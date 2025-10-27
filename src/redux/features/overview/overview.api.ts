import { baseApi } from "@/redux/baseApi";

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => ({
        url: "/overview/dashboard",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getUserStats: builder.query({
      query: () => ({
        url: "/overview/users",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getCourseStats: builder.query({
      query: () => ({
        url: "/overview/courses",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getEnrollmentStats: builder.query({
      query: () => ({
        url: "/overview/enrollments",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getRevenueStats: builder.query({
      query: () => ({
        url: "/overview/revenue",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getPopularCourses: builder.query({
      query: () => ({
        url: "/overview/popular-courses",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getRecentEnrollments: builder.query({
      query: () => ({
        url: "/overview/recent-enrollments",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getContentStats: builder.query({
      query: () => ({
        url: "/overview/content",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
    }),

    getGrowthAnalytics: builder.query({
      query: () => ({
        url: "/overview/growth",
        method: "GET",
      }),
      providesTags: ["OVERVIEW"],
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
