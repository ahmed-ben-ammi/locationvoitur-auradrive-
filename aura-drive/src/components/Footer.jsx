import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import brandLogo from '../assets/logo.png';

export default function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/fleet', label: t('nav.fleet') },
    { to: '/guides', label: t('nav.guides') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/212777543264', '_blank');
  };

  return (
    <footer className="bg-dark dark:bg-[#121212] border-t border-black/5 dark:border-white/5 py-16 mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Brand & Description */}
          <div className="text-center md:text-left rtl:md:text-right flex-1 w-full md:w-auto">
            <div className="mb-4 flex items-center justify-center md:justify-start rtl:md:justify-end gap-3">
              <img src={brandLogo} alt="Drive Car Go Logo" className="h-10 w-auto" />
              <span className="text-2xl font-heading font-bold tracking-wider text-gray-900 dark:text-white uppercase transition-colors duration-300">
                DRIVE CAR GO
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mx-auto md:mx-0 transition-colors duration-300">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 flex-1 justify-center w-full md:w-auto border-y md:border-none border-black/5 dark:border-white/5 py-6 md:py-0 transition-colors duration-300">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-gray-500 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          
          {/* Contact CTA */}
          <div className="flex justify-center md:justify-end flex-1 w-full md:w-auto">
            <button 
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 bg-primary px-6 py-3 text-black hover:bg-primary-hover transition-all uppercase tracking-widest font-bold rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('footer.sendMessage')}</span>
            </button>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 text-center transition-colors duration-300">
          <p className="text-gray-500 text-xs uppercase tracking-wider">
            &copy; {new Date().getFullYear()} {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

