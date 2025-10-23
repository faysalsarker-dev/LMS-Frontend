import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Shield, Lock, Loader2,  XCircle } from 'lucide-react';
import { useParams } from 'react-router'
import toast, { Toaster } from 'react-hot-toast';
import { useGetCourseBySlugQuery } from '@/redux/features/course/course.api';
import type { ICourse } from '@/interface';
import { useCreateEnrolmentMutation } from '@/redux/features/enrollment/enrollment.api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-dropdown-menu';


const AlipayIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" fill="white"/>
        <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4Z" fill="#1677FF"/>
        <path d="M28.8 14.4H19.2V28.8H28.8V14.4Z" fill="white"/>
        <path d="M24 33.6C16.8 33.6 11.2 28 11.2 20.8H14.4C14.4 26.24 18.24 30.4 24 30.4C29.76 30.4 33.6 26.24 33.6 20.8H36.8C36.8 28 31.2 33.6 24 33.6Z" fill="white"/>
    </svg>
);
const WechatPayIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" fill="white"/>
        <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4Z" fill="#09BB07"/>
        <circle cx="16" cy="18" r="2" fill="white"/>
        <circle cx="32" cy="18" r="2" fill="white"/>
        <path d="M24 34C18.96 34 14.8 30.64 13.04 26H34.96C33.2 30.64 29.04 34 24 34Z" fill="white"/>
    </svg>
);






type PaymentMethod = "alipay" | "wechat";

const CheckoutPage = () => {
  const { slug } = useParams();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const { 
    data, 
    isLoading: isCourseLoading, 
    isError: isCourseError, 
  } = useGetCourseBySlugQuery(slug || '');

  const course = data?.data as ICourse;
 
  const [createEnrolment, { isLoading: isMutating }] = useCreateEnrolmentMutation();

  const handleCheckout = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method to proceed.');
      return;
    }
    
    if (!course?._id) {
        toast.error('Course details are missing. Cannot proceed with enrollment.');
        return;
    }

    const enrolData = {
      course: course._id,
      method: selectedPayment,
    };

    const loadingToastId = toast.loading(`Processing ${selectedPayment} payment...`);
    
    try {
      const result = await createEnrolment(enrolData).unwrap();
      
      toast.success(
        result.data?.message || 'Payment successful! You are now enrolled.',
        { id: loadingToastId }
      );

      console.log('Simulation: Redirecting to:', result.data?.redirectUrl || '/dashboard');

    } catch (error) {
      console.error("Enrollment error:", error);
      
      let errorMessage = 'An unexpected error occurred during checkout.';
      
      
      if (typeof error === 'object' && error !== null && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data && typeof error.data.message === 'string') {
          errorMessage = error.data.message;
      } else if (error instanceof Error) {
          errorMessage = error.message;
      }

      toast.error(
        errorMessage,
        { id: loadingToastId }
      );
    }
  };

  const isCheckoutDisabled = isMutating || !selectedPayment || isCourseLoading || isCourseError;

  if (isCourseLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
            <span className="text-lg font-semibold text-muted-foreground">Loading course details...</span>
        </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-lg text-center border-red-500/30">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Course</h2>
          
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reload Page
          </Button>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Secure Checkout</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Complete Your Enrollment
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
              You're one step away from joining the course. Secure payment processing is handled below.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Course Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card className="border-gray-200 dark:border-gray-700 p-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full overflow-hidden">
              <div className="aspect-[16/9] relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  src={course?.thumbnail || ''}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/800x450/4f46e5/ffffff?text=Image+Not+Found";
                  }}
                />
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-snug">{course.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{course.description}</p>
                </div>

                <Separator />

                <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-5 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-300">Total Price</span>
                    <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      ${course.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3 pt-3 border-t border-indigo-100 dark:border-gray-700">
                    <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">Risk-Free Enrollment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Enjoy our 30-Day Money-Back Guarantee. Your satisfaction is our priority.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-gray-200 dark:border-gray-700 shadow-xl h-full flex flex-col p-6">
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-indigo-500" />
                    Select Payment Method
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Choose one of the secure options below to complete your payment.</p>
                </div>

                <div className="space-y-3">
                  {/* AliPay Option */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className={`w-full relative justify-start transition-all duration-200 h-16 text-left p-4 ${
                        selectedPayment === "alipay"
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-md ring-2 ring-indigo-500"
                          : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedPayment("alipay")}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                          <AlipayIcon />
                        </div>
                        <span className="font-semibold text-lg text-gray-800 dark:text-white">AliPay</span>
                      </div>
                      {selectedPayment === "alipay" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 bg-indigo-500 rounded-full p-1.5 shadow-lg"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>

                  {/* WeChat Pay Option */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className={`w-full relative justify-start transition-all duration-200 h-16 text-left p-4 ${
                        selectedPayment === "wechat"
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-md ring-2 ring-indigo-500"
                          : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedPayment("wechat")}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <WechatPayIcon />
                        </div>
                        <span className="font-semibold text-lg text-gray-800 dark:text-white">WeChat Pay</span>
                      </div>
                      {selectedPayment === "wechat" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 bg-indigo-500 rounded-full p-1.5 shadow-lg"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </div>

                <Separator className="dark:bg-gray-700" />

                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Course Price</span>
                      <span className="font-semibold text-gray-800 dark:text-white">${course.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                      <span className="font-semibold text-green-500">$0.00</span>
                    </div>
                    <Separator className="my-2 dark:bg-gray-700" />
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-extrabold text-xl text-gray-900 dark:text-white">Total Due</span>
                      <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${course.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 space-y-4">
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold shadow-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all"
                  onClick={handleCheckout}
                  disabled={isCheckoutDisabled}
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Confirm Enrollment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                  By confirming, you agree to our{" "}
                  <a href="#" className="text-indigo-600 hover:underline font-medium dark:text-indigo-400">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:underline font-medium dark:text-indigo-400">
                    Refund Policy
                  </a>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
