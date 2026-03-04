import { baseApi } from "@/redux/baseApi";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAssignment: builder.mutation({
      query: (formData) => ({
        url: "/assignment",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [{ type: "ASSIGNMENT", id: "LIST" }],
    }),
    getAllAssignments: builder.query({
      query: (params) => ({
        url: "/assignment",
        method: "GET",
        params, 
      }),
      providesTags: (result) =>
        result
          ? [
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...result.data.map((a:any) => ({ type: "ASSIGNMENT", id: a._id })),
              { type: "ASSIGNMENT", id: "LIST" },
            ]
          : [{ type: "ASSIGNMENT", id: "LIST" }],
    }),
    getAssignmentById: builder.query({
      query: (id) => ({
        url: `/assignment/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ASSIGNMENT", id }],
    }),
    getAssignmentByLessonId: builder.query({
      query: (id) => ({
        url: `/assignment/lesson-assignment/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ASSIGNMENT", id }],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/assignment/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ASSIGNMENT", id },
        { type: "ASSIGNMENT", id: "LIST" },
      ],
    }),

    reviewAssignment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignment/review/${id}`,
        method: "PATCH",
        data, // score, feedback, status
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ASSIGNMENT", id },
      ],
    }),
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ASSIGNMENT", id },
        { type: "ASSIGNMENT", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateAssignmentMutation,
  useGetAllAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useUpdateAssignmentMutation,
  useReviewAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentByLessonIdQuery
} = assignmentApi;
