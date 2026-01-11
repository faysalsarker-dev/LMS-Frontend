// Checkout Types aligned with backend Enrollment and Course models

import type { PaymentMethod, PaymentStatus } from './enrolment.types';

export interface CheckoutCourse {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  isDiscounted: boolean;
  currency: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  totalLectures?: number;
  certificateAvailable?: boolean;
  instructor?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface PromoCode {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiresAt?: string;
}

export interface PromoRedeemResponse {
  success: boolean;
  discount: number;
  finalAmount: number;
  promo: PromoCode | null;
  message?: string;
}

export interface PricingBreakdown {
  originalPrice: number;
  discountAmount: number;
  promoDiscount: number;
  finalAmount: number;
  currency: string;
}

export interface CheckoutPayload {
  course: string;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  promoCodeUsed?: string;
}

export interface CheckoutResult {
  success: boolean;
  enrollmentId?: string;
  transactionId?: string;
  paymentStatus: PaymentStatus;
  message?: string;
}

export type CheckoutStep = 'review' | 'payment' | 'processing' | 'success' | 'failed';

export interface CheckoutState {
  step: CheckoutStep;
  course: CheckoutCourse | null;
  pricing: PricingBreakdown;
  selectedPaymentMethod: PaymentMethod | null;
  appliedPromo: PromoCode | null;
  isProcessing: boolean;
  error: string | null;
}
