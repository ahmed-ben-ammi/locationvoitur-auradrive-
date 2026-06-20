import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Lock, ArrowRight } from 'lucide-react';
import { login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const [CNE, setCNE] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(t(location.state.message));
    }
  }, [location.state, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ CNE, password });
      authLogin({ token: response.token, user: response.user });
      const redirectPath = location.state?.from || (response.user.role === 'admin' ? '/admin' : '/');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('nav.login')}</title>
      </Helmet>

      <div className="pt-32 pb-24 bg-dark dark:bg-[#121212] transition-colors duration-300 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light transition-colors duration-300">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="bg-white dark:bg-[#242424] p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-xl shadow-black/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    CNE
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 transition-colors duration-300">
                    <span className="text-primary font-semibold">CNE</span>
                    <input
                      type="text"
                      placeholder="123456789"
                      value={CNE}
                      onChange={(event) => setCNE(event.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    {t('auth.password')}
                  </span>
                  <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 transition-colors duration-300">
                    <Lock className="w-5 h-5 text-primary" />
                    <input
                      type="password"
                      placeholder={t('auth.password')}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                    />
                  </div>
                </label>

                {infoMessage && (
                  <p className="text-sm text-primary dark:text-primary/80">{infoMessage}</p>
                )}
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-black font-semibold uppercase tracking-widest py-4 rounded-2xl hover:bg-primary-hover transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : t('auth.loginButton')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-[#181818] p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-xl shadow-black/5 transition-colors duration-300">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                {t('auth.noAccount')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
                {t('auth.registerSubtitle')}
              </p>
              <NavLink
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-primary text-primary font-semibold uppercase tracking-widest hover:bg-primary hover:text-black transition-colors duration-300"
              >
                {t('auth.linkRegister')}
                <ArrowRight className="w-4 h-4" />
              </NavLink>
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                <NavLink
                  to="/admin-register"
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                >
                  {t('auth.createAdminAccount')}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
