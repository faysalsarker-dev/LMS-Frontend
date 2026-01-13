import { baseApi } from "@/redux/baseApi";

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ Create testimonial
    createTestimonial: build.mutation({
      query: (data) => ({
        url: "/testimonial",
        method: "POST",
        data,
      }),
      invalidatesTags: ["TESTIMONIAL"],
    }),

    // ✅ Update testimonial
    updateTestimonial: build.mutation({
      query: ({ testimonialId, payload }) => ({
        url: `/testimonial/${testimonialId}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["TESTIMONIAL"],
    }),

    // ✅ Delete testimonial
    deleteTestimonial: build.mutation({
      query: (testimonialId) => ({
        url: `/testimonial/${testimonialId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TESTIMONIAL"],
    }),

    // ✅ Public: course review summary (total count + top 10)
    getCourseReviewSummary: build.query({
      query: (courseId) => ({
        url: `/testimonial/course/${courseId}`,
        method: "GET",
      }),
            keepUnusedDataFor: 60 * 60 * 5,

      providesTags: ["TESTIMONIAL"],
    }),

    // ✅ Public: top 20 highest-rated testimonials
    getTopTestimonials: build.query({
      query: () => ({
        url: "/testimonial/top",
        method: "GET",
      }),
            keepUnusedDataFor: 60 * 60 * 5,

      providesTags: ["TESTIMONIAL"],
    }),
    getMyTestimonials: build.query({
      query: (courseId) => ({
        url: `/testimonial/my-review/${courseId}`,
        method: "GET",
      }),
            keepUnusedDataFor: 60 * 60 * 5,

      providesTags: ["TESTIMONIAL"],
    }),

    // ✅ Admin: all testimonials with pagination + sorting
    getAllTestimonialsAdmin: build.query({
      query: ({ page = 1, limit = 10, sort = "newest" }) => ({
        url: "/testimonial/admin",
        method: "GET",
        params: { page, limit, sort },
      }),
      providesTags: ["TESTIMONIAL"],
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
