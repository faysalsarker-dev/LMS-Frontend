export interface EnrolmentUser {
  _id: string;
  name: string;
  email: string;
}

export interface EnrolmentCourse {
  _id: string;
  title: string;
}

export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled" | "refunded";

export interface IEnrolment {
  _id: string;
  user: EnrolmentUser;
  course: EnrolmentCourse;
  currency: string;
  amount: number;
  paymentStatus: PaymentStatus;
  promoCode: string | null;
  transactionId: string;
  status: boolean;
  refundDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnrolmentFiltersState {
  paymentStatus: PaymentStatus | 'all';
  course: string;
  search: string;
  page: number;
  limit: number;
}

export interface EnrolmentsResponse {
  success: boolean;
  data: IEnrolment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateEnrolmentData {
  paymentStatus?: PaymentStatus;
}


export type PaymentMethod = 'alipay' | 'wechat' | 'stripe' | 'paypal';
