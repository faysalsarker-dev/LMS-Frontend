import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Users2, 
  Building2 
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  // Extracting arrays from i18n
  const offerItems = t('aboutPage.offers.items', { returnObjects: true }) as Array<{ label: string, text: string }>;
  const teamItems = t('aboutPage.whoWeAre.teams', { returnObjects: true }) as Array<{ name: string, role: string }>;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-24">
        
        {/* HERO / GOAL SECTION */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          className="text-center space-y-6"
        >
          <Badge variant="secondary" className="px-4 py-1 text-sm rounded-full">
            {t('navbar.about')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {t('aboutPage.goal.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('aboutPage.goal.content')}
          </p>
        </motion.section>

        {/* OFFERS SECTION */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <CheckCircle2 className="text-primary w-8 h-8" />
              {t('aboutPage.offers.title')}
            </h2>
            <p className="text-muted-foreground">{t('aboutPage.offers.description')}</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {offerItems.map((item, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full border-muted hover:border-primary/50 transition-all duration-300 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-primary italic">
                      · {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* WHO WE ARE SECTION */}
        <section className="rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 md:p-12 space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <Users2 className="text-primary w-8 h-8" />
              {t('aboutPage.whoWeAre.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('aboutPage.whoWeAre.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamItems.map((team, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-background border shadow-sm"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">{idx + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LEGAL SECTION */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <ShieldCheck className="text-primary w-8 h-8" />
              {t('aboutPage.legal.title')}
            </h2>
            <p className="text-muted-foreground">{t('aboutPage.legal.intro')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bangladesh Office */}
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {t('aboutPage.legal.bangladesh.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-bold text-primary">{t('aboutPage.legal.bangladesh.name')}</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    {t('aboutPage.legal.bangladesh.address')}
                  </p>
                  <div className="grid grid-cols-1 gap-1 border-t pt-4 mt-4 font-mono text-[13px]">
                    <p>Trade License: {t('aboutPage.legal.bangladesh.tradeLicense')}</p>
                    <p>e-TIN: {t('aboutPage.legal.bangladesh.eTIN')}</p>
                    <p>BIN: {t('aboutPage.legal.bangladesh.bin')}</p>
                    <p className="mt-2 text-muted-foreground italic font-sans">
                      {t('aboutPage.legal.bangladesh.vat')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* China Office */}
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {t('aboutPage.legal.china.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-bold text-primary">{t('aboutPage.legal.china.name')}</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    {t('aboutPage.legal.china.address')}
                  </p>
                  <div className="grid grid-cols-1 gap-1 border-t pt-4 mt-4 font-mono text-[13px]">
                    <p>Tax ID: {t('aboutPage.legal.china.taxId')}</p>
                    <p>Legal Rep: {t('aboutPage.legal.china.legalRep')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CONTACT FOOTER */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t pt-16"
        >
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-xl">
            <h2 className="text-3xl font-bold">{t('aboutPage.contact.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center">
              <a href={`mailto:${t('aboutPage.contact.email')}`} className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                <Mail className="w-6 h-6" />
                <span className="text-sm">{t('aboutPage.contact.email')}</span>
              </a>
              <div className="flex flex-col items-center gap-2">
                <Phone className="w-6 h-6" />
                <span className="text-sm">BD: {t('aboutPage.contact.phoneBD')}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Phone className="w-6 h-6" />
                <span className="text-sm">CN: {t('aboutPage.contact.phoneCN')}</span>
              </div>
              <a href={t('aboutPage.contact.website')} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                <Globe className="w-6 h-6" />
                <span className="text-sm">Official Website</span>
              </a>
            </div>
          </div>
        </motion.footer>

      </main>
    </div>
  );
};

export default AboutPage;