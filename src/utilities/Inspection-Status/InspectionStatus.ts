import { useEffect, useSyncExternalStore } from "react";
import { useGetInspectionStatusQuery } from "./api/inspection-status.api";
import InspectionStatus from "./interfaces/inspection-status.interface";

let inspectionStatus: Array<InspectionStatus> = [];
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

export const useGetInspectionStates = () => {
	const InspectionStatus = useGetInspectionStatusQuery();
	
	const states = useSyncExternalStore(subscribe, () => inspectionStatus);

	useEffect(() => {
		if (InspectionStatus.isSuccess) inspectionStatus = InspectionStatus.data;
	}, [InspectionStatus.isSuccess, InspectionStatus.data]);

	return {
		states,
		getStatus: (status: number | string) => states.find((state) => state.code == status),
		getStatusColorClass: (status: number | string) => `inspection-status-bg-${status}`,
	};
};
