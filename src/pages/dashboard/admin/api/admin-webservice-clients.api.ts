import { ApiWithAuth } from "../../../../Stores/apis/api";
import {
  CreateWebserviceClientRequest,
  UpdateWebserviceClientRequest,
  WebserviceClientDeleteResponse,
  WebserviceClientListResponse,
  WebserviceClientResponse,
  WebserviceClientTokenResponse,
} from "../interfaces/webservice-client.interface";

interface WebserviceClientListParams {
  query?: string;
  is_active?: 0 | 1;
  page: number;
  per_page: number;
}

export const {
  useGetWebserviceClientsQuery,
  useGetWebserviceClientQuery,
  useCreateWebserviceClientMutation,
  useUpdateWebserviceClientMutation,
  useRotateWebserviceClientMutation,
  useDeleteWebserviceClientMutation,
} = ApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getWebserviceClients: builder.query<
      WebserviceClientListResponse,
      WebserviceClientListParams
    >({
      query: (params) => ({
        url: "admin/webservice-clients",
        method: "GET",
        params,
      }),
      providesTags: (result) => [
        "WebserviceClients",
        ...(result?.data.data.map(({ id }) => ({
          type: "WebserviceClients" as const,
          id,
        })) ?? []),
      ],
    }),

    getWebserviceClient: builder.query<WebserviceClientResponse, number>({
      query: (id) => ({
        url: `admin/webservice-clients/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "WebserviceClients", id },
      ],
    }),

    createWebserviceClient: builder.mutation<
      WebserviceClientTokenResponse,
      CreateWebserviceClientRequest
    >({
      query: (data) => ({
        url: "admin/webservice-clients",
        method: "POST",
        data,
      }),
      invalidatesTags: ["WebserviceClients"],
    }),

    updateWebserviceClient: builder.mutation<
      WebserviceClientResponse,
      UpdateWebserviceClientRequest
    >({
      query: ({ id, ...data }) => ({
        url: `admin/webservice-clients/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "WebserviceClients",
        { type: "WebserviceClients", id },
      ],
    }),

    rotateWebserviceClient: builder.mutation<
      WebserviceClientTokenResponse,
      number
    >({
      query: (id) => ({
        url: `admin/webservice-clients/${id}/rotate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        "WebserviceClients",
        { type: "WebserviceClients", id },
      ],
    }),

    deleteWebserviceClient: builder.mutation<
      WebserviceClientDeleteResponse,
      number
    >({
      query: (id) => ({
        url: `admin/webservice-clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WebserviceClients"],
    }),
  }),
});
