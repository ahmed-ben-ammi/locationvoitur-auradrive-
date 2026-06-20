import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../api/users';
import { getAllCars } from '../api/cars';
import { createReservation } from '../api/reservations';
import AdminLayout from '../components/AdminLayout';
import { Loader2, CheckCircle, XCircle, Users, Car } from 'lucide-react';

export default function AdminCreateReservation() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [created, setCreated] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    userId: '',
    carId: '',
    dateDebut: '',
    dateFin: ''
  });

  // Debug: Log i18n state on mount and language change
  useEffect(() => {
    console.log('🔍 i18n current language:', i18n.language);
    console.log('🔍 i18n available languages:', i18n.languages);
    console.log('🔍 Checking translation keys:');
    console.log('  - adminCreateReservation.title:', t('adminCreateReservation.title'));
    console.log('  - adminCreateReservation.selectClient:', t('adminCreateReservation.selectClient'));
    console.log('  - adminCreateReservation.selectVehicle:', t('adminCreateReservation.selectVehicle'));
    console.log('  - adminCreateReservation.pickupDate:', t('adminCreateReservation.pickupDate'));
    console.log('  - adminCreateReservation.dropoffDate:', t('adminCreateReservation.dropoffDate'));
    console.log('  - adminCreateReservation.confirm:', t('adminCreateReservation.confirm'));
    console.log('  - adminCreateReservation.creating:', t('adminCreateReservation.creating'));
    console.log('  - adminCreateReservation.success:', t('adminCreateReservation.success'));
    console.log('  - adminCreateReservation.sendWhatsApp:', t('adminCreateReservation.sendWhatsApp'));
    console.log('  - adminCreateReservation.clientRequired:', t('adminCreateReservation.clientRequired'));
    console.log('  - adminCreateReservation.vehicleRequired:', t('adminCreateReservation.vehicleRequired'));
    console.log('  - adminCreateReservation.datesRequired:', t('adminCreateReservation.datesRequired'));
    console.log('  - adminCreateReservation.invalidDates:', t('adminCreateReservation.invalidDates'));
  }, [i18n.language, t]);

  useEffect(() => {
    if (!isLoggedIn || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isLoggedIn, user, navigate]);

  const fetchData = async () => {
    try {
      setFetching(true);
      const [usersData, carsData] = await Promise.all([
        getUsers(),
        getAllCars()
      ]);
      console.log('Users API response:', usersData);
      console.log('Cars API response:', carsData);

      // Handle both array and object-with-data responses
      const processedUsers = Array.isArray(usersData) ? usersData : usersData?.data || [];
      const processedCars = Array.isArray(carsData) ? carsData : carsData?.data || [];
      
      console.log('Users API response (processed):', processedUsers);
      console.log('User roles:', processedUsers.map(u => ({ 
        id: u.id, 
        name: u.name, 
        role: u.role 
      })));

      // Flexible role filtering supporting multiple formats and case insensitivity
      const allowedRoles = ['client', 'user', 'customer'];
      const clients = processedUsers.filter(u => {
        const role = u.role?.toLowerCase() || '';
        return allowedRoles.includes(role);
      });
      
      console.log('Filtered clients:', clients);

      // Filter available cars
      const availableCars = processedCars.filter(c => c.statut === 'disponible');

      setUsers(clients);
      setCars(availableCars);
    } catch (err) {
      console.error('Error fetching data:', err);
      setErrorMessage(t('adminReservations.error'));
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
  };

  const formatDate = (dateStr, lang) => {
    const date = new Date(dateStr);
    const locale = lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateWhatsAppMessage = (selectedUser, selectedCar, startDate, endDate) => {
    const clientLang = selectedUser.language || i18n.language;
    const carName = `${selectedCar.marque} ${selectedCar.modele}`;
    const formattedStart = formatDate(startDate, clientLang);
    const formattedEnd = formatDate(endDate, clientLang);

    let message = '';
    switch (clientLang) {
      case 'ar':
        message = `مرحباً ${selectedUser.name}

تم إنشاء حجز جديد لك بنجاح.

السيارة: ${carName}
تاريخ الاستلام: ${formattedStart}
تاريخ التسليم: ${formattedEnd}

شكراً لاختياركم خدماتنا.`;
        break;
      case 'fr':
        message = `Bonjour ${selectedUser.name}

Une nouvelle réservation a été créée pour vous.

Véhicule: ${carName}
Date de début: ${formattedStart}
Date de fin: ${formattedEnd}

Merci pour votre confiance.`;
        break;
      case 'es':
        message = `Hola ${selectedUser.name}

Se ha creado una nueva reserva para usted.

Vehículo: ${carName}
Fecha de recogida: ${formattedStart}
Fecha de devolución: ${formattedEnd}

Gracias por confiar en nosotros.`;
        break;
      default:
        message = `Hello ${selectedUser.name}

A new reservation has been created for you.

Vehicle: ${carName}
Pickup Date: ${formattedStart}
Return Date: ${formattedEnd}

Thank you for choosing our services.`;
    }

    let phone = selectedUser.phone;
    if (phone.startsWith('0')) {
      phone = '212' + phone.substring(1);
    }
    phone = phone.replace(/\D/g, '');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!form.userId) {
      setErrorMessage(t('adminCreateReservation.clientRequired'));
      return;
    }
    if (!form.carId) {
      setErrorMessage(t('adminCreateReservation.vehicleRequired'));
      return;
    }
    if (!form.dateDebut || !form.dateFin) {
      setErrorMessage(t('adminCreateReservation.datesRequired'));
      return;
    }
    if (new Date(form.dateFin) <= new Date(form.dateDebut)) {
      setErrorMessage(t('adminCreateReservation.invalidDates'));
      return;
    }

    try {
      setLoading(true);
      const selectedUser = users.find(u => u.id === parseInt(form.userId));
      const selectedCar = cars.find(c => c.id === parseInt(form.carId));

      await createReservation({
        user_id: parseInt(form.userId),
        car_id: parseInt(form.carId),
        date_debut: form.dateDebut,
        date_fin: form.dateFin,
        statut: 'confirmée'
      });

      const waUrl = generateWhatsAppMessage(selectedUser, selectedCar, form.dateDebut, form.dateFin);
      setWhatsAppUrl(waUrl);
      setCreated(true);
      setSuccessMessage(t('adminCreateReservation.success'));
    } catch (err) {
      console.error('Error creating reservation:', err);
      setErrorMessage(t('adminReservations.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      userId: '',
      carId: '',
      dateDebut: '',
      dateFin: ''
    });
    setCreated(false);
    setWhatsAppUrl('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  if (fetching) {
    return (
      <AdminLayout title={t('adminCreateReservation.title')}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">{t('adminReservations.loading')}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t('adminCreateReservation.title')}>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <XCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-8 shadow-sm">
          {!created ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('adminCreateReservation.selectClient')}
                </label>
                {users.length === 0 ? (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{t('adminUsers.noUsers')}</span>
                  </div>
                ) : (
                  <select
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t('adminCreateReservation.selectClient')}</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Vehicle Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('adminCreateReservation.selectVehicle')}
                </label>
                {cars.length === 0 ? (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    <span>{t('fleet.empty.title')}</span>
                  </div>
                ) : (
                  <select
                    name="carId"
                    value={form.carId}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t('adminCreateReservation.selectVehicle')}</option>
                    {cars.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.marque} {c.modele} ({c.annee})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('adminCreateReservation.pickupDate')}
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={form.dateDebut}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('adminCreateReservation.dropoffDate')}
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    value={form.dateFin}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/reservations')}
                  className="flex-1 bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading || users.length === 0 || cars.length === 0}
                  className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? t('adminCreateReservation.creating') : t('adminCreateReservation.confirm')}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('adminCreateReservation.success')}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/admin/reservations')}
                  className="w-full bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {t('adminReservations.title')}
                </button>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {t('adminCreateReservation.sendWhatsApp')}
                </a>
              </div>

              <button
                onClick={handleReset}
                className="w-full text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-gray-900 dark:hover:text-white"
              >
                Create another reservation
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
