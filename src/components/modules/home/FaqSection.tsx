
import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import faqImage from '@/assets/faq.jpg'

const faqs = [
  {
    question: "What is included in the E-Learning courses?",
    answer:
      "Each course includes high-quality video lessons, downloadable resources, quizzes, and access to our community forum for discussions and mentorship.",
  },
  {
    question: "Can I access the courses offline?",
    answer:
      "Yes! Once you enroll, you can download the course videos and materials for offline learning through our mobile app.",
  },
  {
    question: "Do you provide certificates after completion?",
    answer:
      "Absolutely! After completing a course, you’ll receive a verified digital certificate that you can share on LinkedIn or add to your resume.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our 24/7 support team through the Help Center or by emailing support@elearning.com.",
  },
  {
    question: "Can I get a refund if I’m not satisfied?",
    answer:
      "Yes, we offer a 14-day refund policy. If you’re not satisfied with your learning experience, you can request a full refund.",
  },
];

export default function FaqSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white via-blue-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* ===== Left Side: FAQ Content ===== */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-10">
            Find answers to some of the most common questions about our courses and platform.
          </p>

          <Card className="shadow-lg border border-blue-100/30 dark:border-slate-700">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className={cn(
                        "rounded-lg border border-blue-100/50 dark:border-slate-700",
                        "transition-all hover:shadow-md"
                      )}
                    >
                      <AccordionTrigger className="px-4 py-3 text-left text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* ===== Right Side: Illustration ===== */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center items-center"
        >
          <div className="relative w-full h-[420px] md:h-[500px]">
            <img
              src={faqImage}
              alt="FAQ illustration"
              
              className="object-contain drop-shadow-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
