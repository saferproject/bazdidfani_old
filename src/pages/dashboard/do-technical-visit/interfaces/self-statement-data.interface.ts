import InspectionStatusCodes from "../../../../utilities/Inspection-Status/enums/inspection-status.enum";

export default interface SelfStatementData {
	id: number;
	status: InspectionStatusCodes; // Main status code
	code: string; // Unique record code
	created_at: string; // ISO 8601 DateTime
	TechnicalInspection: number;
	technical_manager: {
		manager_national_code: string | null;
		name: string | null;
		phone: string | null;
		father_name: string | null;
		telephone: string | null;
		address: string | null;
		birthdate: string | null; // DateTime string format
	};
	truck: {
		smart_number: string;
		first_number: string;
		second_number: string;
		third_character: string; // Persian character
		fourth_number: string;
		loader_type: string; // Vehicle type description
		loader_code: number;
		loader_type_id: string; // UUID format
		date_made: number; // Year of manufacture (Shamsi/Persian calendar)
		validity_technical_examination: string; // DateTime string
	};
	driver: {
		full_name: string;
		phone: string;
		father_name: string;
		national_code: string;
		health_card_validity: string | null; // DateTime string
		smart_card_validity: string | null; // DateTime string
	};
	technical_inspection: {
		status: InspectionStatusCodes;
		description: string | null;
		technical_inspection_id: string | null; // UUID format
		sabaf_code: string | null; // Specialized code format
		submitted_at: string | null; // DateTime string
	};
}
