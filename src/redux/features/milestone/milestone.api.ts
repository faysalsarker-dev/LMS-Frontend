import { baseApi } from "@/redux/baseApi";

export const milestoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Milestone
    createMilestone: builder.mutation({
      query: (data) => ({
        url: "/milestone",         
        method: "POST",       
        data: data,          
      }),
      invalidatesTags: ["MILESTONE"],
    }),

    // Get all Milestones
    getAllMilestones: builder.query({
      query: (params) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const queryParams = new URLSearchParams(params as any).toString();
        return {
          url: `/milestone?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["MILESTONE"],
    }),


    // Get single Milestone
    getMilestoneById: builder.query({
      query: (id) => ({
        url: `/milestone/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 2,
      providesTags: ["MILESTONE"],
    }),

    // Update Milestone
updateMilestone: builder.mutation({
  query: ({ id, ...values }) => ({
    url: `/milestone/${id}`,
    method: "PUT",
    data: values,
  }),
  invalidatesTags: ["MILESTONE"],
}),


    // Delete Milestone
    deleteMilestone: builder.mutation({
      query: (id) => ({
        url: `/milestone/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MILESTONE"],
    }),
  }),
});

export const {
  useCreateMilestoneMutation,
  useGetAllMilestonesQuery,
  useGetMilestoneByIdQuery,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
} = milestoneApi;