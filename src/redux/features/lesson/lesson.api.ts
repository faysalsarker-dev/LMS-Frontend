import { baseApi } from "@/redux/baseApi";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Lesson
    createLesson: builder.mutation({
      query: (data) => ({
        url: "/lesson",         
        method: "POST",       
        data: data,          
      }),
      invalidatesTags: ["LESSON"],
    }),

    // Get all Lessons
    getAllLessons: builder.query({
      query: (params) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const queryParams = new URLSearchParams(params as any).toString();
        return {
          url: `/lesson?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["LESSON"],
    }),


    // Get single Lesson
    getLessonById: builder.query({
      query: (id) => ({
        url: `/lesson/${id}`,
        method: "GET",
      }),
      providesTags: ["LESSON"],
    }),

    // Update Lesson
    updateLesson: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/lesson/${id}`,
        method: "PUT",
        data: formData,    
      }),
      invalidatesTags: ["LESSON"],
    }),

    // Delete Lesson
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/lesson/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LESSON"],
    }),
  }),
});

export const {
  useCreateLessonMutation,
  useGetAllLessonsQuery,
  useGetLessonByIdQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;