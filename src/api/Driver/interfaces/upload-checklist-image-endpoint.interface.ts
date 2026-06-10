export default interface UploadInspectionImage {
	code: number;
	inspectionId: number;
	isSelfStatement: 0 | 1;
  image: File;
}