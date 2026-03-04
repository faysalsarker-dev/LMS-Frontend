import type { ICourse } from "@/interface/course.types";
import { baseApi } from "@/redux/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create course
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/course",         
        method: "POST",       
        data: data,          
      }),
      invalidatesTags: ["COURSE"],
    }),

    // Get all courses
    getAllCourses: builder.query({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(params as any || {}).filter(([_, v]) => v !== undefined && v !== null && v !== "")
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const queryParams = new URLSearchParams(filteredParams as any).toString();
        return {
          url: queryParams ? `/course?${queryParams}` : "/course",
          method: "GET",
        };
      },
      keepUnusedDataFor: 60 * 60, 
      providesTags: (result) => {
        if (result?.data?.data) {
          return [
            ...result.data.data.map((c: ICourse) => ({ type: "COURSE" as const, id: c._id })),
            { type: "COURSE" as const, id: "LIST" },
          ];
        }
        return [{ type: "COURSE" as const, id: "LIST" }];
      },
    }),

    // Get single course
    getCourseBySlug: builder.query({
      query: (slug) => ({
        url: `/course/${slug}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 2,
      providesTags: (_result, _error, slug) => [
        { type: "COURSE", id: slug },
        { type: "COURSE", id: "LIST" },
      ],
    }),

    getCourseForSelect: builder.query({
      query: () => ({
        url: `/course/select`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 5,
      providesTags: [{ type: "COURSE", id: "SELECT" }],
    }),
    getMyEnrolledCourses: builder.query({
      query: () => ({
        url: `/course/my-enrolled-courses`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 1,
      providesTags: (result) =>
        result
          ? result.data.map((c: ICourse) => ({ type: "COURSE" as const, id: c._id }))
          : [],
    }),
    getMyWishlistCourses: builder.query({
      query: () => ({
        url: `/course/my-wishlist-courses`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 1,
      providesTags: (result) =>
        result
          ? result.data.map((c: ICourse) => ({ type: "COURSE" as const, id: c._id }))
          : [],
    }),
    getCourseById: builder.query({
      query: (id) => ({
        url: `/course/my-course/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 5,
      providesTags: (_result, _error, id) => [
        { type: "COURSE", id },
      ],
    }),

    // Update course
updateCourse: builder.mutation({
  query: ({ courseId, formData }) => ({
    url: `/course/${courseId}`,
    method: "PUT",
    data: formData,
  }),
  invalidatesTags: (_result, _error, { courseId }) => [
    { type: "COURSE", id: courseId },
    { type: "COURSE", id: "LIST" },
  ],
}),

getCourseCurriculum: builder.query({
      query: (courseId: string) => ({
        url: `/course/${courseId}/curriculum`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 5,
      providesTags: (_result, _error, courseId) => [
        { type: "COURSE", id: courseId },
        { type: "PROGRESS", id: courseId },
      ],
    }),

    // Get specific heavy lesson content on-demand
    getLessonContent: builder.query({
      query: (lessonId: string) => ({
        url: `/course/lessons/${lessonId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 5,
      providesTags: (_result, _error, lessonId) => [
        { type: "LESSON", id: lessonId },
      ],
    }),
    // Delete course
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "COURSE", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseBySlugQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useGetCourseCurriculumQuery,
  useGetLessonContentQuery,
  useGetMyEnrolledCoursesQuery,
  useGetMyWishlistCoursesQuery,
  useGetCourseForSelectQuery
} = courseApi;