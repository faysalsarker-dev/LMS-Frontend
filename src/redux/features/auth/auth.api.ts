import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/user/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    update: builder.mutation({
      query: (userInfo) => ({
        url: "/user/update",
        method: "PUT",
        data: userInfo,
      }),
     invalidatesTags: ["USER"],

    }),
    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: "/user/change-password",
        method: "PUT",
        data: userInfo,
      }),
     invalidatesTags: ["USER"],
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
    driverOnline: builder.mutation({
      query: () => ({
        url: "/user/driver-online",
        method: "PUT",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useUpdateMutation,
  useChangePasswordMutation,
  useDriverOnlineMutation
} = authApi;