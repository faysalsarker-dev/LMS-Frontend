import type { ITestimonial } from "@/interface/testimonial.types";
import { baseApi } from "@/redux/baseApi";

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTestimonial: build.mutation({
      query: (data) => ({
        url: "/testimonial",
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: "TESTIMONIAL", id: "LIST" },
        data.courseId && { type: "COURSE", id: data.courseId },
      ].filter(Boolean),
    }),

    updateTestimonial: build.mutation({
      query: ({ testimonialId, payload }) => ({
        url: `/testimonial/${testimonialId}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { testimonialId }) => [
        { type: "TESTIMONIAL", id: testimonialId },
        { type: "TESTIMONIAL", id: "LIST" },
      ],
    }),

    deleteTestimonial: build.mutation({
      query: (testimonialId) => ({
        url: `/testimonial/${testimonialId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, testimonialId) => [
        { type: "TESTIMONIAL", id: testimonialId },
        { type: "TESTIMONIAL", id: "LIST" },
      ],
    }),

    getCourseReviewSummary: build.query({
      query: (courseId) => ({
        url: `/testimonial/course/${courseId}`,
        method: "GET",
      }),
            keepUnusedDataFor: 60 * 60 * 5,
      providesTags: (_result, _error, courseId) => [
        { type: "TESTIMONIAL", id: `COURSE_${courseId}` },
      ],
    }),
    getTopTestimonials: build.query({
      query: () => ({
        url: "/testimonial/top",
        method: "GET",
      }),
            keepUnusedDataFor: 60 * 60 * 5,
      providesTags: [{ type: "TESTIMONIAL", id: "TOP20" }],
    }),
    getMyTestimonials: build.query({
      query: (courseId) => ({
        url: `/testimonial/my-review/${courseId}`,
        method: "GET",
      }),
            keepUnusedDataFor: 60 * 60 * 5,
      providesTags: (_result, _error, courseId) => [{ type: "TESTIMONIAL", id: `USER_${courseId}` }],
    }),

    getAllTestimonialsAdmin: build.query({
      query: ({ page = 1, limit = 10, sort = "newest" }) => ({
        url: "/testimonial/admin",
        method: "GET",
        params: { page, limit, sort },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((t:ITestimonial) => ({ type: "TESTIMONIAL", id: t._id })),
              { type: "TESTIMONIAL", id: "LIST" },
            ]
          : [{ type: "TESTIMONIAL", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetCourseReviewSummaryQuery,
  useGetTopTestimonialsQuery,
  useGetAllTestimonialsAdminQuery,
  useGetMyTestimonialsQuery,
} = testimonialApi;
