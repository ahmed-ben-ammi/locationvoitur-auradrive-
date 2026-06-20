import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash, X, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { getAllCars, createCar, updateCar, deleteCar, STATIC_URL } from '../api/cars';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import clsx from 'clsx';

const StatusBadge = ({ status, t }) => {
  const statusColors = {
    disponible: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    reservée: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    en_maintenance: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  };

  return (
    <span className={clsx(
      'px-3 py-1 rounded-full text-sm font-semibold border',
      statusColors[status] || statusColors.disponible
    )}>
      {t(`admin.statuses.${status}`)}
    </span>
  );
};

export default function AdminFleet() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    numero_immatriculation: '',
    prix_par_jour: 500,
    statut: 'disponible',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchCars();
  }, [isLoggedIn, user, navigate]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await getAllCars();
      setCars(data);
    } catch (err) {
      setError(err.message || t('fleet.error') || 'Error loading cars');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingCar(null);
    setFormData({
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      numero_immatriculation: '',
      prix_par_jour: 500,
      statut: 'disponible',
      image: null
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditClick = (car) => {
        setEditingCar(car);
        setFormData({
            marque: car.marque,
            modele: car.modele,
            annee: car.annee,
            numero_immatriculation: car.numero_immatriculation,
            prix_par_jour: car.prix_par_jour || 500,
            statut: car.statut,
            image: null
        });
        setImagePreview(
        car.image 
          ? car.image.startsWith('http') 
            ? car.image 
            : car.image.startsWith('uploads/')
              ? `${STATIC_URL}/${car.image}`
              : `${STATIC_URL}/uploads/${car.image}` 
          : null
      );
        setShowModal(true);
      };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const form = new FormData();
      form.append('marque', formData.marque);
      form.append('modele', formData.modele);
      form.append('annee', formData.annee);
      form.append('numero_immatriculation', formData.numero_immatriculation);
      form.append('prix_par_jour', formData.prix_par_jour);
      form.append('statut', formData.statut);
      if (formData.image) {
        form.append('image', formData.image);
      }

      if (editingCar) {
        await updateCar(editingCar.id, form);
        setSuccess(t('admin.editSuccess'));
      } else {
        await createCar(form);
        setSuccess(t('admin.addSuccess'));
      }

      setShowModal(false);
      await fetchCars();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error saving car');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      await deleteCar(deleteConfirmId);
      setSuccess(t('admin.deleteSuccess'));
      setDeleteConfirmId(null);
      await fetchCars();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error deleting car');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <AdminLayout title={t('admin.title')}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('admin.title')}
            </h1>
          </div>
          <button
            onClick={handleAddClick}
            className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            {t('admin.addCar')}
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-600 dark:text-green-400 font-semibold">{success}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-12 h-12 text-primary animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">{t('adminReservations.loading')}</p>
            </div>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map(car => {
              const carImage = car.image 
                ? car.image.startsWith('http') 
                  ? car.image 
                  : car.image.startsWith('uploads/')
                    ? `${STATIC_URL}/${car.image}`
                    : `${STATIC_URL}/uploads/${car.image}` 
                : 'https://via.placeholder.com/400x300?text=No+Image';
              return (
                <div key={car.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300">
                  <div className="h-56 overflow-hidden">
                    <img
                      src={carImage}
                      alt={`${car.marque} ${car.modele}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {car.marque} {car.modele}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">{car.annee}</p>
                      </div>
                      <StatusBadge status={car.statut} t={t} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-2xl font-bold text-primary">
                        {car.prix_par_jour || 500} MAD
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">/ {t('fleet.pricePerDay').split(' ')[0]}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                      {t('admin.licensePlate')}: {car.numero_immatriculation}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditClick(car)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                        {t('admin.editCar')}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(car.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-all"
                      >
                        <Trash className="w-4 h-4" />
                        {t('admin.deleteCar')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingCar ? t('admin.editCar') : t('admin.addCar')}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('admin.image')}
                </label>
                {imagePreview && (
                  <div className="mb-4 h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('admin.brand')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.marque}
                  onChange={(e) => setFormData(prev => ({ ...prev, marque: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('admin.model')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.modele}
                  onChange={(e) => setFormData(prev => ({ ...prev, modele: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Year */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('admin.year')}
                  </label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.annee}
                    onChange={(e) => setFormData(prev => ({ ...prev, annee: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                {/* Price per Day */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('admin.pricePerDay')}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.prix_par_jour}
                    onChange={(e) => setFormData(prev => ({ ...prev, prix_par_jour: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* License Plate */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('admin.licensePlate')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.numero_immatriculation}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero_immatriculation: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('admin.status')}
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="disponible">{t('admin.statuses.disponible')}</option>
                  <option value="reservée">{t('admin.statuses.reservée')}</option>
                  <option value="en_maintenance">{t('admin.statuses.en_maintenance')}</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-70"
                >
                  {formLoading && <Loader className="w-5 h-5 animate-spin" />}
                  {t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('admin.deleteCar')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('admin.confirmDelete')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={formLoading}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={formLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {formLoading && <Loader className="w-5 h-5 animate-spin" />}
                {t('admin.deleteCar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
