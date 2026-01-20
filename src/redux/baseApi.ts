import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER","COURSE","MILESTONE","LESSON","SETTING","CATEGORY","ENROLMENT","PROGRESS","OVERVIEW","TESTIMONIAL","PROMO","ASSIGNMENT","PRACTICE"],
  endpoints: () => ({}),
});


