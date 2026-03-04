import type { ILesson } from "@/interface";
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
      invalidatesTags: [{ type: "LESSON", id: "LIST" }],
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
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((l:ILesson) => ({ type: "LESSON", id: l._id })),
              { type: "LESSON", id: "LIST" },
            ]
          : [{ type: "LESSON", id: "LIST" }],
    }),


    // Get single Lesson
    getLessonById: builder.query({
      query: (id) => ({
        url: `/lesson/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 60 * 2,
      providesTags: (_result, _error, id) => [{ type: "LESSON", id }],
    }),

    // Update Lesson
    updateLesson: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/lesson/${id}`,
        method: "PUT",
        data: formData,    
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "LESSON", id },
        { type: "LESSON", id: "LIST" },
      ],
    }),

    // Delete Lesson
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/lesson/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "LESSON", id },
        { type: "LESSON", id: "LIST" },
      ],
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