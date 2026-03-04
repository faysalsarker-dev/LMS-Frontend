import type { IUser } from "@/interface/user.types";
import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/user/login",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    logoutFromOthers: builder.mutation({
      query: (email) => ({
        url: "/user/logout-all",
        method: "POST",
        data:email
      }),
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
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
      invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    updateUser: builder.mutation({
      query: ({id,payload}) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: (_result, _error, { id }) => [
        { type: "USER", id },
        { type: "USER", id: "LIST" },
      ],
    }),
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `/user/update-password`,
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/send-otp",
        method: "POST",
        data: email,
      }),
     invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    verifyOtp: builder.mutation({
      query: (payload) => ({
        url: "/user/verify-otp",
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    addToWishlist: builder.mutation({
      query: (payload) => ({
        url: "/user/addToWishlist",
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: [
        { type: "USER", id: "CURRENT" },
        { type: "COURSE", id: "LIST" },
      ],
    }),
    forgetPassword: builder.mutation({
      query: (payload) => ({
        url: "/user/forget-password",
        method: "POST",
        data: payload,
      }),
     invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/user/reset-password",
        method: "PUT",
        data: payload,
      }),
     invalidatesTags: [{ type: "USER", id: "CURRENT" }],
    }),
    userInfo: builder.query({
      query: () => ({
        url: `/user/me`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "USER", id: result?.data?.data?._id }] : [],
      keepUnusedDataFor: 60 * 60 * 3,
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
  providesTags: (result) => {
    const data = result?.data?.data || result?.data;
    if (Array.isArray(data)) {
      return [
        ...data.map((u: IUser) => ({ type: "USER" as const, id: u._id })),
        { type: "USER" as const, id: "LIST" },
      ];
    }
    return [{ type: "USER" as const, id: "LIST" }];
  },
}),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "USER", id },
        { type: "USER", id: "LIST" },
      ],
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
  useUpdatePasswordMutation,
  useLogoutFromOthersMutation
} = authApi;