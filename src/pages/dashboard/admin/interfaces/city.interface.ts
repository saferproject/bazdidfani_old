interface State {
	uuid: string;
	name: string;
	code: number;
	created_at: string;
	updated_at: string;
}

export default interface City {
	uuid: string;
	name: string;
	code: number;
	province_id: string;
	city_org: number;
	created_at: string;
	updated_at: string;
	state: State;
}

