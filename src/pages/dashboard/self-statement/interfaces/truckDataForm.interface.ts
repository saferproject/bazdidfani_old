export default interface TruckDataForm {
	smart_number: string;
	first_number: string;
	second_number: string;
	third_character: string;
	fourth_number: string;
	date_made: string;
	usage: "passenger" | "freighter";
	loader: { type_code: string; name: string };
	validity_technical_examination: string;
	allowed_certificate: 1 | 2 | 3;
	smartcard_status: 1 | 2;
	truck_id: number;
	loaderTypeSearch: string;
	type: 1 | 2;
	insurance_validity: string;
	description: null | string;
}
