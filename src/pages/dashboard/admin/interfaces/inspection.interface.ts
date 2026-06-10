interface TechnicalManager {
	manager_national_code: string;
	name: string;
	phone: string;
	father_name: string;
	telephone: string;
	address: string;
	birthdate: string;
}

interface Truck {
	smart_number: string;
	first_number: string;
	second_number: string;
	third_character: string;
	fourth_number: string;
	loader_type: string;
	loader_type_id: string;
	date_made: number;
	VIN: string;
	usage: string;
	Insurance_validity: string;
	validity_technical_examination: string;
}

interface Driver {
	driver_id: number | null;
	insurance_number: string | null;
	description: string | null;
	full_name: string | null;
	phone: string | null;
	father_name: string | null;
	national_code: string | null;
	health_card_validity: string | null;
	smart_card_validity: string | null;
}

interface TechnicalInspection {
	status: string | null;
	description: string | null;
	technical_inspection_id: string | null;
	sabaf_code: string | null;
	submitted_at: string | null;
	type: string | null;
}

interface Company {
	id: number;
	name: string;
}

interface CompanyCredential {
	id: number | null;
	name: string | null;
}

interface UserCompany {
	user_id: number;
	full_name: string;
	national_code: string;
	phone_number: string;
}

export interface Inspection {
	id: number;
	self_statement: number;
	status: number;
	code: string;
	type: number;
	created_at: string;
	technical_manager: TechnicalManager;
	truck: Truck;
	driver: Driver;
	technical_inspection: TechnicalInspection;
	company: Company;
	company_credential: CompanyCredential;
	user_company: UserCompany;
}
