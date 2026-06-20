import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import {
  Car,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Calendar,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  MessageSquare,
  Users,
  Check,
  X,
  CheckSquare,
  CircleX
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { getAllCars } from '../api/cars';
import { getAllReservations } from '../api/reservations';
import { getAllUsers } from '../api/admin';
import { getContactStats } from '../api/contact';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [contactStats, setContactStats] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [carsData, reservationsData, usersData] = await Promise.allSettled([
          getAllCars(),
          getAllReservations(),
          getAllUsers()
        ]);

        const processedCars = carsData.status === 'fulfilled' 
          ? (Array.isArray(carsData.value) ? carsData.value : carsData.value?.data || []) 
          : [];
        
        const processedReservations = reservationsData.status === 'fulfilled' 
          ? (Array.isArray(reservationsData.value) ? reservationsData.value : reservationsData.value?.data || []) 
          : [];

        const processedUsers = usersData.status === 'fulfilled' 
          ? (Array.isArray(usersData.value) ? usersData.value : usersData.value?.data || []) 
          : [];

        setCars(processedCars);
        setReservations(processedReservations);
        setUsersCount(processedUsers.length);

        // Calculate stats from raw data
        const totalCars = processedCars.length;
        const availableCars = processedCars.filter(car => car.statut === 'disponible').length;
        const reservedCars = processedCars.filter(car => car.statut === 'reservée').length;
        const maintenanceCars = processedCars.filter(car => car.statut === 'en_maintenance').length;
        
        const totalReservations = processedReservations.length;
        const pendingReservations = processedReservations.filter(r => r.statut === 'en_attente').length;
        const confirmedReservations = processedReservations.filter(r => r.statut === 'confirmée').length;
        const completedReservations = processedReservations.filter(r => r.statut === 'terminée').length;
        const cancelledReservations = processedReservations.filter(r => r.statut === 'annulée').length;

        setStats({
          totalCars,
          availableCars,
          reservedCars,
          maintenanceCars,
          totalReservations,
          pendingReservations,
          confirmedReservations,
          completedReservations,
          cancelledReservations
        });

        // Try to fetch contact stats
        try {
          const contactStatsData = await getContactStats();
          setContactStats(contactStatsData);
        } catch (err) {
          // Fallback to static 0
          setContactStats({ total: 0, unread: 0 });
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const statusChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: t('adminDashboard.stats.pendingReservations'), value: stats.pendingReservations, color: '#F59E0B' },
      { name: t('adminDashboard.stats.confirmedReservations'), value: stats.confirmedReservations, color: '#10B981' },
      { name: t('adminDashboard.stats.completedReservations'), value: stats.completedReservations, color: '#3B82F6' },
      { name: t('adminDashboard.stats.cancelledReservations'), value: stats.cancelledReservations, color: '#EF4444' }
    ];
  }, [stats, t]);

  const fleetChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: t('adminDashboard.stats.availableCars'), value: stats.availableCars, color: '#10B981' },
      { name: t('adminDashboard.stats.reservedCars'), value: stats.reservedCars, color: '#F59E0B' },
      { name: t('admin.statuses.en_maintenance'), value: stats.maintenanceCars, color: '#6B7280' }
    ];
  }, [stats, t]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        value: 0
      };
    });

    if (!reservations.length) return months;

    reservations.forEach(r => {
      try {
        const date = new Date(r.date_debut);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        const monthIndex = months.findIndex(m => m.month === monthKey);
        if (monthIndex !== -1) {
          months[monthIndex].value += 1;
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    return months;
  }, [reservations]);

  const statCards = stats ? [
    { label: t('adminDashboard.stats.totalCars'), value: stats.totalCars, icon: Car, color: '#3B82F6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: t('adminDashboard.stats.availableCars'), value: stats.availableCars, icon: CheckCircle, color: '#10B981', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: t('adminDashboard.stats.reservedCars'), value: stats.reservedCars, icon: XCircle, color: '#F59E0B', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: t('adminDashboard.stats.totalReservations'), value: stats.totalReservations, icon: Calendar, color: '#8B5CF6', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: t('adminDashboard.stats.pendingReservations'), value: stats.pendingReservations, icon: Clock, color: '#F97316', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: t('adminDashboard.stats.confirmedReservations'), value: stats.confirmedReservations, icon: CheckSquare, color: '#10B981', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: t('adminDashboard.stats.completedReservations'), value: stats.completedReservations, icon: Check, color: '#3B82F6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: t('adminDashboard.stats.cancelledReservations'), value: stats.cancelledReservations, icon: CircleX, color: '#EF4444', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: t('adminDashboard.stats.totalUsers'), value: usersCount, icon: Users, color: '#EC4899', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: t('adminDashboard.stats.totalMessages'), value: contactStats?.total || 0, icon: MessageSquare, color: '#C17767', bg: 'bg-rose-50 dark:bg-rose-900/20' }
  ] : [];

  const quickActions = [
    { label: t('adminDashboard.quickActions.addNewCar'), icon: Plus, onClick: () => navigate('/admin/fleet?add=true'), color: 'bg-[#C17767] hover:bg-[#A86557]' },
    { label: t('adminDashboard.quickActions.createReservation'), icon: Calendar, onClick: () => navigate('/admin/create-reservation'), color: 'bg-purple-600 hover:bg-purple-700' },
    { label: t('adminDashboard.quickActions.manageFleet'), icon: Car, onClick: () => navigate('/admin/fleet'), color: 'bg-blue-600 hover:bg-blue-700' },
    { label: t('adminDashboard.quickActions.viewReservations'), icon: Calendar, onClick: () => navigate('/admin/reservations'), color: 'bg-green-600 hover:bg-green-700' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
          <p className="text-sm text-[#C17767]">{`${payload[0].value} ${payload[0].name?.includes('Reservation') ? 'reservations' : 'cars'}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <AdminLayout title={t('adminDashboard.title')}>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#C17767]/20 border-t-[#C17767] rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400">{t('adminDashboard.loading')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t('adminDashboard.title')}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('adminDashboard.welcomeMessage', { name: user?.name || 'Admin' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your fleet, reservations, and business operations from a single dashboard.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <card.icon style={{ color: card.color }} className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-800 p-6 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('adminDashboard.quickActions.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.color} text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <action.icon className="w-5 h-5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Remaining Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reservations by Status */}
          <div className="lg:col-span-1 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-800 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#C17767]" />
              {t('adminDashboard.charts.reservationsByStatus')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Reservations */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-800 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#C17767]" />
              {t('adminDashboard.charts.monthlyReservations')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" dark:stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#C17767" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
