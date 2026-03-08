import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER","COURSE","MILESTONE","LESSON","SETTING","CATEGORY","ENROLMENT","PROGRESS","OVERVIEW","TESTIMONIAL","PROMO","ASSIGNMENT","PRACTICE","MOCK_TEST","MOCK_TEST_SECTION"],
  /*
    Global defaults help avoid forgetting cache settings on individual
    endpoints. 1 hour is a reasonable starting point; individual queries
    can opt‑out or extend as needed.
  */
  keepUnusedDataFor: 60 * 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});


