import InspectionStatusCodes from "../../../utilities/Inspection-Status/enums/inspection-status.enum";

export default interface TechnicalInspection {
	id: number;
	status: InspectionStatusCodes;
	code: string;
	created_at: string;
	type?: number;
	company_name?: string;
	driver_phone?: string | null;
	driver_name?: string | null;
	driver_national_code?: string | null;
	plate_first_number?: number;
	plate_second_number?: number;
	plate_character?: string;
	plate_fourth_number?: number;
	self_statement?: number;
	technical_manager?:
		| {
				id: number;
				national_code: string;
		  }
		| {
				id: number;
				manager_national_code: string;
				name: string;
				phone: string;
				father_name: string;
				telephone: string;
				address: string;
				birthdate: string;
		  };
	truck_info?: {
		id: number;
		title: string | null;
		insurance_validity: string;
		loader_code: number;
		loader_name: string;
		smart_number: number;
	};
	truck?: {
		id: number;
		smart_number: string;
		first_number: string;
		second_number: string;
		third_character: string;
		fourth_number: string;
		loader_type: string;
		loader_code: number;
		loader_type_id: string;
		date_made: number;
		validity_technical_examination: string;
	};
	driver?: {
		id: number;
		full_name: string;
		phone: string;
		father_name: string;
		national_code: string;
		health_card_validity: string;
		smart_card_validity: string;
	};
	technical_inspection?: {
		id: number;
		status: string;
		description: string | null;
		technical_inspection_id: string;
		sabaf_code: string | null;
		submitted_at: string;
	};
}
