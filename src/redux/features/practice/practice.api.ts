import { baseApi } from "@/redux/baseApi";

export const practiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPractice: builder.mutation({
      query: (data) => ({
        url: "/practice",
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "PRACTICE", id: "LIST" },
        data?.courseId && { type: "COURSE", id: data.courseId },
      ].filter(Boolean),
    }),
    getAllPractices: builder.query({
      query: (params) => ({
        url: "/practice",
        method: "GET",
        params, 
      }),
      keepUnusedDataFor: 60 * 10, 
      providesTags: (result) =>
        result
          ? [
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...result.data.map((p:any) => ({ type: "PRACTICE", id: p._id })),
              { type: "PRACTICE", id: "LIST" },
            ]
          : [{ type: "PRACTICE", id: "LIST" }],
    }),

    getSinglePractice: builder.query({
      query: (id) => ({
        url: `/practice/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 5, // 5 min
      providesTags: (_result, _error, id) => [{ type: "PRACTICE", id }],
    }),
    getSinglePracticeForUser: builder.query({
      query: (id) => ({
        url: `/practice/${id}/student`,
        method: "GET",
      }),
      keepUnusedDataFor:60* 60 * 2, 
      providesTags: (_result, _error, id) => [{ type: "PRACTICE", id }],
    }),
    getUserPractices: builder.query({
      query: () => ({
        url: `/practice/student`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 5, 
      providesTags: (result) =>
        result
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? result.data.map((p:any) => ({ type: "PRACTICE", id: p._id }))
          : [],
    }),

    /* =====================
       UPDATE (ADMIN)
    ===================== */
    updatePractice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/practice/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id, data }) => [
        { type: "PRACTICE", id },
        { type: "PRACTICE", id: "LIST" },
        data?.courseId && { type: "COURSE", id: data.courseId },
      ].filter(Boolean),
    }),

    deletePractice: builder.mutation({
      query: (id) => ({
        url: `/practice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PRACTICE", id },
        { type: "PRACTICE", id: "LIST" },
      ],
    }),



     addItemToPractice: builder.mutation({
      query: (data) => ({
        url: "/practice/items",
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { practiceId }) => [
        { type: "PRACTICE", id: practiceId },
      ],
    }),

    updatePracticeItem: builder.mutation({
      query: ({ practiceId, itemId, data }) => ({
        url: `/practice/${practiceId}/items/${itemId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { practiceId }) => [
        { type: "PRACTICE", id: practiceId },
      ],
    }),

    deletePracticeItem: builder.mutation({
      query: ({ practiceId, itemId }) => ({
        url: `/practice/${practiceId}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { practiceId }) => [
        { type: "PRACTICE", id: practiceId },
      ],
    }),

    reorderPracticeItems: builder.mutation({
      query: ({ practiceId, itemOrders }) => ({
        url: `/practice/${practiceId}/items/reorder`,
        method: "PATCH",
        data: { itemOrders },
      }),
      invalidatesTags: (_result, _error, { practiceId }) => [
        { type: "PRACTICE", id: practiceId },
      ],
    }),
 




  }),
});

export const {
  useCreatePracticeMutation,
  useGetAllPracticesQuery,
  useGetSinglePracticeQuery,
  useUpdatePracticeMutation,
  useDeletePracticeMutation,
  useGetUserPracticesQuery,
  useGetSinglePracticeForUserQuery,
// New hooks
  useAddItemToPracticeMutation,
  useUpdatePracticeItemMutation,
  useDeletePracticeItemMutation,
  useReorderPracticeItemsMutation,


} = practiceApi;
