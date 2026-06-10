import { ApiWithAuth } from "../../Stores/apis/api";
import { RoleType } from "../../types/RoleType";

export const { useDeleteUserMutation, useGetUsersByRoleQuery } = ApiWithAuth.injectEndpoints({
	endpoints: (builder) => ({
		getUsersByRole: builder.query<any, { queryString: string; role: RoleType }>({
			query: ({ role, queryString }) => ({
				url: `admin/users?type=${role}${"&" + queryString}`,
				method: "GET",
			}),
			providesTags: ["AdminUser"], // برای کش کردن داده‌ها
		}),
		deleteUser: builder.mutation<any, number>({
			query: (id) => ({
				url: `admin/users/delete/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["AdminUser"], // بعد از حذف، لیست را دوباره دریافت کند
		}),
	}),
});
