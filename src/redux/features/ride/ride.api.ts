import type { Ride } from "@/components/interfaces";
import { baseApi } from "@/redux/baseApi";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRideRequest: builder.mutation({
      query: (rideInfo) => ({
        url: "/rides/request",
        method: "POST",
        data: rideInfo,
      }),
      invalidatesTags: ["RIDE"],
    }),

    cancelRide: builder.mutation({
      query: ({ rideId }: { rideId: string }) => ({
        url: `/rides/${rideId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["RIDE"],
    }),
    acceptRide: builder.mutation({
      query: ({ rideId }: { rideId: string }) => ({
        url: `/rides/${rideId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["RIDE"],
    }),
    changeRideStatus: builder.mutation({
      query: ({
        rideId,
        status,
      }: {
        rideId: string;
        status: Ride["status"];
      }) => ({
        url: `/rides/${rideId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["RIDE"],
    }),

    rideHistory: builder.query({
      query: () => ({
        url: "/rides/history",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    driverHistory: builder.query({
      query: () => ({
        url: "/rides/driver-history",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getAvailableRides: builder.query({
      query: () => ({
        url: "/rides/available",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getSingleRide: builder.query({
      query: (rideId) => ({
        url: `/rides/${rideId}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
  }),
});

export const {
  useCreateRideRequestMutation,
  useCancelRideMutation,
  useRideHistoryQuery,
  useGetAvailableRidesQuery,
  useAcceptRideMutation,
  useDriverHistoryQuery,
  useGetSingleRideQuery,
  useChangeRideStatusMutation
} = rideApi;
