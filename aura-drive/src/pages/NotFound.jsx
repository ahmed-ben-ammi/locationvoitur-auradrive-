import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Car, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('notFound.title')}</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] dark:bg-[#0a0a0a] py-20 px-4 transition-colors duration-300">
        <div className="max-w-4xl w-full">
          {/* Hero Section with Car Illustration */}
          <div className="relative mb-12 text-center">
            {/* Background Blob */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
            </div>

            {/* Big 404 Text */}
            <h1 className="text-[140px] md:text-[180px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-900 dark:from-white via-gray-700 dark:via-gray-300 to-gray-500 dark:to-gray-500 animate-bounce" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>
              404
            </h1>

            {/* Car Icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Car className="w-16 h-16 md:w-24 md:h-24 text-primary drop-shadow-2xl" />
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-[32px] shadow-xl p-8 md:p-12 transition-all duration-300">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                {t('notFound.subtitle')}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto transition-colors duration-300">
                {t('notFound.description')}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black font-semibold uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {t('notFound.goHomeButton')}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/fleet"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-primary text-primary font-semibold uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black transition-all duration-300 hover:-translate-y-1"
                >
                  {t('notFound.browseFleetButton')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
