import CompanyUsage from "../enums/company-usage.enum";

export default interface AdminCompanyForm {
	organization_code: string;
	branch_code: number;
	company_national_code: string;
	name: string;
	ceo_name: string;
	ceo_phone: string;
	father_name: string;
	coordinator_name: string;
	coordinator_phone: string;
	national_code: string;
	password: string;
	company_type: null;
	company_usage: CompanyUsage;
	company_website: string;
	company_fax: string;
	company_phone: string;
	citySearch: string;
	city: {
		uuid: string;
		name: string;
		code: number;
	};
	state: {
		uuid: string;
		name: string;
		code: number;
	};
	address: string;
	location: string;
	postal_code: string;
	ceo_as_coordinator: boolean;
	company_original_fee: number;
}
