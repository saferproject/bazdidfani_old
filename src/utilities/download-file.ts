export default function downloadFile(data: File | Blob, filename: string, type: string) {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
}
