export default interface Pagonator<DataType = Record<string, unknown>> {
	data: Array<DataType>;
	path: string;
	current_page: number;
	per_page: number;
	first_page_url: string;
	next_page_url: string;
	prev_page_url: string;
	last_page_url: string;
	last_page: number;
	from: number;
	to: number;
	total: number;
}
