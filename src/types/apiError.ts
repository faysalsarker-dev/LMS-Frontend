import type { AxiosError } from "axios";

export interface ApiErrorResponse {
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type ApiError = AxiosError<ApiErrorResponse>;