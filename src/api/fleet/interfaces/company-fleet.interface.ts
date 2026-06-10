interface Loader {
	id: string;
	name: string;
	code: number;
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
	plate_type: string | null;
	usage: string | null;
	loader_type_id: string | null;
	VIN: string;
	validity_technical_examination: string | null;
	date_made: number | null;
	loader: Loader;
}

interface TruckInfo {
	type_ownership: number | null;
	allowed_certificate: number | null;
	capacity: number | null;
	chassis_number: string | null;
	document_number: string | null;
	document_date: string | null;
	insurance_validity: string | null;
	insurance_number: string | null;
	owner_phone_number: string | null;
	description: string | null;
	company_status: number | null;
	company_id: number | null;
	created_at: string;
}

interface CompanyTruck {
	id: number;
	company_id: number;
	truck_id: number;
	status: string;
}

export default interface CompanyFleet {
  id: number;
	image: string | null;
	truck_info: TruckInfo;
	truck: Truck;
	company_truck: CompanyTruck;
}
