import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllReservations, updateReservationStatus, deleteReservation } from '../api/reservations';
import { Calendar, Search, CheckCircle, Clock, XCircle, Phone, User, CreditCard, MapPin, Car, Loader2, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { STATIC_URL } from '../api/cars';

export default function AdminReservations() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getCarImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop';
    let cleanFilename = image;
    if (cleanFilename.startsWith('uploads/')) {
      cleanFilename = cleanFilename.replace('uploads/', '');
    }
    return `${STATIC_URL}/uploads/${cleanFilename}`;
  };

  const getStatusConfig = (statut) => {
    const normalizedStatut = statut?.toLowerCase() || '';
    if (normalizedStatut === 'en_attente' || normalizedStatut === 'pending') {
      return { label: t('reservations.status.en_attente'), color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <Clock className="w-4 h-4 mr-2" /> };
    }
    if (normalizedStatut === 'confirmée' || normalizedStatut === 'confirmed') {
      return { label: t('reservations.status.confirmée'), color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: <CheckCircle className="w-4 h-4 mr-2" /> };
    }
    if (normalizedStatut === 'annulée' || normalizedStatut === 'rejected' || normalizedStatut === 'refusée') {
      return { label: t('reservations.status.annulée'), color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="w-4 h-4 mr-2" /> };
    }
    if (normalizedStatut === 'terminée' || normalizedStatut === 'completed') {
      return { label: t('reservations.status.terminée'), color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <CheckCircle className="w-4 h-4 mr-2" /> };
    }
    return { label: statut || 'Unknown', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: null };
  };

  const generateWhatsAppUrl = (phone, reservation, isApproval) => {
    const startDate = new Date(reservation.date_debut).toLocaleDateString(i18n.language);
    const endDate = new Date(reservation.date_fin).toLocaleDateString(i18n.language);
    const car = `${reservation.marque || ''} ${reservation.modele || ''}`.trim();
    
    const messageTemplate = isApproval 
      ? t('whatsapp.approve') 
      : t('whatsapp.reject');
    
    const message = messageTemplate
      .replace('{name}', reservation.full_name || '')
      .replace('{car}', car)
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate);
    
    let cleanedPhone = phone;
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = '212' + cleanedPhone.substring(1);
    }
    return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
  };

  const fetchReservations = async () => {
    try {
      console.log('🔍 [AdminReservations] fetchReservations() called');
      setLoading(true);
      const data = await getAllReservations();
      console.log('✅ [AdminReservations] fetchReservations() got data:', data);
      console.log('📊 Data type:', typeof data, 'is array?', Array.isArray(data));
      setReservations(data);
      setFilteredReservations(data);
      setError(null);
    } catch (err) {
      setError(t('adminReservations.error'));
      console.error('❌ [AdminReservations] Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchReservations();
  }, [isLoggedIn, user, navigate, t]);

  useEffect(() => {
    console.log('🔍 [AdminReservations] Filtering reservations:');
    console.log('  - Original reservations:', reservations.length);
    console.log('  - Filter:', filter);
    console.log('  - Search query:', searchQuery);
    
    let filtered = [...reservations];
    
    if (filter !== 'all') {
      const statusMap = {
        pending: ['en_attente', 'pending'],
        confirmed: ['confirmée', 'confirmed'],
        rejected: ['annulée', 'rejected', 'refusée']
      };
      const allowedStatuses = statusMap[filter];
      if (allowedStatuses) {
        filtered = filtered.filter(r => allowedStatuses.includes(r.statut?.toLowerCase()));
      }
      console.log('  - After status filter:', filtered.length);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        (r.full_name?.toLowerCase().includes(query) || false) ||
        (r.cne?.toLowerCase().includes(query) || false) ||
        (r.phone?.toLowerCase().includes(query) || false) ||
        (r.marque?.toLowerCase().includes(query) || false)
      );
      console.log('  - After search filter:', filtered.length);
    }
    
    console.log('✅ [AdminReservations] Setting filteredReservations:', filtered.length);
    setFilteredReservations(filtered);
  }, [reservations, filter, searchQuery]);

  const handleApprove = async (id) => {
    try {
      const reservation = reservations.find(r => r.id === id);

      const response = await updateReservationStatus(id, 'confirmée');
      if (response.reservation) {
        setReservations(prev => 
          prev.map(r => r.id === response.reservation.id ? response.reservation : r)
        );
      }
      setSuccessMessage(t('adminReservations.approveSuccess'));
      setTimeout(() => setSuccessMessage(''), 3000);

      if (reservation && reservation.phone) {
        const url = generateWhatsAppUrl(reservation.phone, reservation, true);
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Error approving reservation:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const reservation = reservations.find(r => r.id === id);
      
      const response = await updateReservationStatus(id, 'annulée');
      if (response.reservation) {
        setReservations(prev => 
          prev.map(r => r.id === response.reservation.id ? response.reservation : r)
        );
      }
      setSuccessMessage(t('adminReservations.rejectSuccess'));
      setTimeout(() => setSuccessMessage(''), 3000);
      
      if (reservation && reservation.phone) {
        const url = generateWhatsAppUrl(reservation.phone, reservation, false);
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Error rejecting reservation:', err);
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      const response = await updateReservationStatus(id, 'terminée');
      if (response.reservation) {
        setReservations(prev => 
          prev.map(r => r.id === response.reservation.id ? response.reservation : r)
        );
      }
      setSuccessMessage(t('adminReservations.markAsCompletedSuccess'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error marking reservation as completed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      setSuccessMessage(t('adminReservations.deleteSuccess'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting reservation:', err);
    }
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (loading) {
    return (
      <AdminLayout title={t('adminReservations.title')}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">{t('adminReservations.loading')}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t('adminReservations.title')}>
      <div className="space-y-8">
        {successMessage && (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('adminReservations.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-primary text-black shadow-lg shadow-primary/25'
                    : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                }`}
              >
                {f === 'all' ? t('adminReservations.all') :
                 f === 'pending' ? t('adminReservations.pending') :
                 f === 'confirmed' ? t('adminReservations.confirmed') :
                 t('adminReservations.rejected')}
              </button>
            ))}
          </div>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
              <Car className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-400">{t('adminReservations.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReservations.map((reservation) => {
              const statusConfig = getStatusConfig(reservation.statut);
              const days = calculateDays(reservation.date_debut, reservation.date_fin);
              return (
                <div
                  key={reservation.id}
                  className="group bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-zinc-700"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getCarImageUrl(reservation.image)}
                      alt={`${reservation.marque} ${reservation.modele}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{reservation.marque || '-'} - {reservation.annee || '-'}</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide line-clamp-1">
                          {reservation.modele || 'Unknown Car'}
                        </h3>
                      </div>
                      <div className="text-right rtl:text-left shrink-0 ml-4">
                        <div className="text-primary font-bold text-lg leading-tight">
                          {reservation.prix_par_jour || 500} DH
                        </div>
                        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
                          {t('adminReservations.pricePerDay')}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 border-t border-gray-100 dark:border-zinc-700 pt-4">
                      <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        <span>{t('adminReservations.customerInfo')}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('adminReservations.fullName')}:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{reservation.full_name || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('adminReservations.cne')}:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{reservation.cne || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('adminReservations.phone')}:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{reservation.phone || '-'}</span>
                        </div>
                        {reservation.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t('adminReservations.email')}:</span>
                            <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">{reservation.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 border-t border-gray-100 dark:border-zinc-700 pt-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">{t('reservations.pickupDate')}:</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {new Date(reservation.date_debut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">{t('reservations.dropoffDate')}:</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {new Date(reservation.date_fin).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <CreditCard className="w-4 h-4 mr-2" />
                            <span className="text-sm">{t('adminReservations.rentalDuration')}:</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {days} {t('adminReservations.days')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{t('fleet.registration')}:</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {reservation.numero_immatriculation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {reservation.statut === 'en_attente' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(reservation.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {t('adminReservations.approve')}
                          </button>
                          <button
                            onClick={() => handleReject(reservation.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            {t('adminReservations.reject')}
                          </button>
                        </div>
                      )}
                      
                      {reservation.statut === 'confirmée' && (
                        <button
                          onClick={() => handleMarkAsCompleted(reservation.id)}
                          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t('adminReservations.markAsCompleted')}
                        </button>
                      )}
                      
                      {(reservation.statut === 'annulée' || reservation.statut === 'terminée') && (
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('adminReservations.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
