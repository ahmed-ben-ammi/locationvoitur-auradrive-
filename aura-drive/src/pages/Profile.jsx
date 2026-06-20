import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { User, Phone, CreditCard, Shield, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getProfile, updateProfile } from '../api/users';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cne: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [createdAt, setCreatedAt] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          cne: data.CNE || data.cne || '',
          password: '',
          confirmPassword: '',
        });
        if (data.createdAt) {
          setCreatedAt(new Date(data.createdAt));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Fallback to user from context
        if (user) {
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
            cne: user.CNE || user.cne || '',
            password: '',
            confirmPassword: '',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, navigate, user]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError(t('adminUsers.nameRequired'));
      return false;
    }
    if (!formData.phone.trim()) {
      setValidationError(t('adminUsers.phoneRequired'));
      return false;
    }
    if (!formData.cne.trim()) {
      setValidationError(t('adminUsers.cneRequired'));
      return false;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setValidationError(t('adminUsers.passwordsDoNotMatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      const dataToSend = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        cne: formData.cne.trim(),
      };
      if (formData.password) {
        dataToSend.password = formData.password;
      }
      const updatedUser = await updateProfile(dataToSend);
      
      // Update auth context
      login({
        token: user.token,
        user: updatedUser,
      });

      setSuccessMessage(t('adminUsers.editSuccess'));
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

      if (updatedUser.createdAt) {
        setCreatedAt(new Date(updatedUser.createdAt));
      }

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage(t('adminUsers.errorSave'));
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Drive Car Go - Profile</title>
        </Helmet>
        <div className="min-h-screen bg-[#F9F6F0] dark:bg-zinc-900/50 pt-32 pb-24 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#C17767]" />
              <p className="text-gray-500 dark:text-gray-400 mt-4">{t('booking.loading')}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Drive Car Go - Profile</title>
      </Helmet>
      <div className="min-h-screen bg-[#F9F6F0] dark:bg-zinc-900/50 pt-32 pb-24 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              {t('profile.title')}
            </h1>
            <div className="w-24 h-1 bg-[#C17767]"></div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-600 dark:text-green-400 font-semibold">{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400 font-semibold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white dark:bg-[#242424] rounded-2xl border border-black/5 dark:border-white/5 p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-[#C17767]/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-[#C17767]" />
                </div>
                {/* Info */}
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    {formData.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user?.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {t(`adminUsers.${user?.role || 'client'}`)}
                    </span>
                  </div>
                  {createdAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('profile.memberSince')}: {createdAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white dark:bg-[#242424] rounded-2xl border border-black/5 dark:border-white/5 p-8">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-[#C17767]" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('profile.personalInfo')}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {t('adminUsers.fullName')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C17767] focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {t('adminUsers.phone')}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C17767] focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                    CNE
                  </label>
                  <input
                    type="text"
                    name="cne"
                    value={formData.cne}
                    onChange={(e) => setFormData({ ...formData, cne: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C17767] focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {t('adminUsers.role')}
                  </label>
                  <input
                    type="text"
                    value={t(`adminUsers.${user?.role || 'client'}`)}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white dark:bg-[#242424] rounded-2xl border border-black/5 dark:border-white/5 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-[#C17767]" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('profile.security')}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('profile.passwordHint')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {t('adminUsers.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={t('adminUsers.passwordPlaceholder')}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C17767] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {t('adminUsers.confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      disabled={!formData.password}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C17767] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400 font-semibold">{validationError}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-8 py-3 bg-[#C17767] text-white font-bold rounded-xl hover:bg-[#C17767]/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('booking.processing')}
                  </>
                ) : (
                  t('adminUsers.save')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}