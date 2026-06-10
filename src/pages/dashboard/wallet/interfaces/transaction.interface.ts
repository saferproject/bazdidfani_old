export default interface Transaction {
	id: number;
	wallet_id: number;
	order_code: string;
	status_code: string;
	status_title: string;
	price: string;
	transaction_type: string;
	description: string | null;
	created_at: string;
	updated_at: string;
}