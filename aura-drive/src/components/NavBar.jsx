import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import clsx from 'clsx';
import brandLogo from '../assets/logo.png';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (event.target.closest('.user-dropdown') === null) {
        setIsUserMenuOpen(false);
      }
      if (event.target.closest('.lang-dropdown') === null) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/gb.svg' },
    { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/fr.svg' },
    { code: 'es', label: 'Español', flag: 'https://flagcdn.com/es.svg' },
    { code: 'ar', label: 'العربية', flag: 'https://flagcdn.com/ma.svg' },
  ];

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/fleet', label: t('nav.fleet') },
    { to: '/guides', label: t('nav.guides') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const authLinks = [
    { to: '/login', label: t('nav.login') },
    { to: '/register', label: t('nav.register') },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <nav
      className={clsx(
        'fixed w-full z-50 transition-all duration-300 ease-in-out',
        scrolled ? 'bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md py-3 shadow-sm border-b border-black/5 dark:border-white/5' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 mr-4">
            <img src={brandLogo} alt="Drive Car Go Logo" className="h-10 w-auto" />
            <span className="text-2xl font-heading font-bold tracking-wider uppercase transition-colors duration-300 text-gray-900 dark:text-white">
              DRIVE CAR GO
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary dark:hover:text-[#C17767]',
                    isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <>
                {user?.role === 'admin' && (
                  <>
                    <NavLink
                      to="/admin/fleet"
                      className={({ isActive }) =>
                        clsx(
                          'text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary dark:hover:text-[#C17767]',
                          isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100'
                        )
                      }
                    >
                      {t('nav.adminFleet')}
                    </NavLink>
                    <NavLink
                      to="/admin/reservations"
                      className={({ isActive }) =>
                        clsx(
                          'text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary dark:hover:text-[#C17767]',
                          isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100'
                        )
                      }
                    >
                      {t('nav.adminReservations')}
                    </NavLink>
                  </>
                )}
                <NavLink
                  to="/reservations"
                  className={({ isActive }) =>
                    clsx(
                      'text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary dark:hover:text-[#C17767]',
                      isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100'
                    )
                  }
                >
                  {t('nav.myReservations')}
                </NavLink>
                {/* User Dropdown */}
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#C17767]/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#C17767]" />
                    </div>
                  </button>
                  {/* Dropdown Menu */}
                  <div 
                    className={clsx(
                      "absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg shadow-xl transition-all duration-200 overflow-hidden z-50",
                      isUserMenuOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"
                    )}
                  >
                    <NavLink
                      to={user?.role === 'admin' ? '/admin/profile' : '/profile'}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>{t('nav.profile')}</span>
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-100 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border-t border-black/5 dark:border-white/5"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              authLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2 rounded-full uppercase tracking-widest text-xs font-semibold transition-all duration-300 border',
                      isActive
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-white dark:bg-[#242424] border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))
            )}

            {isLoggedIn ? (
              <NotificationDropdown />
            ) : null}

            {/* Lang Switcher */}
            <div className="relative lang-dropdown">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767] transition-colors p-2 rounded-full"
              >
                <img src={currentLanguage.flag} alt={currentLanguage.label} className="w-5 h-5 rounded-[2px] object-cover shadow-sm" loading="lazy" />
                <span className="text-sm uppercase font-medium hidden lg:inline">{i18n.language}</span>
              </button>
              <div 
                className={clsx(
                  "absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-md shadow-xl transition-all duration-200 overflow-hidden py-1 z-50",
                  isLangMenuOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"
                )}
              >
                {languages.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#242424] hover:text-primary dark:hover:text-[#C17767] transition-colors"
                  >
                    <img src={lng.flag} alt={lng.label} className="w-5 h-5 rounded-[2px] object-cover shadow-sm" loading="lazy" />
                    <span>{lng.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-full text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ml-2"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Actions & Menu Button */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3 rtl:gap-3">
            {/* Dark Mode Toggle (Mobile) */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767] transition-colors rounded-full"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {/* Lang Switcher (Mobile) */}
            <div className="relative lang-dropdown">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767] transition-colors p-2 rounded-full"
              >
                <img src={currentLanguage.flag} alt={currentLanguage.label} className="w-6 h-6 rounded-[2px] object-cover shadow-sm" loading="lazy" />
              </button>
              <div 
                className={clsx(
                  "absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-md shadow-xl transition-all duration-200 overflow-hidden py-1 z-50",
                  isLangMenuOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"
                )}
              >
                {languages.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#242424] hover:text-primary dark:hover:text-[#C17767] transition-colors"
                  >
                    <img src={lng.flag} alt={lng.label} className="w-5 h-5 rounded-[2px] object-cover shadow-sm" loading="lazy" />
                    <span>{lng.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Bell (Mobile) */}
            {isLoggedIn && <NotificationDropdown />}

            {/* User Profile Icon (Mobile) */}
            {isLoggedIn && (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-9 h-9 bg-[#C17767]/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#C17767]" />
                  </div>
                </button>
                {/* Dropdown Menu for Mobile */}
                <div 
                  className={clsx(
                    "absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg shadow-xl transition-all duration-200 overflow-hidden z-50",
                    isUserMenuOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 pointer-events-none"
                  )}
                >
                  <NavLink
                    to={user?.role === 'admin' ? '/admin/profile' : '/profile'}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('nav.profile')}</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-100 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border-t border-black/5 dark:border-white/5"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-[#C17767] transition-colors p-2 rounded-full"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={clsx(
          'md:hidden absolute w-full bg-white dark:bg-[#1a1a1a] border-b border-black/5 dark:border-white/5 shadow-lg transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-screen py-4 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        )}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'text-lg font-medium transition-colors border-b border-black/5 dark:border-white/5 pb-2',
                  isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <>
              {user?.role === 'admin' && (
                <>
                  <NavLink
                    to="/admin/fleet"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'text-lg font-medium transition-colors border-b border-black/5 dark:border-white/5 pb-2',
                        isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767]'
                      )
                    }
                  >
                    {t('nav.adminFleet')}
                  </NavLink>
                  <NavLink
                    to="/admin/reservations"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'text-lg font-medium transition-colors border-b border-black/5 dark:border-white/5 pb-2',
                        isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767]'
                      )
                    }
                  >
                    {t('nav.adminReservations')}
                  </NavLink>
                </>
              )}
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'text-lg font-medium transition-colors border-b border-black/5 dark:border-white/5 pb-2',
                    isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767]'
                  )
                }
              >
                {t('nav.profile')}
              </NavLink>
              <NavLink
                to="/reservations"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'text-lg font-medium transition-colors border-b border-black/5 dark:border-white/5 pb-2',
                    isActive ? 'text-primary dark:text-[#C17767]' : 'text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767]'
                  )
                }
              >
                {t('nav.myReservations')}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-left text-lg font-medium transition-colors border-b border-black/5 dark:border-white/5 pb-2 text-gray-600 dark:text-gray-100 hover:text-primary dark:hover:text-[#C17767]"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              {authLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center justify-center w-full px-4 py-3 rounded-sm uppercase tracking-widest text-sm font-semibold transition-all duration-300 border',
                      isActive
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-white dark:bg-[#242424] border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#333] dark:hover:text-[#C17767]'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
