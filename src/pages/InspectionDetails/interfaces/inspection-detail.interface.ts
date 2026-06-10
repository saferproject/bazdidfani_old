interface ChecklistDetail {
	id: number;
	base_uuid: string;
	uuid: string;
	bazdidfani_id: number;
	technical_inspection_id: number;
	checklist_item_id: number;
	code: number;
	name: string;
	description: string | null;
	driverDescription: string | null;
	inspectorDescription: string | null;
	requiredImage: boolean;
	isImage: boolean;
	minImageCount: number;
	maxImageCount: number;
	image_data: Record<string, string>;
	is_rejected: number;
	checked: number;
	self_statement: number;
	is_active: boolean;
	bazdidfani_status: number;
}

interface ChecklistItem {
	id: number;
	bazdidfani_id: number;
	technical_inspection_id: number;
	base_uuid: string;
	uuid: string;
	code: number;
	name: string;
	description: string | null;
	driverDescription: string | null;
	inspectorDescription: string | null;
	requiredImage: boolean;
	isImage: boolean;
	minImageCount: number;
	maxImageCount: number;
	image_data: Record<string, string>;
	is_rejected: number;
	detailCount: number;
	checked: number;
	is_active: boolean;
	self_statement: number;
	bazdidfani_status: number;
	details: ChecklistDetail[];
}

interface TechnicalInspection {
	id: number;
	truck_id: number;
	driver_id: number;
	company_id: number;
	bazdidfani_id: number;
	technical_manager_id: number;
	status: "completed" | "pending" | string;
	description: string | null;
	is_submitted_to_external_api: number;
	external_technical_inspections_id: string | null;
	external_api_response: string | null;
	latitude: string | null;
	longitude: string | null;
	start_technical_inspection_at: string;
	submitted_at: string;
	created_at: string;
	updated_at: string;
}

export interface BazdidfaniRow {
	id: number;
	code: string;
	truck_info_id: number;
	smart_number: number;
	first_number: number;
	second_number: number;
	third_character: string;
	fourth_number: number;
	loader_type: string;
	insurance_validity: string;
	driver_id: number;
	driver_national_code: string;
	driver_full_name: string;
	driver_father_name: string;
	driver_health_card_validity: string;
	driver_smart_card_validity: string;
	technical_manager_national_code: string;
	technical_manager_id: number;
	self_statement: number;
	sabaf_code: string | null;
	company_id: number;
	user_id: number | null;
	company_software: string | null;
	company_credential_id: number;
	status: number;
	type: number;
	description: string | null;
	latitude: string | null;
	longitude: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	technical_inspection: TechnicalInspection[];
}

export interface InspectionDetail {
	checklist: ChecklistItem[];
	bazdidfani_row: BazdidfaniRow;
}
