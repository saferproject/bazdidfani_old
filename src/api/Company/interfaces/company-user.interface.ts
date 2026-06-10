interface User {
	id: number;
}

export default interface CompanyUser {
	id: number;
	user: User;
	email: string | null;
	post: string | null;
	father_name: string | null;
	address: string | null;
	telephone: string | null;
	birthdate: string | null;
	full_name: string;
	phone: string;
	status: string;
	national_code: string;
}
