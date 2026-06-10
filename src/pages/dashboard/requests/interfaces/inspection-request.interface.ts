export default interface InspectionRequest {
	id: number;
	self_statement: number;
	status: number;
	code: string;
	type: 1 | 2;
	created_at: string;

	technical_manager: {
		manager_national_code: string;
		name: string;
		phone: string;
		father_name: string;
		telephone: string;
		address: string;
		birthdate: string;
	};

	truck: {
		smart_number: string;
		first_number: string;
		second_number: string;
		third_character: string;
		fourth_number: string;
		loader_type: string;
		loader_type_id: string;
		date_made: number;
		validity_technical_examination: string;
		Insurance_validity: string | null;
		plate_type: number | null;
		VIN: string | null;
		type: string | null;
		usage: "freighter" | "passenger";
	};

	driver: {
		full_name: string | null;
		phone: string | null;
		father_name: string | null;
		national_code: string | null;
		health_card_validity: string | null;
		smart_card_validity: string | null;
		description: string | null;
		driver_id: number | null;
		insurance_number: string | null;
		id: number | null;
	};

	technical_inspection: {
		status: string;
		description: string | null;
		latitude: string | null;
		longitude: string | null;
		technical_inspection_id: string;
		sabaf_code: string;
		submitted_at: string;
		type: number;
	};

	company: {
		id: number;
		name: string;
	};

	user_company: {
		user_id: number;
		full_name: string;
		national_code: string;
		phone_number: string;
	};
}
