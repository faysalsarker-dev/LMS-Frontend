import type { ICategory } from "@/interface/category.types";
import { baseApi } from "@/redux/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Category
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category",         
        method: "POST",       
        data: data,          
      }),
      invalidatesTags: [{ type: "CATEGORY", id: "LIST" }],
    }),

    // Get all Categorys
    getAllCategorys: builder.query({
      query: () => {
  
        return {
          url: `/category`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 60 * 60 * 5,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((c:ICategory) => ({ type: "CATEGORY", id: c._id })),
              { type: "CATEGORY", id: "LIST" },
            ]
          : [{ type: "CATEGORY", id: "LIST" }],
    }),


    // Get single Category
    getCategoryBySlug: builder.query({
      query: (slug) => ({
        url: `/category/${slug}`,
        method: "GET",
      }),
        keepUnusedDataFor: 60 * 60 * 1,
      providesTags: (_result, _error, slug) => [
        { type: "CATEGORY", id: slug },
        { type: "CATEGORY", id: "LIST" },
      ],
    }),

    // Update Category
updateCategory: builder.mutation({
  query: ({ CategoryId, formData }) => ({
    url: `/category/${CategoryId}`,
    method: "PUT",
    data: formData,
  }),
  invalidatesTags: (_result, _error, { CategoryId }) => [
    { type: "CATEGORY", id: CategoryId },
    { type: "CATEGORY", id: "LIST" },
  ],
}),


    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "CATEGORY", id },
        { type: "CATEGORY", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategorysQuery,
  useGetCategoryBySlugQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi