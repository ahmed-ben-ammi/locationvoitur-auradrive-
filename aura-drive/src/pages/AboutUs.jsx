import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Star, Clock, Map, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
  const { t } = useTranslation();

  const values = [
    { id: 'fleet', icon: Star },
    { id: 'support', icon: Clock },
    { id: 'expertise', icon: Map },
    { id: 'pricing', icon: Shield },
  ];

  return (
    <div className="bg-[#F9F6F0] dark:bg-[#121212] min-h-screen transition-colors duration-300">
      <Helmet>
        <title>{`Drive Car Go - ${t('nav.about')}`}</title>
        <meta name="description" content={t('aboutPage.heroSubtitle')} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2070&auto=format&fit=crop"
          alt="Moroccan Landscape"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white uppercase tracking-widest mb-6 animate-fade-in-up">
            {t('aboutPage.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('aboutPage.heroSubtitle')}
          </p>
        </div>
      </div>

      {/* Our Story (Split Layout) */}
      <div className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 rtl:flex-row-reverse">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 dark:text-white uppercase mb-8 rtl:font-sans">
              {t('aboutPage.storyTitle')}
            </h2>
            <div className="w-20 h-1 bg-primary mb-8 ml-0 rtl:mr-0 rtl:ml-auto"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed rtl:font-sans rtl:text-right">
              {t('aboutPage.storyContent')}
            </p>
          </div>
          <div className="lg:w-1/2 relative w-full">
            <div className="absolute inset-0 bg-primary transform translate-x-4 translate-y-4 rtl:-translate-x-4 rounded-xl opacity-20 dark:opacity-40"></div>
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
              alt={t('aboutPage.storyImageAlt')}
              className="relative rounded-xl shadow-2xl w-full object-cover h-[400px] md:h-[500px]"
            />
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="py-24 bg-white dark:bg-[#1a1a1a] transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 rtl:font-sans">
              {t('aboutPage.valuesTitle')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val) => (
              <div
                key={val.id}
                className="bg-[#F9F6F0] dark:bg-[#242424] p-8 rounded-xl border border-black/5 dark:border-white/10 hover:border-primary dark:hover:border-primary transition-all duration-300 text-center hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto bg-white dark:bg-[#121212] rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <val.icon className="w-8 h-8 text-[#C17767]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 rtl:font-sans">
                  {t(`aboutPage.values.${val.id}.title`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 rtl:font-sans leading-relaxed">
                  {t(`aboutPage.values.${val.id}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats/Milestones */}
      <div className="py-20 bg-dark dark:bg-black text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-white/20">
            <div className="pt-6 md:pt-0 flex flex-col items-center justify-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-2 rtl:font-sans">{t('aboutPage.stats.cars')}</div>
            </div>
            <div className="pt-6 md:pt-0 flex flex-col items-center justify-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-2 rtl:font-sans">{t('aboutPage.stats.clients')}</div>
            </div>
            <div className="pt-6 md:pt-0 flex flex-col items-center justify-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-2 rtl:font-sans">{t('aboutPage.stats.assistance')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900 dark:text-white mb-8 rtl:font-sans">
          {t('aboutPage.ctaTitle')}
        </h2>
        <NavLink
          to="/fleet"
          className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-black uppercase tracking-wider overflow-hidden bg-primary rtl:flex-row-reverse"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
          <span className="relative">{t('aboutPage.ctaButton')}</span>
          <ChevronRight className="ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180 w-5 h-5 relative group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </NavLink>
      </div>
    </div>
  );
}
