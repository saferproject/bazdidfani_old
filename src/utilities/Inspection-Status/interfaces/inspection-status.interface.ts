import InspectionStatusCodes from "../enums/inspection-status.enum";

export default interface InspectionStatus {
	code: InspectionStatusCodes;
	title: string;
	technical_inspection_title: string;
	self_statement_title: string;
	color: string;
}
