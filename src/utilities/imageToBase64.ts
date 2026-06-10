export default (file: Blob) => {
	if (file && file instanceof Blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
		});
	} else return Promise.reject();
};
