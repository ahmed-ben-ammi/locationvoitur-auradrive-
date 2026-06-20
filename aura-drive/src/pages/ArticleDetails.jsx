import { useEffect } from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogData } from '../data/blogData';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ArticleDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  
  const article = blogData.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return <Navigate to="/guides" replace />;
  }

  // To map contentBlocks, we can check if it's an array
  const contentBlocks = t(`blog.articles.${id}.contentBlocks`, { returnObjects: true });
  const isArray = Array.isArray(contentBlocks);

  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen transition-colors duration-300 pb-20">
      <Helmet>
        <title>{`Drive Car Go - ${t(`blog.articles.${id}.title`)}`}</title>
        <meta name="description" content={t(`blog.articles.${id}.excerpt`)} />
      </Helmet>

      {/* Cover Image */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-black overflow-hidden">
        <img 
          src={article.coverImage} 
          alt={t(`blog.articles.${id}.title`)}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] via-transparent to-transparent"></div>
        
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <NavLink 
            to="/guides"
            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/40 dark:bg-black/40 dark:hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all font-medium text-sm rtl:flex-row-reverse"
          >
            <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
            {t('nav.guides')}
          </NavLink>
        </div>
      </div>

      {/* Content Container (Medium Style) */}
      <div className="relative z-10 -mt-32 container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 border border-black/5 dark:border-white/5">
          
          {/* Article Header */}
          <div className="text-center mb-10 border-b border-black/10 dark:border-white/10 pb-10">
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900 dark:text-white leading-tight mb-6 rtl:font-sans">
              {t(`blog.articles.${id}.title`)}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
              <span className="flex items-center gap-2 rtl:flex-row-reverse">
                <Calendar className="w-4 h-4 text-primary" />
                {t('blog.publishedOn')} {article.date}
              </span>
              <span className="flex items-center gap-2 rtl:flex-row-reverse">
                <Clock className="w-4 h-4 text-primary" />
                10 {t('blog.minRead')}
              </span>
              <span className="flex items-center gap-2 rtl:flex-row-reverse">
                <User className="w-4 h-4 text-primary" />
                {article.author}
              </span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-a:text-primary hover:prose-a:text-primary-hover max-w-none rtl:text-right">
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-8 italic border-l-4 border-primary pl-4 rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r-4">
              {t(`blog.articles.${id}.excerpt`)}
            </p>

            {isArray && contentBlocks.map((block, index) => (
              <p key={index} className="text-gray-800 dark:text-gray-300 leading-relaxed mb-6 rtl:font-sans">
                {block}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
