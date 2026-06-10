export default interface Setting {
	id: number;
	key: string;
	title: string;
	value: string | null;
	status: number;
	description: string | null;
	last_modified_by_id: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}
