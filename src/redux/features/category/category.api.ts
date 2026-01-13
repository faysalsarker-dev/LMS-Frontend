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
      invalidatesTags: ["CATEGORY"],
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
      providesTags: ["CATEGORY"],
    }),


    // Get single Category
    getCategoryBySlug: builder.query({
      query: (slug) => ({
        url: `/category/${slug}`,
        method: "GET",
      }),
        keepUnusedDataFor: 60 * 60 * 1,
      providesTags: ["CATEGORY"],
    }),

    // Update Category
updateCategory: builder.mutation({
  query: ({ CategoryId, formData }) => ({
    url: `/category/${CategoryId}`,
    method: "PUT",
    data: formData,
  }),
  invalidatesTags: ["CATEGORY"],
}),


    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORY"],
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