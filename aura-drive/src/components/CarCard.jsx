import { useTranslation } from 'react-i18next';
import { Fuel, Settings, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function CarCard({ car }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, isClient } = useAuth();

  const handleBookClick = () => {
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          from: `/book/${car.id}`,
          message: 'auth.loginRequired',
        },
      });
      return;
    }

    if (!isClient) {
      navigate('/login', {
        state: {
          from: `/book/${car.id}`,
          message: 'auth.clientRoleRequired',
        },
      });
      return;
    }

    navigate(`/book/${car.id}`);
  };

  return (
    <div className="group bg-white dark:bg-[#242424] border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 rounded-xl">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-black/80 backdrop-blur-sm text-primary px-3 py-1 text-xs uppercase tracking-wider font-semibold border border-primary/20">
          {car.year}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{car.brand}</p>
            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white uppercase tracking-wide line-clamp-1 transition-colors duration-300">
              {car.model}
            </h3>
          </div>
          <div className="text-right rtl:text-left shrink-0 ml-4 rtl:ml-0 rtl:mr-4">
            <div className="text-primary font-bold text-lg leading-tight">
              {(car.pricePerDay || 299).toLocaleString('en-US')}
            </div>
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
              {t('fleet.pricePerDay')}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex flex-col items-center justify-center text-center">
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 mb-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{t(`fleet.${car.transmission || 'auto'}`)}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-black/5 dark:border-white/5">
            <Fuel className="w-5 h-5 text-gray-500 dark:text-gray-400 mb-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{t(`fleet.fuel.${car.fuel || 'petrol'}`)}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mb-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{car.seats || 5}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBookClick}
          className="w-full py-3 block text-center bg-gray-50 dark:bg-[#1a1a1a] hover:bg-primary dark:hover:bg-primary text-gray-900 dark:text-white hover:text-gray-900 font-semibold tracking-wider uppercase transition-colors duration-300 rtl:font-sans"
        >
          {t('fleet.bookNow')}
        </button>
      </div>
    </div>
  );
}
