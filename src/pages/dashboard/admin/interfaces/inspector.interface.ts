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
}

interface User {
	id: number;
	username: string;
	status: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	personal: Personal;
	images: any[]; // use a proper Image interface if image objects exist elsewhere
}

export default interface Inspector {
	id: number;
	passenger_capacity: number | null;
	freighter_capacity: number | null;
	capacity: number | null;
	type: number;
	user_id: number;
	status: number;
	description: string | null;
	last_modified_by_id: number | null;
	deleted_at: string | null;
	created_at: string;
	updated_at: string;
	user: User;
}
