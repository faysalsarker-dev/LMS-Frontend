import type { IPromo } from "@/interface/promo.interfaces";
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
      invalidatesTags: [{ type: "PROMO", id: "LIST" }],
    }),
    redeemPromo: builder.mutation({
      query: (data) => ({
        url: "/promo/redeem",
        method: "POST",
        data: data,
      }),
      invalidatesTags: (_result, _error, data) => [{ type: "PROMO", id: data.promoId }],
    }),

    // Get all Promos
    getMyPromos: builder.query({
      query: () => ({
        url: "/promo/my-promo",
        method: "GET",
      }),
      providesTags: (result) => {
        const data = result?.data?.data || result?.data;
        if (Array.isArray(data)) {
          return data.map((p: IPromo) => ({ type: "PROMO" as const, id: p._id }));
        }
        if (data?._id) {
          return [{ type: "PROMO" as const, id: data._id }];
        }
        return [];
      },
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
  providesTags: (result) => {
    const data = result?.data?.data || result?.data;
    if (Array.isArray(data)) {
      return [
        ...data.map((p: IPromo) => ({ type: "PROMO" as const, id: p._id })),
        { type: "PROMO" as const, id: "LIST" },
      ];
    }
    return [{ type: "PROMO" as const, id: "LIST" }];
  },
}),

    // Get single promo
    getPromoById: builder.query({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PROMO", id }],
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
  providesTags: [{ type: "PROMO", id: "ANALYTICS" }],
    }),

    // Update promo
    updatePromo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/promo/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PROMO", id },
        { type: "PROMO", id: "LIST" },
      ],
    }),

    // Delete promo
    deletePromo: builder.mutation({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PROMO", id },
        { type: "PROMO", id: "LIST" },
      ],
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
  useGetAnalyticsQuery,
  useRedeemPromoMutation
} = promoApi;
