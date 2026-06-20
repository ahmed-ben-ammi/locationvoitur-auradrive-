import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import { Clock, ThumbsUp, Zap, MapPin, Search } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import CarCard from '../components/CarCard';
import EmptyState from '../components/EmptyState';
import { getAllCars, mapCarData } from '../api/cars';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const featuredCars = cars.slice(0, 3); // Limit to 3 featured cars on home

  const aboutRef = useRef(null);
  const mapRef = useRef(null);
  
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await getAllCars();
        const mappedCars = data.map(mapCarData);
        setCars(mappedCars);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('nav.home')}</title>
      </Helmet>

      <Hero />
      <section className="py-24 bg-[#F9F6F0] dark:bg-zinc-900/50 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('fleet.title')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#C17767]/20 border-t-[#C17767] rounded-full animate-spin"></div>
                <p className="text-gray-500 dark:text-gray-400">{t('booking.loading')}</p>
              </div>
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map(car => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title={t('fleet.empty.title')}
              description={t('fleet.empty.description')}
            />
          )}
          
          <div className="mt-16 text-center">
            <NavLink 
              to="/fleet"
              className="inline-block border border-black/10 dark:border-white/10 px-8 py-4 text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors uppercase tracking-widest font-semibold"
            >
              View All Cars
            </NavLink>
          </div>
        </div>
      </section>

      <Destinations />

      {/* About Us Section */}
      <section ref={aboutRef} className="py-24 bg-dark-lighter dark:bg-[#1a1a1a] transition-colors duration-300 reveal-on-scroll opacity-0 translate-y-10 ease-out overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('about.title')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
              {t('about.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-[#242424] p-8 rounded-2xl border border-black/5 dark:border-white/5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('about.stats.response')}</h3>
            </div>
            
            <div className="bg-white dark:bg-[#242424] p-8 rounded-2xl border border-black/5 dark:border-white/5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <ThumbsUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('about.stats.satisfaction')}</h3>
            </div>
            
            <div className="bg-white dark:bg-[#242424] p-8 rounded-2xl border border-black/5 dark:border-white/5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('about.stats.delivery')}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section ref={mapRef} className="py-24 bg-dark dark:bg-[#121212] transition-colors duration-300 reveal-on-scroll opacity-0 translate-y-10 ease-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('location.title')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <MapPin className="text-primary w-5 h-5" />
              <p className="text-lg">{t('location.description')}</p>
            </div>
          </div>
        </div>
        
        <div className="w-full h-[500px] border-y border-black/5 dark:border-white/5 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106424.3828974868!2d-7.666874052328422!3d33.366755490076295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda63b7e77b47b41%3A0x608e5e8e788bc5f3!2sMohammed%20V%20International%20Airport!5e0!3m2!1sen!2sma!4v1714567890123!5m2!1sen!2sma"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
            title="Google Maps Location"
          ></iframe>
        </div>
      </section>

      {/* Featured Fleet Slider Section */}
      <section className="py-24 bg-dark-lighter dark:bg-[#1a1a1a] transition-colors duration-300 overflow-hidden relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center">
            <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('showcase.title')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4">
          <Swiper
            key={i18n.language}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={featuredCars.length > 3}
            autoplay={featuredCars.length > 0 ? {
              delay: 3000,
              disableOnInteraction: false,
            } : false}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="w-full !pb-12"
          >
            {featuredCars.map((car) => (
              <SwiperSlide key={`slider-${car.id}`} className="max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
                <div className="relative group rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-white dark:bg-[#242424] shadow-lg shadow-black/5 transition-colors duration-300">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{car.brand} {car.model}</h3>
                    <p className="text-primary font-semibold drop-shadow-md">{car.category}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-12 text-center">
          <NavLink 
            to="/fleet"
            className="inline-block bg-primary px-10 py-4 text-black hover:bg-primary-hover transition-colors uppercase tracking-widest font-bold rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            {t('showcase.bookNow')}
          </NavLink>
        </div>
      </section>

    </>
  );
}
