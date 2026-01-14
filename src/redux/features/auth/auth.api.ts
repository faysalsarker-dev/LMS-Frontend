import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/user/login",
        method: "POST",
        data: userInfo,
      }),
    invalidatesTags: ["USER"],

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
      query: (payload) => ({
        url: `/user/update`,
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: ["USER"],

    }),
    updateUser: builder.mutation({
      query: ({id,payload}) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: ["USER"],

    }),
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `/user/update-password`,
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: ["USER"],

    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/send-otp",
        method: "POST",
        data: email,
      }),
     invalidatesTags: ["USER"],

    }),
    verifyOtp: builder.mutation({
      query: (payload) => ({
        url: "/user/verify-otp",
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: ["USER"],

    }),
    addToWishlist: builder.mutation({
      query: (payload) => ({
        url: "/user/addToWishlist",
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: ["USER","COURSE"],

    }),
    forgetPassword: builder.mutation({
      query: (payload) => ({
        url: "/user/forget-password",
        method: "POST",
        data: payload,
      }),
     invalidatesTags: ["USER"],

    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/user/reset-password",
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: ["USER"],

    }),
    userInfo: builder.query({
      query: () => ({
        url: `/user/me`,
        method: "GET",
      }),
      providesTags: ["USER"],
      keepUnusedDataFor: 60 * 60 * 3
    }),

    getAll: builder.query({
  query: (params) => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    return {
      url: `/user?${searchParams.toString()}`,
      method: "GET",
    };
  },
  providesTags: ["USER"],
}),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete/${id}`,
        method: "DELETE",
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
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetAllQuery,
  useAddToWishlistMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation
} = authApi;