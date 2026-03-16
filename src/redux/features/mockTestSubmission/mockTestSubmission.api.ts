import { baseApi } from "@/redux/baseApi";
import type { IGradeSubmissionPayload, ISubmitMockTestPayload } from "@/interface/mockTestSubmission.types";

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

    // 3. Get Pending Submissions (Admin)
    getPendingSubmissions: builder.query<any, void>({
      query: () => ({
        url: "/mock-test-submission/pending",
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
  useGetMockTestProgressQuery
} = mockTestSubmissionApi;
