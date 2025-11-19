import { baseApi } from "@/redux/baseApi";

export const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Create Promo
    createPromo: builder.mutation({
      query: (data) => ({
        url: "/promo",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["PROMO"],
    }),

    // Get all Promos
    getMyPromos: builder.query({
      query: () => ({
        url: "/promo/my-promo",
        method: "GET",
      }),
      providesTags: ["PROMO"],
    }),
getAllPromos: builder.query({
  query: (params) => {
    // Remove undefined/null values and create clean query string
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>);

    const queryString = new URLSearchParams(cleanParams).toString();
    
    return {
      url: `/promo/admin/all${queryString ? `?${queryString}` : ''}`,
      method: "GET",
    };
  },
  providesTags: ["PROMO"],
}),

    // Get single promo
    getPromoById: builder.query({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "GET",
      }),
      providesTags: ["PROMO"],
    }),

    getAnalytics: builder.query({
     query: (params) => {
    // Remove undefined/null values and create clean query string
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>);

    const queryString = new URLSearchParams(cleanParams).toString();
    
    return {
      url: `/promo/analytics${queryString ? `?${queryString}` : ''}`,
      method: "GET",
    };
  },
  providesTags: ["PROMO"],
    }),

    // Update promo
    updatePromo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/promo/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["PROMO"],
    }),

    // Delete promo
    deletePromo: builder.mutation({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PROMO"],
    }),
  }),
});

export const {
  useCreatePromoMutation,
  useGetAllPromosQuery,
  useGetPromoByIdQuery,
  useUpdatePromoMutation,
  useDeletePromoMutation,
  useGetMyPromosQuery,
  useGetAnalyticsQuery
} = promoApi;
