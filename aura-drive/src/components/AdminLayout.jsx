import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { User, LogOut, Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import NotificationDropdown from './NotificationDropdown';

export default function AdminLayout({ children, title = '' }) {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/gb.svg' },
    { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/fr.svg' },
    { code: 'es', label: 'Español', flag: 'https://flagcdn.com/es.svg' },
    { code: 'ar', label: 'العربية', flag: 'https://flagcdn.com/ma.svg' },
  ];

  const toggleProfileMenu = () => {
    setProfileMenuOpen(prev => !prev);
    if (langMenuOpen) setLangMenuOpen(false);
  };

  const toggleLangMenu = () => {
    setLangMenuOpen(prev => !prev);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileMenuOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{title ? `${title} - Drive Car Go Admin` : 'Drive Car Go Admin'}</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <AdminSidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          toggleMobileMenu={toggleMobileMenu} 
        />
        <main className="lg:pl-64">
          {/* Top Header */}
          <div className="sticky top-0 z-20 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Sidebar Toggle */}
                <button 
                  onClick={toggleMobileMenu} 
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
                
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <NotificationDropdown />
                
                {/* Language Selector */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    onClick={toggleLangMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                    aria-label="Open language menu"
                    aria-expanded={langMenuOpen}
                    aria-haspopup="true"
                  >
                    <Globe className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                  {langMenuOpen && (
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-36 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                      {languages.map((lng) => (
                        <button
                          key={lng.code}
                          onClick={() => changeLanguage(lng.code)}
                          className={`flex items-center gap-3 px-4 py-3 w-full text-left transition-colors ${
                            i18n.language === lng.code
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <img src={lng.flag} alt={lng.label} className="w-5 h-5 rounded" />
                          <span className="font-medium">{lng.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                    aria-label="Open user menu"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-9 h-9 bg-[#C17767]/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#C17767]" />
                    </div>
                  </button>
                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                      <NavLink
                        to="/admin/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{t('nav.profile')}</span>
                      </NavLink>
                      <div className="border-t border-gray-200 dark:border-zinc-800"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
