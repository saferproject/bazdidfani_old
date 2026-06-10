interface RoleInfo {
	id: number;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
}

interface UserRole {
	id: number;
	user_id: number;
	role_id: number;
	status: number;
	created_at: string;
	updated_at: string;
	role: RoleInfo;
}

interface City {
	uuid: string;
	name: string;
	code: number;
	province_id: string;
	city_org: number;
	created_at: string;
	updated_at: string;
}

interface Personal {
	id: number;
	full_name: string;
	email: string | null;
	national_code: string;
	user_id: number;
	post: string | null;
	phone: string;
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
	cities: City;
}

interface Image {
	id: number;
	title: string;
	user_id: number;
	image_type: string;
	description: string | null;
	url: string;
	created_at: string;
	updated_at: string;
}

export default interface User {
	id: number;
	username: string;
	status: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	roles: UserRole[];
	personal: Personal;
	images: Image[];
}
