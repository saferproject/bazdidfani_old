import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";
import { ApiWithAuth } from "../../Stores/apis/api";
import buildQueryParams from "../../utilities/build-query-params";

export const {
	useGetSelfStatementInspectionItemsQuery,
	useGetTechnicalManagerInspectionItemsQuery,
	useAddTechnicalManagerChecklistMutation,
	useGetTechnicalManagerRejectedInspectionItemsMutation,
	useSubmitTechnicalVisitChecklistMutation,
} = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getSelfStatementInspectionItems: builder.query<any, any>({
			query: ({ TrailerTypeCode, selfStatement }) => ({
				url: `driver/self_statement/check-list?TrailerTypeCode=${TrailerTypeCode}&selfStatement=${selfStatement}`,
				method: "GET",
			}),
		}),

		getTechnicalManagerInspectionItems: builder.query<{ data: { checkList: InspectionItem[], previousRejectedItems: any[] }; message: string; success: boolean }, { TrailerTypeCode: string, with_last_rejected_checklist: string }>({
			query: (data) => ({
				url: `technical-manager/bazdidfani/check-list?${buildQueryParams(data)}`,
				method: "GET",
			}),
			transformResponse: ({ data, message, success }: { data: { checkList: InspectionItem[], previousRejectedItems: any[] }; message: string; success: boolean }) => ({
				data: {
					checkList: data.checkList.map((item, index) => ({ ...item, count: index + 1 })),
					previousRejectedItems: data.previousRejectedItems
				},
				message,
				success,
			}),
		}),

		addTechnicalManagerChecklist: builder.mutation<
			any,
			{ inspectionItems: Omit<Array<InspectionItem>, "images">; inspectionId: number; isSelfStatement: number }
		>({
			query: (data) => ({
				url: "submit-check-list",
				method: "POST",
				data,
			}),
		}),

		getTechnicalManagerRejectedInspectionItems: builder.mutation<
			unknown,
			{ bazdidfani_id: number; technical_manager_id: number; company_id: number }
		>({
			query: (data) => ({
				url: "technical-manager/bazdidfani/rejected-checklist/get-rejected-item",
				method: "POST",
				data,
			}),
		}),

		submitTechnicalVisitChecklist: builder.mutation<
			any,
			{ inspectionItems: Omit<Array<InspectionItem>, "images">; inspectionId: number; isSelfStatement: number }
		>({
			query: (data) => ({
				url: "technical-manager/visit/submit-checklist",
				method: "POST",
				data,
			}),
		}),
	}),
});
