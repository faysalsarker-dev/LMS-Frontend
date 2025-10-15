import { baseApi } from "@/redux/baseApi";

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppSettings: builder.query({
      query: () => ({
        url: "/app-config",
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),

    getAppSettingById: builder.query({
      query: (id: string) => ({
        url: `/app-config/${id}`,
        method: "GET",
      }),
      providesTags: ["SETTING"],
    }),

    createAppSetting: builder.mutation({
      query: (payload) => ({
        url: "/app-config",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["SETTING"],
    }),

    updateAppSetting: builder.mutation({
      query: ({id , payload}) => ({
        url: `/app-config/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["SETTING"],

    }),

    deleteAppSetting: builder.mutation({
      query: (id: string) => ({
        url: `/app-config/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SETTING"],
    }),
  }),
});

export const {
  useGetAppSettingsQuery,
  useGetAppSettingByIdQuery,
  useCreateAppSettingMutation,
  useUpdateAppSettingMutation,
  useDeleteAppSettingMutation,
} = settingApi;
