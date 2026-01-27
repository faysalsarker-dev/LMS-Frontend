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

    /* =====================
       DELETE (ADMIN)
    ===================== */
    deletePractice: builder.mutation({
      query: (id) => ({
        url: `/practice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRACTICE", "COURSE"],
    }),
  }),
});

export const {
  useCreatePracticeMutation,
  useGetAllPracticesQuery,
  useGetSinglePracticeQuery,
  useUpdatePracticeMutation,
  useDeletePracticeMutation,
} = practiceApi;
