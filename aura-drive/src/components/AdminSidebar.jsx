import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar({ isMobileMenuOpen, toggleMobileMenu }) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: t('nav.adminDashboard'), icon: LayoutDashboard },
    { path: '/admin/fleet', label: t('nav.adminFleet'), icon: Car },
    { path: '/admin/reservations', label: t('nav.adminReservations'), icon: CalendarCheck },
    { path: '/admin/create-reservation', label: t('nav.adminCreateReservation'), icon: Plus },
    { path: '/admin/users', label: t('nav.adminUsers'), icon: Users },
    { path: '/admin/messages', label: t('nav.adminContactMessages'), icon: MessageSquare },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Drive Car Go</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isMobileMenuOpen) {
                    toggleMobileMenu();
                  }
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}
