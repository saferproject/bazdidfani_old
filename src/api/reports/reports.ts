import { ApiWithAuth } from "../../Stores/apis/api";

export const { useGetSabafTechnicalInspectionMutation } =
  ApiWithAuth.injectEndpoints({
    endpoints: (builder) => ({
      //? برای دریافت کد سباف بازدید فنی
      getSabafTechnicalInspection: builder.mutation({
        query: (data: { technical_inspection_id: string }) => ({
          url: `sabaf-code-inquiry`,
          method: "POST",
          data,
        }),
      }),
    }),
  });
