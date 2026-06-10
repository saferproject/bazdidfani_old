interface Personal {
	id: number;
	full_name: string;
	email: string | null;
	national_code: string;
	user_id: number;
	post: string | null;
	phone: string;
	father_name: string;
	address: string;
	telephone: string;
	city_id: string;
	birthdate: string; // Consider using Date type if you'll parse it
	created_at: string; // Consider using Date type if you'll parse it
	updated_at: string; // Consider using Date type if you'll parse it
	deleted_at: string | null;
}

interface User {
	id: number;
	username: string;
	status: number;
	created_at: string; // Consider using Date type if you'll parse it
	updated_at: string; // Consider using Date type if you'll parse it
	deleted_at: string | null;
	personal: Personal;
}

interface City {
	uuid: string;
	name: string;
	code: number;
	province_id: string;
	city_org: number;
	created_at: string; // Consider using Date type if you'll parse it
	updated_at: string; // Consider using Date type if you'll parse it
}

export default interface Company {
	id: number;
	organization_code: number;
	branch_code: number;
	company_national_code: string | null;
	name: string;
	user_id: number;
	ceo_name: string;
	ceo_phone: string;
	coordinator_name: string;
	coordinator_phone: string;
	company_type: string | null;
	company_usage: number;
	company_website: string | null;
	status: number;
	company_fax: string | null;
	company_phone: string | null;
	state_id: string | null;
	city_id: string;
	address: string;
	postal_code: string | null;
	location: string; // Consider parsing into { lat: number; lng: number }
	description: string;
	last_modified_by_id: number;
	created_at: string; // Consider using Date type if you'll parse it
	updated_at: string; // Consider using Date type if you'll parse it
	deleted_at: string | null;
	user: User;
	states: unknown | null; // Couldn't determine structure from example
	cities: City;
}
