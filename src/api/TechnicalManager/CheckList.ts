import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";
import { ApiWithAuth } from "../../Stores/apis/api";

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

		getTechnicalManagerInspectionItems: builder.query<{ data: InspectionItem[]; message: string; success: boolean }, { TrailerTypeCode: string }>({
			query: ({ TrailerTypeCode }) => ({
				url: `technical-manager/bazdidfani/check-list?TrailerTypeCode=${TrailerTypeCode}`,
				method: "GET",
			}),
			transformResponse: ({ data, message, success }: { data: InspectionItem[]; message: string; success: boolean }) => ({
				data: data.map((item, index) => ({ ...item, count: index + 1 })),
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
