import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Calendar, Phone, MapPin, ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { getCarById } from '../api/cars';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api/axios';

// API_URL is for API calls (has /api prefix)
// STATIC_URL is for images/files (no /api prefix)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};
const STATIC_URL = getBaseUrl();

export default function BookingPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoggedIn, isClient } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    date_debut: '',
    date_fin: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCarById(carId);
        setCar({
          ...data,
          image: data.image 
            ? data.image.startsWith('http') 
              ? data.image 
              : data.image.startsWith('uploads/')
                ? `${STATIC_URL}/${data.image}`
                : `${STATIC_URL}/uploads/${data.image}` 
            : 'https://via.placeholder.com/400x300?text=No+Image',
        });
      } catch (err) {
        console.error('Error fetching car:', err);
        setError(err.message || 'Erreur lors du chargement de la voiture');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark dark:bg-[#121212] pt-32 pb-24 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <p className="text-gray-500 dark:text-gray-400">{t('booking.loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return <Navigate to="/fleet" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          from: `/book/${carId}`,
          message: 'auth.loginRequired',
        },
      });
      return;
    }

    if (!isClient) {
      navigate('/login', {
        state: {
          from: `/book/${carId}`,
          message: 'auth.clientRoleRequired',
        },
      });
      return;
    }

    if (!formData.date_debut || !formData.date_fin) {
      setError(t('booking.datesRequired') || 'Les dates sont requises');
      return;
    }

    if (new Date(formData.date_debut) >= new Date(formData.date_fin)) {
      setError(t('booking.invalidDateRange') || 'La date de fin doit être après la date de début');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/reservations', {
        voiture_id: parseInt(carId),
        date_debut: formData.date_debut.split('T')[0],
        date_fin: formData.date_fin.split('T')[0],
      });

      setSuccessMessage(t('booking.success') || 'Réservation créée avec succès !');
      setFormData({ date_debut: '', date_fin: '' });

      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error creating reservation:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la réservation';
      
      // Afficher le message d'erreur approprié
      if (errorMsg.includes('déjà réservée') || errorMsg.includes('already reserved')) {
        setError(`${t('booking.alreadyReserved')} ${t('booking.tryAgain')}`);
      } else {
        setError(`${t('booking.reservationError')} ${errorMsg}`);
      }
      
      // Scroller vers le message d'erreur
      setTimeout(() => {
        const errorElement = document.querySelector('[class*="bg-red-50"]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('booking.step1')}</title>
      </Helmet>

      <div className="min-h-screen bg-dark dark:bg-[#121212] pt-32 pb-24 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            <span className="uppercase tracking-wider font-semibold text-sm">{t('booking.back')}</span>
          </button>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Car Details */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="bg-white dark:bg-[#242424] rounded-2xl p-6 md:p-8 shadow-xl border border-black/5 dark:border-white/5 animate-fade-in-up transition-colors duration-300">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-8 group">
                  <img 
                    src={car.image} 
                    alt={car.modele} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto bg-black/80 backdrop-blur-sm text-white px-4 py-2 text-sm uppercase tracking-wider font-bold shadow-lg rounded">
                    {car.annee}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-1">{car.marque}</p>
                  <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white uppercase tracking-wide transition-colors duration-300">
                    {car.modele}
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg border border-black/5 dark:border-white/5 transition-colors duration-300">
                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">{t('fleet.registration') || 'Immatriculation'}</span>
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{car.numero_immatriculation}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg border border-black/5 dark:border-white/5 transition-colors duration-300">
                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">{t('fleet.status')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white capitalize transition-colors duration-300">{car.statut}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Form */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white dark:bg-[#242424] rounded-2xl p-6 md:p-8 shadow-xl border border-black/5 dark:border-white/5 sticky top-32 animate-fade-in-up transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('booking.reserveNow') || 'Réserver cette voiture'}</h2>
                <div className="w-16 h-1 bg-primary mb-8"></div>

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
                  </div>
                )}
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">{t('booking.form.pickup')}</label>
                    <div className="relative">
                      <Calendar className="absolute top-3 left-3 rtl:right-3 rtl:left-auto w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <input 
                        type="date" 
                        name="date_debut"
                        required
                        value={formData.date_debut}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white pl-11 rtl:pr-11 rtl:pl-3 pr-3 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">{t('booking.form.dropoff')}</label>
                    <div className="relative">
                      <Calendar className="absolute top-3 left-3 rtl:right-3 rtl:left-auto w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <input 
                        type="date" 
                        name="date_fin"
                        required
                        value={formData.date_fin}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white pl-11 rtl:pr-11 rtl:pl-3 pr-3 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-primary text-black font-bold tracking-widest uppercase rounded-lg shadow-lg hover:bg-primary/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting && <Loader className="w-5 h-5 animate-spin" />}
                      <span>{submitting ? (t('booking.processing') || 'Traitement...') : (t('booking.reserve') || 'Réserver')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
