import type InspectionItem from "../interfaces/inspection-item.interface";
import { dataUrlToFile } from "../../../utilities/dataURLToFile";
import type UploadInspectionImage from "../../../api/Driver/interfaces/upload-checklist-image-endpoint.interface";
import { compressImage } from "../../../utilities/compress-image";
import type { PreparedInspectionImage } from "../interfaces/inspection-submission.interface";
import createImageFormData from "./create-image-form-data";
import { mapWithConcurrency } from "./map-with-concurrency";

const collectPhotos = (items: InspectionItem[]) => {
  const photos: Array<{ code: number; image: string }> = [];
  for (const item of items) {
    const leaves = item.details.length ? item.details : [item];
    for (const leaf of leaves)
      if (leaf.isImage)
        for (const image of leaf.images) photos.push({ code: leaf.code, image });
  }
  return photos;
};

const compressPhoto = async (
  { code, image }: { code: number; image: string },
  inspectionId: number,
  isSelfStatement: 0 | 1,
): Promise<UploadInspectionImage> => {
  const imageFile = await dataUrlToFile(image, `${code}-${Date.now()}`);
  const compressedImage = await compressImage(imageFile, {
    fileType: "image/jpeg",
    maxSizeMB: 0.40,
    maxIteration: 20,
    useWebWorker: true,
  });
  return { code, inspectionId, isSelfStatement, image: compressedImage };
};

export default async function processInspectionPhotos(
  inspectionItems: InspectionItem[],
  inspectionId: number,
  isSelfStatement: 0 | 1,
): Promise<UploadInspectionImage[]> {
  return mapWithConcurrency(collectPhotos(inspectionItems), 2, (photo) =>
    compressPhoto(photo, inspectionId, isSelfStatement),
  );
}

/** Fingerprints stay local: the server still receives precisely the existing four fields. */
export async function prepareInspectionUploads(
  inspectionItems: InspectionItem[],
  inspectionId: number,
  isSelfStatement: 0 | 1,
): Promise<PreparedInspectionImage[]> {
  const occurrences = new Map<string, number>();
  const photos = collectPhotos(inspectionItems);
  const prepared = await mapWithConcurrency(photos, 2, async (photo) => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(photo.image));
    const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const compressed = await compressPhoto(photo, inspectionId, isSelfStatement);
    return { hash, code: photo.code, data: createImageFormData([compressed])[0] };
  });

  return prepared.map(({ hash, code, data }) => {
    const identity = `${code}:${hash}`;
    const occurrence = occurrences.get(identity) ?? 0;
    occurrences.set(identity, occurrence + 1);
    return { key: `${identity}:${occurrence}`, data };
  });
}
