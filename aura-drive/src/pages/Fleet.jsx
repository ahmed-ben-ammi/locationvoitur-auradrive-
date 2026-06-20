import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import CarCard from '../components/CarCard';
import EmptyState from '../components/EmptyState';
import { Search } from 'lucide-react';
import { getAllCars, mapCarData } from '../api/cars';
import clsx from 'clsx';

export default function Fleet() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const priceFilters = ['all', 'economy', 'mid-range', 'luxury'];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllCars();
        const mappedCars = data.map(mapCarData);
        setCars(mappedCars);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(err.message || 'Erreur lors du chargement des voitures');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const getPriceCategory = (price) => {
    if (price < 300) return 'economy';
    if (price >= 300 && price < 800) return 'mid-range';
    return 'luxury';
  };

  const filteredCars = filter === 'all' 
    ? cars 
    : cars.filter(car => getPriceCategory(car.pricePerDay) === filter);

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('nav.fleet')}</title>
      </Helmet>

      <div className="pt-32 pb-16 bg-[#F9F6F0] dark:bg-zinc-900/50 transition-colors duration-300 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('fleet.title')}
            </h1>
            <div className="w-24 h-1 bg-[#C17767] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('fleet.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {priceFilters.map((priceFilter) => (
              <button
                key={priceFilter}
                onClick={() => setFilter(priceFilter)}
                className={clsx(
                  'relative px-8 py-4 rounded-xl font-semibold text-sm md:text-base uppercase tracking-wider transition-all duration-300 overflow-hidden border-2',
                  {
                    'bg-[#C17767] border-[#C17767] text-white shadow-lg scale-105': filter === priceFilter,
                    'bg-white dark:bg-[#242424] border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:border-[#C17767]/50': filter !== priceFilter,
                  }
                )}
              >
                {filter === priceFilter && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[#C17767] to-[#d69484] opacity-20 animate-pulse"></span>
                )}
                <span className="relative z-10">
                  {t(`fleet.filters.${priceFilter}`)}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#C17767]/20 border-t-[#C17767] rounded-full animate-spin"></div>
                <p className="text-gray-500 dark:text-gray-400">{t('booking.loading')}</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">{t('fleet.error') || 'Erreur: '} {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          
          {!loading && !error && filteredCars.length === 0 && (
            <EmptyState
              icon={Search}
              title={t('fleet.empty.title')}
              description={t('fleet.empty.description')}
            />
          )}
        </div>
      </div>
    </>
  );
}
