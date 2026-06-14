import { LatLngExpression } from "leaflet";

export default interface CompanyRoleForm {
	organization_code: string;
	name: string;
	work_field: string;
	ceo_name: string;
	ceo_phone: string;
	coordinator_name: string;
	coordinator_phone: string;
	company_usage: 1 | 2 | 3;
	company_phone: string;
	state_id: number;
	city_code: number;
	postal_code: string;
	address: string;
	location: LatLngExpression;
	statesSearch: string;
	citySearch: string;
	states: any;
	cities: any;
	branch_code: number;
	ceo_as_coordinator: boolean;
	company_national_code: string;
}
