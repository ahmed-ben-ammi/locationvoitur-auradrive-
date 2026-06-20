import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import { Search, Plus, Edit, Trash2, Users, User, Shield, Loader2, XCircle, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cne: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setErrorMessage(t('adminUsers.errorFetch'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      fetchUsers();
    } else if (isLoggedIn) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, user]);

  // Search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredUsers(users.filter(u =>
        (u.name && u.name.toLowerCase().includes(lowerSearch)) ||
        (u.phone && u.phone.includes(lowerSearch)) ||
        (u.CNE && u.CNE.toLowerCase().includes(lowerSearch))
      ));
    }
  }, [searchTerm, users]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'password' || name === 'confirmPassword') {
      setValidationError('');
    }
  };

  const handleOpenAddModal = () => {
    console.log("Opening add modal");
    setEditingUser(null);
    setFormData({
      name: '',
      phone: '',
      cne: '',
      password: '',
      confirmPassword: '',
      role: 'client'
    });
    setValidationError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (userToEdit) => {
    console.log("Opening edit modal for user:", userToEdit);
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      phone: userToEdit.phone,
      cne: userToEdit.CNE,
      password: '',
      confirmPassword: '',
      role: userToEdit.role
    });
    setValidationError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsModalOpen(true);
  };

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
    if (!editingUser && !formData.password) {
      setValidationError(t('adminUsers.passwordRequired'));
      return false;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setValidationError(t('adminUsers.passwordsDoNotMatch'));
      return false;
    }
    if (!formData.role) {
      setValidationError(t('adminUsers.roleRequired'));
      return false;
    }
    return true;
  };

  // Format phone number (add +212 if not present and remove leading 0)
  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    if (!cleaned.startsWith('212')) {
      cleaned = '212' + cleaned;
    }
    return '+' + cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSend = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        CNE: formData.cne.trim(),
        role: formData.role
      };
      
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (editingUser) {
        await updateUser(editingUser.id, dataToSend);
        setSuccessMessage(t('adminUsers.editSuccess'));
        
        // Generate WhatsApp message for update
        const translatedRole = t(`adminUsers.${formData.role}`);
        let message = '';
        const name = formData.name.trim();
        const phone = formData.phone.trim();
        const cne = formData.cne.trim();
        const password = formData.password;

        // Build message based on current language
        switch (i18n.language) {
          case 'ar':
            message = `مرحباً ${name}

تم تحديث معلومات حسابك بنجاح.

المعلومات الجديدة:

الاسم: ${name}
الهاتف: ${phone}
CNE: ${cne}
الدور: ${translatedRole}${password ? `

بيانات تسجيل الدخول:

رقم الهاتف: ${phone}
كلمة المرور: ${password}

يرجى الاحتفاظ بهذه المعلومات في مكان آمن.` : ''}

شكراً لتعاونكم.`;
            break;
          case 'fr':
            message = `Bonjour ${name}

Les informations de votre compte ont été mises à jour avec succès.

Nouvelles informations :

Nom : ${name}
Téléphone : ${phone}
CNE : ${cne}
Rôle : ${translatedRole}${password ? `

Informations de connexion :

Téléphone : ${phone}
Mot de passe : ${password}

Veuillez conserver ces informations dans un endroit sûr.` : ''}

Merci pour votre collaboration.`;
            break;
          case 'es':
            message = `Hola ${name}

La información de su cuenta ha sido actualizada correctamente.

Información actualizada:

Nombre: ${name}
Teléfono: ${phone}
CNE: ${cne}
Rol: ${translatedRole}${password ? `

Datos de acceso:

Teléfono: ${phone}
Contraseña: ${password}

Por favor, guarde esta información en un lugar seguro.` : ''}

Gracias por su colaboración.`;
            break;
          // Default to English
          default:
            message = `Hello ${name}

Your account information has been successfully updated.

Updated Information:

Name: ${name}
Phone: ${phone}
CNE: ${cne}
Role: ${translatedRole}${password ? `

Login Information:

Phone: ${phone}
Password: ${password}

Please keep this information in a safe place.` : ''}

Thank you for your cooperation.`;
        }
        
        let cleanedPhone = formData.phone.trim();
        if (cleanedPhone.startsWith('0')) {
          cleanedPhone = '212' + cleanedPhone.substring(1);
        }
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, '_blank');
        
      } else {
        await createUser(dataToSend);
        setSuccessMessage(t('adminUsers.addSuccess'));
        
        // Generate WhatsApp message for creation
        const translatedRole = t(`adminUsers.${formData.role}`);
        let message = '';
        const name = formData.name.trim();
        const phone = formData.phone.trim();
        const cne = formData.cne.trim();
        const password = formData.password;

        // Build message based on current language
        switch (i18n.language) {
          case 'ar':
            message = `مرحباً ${name}

تم إنشاء حسابك بنجاح.

معلومات الحساب:

الاسم: ${name}
الهاتف: ${phone}
CNE: ${cne}
الدور: ${translatedRole}

بيانات تسجيل الدخول:

رقم الهاتف: ${phone}
كلمة المرور: ${password}

يرجى الاحتفاظ بهذه المعلومات في مكان آمن.

شكراً لاستخدامكم خدماتنا.`;
            break;
          case 'fr':
            message = `Bonjour ${name}

Votre compte a été créé avec succès.

Informations du compte :

Nom : ${name}
Téléphone : ${phone}
CNE : ${cne}
Rôle : ${translatedRole}

Informations de connexion :

Téléphone : ${phone}
Mot de passe : ${password}

Veuillez conserver ces informations dans un endroit sûr.

Merci pour votre confiance.`;
            break;
          case 'es':
            message = `Hola ${name}

Su cuenta ha sido creada correctamente.

Información de la cuenta:

Nombre: ${name}
Teléfono: ${phone}
CNE: ${cne}
Rol: ${translatedRole}

Datos de acceso:

Teléfono: ${phone}
Contraseña: ${password}

Por favor, guarde esta información en un lugar seguro.

Gracias por confiar en nosotros.`;
            break;
          // Default to English
          default:
            message = `Hello ${name}

Your account has been successfully created.

Account Information:

Name: ${name}
Phone: ${phone}
CNE: ${cne}
Role: ${translatedRole}

Login Information:

Phone: ${phone}
Password: ${password}

Please keep this information in a safe place.

Thank you for using our services.`;
        }
        
        let cleanedPhone = formData.phone.trim();
        if (cleanedPhone.startsWith('0')) {
          cleanedPhone = '212' + cleanedPhone.substring(1);
        }
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, '_blank');
      }
      setIsModalOpen(false);
      await fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage(t('adminUsers.errorSave'));
      }
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 4000);
  };

  const handleDelete = async () => {
    console.log("Deleting user with ID:", confirmDelete.id);
    try {
      await deleteUser(confirmDelete.id);
      setSuccessMessage(t('adminUsers.deleteSuccess'));
      await fetchUsers();
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage(t('adminUsers.errorDelete'));
      }
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 4000);
  };

  // Statistics
  const totalUsers = users.length;
  const totalClients = users.filter(u => u.role === 'client').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  return (
    <AdminLayout title={t('nav.adminUsers')}>
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-center gap-2 text-green-800 dark:text-green-300">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2 text-red-800 dark:text-red-300">
          <XCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('adminUsers.totalUsers')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('adminUsers.totalClients')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalClients}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <User className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('adminUsers.totalAdmins')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalAdmins}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('adminUsers.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('adminUsers.addUser')}
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('adminUsers.noUsers')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('adminUsers.fullName')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('adminUsers.phone')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CNE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('adminUsers.role')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('adminUsers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{u.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{u.CNE}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {t(`adminUsers.${u.role}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(u)}
                          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-lg rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingUser ? t('adminUsers.editUser') : t('adminUsers.addUser')}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('adminUsers.fullName')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('adminUsers.phone')}
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CNE
                    </label>
                    <input
                      type="text"
                      name="cne"
                      value={formData.cne}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('adminUsers.role')}
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="client">{t('adminUsers.client')}</option>
                      <option value="admin">{t('adminUsers.admin')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('adminUsers.password')}
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={editingUser ? t('adminUsers.passwordPlaceholder') : ''}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-9 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('adminUsers.confirmPassword')}
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={editingUser && !formData.password ? '' : ''}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-9 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {validationError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    {validationError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium"
                  >
                    {t('adminUsers.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                  >
                    {editingUser ? t('adminUsers.save') : t('adminUsers.add')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setConfirmDelete(null)} />
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('adminUsers.confirmDelete')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {t('adminUsers.confirmDeleteText', { name: confirmDelete.name })}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="px-6 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium"
                >
                  {t('adminUsers.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  {t('adminUsers.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}