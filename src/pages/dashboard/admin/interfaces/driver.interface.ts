interface DriverInfo {
	id: number;
	status: number;
	personal_number: string | null;
	birth_certificate_number: string | null;
	certificate_validity: string | null;
	certificate_type: 1 | 2 | 3 | null;
	start_activity: string | null;
	full_name: string;
	driver_id: number;
	company_id: number | null;
	user_id: number;
	violation: string | null;
	phone_number: string | null;
	smart_truck: string | null;
	description: string | null;
	last_modified_by_id: number | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export default interface Driver {
	id: number;
	father_name: string;
	smart_card_validity: string | null;
	national_code: string;
	health_card_validity: string | null;
	start_activity: string | null;
	birthdate: string | null;
	insurance_number: string | null;
	certificate_number: string;
	description: string | null;
	certificate_validity: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	driver: DriverInfo[];
}
