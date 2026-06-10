import { ApiWithoutAuth } from "../../../Stores/apis/api";
import { InspectionDetail } from "../interfaces/inspection-detail.interface";

export const { useGetInspectionDetailMutation } = ApiWithoutAuth.injectEndpoints({
	endpoints: (builder) => ({
		getInspectionDetail: builder.mutation<
			{ messgae: string; success: boolean; data: InspectionDetail },
			{ bazdidfani_id: string; code: string }
		>({
			query: (data) => ({
				url: "v1/company/get-checklist-items",
				method: "POST",
				data,
			}),
		}),
	}),
});
