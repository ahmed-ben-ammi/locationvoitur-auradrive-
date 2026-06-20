import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import heroVideo from '../assets/hero.mp4';
import heroImg from '../assets/hero.png';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video (z-0 باش ما يتخباش مورا الموقع) */}
      <video
        src={heroVideo}
        poster={heroImg}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block"
      />
      <img
        src={heroImg}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-0 block md:hidden"
      />

      {/* Overlay (z-10 باش يجي فوق الفيديو) */}
      <div className="absolute inset-0 z-10 bg-black/40 dark:bg-black/60 transition-colors duration-300"></div>

      {/* Content Wrapper (z-20 باش يجي فوق كلشي) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">

        {/* الكتيبة رديناها ديما بيضاء text-white باش تقرا فوق الفيديو */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white leading-tight mb-6 animate-fade-in-up transition-colors duration-300">
          {t('hero.title')}<span className="text-primary">.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto mb-10 rtl:font-sans transition-colors duration-300">
          {t('hero.subtitle')}
        </p>

        <div className="flex justify-center">
          <NavLink
            to="/fleet"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black uppercase tracking-wider overflow-hidden bg-primary rtl:flex-row-reverse"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
            <span className="relative">{t('hero.cta')}</span>
            <ChevronRight className="ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180 w-5 h-5 relative group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}