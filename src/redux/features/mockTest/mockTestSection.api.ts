import { baseApi } from "@/redux/baseApi";

export const mockTestSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── READ ──────────────────────────────────────────────────────────────────
    // Returns the full section document including its embedded questions[]
    getSectionById: builder.query({
      query: (id: string) => ({
        url: `/mock-test-section/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 15, // 15 min
      providesTags: (_result, _error, id) => [
        { type: "MOCK_TEST_SECTION", id },
      ],
    }),

    // ─── CREATE ────────────────────────────────────────────────────────────────
    // Body: { mockTestId, name: "listening" | "reading" | "writing" | "speaking" }
    // The backend automatically links the new section back to the parent MockTest.
    createSection: builder.mutation({
      query: (data: { mockTestId: string; name: string }) => ({
        url: "/mock-test-section",
        method: "POST",
        data,
      }),
      // Invalidate the parent MockTest so its sections[] reference stays fresh
      invalidatesTags: (_result, _error, { mockTestId }) => [
        { type: "MOCK_TEST", id: mockTestId },
        { type: "MOCK_TEST", id: "LIST" },
      ],
    }),

    // ─── UPDATE ────────────────────────────────────────────────────────────────
    // Used to add / edit / replace the entire questions[] array inside a section.
    // Body can include: { questions: IMockQuestion[], timeLimit?, ... }
    updateSection: builder.mutation({
      query: ({ id, data }: { id: string; data: Record<string, unknown> }) => ({
        url: `/mock-test-section/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MOCK_TEST_SECTION", id },
      ],
    }),

    // ─── DELETE ────────────────────────────────────────────────────────────────
    deleteSection: builder.mutation({
      query: ({ id, mockTestId: _mockTestId }: { id: string; mockTestId: string }) => ({
        url: `/mock-test-section/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id, mockTestId }) => [
        { type: "MOCK_TEST_SECTION", id },
        { type: "MOCK_TEST", id: mockTestId },
        { type: "MOCK_TEST", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = mockTestSectionApi;
