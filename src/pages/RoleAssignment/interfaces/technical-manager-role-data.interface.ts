export interface TechnicalManagerRoleImage {
	id: number;
	title: string;
	user_id: number;
	image_type: string;
	description: string | null;
	url: string;
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
	father_name: string;
	address: string;
	telephone: string;
	city_id: string;
	birthdate: string;
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
	images: TechnicalManagerRoleImage[];
}

export default interface TechnicalManagerRoleData {
	id: number;
	passenger_capacity: number;
	freighter_capacity: number;
	capacity: number;
	type: 1 | 2 | 3;
	user_id: number;
	deleted_at: string | null;
	created_at: string;
	updated_at: string;
	user: User;
}

