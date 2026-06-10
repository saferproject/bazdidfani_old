import APIResponse from "../../../../api/interfaces/response.interface";
import { ApiWithAuth } from "../../../../Stores/apis/api";
import buildQueryParams from "../../../../utilities/build-query-params";
import IncreaseCreditAPI from "../interfaces/increase-credit-api.interface";
import Transaction from "../interfaces/transaction.interface";

export const { useGetWalletInfoQuery, useGetCreditChangesHistoryQuery, useGetInfiniteCreditChangesHistoryInfiniteQuery, useIncreaseCreditMutation } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		// ? This endpoint is used for getting wallet info
		getWalletInfo: builder.query<any, void>({
			query: () => ({
				url: "wallet/index",
				method: "GET",
			}),
			providesTags: ["WalletInfo"], // کش کردن داده‌ها
		}),

		// ? This endpoint is used to get balance changes history
		getCreditChangesHistory: builder.query<APIResponse<Transaction>, Record<string, string | number | boolean> | null>({
			query: (params) => ({
				url: `wallet/transactions${params ? "?" + buildQueryParams(params) : ""}`,
				method: "GET",
			}),
			providesTags: ["CreditChnageHistory"], // کش کردن داده‌ها
			transformResponse: ({ data, message, status }: APIResponse<Transaction>) => ({
				data: {
					...data,
					data: data.data.map((item, index) => ({ ...item, count: data.per_page * (data.current_page - 1) + (index + 1) })),
				},
				message,
				status,
			}),
		}),

		getInfiniteCreditChangesHistory: builder.infiniteQuery<APIResponse<unknown>, Record<string, string | number | boolean>, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
					_lastPage.data.current_page < _lastPage.data.last_page ? lastPageParam + 1 : undefined,
			},
			query: ({ queryArg, pageParam }) => ({
				url: `wallet/transactions${queryArg ? "?" + buildQueryParams({ ...queryArg, page: pageParam }) : ""}`,
				method: "GET",
			}),
			providesTags: ["CreditChnageHistory"],
		}),

		// ? This endpoint is used to increase the credit of the wallet
		increaseCredit: builder.mutation<unknown, IncreaseCreditAPI>({
			query: (data) => ({
				url: `wallet/charge`,
				method: "POST",
				data,
			}),
			invalidatesTags: ["CreditChnageHistory", "WalletInfo"], // کش کردن داده‌ها
		}),
	}),
});
