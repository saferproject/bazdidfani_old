export const dataUrlToFile = async (dataUrl: string, filename?: string) => {
	const res = await fetch(dataUrl);
	const blob = await res.blob();
	return new File([blob], filename ? filename : String(`image-${Date.now()}`), { type: blob.type });
};