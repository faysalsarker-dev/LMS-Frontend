import { baseApi } from "@/redux/baseApi";

export const historyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    riderFeedback: builder.mutation({
      query: ({id,data}) => ({
        url: `/history/rider-feedback/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["HISTORY"],
    }),


  }),
});

export const {
  useRiderFeedbackMutation
} = historyApi;
