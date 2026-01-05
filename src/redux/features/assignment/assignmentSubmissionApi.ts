import { baseApi } from "@/redux/baseApi";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------
    // Create Assignment Submission
    // POST /assignment
    // ---------------------------
    createAssignment: builder.mutation({
      query: (formData) => ({
        url: "/assignment",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["ASSIGNMENT"],
    }),

    // ---------------------------
    // Get All Assignment Submissions (with params)
    // GET /assignment
    // ---------------------------
    getAllAssignments: builder.query({
      query: (params) => ({
        url: "/assignment",
        method: "GET",
        params, // page, limit, status, course, lesson, search
      }),
      providesTags: ["ASSIGNMENT"],
    }),

    // ---------------------------
    // Get Single Assignment Submission
    // GET /assignment/:id
    // ---------------------------
    getAssignmentById: builder.query({
      query: (id) => ({
        url: `/assignment/${id}`,
        method: "GET",
      }),
      providesTags: ["ASSIGNMENT"],
    }),

    // ---------------------------
    // Update Assignment Submission
    // PATCH /assignment/:id
    // ---------------------------
    updateAssignment: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/assignment/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["ASSIGNMENT"],
    }),

    // ---------------------------
    // Admin Review Assignment
    // PATCH /assignment/review/:id
    // ---------------------------
    reviewAssignment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignment/review/${id}`,
        method: "PATCH",
        data, // score, feedback, status
      }),
      invalidatesTags: ["ASSIGNMENT"],
    }),

    // ---------------------------
    // Delete Assignment Submission
    // DELETE /assignment/:id
    // ---------------------------
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ASSIGNMENT"],
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
} = assignmentApi;
