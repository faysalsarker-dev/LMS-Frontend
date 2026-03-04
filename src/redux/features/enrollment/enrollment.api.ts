import type { IEnrolment } from "@/interface/enrolment.types";
import { baseApi } from "@/redux/baseApi";

export const enrolmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnrolment: builder.mutation({
      query: (data) => ({
        url: "/enrolment",
        method: "POST",
        data: data,
      }),
      invalidatesTags: (_result, _error, { courseId, userId, promoId }) => {
        const tags: Array<{ type: "ENROLMENT" | "COURSE" | "USER" | "PROMO" | "PROGRESS"; id: string }> = [
          { type: "ENROLMENT", id: "LIST" },
        ];
        if (courseId) tags.push({ type: "COURSE", id: courseId });
        if (userId) tags.push({ type: "USER", id: userId });
        if (promoId) tags.push({ type: "PROMO", id: promoId });
        if (courseId) tags.push({ type: "PROGRESS", id: courseId });
        return tags;
      },
    }),

    getAllEnrolments: builder.query({
      query: () => {
      
        return {
          url: `/enrolment`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((e:IEnrolment) => ({ type: "ENROLMENT", id: e._id })),
              { type: "ENROLMENT", id: "LIST" },
            ]
          : [{ type: "ENROLMENT", id: "LIST" }],
    }),

    getEnrolmentById: builder.query({
      query: (id) => ({
        url: `/enrolment/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ENROLMENT", id }],
    }),

    updateEnrolment: builder.mutation({
      query: ({ enrolmentId, formData }) => ({
        url: `/enrolment/${enrolmentId}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: (_result, _error, { enrolmentId }) => [
        { type: "ENROLMENT", id: enrolmentId },
        { type: "ENROLMENT", id: "LIST" },
      ],
    }),

    deleteEnrolment: builder.mutation({
      query: (id) => ({
        url: `/enrolment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ENROLMENT", id },
        { type: "ENROLMENT", id: "LIST" },
      ],
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
