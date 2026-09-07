import { ApiWithAuth } from "../../../../../Stores/apis/api";

export interface AdminRoleState {
  role: string;
  title: string;
  role_id: number;
  status: number | string | null;
  assigned: boolean;
  assignable: boolean;
  company_id?: number | null;
  company_name?: string | null;
}

interface UserRoleStatesResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    roles: Record<string, AdminRoleState>;
  };
}

interface UserRolesMutationResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export const {
  useGetRoleStatesQuery,
  useAssignUserRoleMutation,
  useRemoveUserRoleMutation,
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getRoleStates: builder.query<UserRoleStatesResponse, number>({
      query: (id) => ({
        url: `admin/roles/get-user-roles/${id}`,
        method: "GET",
      }),
      providesTags: ["RoleStates"],
    }),
    assignUserRole: builder.mutation<
      UserRolesMutationResponse,
      { userId: number; roleId: number; status?: 0 | 1 }
    >({
      query: ({ userId, roleId, status = 1 }) => ({
        url: `admin/users/${userId}/roles`,
        method: "POST",
        data: { role_id: roleId, status },
      }),
      invalidatesTags: ["RoleStates", "AdminUsers"],
    }),
    removeUserRole: builder.mutation<
      UserRolesMutationResponse,
      { userId: number; roleId: number }
    >({
      query: ({ userId, roleId }) => ({
        url: `admin/users/${userId}/roles/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RoleStates", "AdminUsers"],
    }),
  }),
});
