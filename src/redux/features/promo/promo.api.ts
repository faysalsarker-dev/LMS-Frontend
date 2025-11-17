import type { IPromo, IPromoPayload } from "@/interface";
import { baseApi } from "@/redux/baseApi";

export const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Create Promo
    createPromo: builder.mutation<IPromo, IPromoPayload>({
      query: (data) => ({
        url: "/promo",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["PROMO"],
    }),

    // Get all Promos
    getAllPromos: builder.query<IPromo[], void>({
      query: () => ({
        url: "/promo",
        method: "GET",
      }),
      providesTags: ["PROMO"],
    }),

    // Get single promo
    getPromoById: builder.query<IPromo, string>({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "GET",
      }),
      providesTags: ["PROMO"],
    }),

    // Update promo
    updatePromo: builder.mutation<
      IPromo,
      { promoId: string; formData: Partial<IPromoPayload> }
    >({
      query: ({ promoId, formData }) => ({
        url: `/promo/${promoId}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["PROMO"],
    }),

    // Delete promo
    deletePromo: builder.mutation<{ message: string }, string>({
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
} = promoApi;
