import { baseApi } from "@/redux/baseApi";
import type { IGradeSubmissionPayload, ISubmitMockTestPayload, IPendingSubmissionsFilters } from "@/interface/mockTestSubmission.types";

export const mockTestSubmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Submit Mock Test (Student)
    submitMockTest: builder.mutation<any, ISubmitMockTestPayload>({
      query: (data) => ({
        url: "/mock-test-submission/submit",
        method: "POST",
        data,
      }),
      invalidatesTags: ["MOCK_TEST_SUBMISSION"],
    }),
    submitSpeakingMockTest: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/mock-test-submission/submit-speaking",
        method: "POST",
        data: formData,
        // Let the browser set the multipart boundary automatically
        headers: { "Content-Type": undefined },
      }),
      invalidatesTags: ["MOCK_TEST_SUBMISSION"],
    }),

    // 2. Get My Submissions (Student)
    getMySubmissions: builder.query<any, string>({
      query: (courseId: string) => ({
        url: `/mock-test-submission/my-submissions/${courseId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...(result?.data?.map(({ _id }: any) => ({ type: "MOCK_TEST_SUBMISSION" as const, id: _id })) || []),
              { type: "MOCK_TEST_SUBMISSION", id: "LIST" },
            ]
          : [{ type: "MOCK_TEST_SUBMISSION", id: "LIST" }],
    }),
    getMockTestProgress: builder.query<any, string>({
      query: (mockTestId: string) => ({
        url: `/mock-test-submission/my-mocktest-progress/${mockTestId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, mockTestId) => [{ type: "MOCK_TEST_SUBMISSION", id: mockTestId }],
    }),
    getMockTestSubmissionById: builder.query<any, string>({
      query: (submissionId: string) => ({
        url: `/mock-test-submission/${submissionId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, submissionId) => [{ type: "MOCK_TEST_SUBMISSION", id: submissionId }],
    }),


    // 3. Get Pending Submissions (Admin)
    getPendingSubmissions: builder.query<any, IPendingSubmissionsFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search)    params.append("search", filters.search);
        if (filters?.course)    params.append("course", filters.course);
        if (filters?.mockTest)  params.append("mockTest", filters.mockTest);
        if (filters?.section)   params.append("section", filters.section);
        if (filters?.createdAt) params.append("createdAt", filters.createdAt);
        if (filters?.page)      params.append("page", String(filters.page));
        if (filters?.limit)     params.append("limit", String(filters.limit));
        if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
        const qs = params.toString();
        return { url: `/mock-test-submission/pending${qs ? `?${qs}` : ""}`, method: "GET" };
      },
      providesTags: (result) =>
        result
          ? [
              ...(result?.data?.map(({ _id }: any) => ({ type: "MOCK_TEST_SUBMISSION" as const, id: _id })) || []),
              { type: "MOCK_TEST_SUBMISSION", id: "LIST" },
            ]
          : [{ type: "MOCK_TEST_SUBMISSION", id: "LIST" }],
    }),

    // 4. Grade Submission (Admin)
    gradeSubmission: builder.mutation<any, { submissionId: string; data: IGradeSubmissionPayload }>({
      query: ({ submissionId, data }) => ({
        url: `/mock-test-submission/${submissionId}/grade`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { submissionId }) => [
        { type: "MOCK_TEST_SUBMISSION", id: submissionId },
        { type: "MOCK_TEST_SUBMISSION", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSubmitMockTestMutation,
  useGetMySubmissionsQuery,
  useGetPendingSubmissionsQuery,
  useGradeSubmissionMutation,
  useGetMockTestProgressQuery,
  useSubmitSpeakingMockTestMutation,
  useGetMockTestSubmissionByIdQuery
} = mockTestSubmissionApi;
