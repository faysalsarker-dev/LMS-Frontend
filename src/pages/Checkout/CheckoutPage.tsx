import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CourseCard,
  PricingSummary,
  PromoCodeInput,
  PaymentMethodSelector,
  CheckoutStatus,
  TrustBadges,
} from '@/components/modules/checkout';

import type { 
  CheckoutStep, 
  PromoCode, 
  CheckoutPayload, 
  CheckoutCourse, 
  PricingBreakdown 
} from '@/interface/checkout.types';
import type { PaymentMethod } from '@/interface/enrolment.types';
import { useGetCourseBySlugQuery } from '@/redux/features/course/course.api';
import { useCreateEnrolmentMutation } from '@/redux/features/enrollment/enrollment.api';
import { useRedeemPromoMutation } from '@/redux/features/promo/promo.api';

// Helper function for pricing calculation
function calculatePricing(
  course: CheckoutCourse,
  promoDiscount: number = 0
): PricingBreakdown {
  const originalPrice = course.isDiscounted && course.discountPrice 
    ? course.discountPrice 
    : course.price;
  
  const discountAmount = course.isDiscounted && course.discountPrice 
    ? course.price - course.discountPrice 
    : 0;
  
  const finalAmount = Math.max(0, originalPrice - promoDiscount);
  
  return {
    originalPrice: course.price,
    discountAmount,
    promoDiscount,
    finalAmount,
    currency: course.currency,
  };
}

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // API hooks
  const { data: courseData, isLoading: courseLoading, error: courseError } = 
    useGetCourseBySlugQuery(slug);
  const [redeemPromo, { isLoading: promoLoading }] = useRedeemPromoMutation();
  const [processCheckout, { isLoading: checkoutLoading }] = useCreateEnrolmentMutation();

  // Local state
  const [step, setStep] = useState<CheckoutStep>('review');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const course = courseData?.data;
  const isEnrolled = false; // This should come from actual enrollment check
  const isLoading = courseLoading;

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!course) return null;
    return calculatePricing(course, promoDiscount);
  }, [course, promoDiscount]);

  // Handle promo code application
  const handleApplyPromo = async (code: string): Promise<boolean> => {
    if (!pricing || !course) {
      toast.error('Unable to apply promo code at this time');
      return false;
    }

    try {
      const result = await redeemPromo({
        code,
        orderAmount: course.isDiscounted && course.discountPrice 
          ? course.discountPrice 
          : course.price,
      }).unwrap();

      if (result.success && result.data?.promo) {
        setAppliedPromo(result.data.promo);
        setPromoDiscount(result.data.discount || 0);
        toast.success(`Promo code "${code}" applied successfully!`);
        return true;
      } else {
        toast.error('Invalid promo code');
        return false;
      }
    } catch (error: any) {
      // Handle specific error messages
      const errorMessage = error?.data?.message || 
                          error?.message || 
                          'Invalid or expired promo code';
      
      toast.error(errorMessage);
      return false;
    }
  };

  // Handle promo removal
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    toast.success('Promo code removed');
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!course || !pricing || !selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setStep('processing');

    try {
      const payload: CheckoutPayload = {
        course: course._id,
        originalPrice: pricing.originalPrice,
        discountAmount: pricing.discountAmount + pricing.promoDiscount,
        finalAmount: pricing.finalAmount,
        currency: pricing.currency,
        paymentMethod: selectedPaymentMethod,
        promoCodeUsed: appliedPromo?.code,
      };

      const result = await processCheckout(payload).unwrap();

      if (result.success) {
        setStep('success');
        toast.success('Enrollment completed successfully!');
      } else {
        setStep('failed');
        toast.error('Payment failed. Please try again.');
      }
    } catch (error: any) {
      setStep('failed');
      const errorMessage = error?.data?.message || 
                          error?.message || 
                          'Payment processing failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setStep('review');
  };

  // Handle go to course
  const handleGoToCourse = () => {
    navigate(`/courses/${slug}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Course Not Found</AlertTitle>
            <AlertDescription>
              The course you're trying to purchase doesn't exist or is no longer available.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/courses')}
            className="mt-4 w-full"
          >
            Browse Courses
          </Button>
        </motion.div>
      </div>
    );
  }

  // Already enrolled state
  if (isEnrolled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Already Enrolled!
          </h2>
          <p className="text-muted-foreground mb-6">
            You're already enrolled in this course. Start learning now!
          </p>
          <Button 
            onClick={() => navigate(`/courses/${slug}`)}
            className="gap-2 gradient-primary text-primary-foreground"
          >
            Continue Learning
          </Button>
        </motion.div>
      </div>
    );
  }

  const canCheckout = selectedPaymentMethod !== null && pricing !== null;

  return (
    <>
      {/* Status Overlays */}
      <CheckoutStatus 
        step={step}
        courseName={course.title}
        onRetry={handleRetry}
        onGoToCourse={handleGoToCourse}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
              <p className="text-sm text-muted-foreground">Complete your enrollment</p>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Course & Payment */}
            <div className="lg:col-span-3 space-y-6">
              <CourseCard course={course} />
              <PaymentMethodSelector
                selected={selectedPaymentMethod}
                onSelect={setSelectedPaymentMethod}
                disabled={step === 'processing'}
              />
            </div>

            {/* Right Column - Pricing & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {pricing && (
                <>
                  <PromoCodeInput
                    appliedPromo={appliedPromo}
                    onApply={handleApplyPromo}
                    onRemove={handleRemovePromo}
                    isLoading={promoLoading}
                  />
                  
                  <PricingSummary
                    pricing={pricing}
                    appliedPromo={appliedPromo}
                    originalPrice={course.price}
                    isDiscounted={course.isDiscounted}
                  />
                </>
              )}

              {/* Checkout Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleCheckout}
                  disabled={!canCheckout || checkoutLoading}
                  className="w-full h-14 text-lg font-semibold gap-2 gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                {!selectedPaymentMethod && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Select a payment method to continue
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12">
            <TrustBadges />
          </div>
        </div>
      </div>
    </>
  );
}