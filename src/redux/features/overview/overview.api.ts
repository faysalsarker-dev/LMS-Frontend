import { baseApi } from "@/redux/baseApi";

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => ({
        url: "/overview/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "DASHBOARD" }],
    }),

    getUserStats: builder.query({
      query: () => ({
        url: "/overview/users",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "USER_STATS" }],
    }),

    getCourseStats: builder.query({
      query: () => ({
        url: "/overview/courses",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "COURSE_STATS" }],
    }),

    getEnrollmentStats: builder.query({
      query: () => ({
        url: "/overview/enrollments",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "ENROLLMENT_STATS" }],
    }),

    getRevenueStats: builder.query({
      query: () => ({
        url: "/overview/revenue",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "REVENUE_STATS" }],
    }),

    getPopularCourses: builder.query({
      query: () => ({
        url: "/overview/popular-courses",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "POPULAR" }],
    }),

    getRecentEnrollments: builder.query({
      query: () => ({
        url: "/overview/recent-enrollments",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "RECENT_ENROLLMENTS" }],
    }),

    getContentStats: builder.query({
      query: () => ({
        url: "/overview/content",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "CONTENT_STATS" }],
    }),

    getGrowthAnalytics: builder.query({
      query: () => ({
        url: "/overview/growth",
        method: "GET",
      }),
      providesTags: [{ type: "OVERVIEW", id: "GROWTH" }],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetUserStatsQuery,
  useGetCourseStatsQuery,
  useGetEnrollmentStatsQuery,
  useGetRevenueStatsQuery,
  useGetPopularCoursesQuery,
  useGetRecentEnrollmentsQuery,
  useGetContentStatsQuery,
  useGetGrowthAnalyticsQuery,
} = overviewApi;
