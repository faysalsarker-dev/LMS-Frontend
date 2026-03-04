import type { IMilestone } from "@/interface/milestone.types";
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
      invalidatesTags: [{ type: "MILESTONE", id: "LIST" }],
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
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((m:IMilestone) => ({ type: "MILESTONE", id: m._id })),
              { type: "MILESTONE", id: "LIST" },
            ]
          : [{ type: "MILESTONE", id: "LIST" }],
    }),


    // Get single Milestone
    getMilestoneById: builder.query({
      query: (id) => ({
        url: `/milestone/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 2,
      providesTags: (_result, _error, id) => [{ type: "MILESTONE", id }],
    }),

    // Update Milestone
updateMilestone: builder.mutation({
  query: ({ id, ...values }) => ({
    url: `/milestone/${id}`,
    method: "PUT",
    data: values,
  }),
  invalidatesTags: (_result, _error, { id }) => [
    { type: "MILESTONE", id },
    { type: "MILESTONE", id: "LIST" },
  ],
}),


    // Delete Milestone
    deleteMilestone: builder.mutation({
      query: (id) => ({
        url: `/milestone/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MILESTONE", id },
        { type: "MILESTONE", id: "LIST" },
      ],
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