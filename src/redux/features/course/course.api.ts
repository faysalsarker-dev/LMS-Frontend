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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const queryParams = new URLSearchParams(params as any).toString();
        return {
          url: `/course?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["COURSE"],
    }),


    // Get single course
    getCourseBySlug: builder.query({
      query: (slug) => ({
        url: `/course/${slug}`,
        method: "GET",
      }),
      providesTags: ["COURSE"],
    }),
    getMyEnrolledCourses: builder.query({
      query: () => ({
        url: `/course/my-enrolled-courses`,
        method: "GET",
      }),
      providesTags: ["COURSE","PROGRESS"],
    }),
    getCourseById: builder.query({
      query: (id) => ({
        url: `/course/my-course/${id}`,
        method: "GET",
      }),
      providesTags: ["COURSE"],
    }),

    // Update course
updateCourse: builder.mutation({
  query: ({ courseId, formData }) => ({
    url: `/course/${courseId}`,
    method: "PUT",
    data: formData,
  }),
  invalidatesTags: ["COURSE"],
}),

getCourseCurriculum: builder.query({
      query: (courseId: string) => ({
        url: `/course/${courseId}/curriculum`,
        method: "GET",
      }),
      keepUnusedDataFor: 18000,
      providesTags: ["COURSE", "PROGRESS"],
    }),

    // Get specific heavy lesson content on-demand
    getLessonContent: builder.query({
      query: (lessonId: string) => ({
        url: `/course/lessons/${lessonId}`,
        method: "GET",
      }),
    }),
    // Delete course
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COURSE"],
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
} = courseApi;