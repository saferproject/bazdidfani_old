import UploadInspectionImage from "../../../api/Driver/interfaces/upload-checklist-image-endpoint.interface";

export default (inspectionImages: Array<UploadInspectionImage>) =>
	inspectionImages.map(({ image, code, inspectionId, isSelfStatement }) => {
		const formData = new FormData();

		formData.append("image", image);
		formData.append("code", String(code));
		formData.append("inspectionId", String(inspectionId));
		formData.append("isSelfStatement", String(isSelfStatement));

		return formData;
	});
