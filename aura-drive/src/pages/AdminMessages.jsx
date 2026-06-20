import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Check, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { getContactMessages, markMessageRead, deleteMessage } from '../api/contact';

export default function AdminMessages() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const pollIntervalRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages(filter === 'all' ? null : filter);
      setMessages(data);
    } catch (error) {
      toast.error('Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Poll for updates every 3 seconds
    pollIntervalRef.current = setInterval(fetchData, 3000);
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      const updated = await markMessageRead(id);
      setMessages(messages.map(m => m.id === id ? updated : m));
    } catch (error) {
      toast.error('Error marking message as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('adminContactMessages.confirmDelete'))) {
      return;
    }
    try {
      await deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      toast.success(t('adminContactMessages.deleteSuccess'));
    } catch (error) {
      toast.error('Error deleting message');
    }
  };

  return (
    <AdminLayout title={t('adminContactMessages.title')}>
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('adminContactMessages.filterAll')}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'read' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('adminContactMessages.filterRead')}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('adminContactMessages.filterUnread')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">{t('adminContactMessages.noMessages')}</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 rounded-xl border ${
                  !msg.is_read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {t('adminContactMessages.messageFrom')}: {msg.name}
                      </h3>
                      {!msg.is_read && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                          {t('adminContactMessages.unread')}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div>
                        <span className="font-medium">{t('adminContactMessages.phone')}:</span> {msg.phone}
                      </div>
                      <div>
                        <span className="font-medium">{t('adminContactMessages.cne')}:</span> {msg.cne}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">{t('adminContactMessages.date')}:</span>{' '}
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {!msg.is_read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                        title={t('adminContactMessages.read')}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title={t('adminContactMessages.delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
