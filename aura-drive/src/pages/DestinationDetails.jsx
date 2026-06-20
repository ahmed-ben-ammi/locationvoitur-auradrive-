import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { destinationsData } from '../data/destinationsData';
import { cars } from '../data/cars';
import CarCard from '../components/CarCard';

export default function DestinationDetails() {
  const { id } = useParams();
  const { t } = useTranslation();

  const destination = destinationsData.find(d => d.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!destination) {
    return <Navigate to="/" replace />;
  }

  // Filter cars based on recommended categories
  const recommendedCars = cars.filter(car => 
    destination.recommendedCarCategories.includes(car.category.toLowerCase()) || destination.recommendedCarCategories.includes(car.category)
  ).slice(0, 3); // Limit to 3 for aesthetic layout

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t(destination.titleKey)}</title>
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center bg-gray-900">
        <img 
          src={destination.heroImage} 
          alt={t(destination.titleKey)}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6 drop-shadow-lg uppercase tracking-wide">
            {t(destination.titleKey)}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 drop-shadow-md font-light max-w-2xl mx-auto">
            {t(destination.subtitleKey)}
          </p>
        </div>
      </div>

      <div className="bg-[#F9F6F0] dark:bg-[#121212] py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Places to Visit (Zig-Zag Layout) */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                {t('destinationDetails.placesToVisitTitle')}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="space-y-24">
              {destination.placesToVisit.map((place, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                    {/* Image */}
                    <div className="w-full md:w-1/2">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
                        <img 
                          src={place.image} 
                          alt={t(place.titleKey)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                      </div>
                    </div>
                    {/* Text */}
                    <div className="w-full md:w-1/2 space-y-6">
                      <div className="inline-block bg-primary/10 text-primary font-semibold px-5 py-2 rounded-full text-sm tracking-wide shadow-sm">
                        {t(place.distanceKey)}
                      </div>
                      <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white transition-colors duration-300">
                        {t(place.titleKey)}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg transition-colors duration-300">
                        {t(place.descKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Cars */}
          {recommendedCars.length > 0 && (
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  {t('destinationDetails.recommendedCarsTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('destinationDetails.recommendedCarsSubtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </div>
          )}

          {/* Map Embed Section */}
          <div>
             <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  {t('destinationDetails.mapTitle')}
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('destinationDetails.mapSubtitle')}</p>
              </div>
            <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#242424] p-2 transition-colors duration-300">
              <iframe
                src={destination.mapEmbedUrl}
                width="100%"
                height="100%"
                className="rounded-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}
