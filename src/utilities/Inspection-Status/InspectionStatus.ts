import { useGetInspectionStatusQuery } from "./api/inspection-status.api";
import InspectionStatus from "./interfaces/inspection-status.interface";

const emptyStates: InspectionStatus[] = [];

export const useGetInspectionStates = () => {
	const { data } = useGetInspectionStatusQuery();
	const states = data ?? emptyStates;

	return {
		states,
		getStatus: (status: number | string) => states.find((state) => state.code == status),
		getStatusColorClass: (status: number | string) => `inspection-status-bg-${status}`,
	};
};
