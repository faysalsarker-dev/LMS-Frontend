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

    // Update course
    updateCourse: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/course/${id}`,
        method: "PUT",
        data: formData,    
      }),
      invalidatesTags: ["COURSE"],
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
} = courseApi;