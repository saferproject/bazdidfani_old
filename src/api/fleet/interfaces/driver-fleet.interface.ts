interface Loader {
	uuid: string;
	name: string;
	code: number;
	type_code: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

interface Truck {
	id: number;
	smart_number: number;
	first_number: string;
	second_number: string;
	third_character: string;
	fourth_number: string;
	fixed_non_fixed_type: string | null;
	plate_type: string | null;
	usage: string | null;
	loader_type_id: string | null;
	VIN: string;
	validity_technical_examination: string | null;
	date_made: number | null;
	loader: Loader;
}

interface TruckInfo {
	id: number;
	type_ownership: string | null;
	capacity: number;
	chassis_number: string | null;
	allowed_certificate: number | null;
	document_number: string | null;
	document_date: string | null;
	insurance_validity: string | null;
	owner_phone_number: string | null;
	title: string | null;
	description: string | null;
	company_status: number | null;
	company_id: number | null;
	created_at: string;
}

export default interface DriverFleet {
	id: number;
	image: string | null;
	truck_info: TruckInfo;
	truck: Truck;
}