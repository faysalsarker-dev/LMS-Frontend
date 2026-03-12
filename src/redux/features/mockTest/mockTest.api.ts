import { baseApi } from "@/redux/baseApi";

export const mockTestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── CREATE ────────────────────────────────────────────────────────────────
    // Uses FormData so the thumbnail image can be uploaded (multipart/form-data)
    createMockTest: builder.mutation({
      query: (formData: FormData) => ({
        url: "/mock-test",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [{ type: "MOCK_TEST", id: "LIST" }],
    }),
   getStudentMockTest: builder.query({
      query: () => ({
        url: `/mock-test/for-user`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 30, 
      providesTags: (_result, _error) => [
        { type: "MOCK_TEST", id: "LIST" },
      ],
    }),
    // ─── READ ──────────────────────────────────────────────────────────────────
    getAllMockTests: builder.query({
      query: (params?) => ({
        url: "/mock-test",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 60 * 10, // 10 min
      providesTags: (result) =>
        result
          ? [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...result?.data?.data?.map((t: any) => ({
                type: "MOCK_TEST" as const,
                id: t._id,
              })),
              { type: "MOCK_TEST" as const, id: "LIST" },
            ]
          : [{ type: "MOCK_TEST" as const, id: "LIST" }],
    }),

    // Fetch a single mock test by its URL slug (public-facing)
    getMockTestBySlug: builder.query({
      query: (slug: string) => ({
        url: `/mock-test/${slug}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 30, // 30 min
      providesTags: (_result, _error, slug) => [
        { type: "MOCK_TEST", id: slug },
        { type: "MOCK_TEST", id: "LIST" },
      ],
    }),

    // Fetch by internal MongoDB _id (admin/editor use-case)
    getMockTestById: builder.query({
      query: (id: string) => ({
        url: `/mock-test/id/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 30,
      providesTags: (_result, _error, id) => [{ type: "MOCK_TEST", id }],
    }),

    // ─── UPDATE ────────────────────────────────────────────────────────────────
    updateMockTest: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData | Record<string, unknown> }) => ({
        url: `/mock-test/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MOCK_TEST", id },
        { type: "MOCK_TEST", id: "LIST" },
      ],
    }),

    // ─── DELETE ────────────────────────────────────────────────────────────────
    deleteMockTest: builder.mutation({
      query: (id: string) => ({
        url: `/mock-test/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MOCK_TEST", id },
        { type: "MOCK_TEST", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateMockTestMutation,
  useGetAllMockTestsQuery,
  useGetMockTestBySlugQuery,
  useGetMockTestByIdQuery,
  useUpdateMockTestMutation,
  useDeleteMockTestMutation,
  useGetStudentMockTestQuery,
} = mockTestApi;
