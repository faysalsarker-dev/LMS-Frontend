import { baseApi } from "@/redux/baseApi";

export const enrolmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnrolment: builder.mutation({
      query: (data) => ({
        url: "/enrolment",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["ENROLMENT"],
    }),

    getAllEnrolments: builder.query({
      query: () => {
      
        return {
          url: `/enrolment`,
          method: "GET",
        };
      },
      providesTags: ["ENROLMENT"],
    }),

    getEnrolmentById: builder.query({
      query: (id) => ({
        url: `/enrolment/${id}`,
        method: "GET",
      }),
      providesTags: ["ENROLMENT"],
    }),

    updateEnrolment: builder.mutation({
      query: ({ enrolmentId, formData }) => ({
        url: `/enrolment/${enrolmentId}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["ENROLMENT"],
    }),

    deleteEnrolment: builder.mutation({
      query: (id) => ({
        url: `/enrolment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ENROLMENT"],
    }),
  }),
});

export const {
  useCreateEnrolmentMutation,
  useGetAllEnrolmentsQuery,
  useGetEnrolmentByIdQuery,
  useUpdateEnrolmentMutation,
  useDeleteEnrolmentMutation,
} = enrolmentApi;
