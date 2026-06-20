import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Calendar, Trash2, MapPin, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { getUserReservations, deleteReservation } from '../api/reservations';
import { useAuth } from '../contexts/AuthContext';
import EmptyState from '../components/EmptyState';
import clsx from 'clsx';

// API_URL is for API calls (has /api prefix)
// STATIC_URL is for images/files (no /api prefix)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};
const STATIC_URL = getBaseUrl();

const getCarImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('uploads/')) return `${STATIC_URL}/${imagePath.replace(/\\/g, '/')}`;
  return `${STATIC_URL}/uploads/${imagePath.replace(/\\/g, '/')}`;
};

const StatusBadge = ({ status, t }) => {
  const statusConfig = {
    confirmée: {
      label: t('reservations.status.confirmée'),
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
    },
    en_attente: {
      label: t('reservations.status.en_attente'),
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
    },
    annulée: {
      label: t('reservations.status.annulée'),
      icon: XCircle,
      color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
    }
  };

  const config = statusConfig[status] || statusConfig.en_attente;
  const Icon = config.icon;

  return (
    <div className={clsx(
      'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider',
      config.color
    )}>
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
    </div>
  );
};

export default function MyReservations() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserReservations();
        setReservations(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await deleteReservation(id);
      setReservations(reservations.filter(r => r.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting reservation:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Drive Car Go - {t('nav.myReservations')}</title>
        </Helmet>
        <div className="min-h-screen bg-[#F9F6F0] dark:bg-zinc-900/50 pt-32 pb-24 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {t('reservations.title')}
                </h1>
                <div className="w-24 h-1 bg-[#C17767]"></div>
              </div>
            </div>
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('booking.loading')}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Drive Car Go - {t('nav.myReservations')}</title>
        </Helmet>
        <div className="min-h-screen bg-[#F9F6F0] dark:bg-zinc-900/50 pt-32 pb-24 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('nav.myReservations')}</title>
      </Helmet>

      <div className="min-h-screen bg-[#F9F6F0] dark:bg-zinc-900/50 pt-32 pb-24 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                {t('reservations.title')}
              </h1>
              <div className="w-24 h-1 bg-[#C17767]"></div>
            </div>
          </div>

          {/* Reservations Grid */}
          {reservations.length === 0 ? (
            <div className="bg-white dark:bg-[#242424] rounded-2xl border border-black/5 dark:border-white/5">
              <EmptyState 
                icon={Calendar}
                title={t('reservations.noReservations')}
                description={t('reservations.noReservationsDesc')}
              />
              <div className="flex justify-center pb-12 px-4">
                <button
                  onClick={() => navigate('/fleet')}
                  className="px-8 py-3 bg-[#C17767] text-white font-bold rounded-xl hover:bg-[#C17767]/90 transition-all shadow-lg hover:shadow-xl"
                >
                  {t('reservations.browseFleet')}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reservations.map((reservation) => {
                const carImage = getCarImageUrl(reservation.image);
                const days = Math.ceil((new Date(reservation.date_fin) - new Date(reservation.date_debut)) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={reservation.id} 
                    className="group bg-white dark:bg-[#242424] border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-300 hover:border-[#C17767]/50 hover:shadow-2xl hover:shadow-[#C17767]/20 rounded-xl"
                  >
                    {/* Car Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={carImage || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={`${reservation.marque} ${reservation.modele}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto">
                        <StatusBadge status={reservation.statut} t={t} />
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6">
                      {/* Car Info */}
      <div className="mb-4 flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{reservation.marque}</p>
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white uppercase tracking-wide line-clamp-1 transition-colors duration-300">
            {reservation.modele}
          </h3>
        </div>
        <div className="text-right rtl:text-left shrink-0 ml-4 rtl:ml-0 rtl:mr-4">
          <div className="text-[#C17767] font-bold text-lg leading-tight">
            {reservation.prix_par_jour || 500} DH
          </div>
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
            {t('reservations.pricePerDay')}
          </div>
        </div>
      </div>
      
      {/* Reservation Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pt-4 border-t border-black/5 dark:border-white/5">
        <div className="flex flex-col items-center justify-center text-center">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mb-2" />
          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('reservations.pickupDate')}</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Date(reservation.date_debut).toLocaleDateString()}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-x border-black/5 dark:border-white/5 pt-4 md:pt-0">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mb-2" />
          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('reservations.rentalDuration')}</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {days} {t('reservations.days')}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-t md:border-t-0 border-black/5 dark:border-white/5 pt-4 md:pt-0">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mb-2" />
          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t('reservations.dropoffDate')}</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {new Date(reservation.date_fin).toLocaleDateString()}
          </span>
        </div>
      </div>

                      {/* Registration Number */}
                      {reservation.numero_immatriculation && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('fleet.registration')}: <span className="font-semibold text-gray-900 dark:text-white">{reservation.numero_immatriculation}</span>
                          </span>
                        </div>
                      )}

                      {/* Delete Button with Confirmation */}
                      {deleteId === reservation.id ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setDeleteId(null)}
                            disabled={deleting}
                            className="py-3 bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white font-semibold tracking-wider uppercase transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg"
                          >
                            {t('reservations.cancel')}
                          </button>
                          <button
                            onClick={() => handleDelete(reservation.id)}
                            disabled={deleting}
                            className="py-3 bg-red-600 text-white font-semibold tracking-wider uppercase transition-colors duration-300 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2"
                          >
                            {deleting ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            {t('reservations.confirmDelete')}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(reservation.id)}
                          className="w-full py-3 block text-center bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold tracking-wider uppercase transition-colors duration-300 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('reservations.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
