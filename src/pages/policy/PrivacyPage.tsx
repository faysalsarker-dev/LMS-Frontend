/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Database, 
  Eye, 
  Share2, 
  UserCheck, 
  ShieldCheck, 
  RefreshCcw, 
  MessageSquare,
  Mail,
  Phone
} from "lucide-react";


const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  // Extracting data arrays
  const collectionItems = t('privacyPage.sections.collection.items', { returnObjects: true }) as any[];
  const usagePoints = t('privacyPage.sections.usage.points', { returnObjects: true }) as string[];
  const sharingCases = t('privacyPage.sections.sharing.cases', { returnObjects: true }) as any[];
  const rightsOptions = t('privacyPage.sections.rights.options', { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center space-y-4 border-b pb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('privacyPage.title')}
          </h1>
          <p className="text-muted-foreground italic text-sm">
            Last Updated: February 2026
          </p>
        </motion.div>

        {/* 1. DATA COLLECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('privacyPage.sections.collection.title')}</h2>
          </div>
          <p className="text-muted-foreground">{t('privacyPage.sections.collection.intro')}</p>
          <div className="grid gap-4">
            {collectionItems.map((item, i) => (
              <Card key={i} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <span className="font-bold text-primary mr-2">{item.label}:</span>
                  <span className="text-muted-foreground text-sm">{item.text}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. DATA USAGE */}
        <section className="space-y-6 bg-slate-50 dark:bg-slate-900/40 p-8 rounded-2xl border">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('privacyPage.sections.usage.title')}</h2>
          </div>
          <p className="text-muted-foreground">{t('privacyPage.sections.usage.intro')}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {usagePoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* 3. DATA SHARING */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('privacyPage.sections.sharing.title')}</h2>
          </div>
          <p className="text-muted-foreground">{t('privacyPage.sections.sharing.intro')}</p>
          <div className="space-y-4">
            {sharingCases.map((c, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-6 py-2">
                <h4 className="font-bold text-sm text-foreground">{c.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. USER RIGHTS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('privacyPage.sections.rights.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rightsOptions.map((option, i) => (
              <div key={i} className="p-5 rounded-xl border bg-background flex flex-col gap-2">
                <h4 className="font-bold text-sm underline decoration-primary underline-offset-4">{option.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{option.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. DATA SAFETY */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('privacyPage.sections.security.title')}</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-loose border-2 border-dashed p-6 rounded-xl">
            {t('privacyPage.sections.security.text')}
          </p>
        </section>

        {/* 6. POLICY CHANGES */}
        <section className="flex items-start gap-4 p-6 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900">
          <RefreshCcw className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
          <div className="space-y-2">
            <h2 className="font-bold text-amber-800 dark:text-amber-400">{t('privacyPage.sections.changes.title')}</h2>
            <p className="text-sm text-amber-700 dark:text-amber-300/80">{t('privacyPage.sections.changes.text')}</p>
          </div>
        </section>

        {/* 7. CONTACT / COMPLAINTS */}
        <section className="space-y-6 pb-20">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('privacyPage.sections.contact.title')}</h2>
          </div>
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <p className="text-muted-foreground mb-6 text-center">{t('privacyPage.sections.contact.text')}</p>
            <div className="flex flex-wrap justify-center gap-8">
              <a href={`mailto:${t('privacyPage.sections.contact.email')}`} className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> {t('privacyPage.sections.contact.email')}
              </a>
              <div className="flex items-center gap-2 font-semibold">
                <Phone className="w-4 h-4" /> BD: {t('privacyPage.sections.contact.phoneBD')}
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <Phone className="w-4 h-4" /> CN: {t('privacyPage.sections.contact.phoneCN')}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;