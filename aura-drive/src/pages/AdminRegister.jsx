import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { UserPlus, Lock, Phone, Key, ArrowRight } from 'lucide-react';
import { registerAdmin } from '../api/auth';
import { toast } from 'sonner';

export default function AdminRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [cne, setCne] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Validate phone number: only digits (0-9)
  const isValidPhone = (value) => /^[0-9]*$/.test(value);

  // Handle phone input change: filter out non-digit characters
  const handlePhoneChange = (event) => {
    const rawValue = event.target.value;
    // Keep only digits
    const filteredValue = rawValue.replace(/[^0-9]/g, '');
    setPhone(filteredValue);
    setPhoneError(filteredValue.length > 0 && !isValidPhone(filteredValue));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate phone number
    if (!isValidPhone(phone)) {
      setPhoneError(true);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      await registerAdmin({ name, cne, password, phone, secretKey });
      toast.success(t('auth.adminRegisteredSuccess'));
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = name && cne && phone && isValidPhone(phone) && password && confirmPassword && (password === confirmPassword) && secretKey;

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('auth.adminRegisterTitle')}</title>
      </Helmet>

      <div className="pt-32 pb-24 bg-dark dark:bg-[#121212] transition-colors duration-300 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('auth.adminRegisterTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light transition-colors duration-300">
              {t('auth.adminRegisterSubtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="bg-white dark:bg-[#242424] p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-xl shadow-black/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    {t('auth.fullName')}
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 transition-colors duration-300">
                    <UserPlus className="w-5 h-5 text-primary" />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    CNE
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 transition-colors duration-300">
                    <span className="text-primary font-semibold">CNE</span>
                    <input
                      type="text"
                      value={cne}
                      onChange={(event) => setCne(event.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    {t('auth.phone')}
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border transition-colors duration-300 rounded-xl px-4 py-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      className={`w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 ${
                        phoneError ? 'border-red-500' : 'border-black/10 dark:border-white/10'
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{t('auth.phoneInvalid')}</p>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    {t('auth.password')}
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 transition-colors duration-300">
                    <Lock className="w-5 h-5 text-primary" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    {t('auth.confirmPassword')}
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 transition-colors duration-300">
                    <Lock className="w-5 h-5 text-primary" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    {t('auth.adminSecretKey')}
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 transition-colors duration-300">
                    <Key className="w-5 h-5 text-primary" />
                    <input
                      type="password"
                      value={secretKey}
                      onChange={(event) => setSecretKey(event.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-black font-semibold uppercase tracking-widest py-4 rounded-2xl hover:bg-primary-hover transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : t('auth.registerButton')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-[#181818] p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-xl shadow-black/5 transition-colors duration-300">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                {t('auth.haveAccount')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
                {t('auth.loginSubtitle')}
              </p>
              <NavLink
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-primary text-primary font-semibold uppercase tracking-widest hover:bg-primary hover:text-black transition-colors duration-300"
              >
                {t('auth.linkLogin')}
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
