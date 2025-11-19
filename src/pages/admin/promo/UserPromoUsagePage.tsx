import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Copy, Percent, Calendar, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetMyPromosQuery } from "@/redux/features/promo/promo.api";
import type { IPromo } from "@/interface/promo.interfaces";
import { getStatusBadge, renderUsage } from "@/components/modules/promo/Progress";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};



export default function UserPromoUsagePage() {

const {data}= useGetMyPromosQuery(undefined)
const promo = data?.data as IPromo


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success("Promo code copied to clipboard!", {
        icon: "📋",
        duration: 2000,
      });
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };






  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Hero Section */}
        <motion.div variants={item} className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Your Promo Code</h1>
          <p className="text-muted-foreground text-lg">
            Share your exclusive code and track its performance
          </p>
        </motion.div>

        {/* Main Promo Card */}
        <motion.div variants={item}>
          <motion.div
            initial="rest"
            whileHover="hover"
            variants={cardHover}
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                                {getStatusBadge(promo?.isActive, promo?.expirationDate)}
              
                </div>
                <CardTitle className="text-2xl">Your Exclusive Code</CardTitle>
                <CardDescription className="text-base">{promo?.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Promo Code Display */}
                <div className="bg-primary/10 rounded-lg p-6 text-center border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Promo Code</p>
                  <p className="text-4xl font-bold font-mono tracking-wider text-primary mb-4">
                    {promo?.code}
                  </p>
                  <Button onClick={copyToClipboard} className="w-full sm:w-auto">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-muted-foreground">Discount Value</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {promo?.discountType === "percentage" ? `${promo?.discountValue}%` : `$${promo?.discountValue}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{promo?.discountType} discount</p>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <p className="text-sm font-medium text-muted-foreground">Expires On</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {formatDate(promo?.expirationDate)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valid until this date
                    </p>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-success" />
                      <p className="text-sm font-medium text-muted-foreground">Total Uses</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {promo?.currentUsageCount} <span className="text-sm text-muted-foreground">/ {promo?.maxUsageCount}</span>
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                   {renderUsage(promo)}
                    </div>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-muted-foreground">Per User Limit</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{promo?.maxUsagePerUser}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum uses per customer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

 

  

        {/* Info Card */}
        <motion.div variants={item}>
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Share Your Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Share this code with your friends and followers. Each time someone uses it, 
                    you'll see the usage count increase in your analytics above.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}