export default interface OrganizationItem {
	id: string;
	checkListId: string;
	code: number;
	name: string;
	driverDescription: null | string;
	isRequired: boolean;
	isImage: boolean;
	maxImageCount: number;
	details: Omit<Array<OrganizationItem>, "details">;
	imgLink: string;
	isHealthy: boolean;
	priority: number;
}