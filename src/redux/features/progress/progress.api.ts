import { baseApi } from "@/redux/baseApi";

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProgress: builder.mutation({
      query: (data) => ({
        url: "/progress/complete-lesson",         
        method: "POST",       
        data: data,          
      }),
      invalidatesTags: ["PROGRESS"],
    }),
    getProgress: builder.query({
      query: (params) => {
        return {
          url: `/progress/${params}`,
          method: "GET",
        };
      },
      providesTags: ["PROGRESS"],
    }),


  }),
});

export const {
useGetProgressQuery,
useCreateProgressMutation
} = progressApi;