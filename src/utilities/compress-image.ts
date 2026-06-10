import imageCompression, { type Options } from "browser-image-compression";

export async function compressImage(file: File, options: Options) {
  return imageCompression(file, options);
}
