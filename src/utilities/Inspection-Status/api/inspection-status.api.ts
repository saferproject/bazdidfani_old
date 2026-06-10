import { ApiWithAuth } from "../../../Stores/apis/api";
import InspectionStatus from "../interfaces/inspection-status.interface";

export const { useGetInspectionStatusQuery } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getInspectionStatus: builder.query<Array<InspectionStatus>, void>({
			query: () => ({
				url: "admin/bazdidfani-statuses",
				method: "GET",
			}),
		}),
	}),
});
