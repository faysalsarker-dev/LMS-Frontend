import { baseApi } from "@/redux/baseApi";

export const practiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Practice
    createPractice: builder.mutation({
      query: (data) => ({
        url: "/practice",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    // Get all Practices with filters and pagination
    getAllPractices: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        if (params?.type) queryParams.append("type", params.type);
        if (params?.difficulty) queryParams.append("difficulty", params.difficulty);
        if (params?.category) queryParams.append("category", params.category);
        if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        return {
          url: `/practice${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 60 * 60 * 5, // 5 hours
      providesTags: ["PRACTICE"],
    }),

    // Get single Practice by ID or Slug
    getPracticeByIdOrSlug: builder.query({
      query: (identifier) => ({
        url: `/practice/${identifier}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 1, // 1 hour
      providesTags: ["PRACTICE"],
    }),

    // Update Practice
    updatePractice: builder.mutation({
      query: ({ practiceId, data }) => ({
        url: `/practice/${practiceId}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    // Delete Practice
    deletePractice: builder.mutation({
      query: (id) => ({
        url: `/practice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    // Add Items to Practice
    addItemsToPractice: builder.mutation({
      query: ({ practiceId, items }) => ({
        url: `/practice/${practiceId}/items`,
        method: "POST",
        data: { items },
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    // Remove Item from Practice
    removeItemFromPractice: builder.mutation({
      query: ({ practiceId, itemIndex }) => ({
        url: `/practice/${practiceId}/items/${itemIndex}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    // Update Practice Item
    updatePracticeItem: builder.mutation({
      query: ({ practiceId, itemIndex, data }) => ({
        url: `/practice/${practiceId}/items/${itemIndex}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["PRACTICE"],
    }),

    // Get Practices by Type (helper query)
    getPracticesByType: builder.query({
      query: (type) => ({
        url: `/practice?type=${type}&isActive=true`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 2,
      providesTags: ["PRACTICE"],
    }),

    // Get Practices by Category (helper query)
    getPracticesByCategory: builder.query({
      query: (categoryId) => ({
        url: `/practice?category=${categoryId}&isActive=true`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 2,
      providesTags: ["PRACTICE"],
    }),

    // Get Practices by Difficulty (helper query)
    getPracticesByDifficulty: builder.query({
      query: (difficulty) => ({
        url: `/practice?difficulty=${difficulty}&isActive=true`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 2,
      providesTags: ["PRACTICE"],
    }),
  }),
});

export const {
  // Mutations
  useCreatePracticeMutation,
  useUpdatePracticeMutation,
  useDeletePracticeMutation,
  useAddItemsToPracticeMutation,
  useRemoveItemFromPracticeMutation,
  useUpdatePracticeItemMutation,

  // Queries
  useGetAllPracticesQuery,
  useGetPracticeByIdOrSlugQuery,
  useGetPracticesByTypeQuery,
  useGetPracticesByCategoryQuery,
  useGetPracticesByDifficultyQuery,

  // Lazy Queries (for conditional fetching)
  useLazyGetAllPracticesQuery,
  useLazyGetPracticeByIdOrSlugQuery,
  useLazyGetPracticesByTypeQuery,
  useLazyGetPracticesByCategoryQuery,
  useLazyGetPracticesByDifficultyQuery,
} = practiceApi;