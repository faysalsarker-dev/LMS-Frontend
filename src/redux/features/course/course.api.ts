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
        const queryParams = new URLSearchParams(params as any).toString();
        return {
          url: `/course?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["COURSE"],
    }),


    // Get single course
    getCourseById: builder.query({
      query: (id) => ({
        url: `/course/${id}`,
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
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;