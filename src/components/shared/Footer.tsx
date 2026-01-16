import { motion } from "framer-motion";
import { Link } from "react-router";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";

const Footer = () => {
  const { t } = useTranslation();
  const publicRoutes = [
    { path: "/", name: t("navbar.home") },
    { path: "/courses", name: t("navbar.courses") },
    { path: "/about", name: t("navbar.about") },
    { path: "/contact", name: t("navbar.contact") },
  ];

// Social media links
const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex justify-start">  <Logo /></div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.description")}
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-foreground font-semibold">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              {publicRoutes.map((route, index) => (
                <li key={index}>
                  <Link
                    to={route.path}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-200 group-hover:w-3" />
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-foreground font-semibold">{t("footer.resources")}</h4>
            <ul className="space-y-2">
              {[t("footer.helpCenter"), t("footer.blog"), t("footer.tutorials"), t("footer.faqs")].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-200 group-hover:w-3" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-foreground font-semibold">{t("footer.contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>123 Learning Street, Education City</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:faysalsarker.dev@gmail.com" className="hover:text-primary transition-colors">
                  faysalsarker.dev@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:01884570877" className="hover:text-primary transition-colors">
                  01884570877
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 pt-6 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} HLC. {t("footer.allRightsReserved")}
            </p>
            <p className="flex items-center gap-1">
              {t("footer.developedBy")}{" "}
              <span className="font-medium text-foreground">Faysal Sarker</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
