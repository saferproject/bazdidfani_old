interface Image {
	id: number;
	title: string;
	user_id: number;
	image_type: string;
	description: string | null;
	url: string;
	created_at: string;
	updated_at: string;
}

interface Personal {
	id: number;
	technical_manager_id: number;
	images: Image[];
	full_name: string;
	national_code: string;
	phone: string;
	capacity: number | null;
	passenger_capacity: number | null;
	freighter_capacity: number | null;
	start_cooperate: string | null;
	end_cooperate: string | null;
	status: number;
}

export default interface Inspector {
	personal: Personal;
	user: {
		id: number,
		[key: string]: any
	}
}
