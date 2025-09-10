import { Link } from 'react-router';
import { GraduationCap, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Footer = () => {
  const isMobile = useIsMobile();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Learners', href: '/learners' },
        { name: 'Partners', href: '/partners' },
        { name: 'Developers', href: '/developers' },
        { name: 'Beta Testers', href: '/beta' },
      ],
    },
    {
      title: 'More',
      links: [
        { name: 'Investors', href: '/investors' },
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Help', href: '/help' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className={`bg-muted/30 border-t border-border ${isMobile ? 'pb-app-bar' : ''}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-primary p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">EduPlatform</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transform your life through learning. Join millions of learners from around the world 
              already learning on EduPlatform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 EduPlatform, Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link to="/sitemap" className="text-muted-foreground hover:text-primary text-sm">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};