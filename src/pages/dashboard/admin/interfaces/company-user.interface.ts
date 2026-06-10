interface Personal {
	id: number;
	full_name: string;
	email: string | null;
	national_code: string | null;
	user_id: number;
	post: string | null;
	phone: string | null;
	father_name: string | null;
	address: string | null;
	telephone: string | null;
	city_id: string | null;
	birthdate: string | null;
	status: number;
	description: string | null;
	last_modified_by_id: number | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface User {
	id: number;
	username: string;
	status: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	personal: Personal;
}

interface Company {
	id: number;
	organization_code: number;
	branch_code: number;
	company_national_code: string;
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
	state_id: string;
	city_id: string;
	address: string;
	postal_code: string;
	location: string;
	description: string | null;
	last_modified_by_id: number | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export default interface CompanyUser {
	id: number;
	user_id: number;
	company_id: number;
	start_cooperate: string | null;
	end_cooperate: string | null;
	status: string;
	description: string | null;
	last_modified_by_id: number | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	user: User;
	company: Company;
}
