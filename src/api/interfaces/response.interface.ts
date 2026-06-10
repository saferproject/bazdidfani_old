import Pagonator from "./paginator.interface";

export default interface APIResponse<DataType> {
	data: Pagonator<DataType>;
	status: boolean;
	message: string;
}
