import { baseApi } from "@/redux/baseApi";

export const practiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================
       CREATE (ADMIN)
    ===================== */
    createPractice: builder.mutation({
      query: (data) => ({
        url: "/practice",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PRACTICE", "COURSE"],
    }),

    /* =====================
       GET ALL (ADMIN)
       - filter
       - sort
    ===================== */
    getAllPractices: builder.query({
      query: (params) => ({
        url: "/practice",
        method: "GET",
        params, // courseId, isActive, sortBy, sortOrder
      }),
      keepUnusedDataFor: 60 * 10, // 10 min
      providesTags: ["PRACTICE"],
    }),

    /* =====================
       GET SINGLE (USER + ADMIN)
    ===================== */
    getSinglePractice: builder.query({
      query: (id) => ({
        url: `/practice/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 5, // 5 min
      providesTags: ["PRACTICE"],
    }),
    getSinglePracticeForUser: builder.query({
      query: (id) => ({
        url: `/practice/${id}/student`,
        method: "GET",
      }),
      keepUnusedDataFor:60* 60 * 2, 
      providesTags: ["PRACTICE"],
    }),
    getUserPractices: builder.query({
      query: () => ({
        url: `/practice/student`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 5, 
      providesTags: ["PRACTICE"],
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
      invalidatesTags: ["PRACTICE", "COURSE"],
    }),

    deletePractice: builder.mutation({
      query: (id) => ({
        url: `/practice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRACTICE", "COURSE"],
    }),



     addItemToPractice: builder.mutation({
      query: (data) => ({
        url: "/practice/items",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    updatePracticeItem: builder.mutation({
      query: ({ practiceId, itemId, data }) => ({
        url: `/practice/${practiceId}/items/${itemId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    deletePracticeItem: builder.mutation({
      query: ({ practiceId, itemId }) => ({
        url: `/practice/${practiceId}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    reorderPracticeItems: builder.mutation({
      query: ({ practiceId, itemOrders }) => ({
        url: `/practice/${practiceId}/items/reorder`,
        method: "PATCH",
        data: { itemOrders },
      }),
      invalidatesTags: ["PRACTICE"],
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
