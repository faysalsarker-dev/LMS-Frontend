export interface EnrolmentUser {
  _id: string;
  name: string;
  email: string;
}

export interface EnrolmentCourse {
  _id: string;
  title: string;
}

export type EnrolmentStatus = 'active' | 'completed' | 'cancelled';
export type PaymentMethod = 'alipay' | 'wechat' | 'stripe' | 'paypal';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IEnrolment {
  _id: string;
  user: EnrolmentUser;
  course: EnrolmentCourse;
  status: EnrolmentStatus;
  enrolledAt: string;
  completedAt: string | null;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  promoCodeUsed: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  paymentDate: string | null;
  refundDate: string | null;
  refundReason: string | null;
}

export interface EnrolmentFiltersState {
  status: EnrolmentStatus | 'all';
  paymentStatus: PaymentStatus | 'all';
  paymentMethod: PaymentMethod | 'all';
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
  status?: EnrolmentStatus;
  paymentStatus?: PaymentStatus;
  refundReason?: string;
}
