/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ShieldAlert, 
  Clock, 
  CreditCard, 
  LockKeyhole, 
  Scale, 
  Info,
  AlertCircle 
} from "lucide-react";

const TermsAndConditions: React.FC = () => {
  const { t } = useTranslation();

  // Mapping i18n data
  const accountRules = t('policyPage.sections.account.rules', { returnObjects: true }) as any[];
  const expiryItems = t('policyPage.sections.expiry.items', { returnObjects: true }) as any[];
  const refundRules = t('policyPage.sections.payments.refunds.conditions', { returnObjects: true }) as any[];
  const contentPoints = t('policyPage.sections.contentRules.points', { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-12 px-4 md:py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('policyPage.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('policyPage.intro')}
          </p>
        </motion.div>

        {/* 1. ACCOUNT RULES */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <LockKeyhole className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">{t('policyPage.sections.account.title')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {accountRules.map((rule, i) => (
              <Card key={i} className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{rule.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{rule.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. COURSE ACCESS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">{t('policyPage.sections.expiry.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expiryItems.map((item, i) => (
              <div key={i} className="bg-background border rounded-xl p-5 shadow-sm">
                <h3 className="font-bold mb-2 text-primary">{item.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-bold">Summary</AlertTitle>
            <AlertDescription className="italic">
              {t('policyPage.sections.expiry.summary')}
            </AlertDescription>
          </Alert>
        </section>

        {/* 3. PAYMENTS & REFUNDS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">{t('policyPage.sections.payments.title')}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-5 border rounded-xl bg-background">
              <h3 className="font-bold mb-2">{t('policyPage.sections.payments.paymentMethods.label')}</h3>
              <p className="text-sm text-muted-foreground">{t('policyPage.sections.payments.paymentMethods.text')}</p>
            </div>

            <div className="p-5 border rounded-xl bg-background">
              <h3 className="font-bold mb-2">{t('policyPage.sections.payments.delivery.label')}</h3>
              <p className="text-sm text-muted-foreground">{t('policyPage.sections.payments.delivery.text')}</p>
              <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                {t('policyPage.sections.payments.delivery.note')}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                {t('policyPage.sections.payments.refunds.label')}
              </h3>
              <div className="space-y-3">
                {refundRules.map((rule, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-900 border">
                    <span className="font-bold text-sm whitespace-nowrap text-primary">{rule.key}:</span>
                    <span className="text-sm text-muted-foreground">{rule.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONTENT RULES */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">{t('policyPage.sections.contentRules.title')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {contentPoints.map((point, i) => (
              <div key={i} className="flex gap-4 items-start p-4 bg-background border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">{point.label}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{point.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. RESPONSIBILITY */}
        <section className="space-y-6 pb-20">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">{t('policyPage.sections.responsibility.title')}</h2>
          </div>
          <Card className="bg-destructive/5 border-destructive/20 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">{t('policyPage.sections.responsibility.label')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('policyPage.sections.responsibility.text')}
              </p>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default TermsAndConditions;