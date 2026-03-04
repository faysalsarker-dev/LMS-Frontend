import { baseApi } from "@/redux/baseApi";

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProgress: builder.mutation({
      query: (data) => ({
        url: "/progress/complete-lesson",         
        method: "POST",       
        data: data,          
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "PROGRESS", id: data.courseId },
      ],
    }),
    createQuizProgress: builder.mutation({
      query: (data) => ({
        url: "/progress/complete-quiz",         
        method: "POST",       
        data: data,          
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "PROGRESS", id: data.courseId },
      ],
    }),
    getProgress: builder.query({
      query: (params) => {
        return {
          url: `/progress/${params}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, params) => [{ type: "PROGRESS", id: params }],
    }),


  }),
});

export const {
useGetProgressQuery,
useCreateProgressMutation,
useCreateQuizProgressMutation
} = progressApi;