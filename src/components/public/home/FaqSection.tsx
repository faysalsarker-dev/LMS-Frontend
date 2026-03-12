import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, BookOpen, CreditCard, Award, Clock, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const { t } = useTranslation();
  const faqs = [
    {
      icon: BookOpen,
      question: t("home.faq.howDoIGetStarted"),
      answer: t("home.faq.getStartedAnswer")
    },
    {
      icon: CreditCard,
      question: t("home.faq.whatPaymentMethods"),
      answer: t("home.faq.paymentMethodsAnswer")
    },
    {
      icon: Award,
      question: t("home.faq.doIGetCertificate"),
      answer: t("home.faq.certificateAnswer")
    },
    {
      icon: Clock,
      question: t("home.faq.howLongAccess"),
      answer: t("home.faq.accessAnswer")
    },
    {
      icon: MessageCircle,
      question: t("home.faq.isThereSupport"),
      answer: t("home.faq.supportAnswer")
    },
    {
      icon: HelpCircle,
      question: t("home.faq.canIGetRefund"),
      answer: t("home.faq.refundAnswer")
    }
  ];

const FAQItem = ({ faq, index, isOpen, onClick }: { 
  faq: typeof faqs[0]; 
  index: number; 
  isOpen: boolean; 
  onClick: () => void;
}) => {
  const Icon = faq.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.button
        onClick={onClick}
        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
          isOpen 
            ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10" 
            : "bg-card/50 border-border/50 hover:bg-card hover:border-border"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start gap-3">
          <motion.div 
            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isOpen 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className={`text-sm md:text-base font-semibold transition-colors ${
                isOpen ? "text-primary" : "text-foreground"
              }`}>
                {faq.question}
              </h3>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed pr-6">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-primary/5 from-background via-muted/20 to-background">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t("home.faq.gotQuestions")}</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t("home.faq.frequentlyAskedQuestions")}
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("home.faq.everythingYouNeed")}
          </p>
        </motion.div>

        {/* Main Content - FAQ + Illustration */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* FAQ List */}
          <div className="space-y-3 order-2 lg:order-1">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* Side Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Main Illustration Card */}
              <motion.div
                className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-3xl p-8 border border-primary/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-3 -left-3 w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30"
                  animate={{ rotate: [0, -10, 10, 0], y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                >
                  <MessageCircle className="w-6 h-6 text-accent" />
                </motion.div>

                {/* Main Content */}
                <div className="text-center space-y-6">
                  {/* Animated Question Marks */}
                  <div className="flex justify-center gap-4">
                    {["?", "问", "?"].map((char, i) => (
                      <motion.span
                        key={i}
                        className="text-5xl font-bold text-primary/30"
                        animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-background/50 rounded-xl p-4 border border-border/50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-xs text-muted-foreground">{t("home.faq.support")}</div>
                    </motion.div>
                    <motion.div
                      className="bg-background/50 rounded-xl p-4 border border-border/50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-primary">{"<2h"}</div>
                      <div className="text-xs text-muted-foreground">{t("home.faq.response")}</div>
                    </motion.div>
                  </div>

                  {/* Message Bubbles */}
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 border border-border/50"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <HelpCircle className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">{t("home.faq.howDoIStart")}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 border border-primary/20 ml-6"
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-xs text-primary">{t("home.faq.justClickEnroll")}</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Rings */}
              <motion.div
                className="absolute -z-10 inset-0 border-2 border-primary/10 rounded-3xl"
                style={{ transform: "translate(10px, 10px)" }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -z-20 inset-0 border border-primary/5 rounded-3xl"
                style={{ transform: "translate(20px, 20px)" }}
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

      
      </div>
    </section>
  );
}
