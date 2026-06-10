import InspectionItem from "../interfaces/inspection-item.interface";
import { dataUrlToFile } from "../../../utilities/dataURLToFile";
import UploadInspectionImage from "../../../api/Driver/interfaces/upload-checklist-image-endpoint.interface";
import { compressImage } from "../../../utilities/compress-image";

export default async function (inspectionItems: Array<InspectionItem>, inspectionId: number, isSelfStatement: number) {
	const createImagePromise = async (code: number, image: string) => {
		const imageFile = await dataUrlToFile(image, `${code}-${Date.now()}`);

		console.info(
			`imageDataBeforeCompression:\n \tinspectionId: ${inspectionId}\n \titemCode: ${code}\n \tisSelfStatement: ${!!isSelfStatement}\n \timageName: ${
				imageFile.name
			}\n \timageSizeBeforeCompression: ${Math.round(imageFile.size / 1000)} KB`
		);

		const compressedImage = await compressImage(imageFile, {
			fileType: "image/jpeg",
			maxSizeMB: 0.40,
			maxIteration: 20,
			useWebWorker: true,
		});

		console.info(
			`imageDataAfterCompression:\n \tinspectionId: ${inspectionId}\n \titemCode: ${code}\n \tisSelfStatement: ${!!isSelfStatement}\n \timageName: ${
				compressedImage.name
			}\n \timageSizeAfterCompression: ${Math.round(compressedImage.size / 1000)} KB`
		);

		return {
			code,
			inspectionId,
			isSelfStatement,
			image: compressedImage,
		} as UploadInspectionImage;
	};

	const imagePromises: Array<Promise<UploadInspectionImage>> = [];

	for (const inspectionItem of inspectionItems)
		if (inspectionItem.details.length) {
			for (const detail of inspectionItem.details)
				if (detail.isImage && detail.images.length)
					for (const image of detail.images) imagePromises.push(createImagePromise(detail.code, image));
		} else if (inspectionItem.isImage && inspectionItem.images.length)
			for (const image of inspectionItem.images) imagePromises.push(createImagePromise(inspectionItem.code, image));

	return Promise.all(imagePromises);
}
