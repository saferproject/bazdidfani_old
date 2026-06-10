import InspectionItem from "../interfaces/inspection-item.interface";
import OrganizationItem from "../interfaces/organization-item.interface";

export default (data: Array<OrganizationItem>, images: Record<number, string>): Array<InspectionItem> => {
	if (!data?.length) return [];
	
	return data.map(({ isHealthy, priority, code, details, imgLink, driverDescription, ...rest }) => ({
		...rest,
		code,
		checked: isHealthy,
		images: images[code] ? [images[code]] : [],
		driverDescription: driverDescription,
		inspectorDescription: "",
		minImageCount: 0,
		detailCount: details.length,
		requiredImage: !!Object.keys(images).length,
		details: details.map(({ isHealthy, priority, code, imgLink, driverDescription, ...rest }) => ({
			...rest,
			code,
			checked: isHealthy,
			images: images[code] ? [images[code]] : [],
			driverDescription: driverDescription,
			inspectorDescription: "",
			minImageCount: 0,
			detailCount: 0,
			requiredImage: !!Object.keys(images).length,
			details: [],
		})),
	}));
};
