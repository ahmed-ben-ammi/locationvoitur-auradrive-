import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Clock, Calendar } from 'lucide-react';
import { blogData } from '../data/blogData';

export default function TravelGuides() {
  const { t } = useTranslation();

  const featuredArticle = blogData[0];
  const gridArticles = blogData.slice(1);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F9F6F0] dark:bg-[#121212] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <NavLink 
            to={`/guide/${featuredArticle.id}`}
            className="group block relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#1a1a1a]"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/3 h-96 lg:h-auto overflow-hidden relative">
                <img 
                  src={featuredArticle.coverImage} 
                  alt={t(`blog.articles.${featuredArticle.id}.title`)}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
              </div>
              <div className="lg:w-1/3 p-8 md:p-12 flex flex-col justify-center relative bg-white dark:bg-[#1a1a1a] z-10 lg:-ml-8 lg:my-8 lg:rounded-l-2xl lg:shadow-[-10px_0_20px_rgba(0,0,0,0.1)] dark:lg:shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 rtl:flex-row-reverse">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {featuredArticle.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 {t('blog.minRead')}</span>
                </div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4 rtl:font-sans">
                  {t(`blog.articles.${featuredArticle.id}.title`)}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 rtl:font-sans line-clamp-3">
                  {t(`blog.articles.${featuredArticle.id}.excerpt`)}
                </p>
                <div className="inline-flex items-center font-bold text-primary uppercase tracking-widest group-hover:text-primary-hover transition-colors rtl:flex-row-reverse">
                  {t('blog.readMore')}
                  <ChevronRight className="ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180 w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Grid Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article) => (
            <NavLink
              key={article.id}
              to={`/guide/${article.id}`}
              className="group bg-white dark:bg-[#242424] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={article.coverImage} 
                  alt={t(`blog.articles.${article.id}.title`)}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 rtl:flex-row-reverse">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 8 {t('blog.minRead')}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3 rtl:font-sans line-clamp-2">
                  {t(`blog.articles.${article.id}.title`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 rtl:font-sans line-clamp-3 flex-grow">
                  {t(`blog.articles.${article.id}.excerpt`)}
                </p>
                <div className="inline-flex items-center font-bold text-primary uppercase tracking-widest text-sm mt-auto rtl:flex-row-reverse group-hover:text-primary-hover transition-colors">
                  {t('blog.readMore')}
                  <ChevronRight className="ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180 w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
