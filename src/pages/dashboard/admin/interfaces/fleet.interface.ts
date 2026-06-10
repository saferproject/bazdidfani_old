import AllowedCertificates from "../types/allowes-certificates.type";

interface TruckInfo {
	id: number;
	title: string | null;
	type_ownership: number;
	Insurance_validity: string | null;
	owner_phone_number: string | null;
	description: string | null;
	allowed_certificate: AllowedCertificates | null;
	truck_id: number;
	company_id: number | null;
	company_status: number | null;
	capacity: number | null;
	status: number;
	admin_description: string | null;
	last_modified_by_id: number | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface Loader {
	uuid: string;
	name: string;
	code: number;
	type_code: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export default interface Truck {
	id: number;
	smart_number: number;
	first_number: string;
	second_number: string;
	third_character: string;
	fourth_number: string;
	usage: string;
	loader_type_id: string;
	VIN: string;
	validity_technical_examination: string | null;
	date_made: number;
	organization_status: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	trucks_info: TruckInfo[];
	loader: Loader;
}
