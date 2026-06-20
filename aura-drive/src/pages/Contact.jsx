import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { sendContactMessage } from '../api/contact';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    cne: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Phone number validation: only digits, spaces, +, -
  const isValidPhone = (value) => {
    const phoneRegex = /^[\d\s+\-]+$/;
    return phoneRegex.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'phone') {
      if (value && !isValidPhone(value)) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number before submitting
    if (!isValidPhone(form.phone)) {
      setPhoneError(true);
      return;
    }
    
    try {
      setSubmitting(true);
      await sendContactMessage(form);
      toast.success(t('contact.form.successToast'));
      setForm({ name: '', phone: '', cne: '', message: '' });
      setPhoneError(false);
    } catch (error) {
      toast.error(t('contact.form.errorToast'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Drive Car Go - {t('nav.contact')}</title>
      </Helmet>

      <div className="pt-32 pb-24 bg-dark dark:bg-[#121212] transition-colors duration-300 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white transition-colors duration-300 mb-4">
              {t('contact.title')}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-heading text-gray-900 dark:text-white transition-colors duration-300 mb-6">
                {t('contact.info.title')}
              </h2>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white transition-colors duration-300 font-semibold mb-1">
                    {t('contact.info.locationLabel')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 text-sm">
                    {t('contact.info.locationValue')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white transition-colors duration-300 font-semibold mb-1">
                    {t('contact.info.phoneLabel')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 text-sm">
                    {t('contact.info.phoneValue')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white transition-colors duration-300 font-semibold mb-1">
                    {t('contact.info.emailLabel')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 text-sm">
                    {t('contact.info.emailValue')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white transition-colors duration-300 font-semibold mb-1">
                    {t('contact.info.workingHoursLabel')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 text-sm">
                    {t('contact.info.workingHoursValue')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-[#242424] p-8 border border-black/5 dark:border-white/5 shadow-xl shadow-black/5 transition-colors duration-300 relative rounded-2xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-3xl rounded-full"></div>

              <h2 className="text-2xl font-heading text-gray-900 dark:text-white transition-colors duration-300 mb-6 relative z-10">
                {t('contact.form.title')}
              </h2>
              <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('contact.form.namePlaceholder')}
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 px-4 py-3 text-gray-900 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:border-primary transition-colors duration-300"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t('contact.form.phonePlaceholder')}
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-50 dark:bg-[#1a1a1a] border px-4 py-3 text-gray-900 dark:text-white dark:placeholder-gray-500 focus:outline-none transition-colors duration-300 ${
                      phoneError 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-black/10 dark:border-white/10 focus:border-primary'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">
                      {t('contact.form.phoneInvalidError')}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="cne"
                    placeholder={t('contact.form.cnePlaceholder')}
                    value={form.cne}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 px-4 py-3 text-gray-900 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:border-primary transition-colors duration-300"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows="4"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 px-4 py-3 text-gray-900 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:border-primary transition-colors duration-300"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting || phoneError}
                  className="w-full bg-primary text-white font-semibold uppercase tracking-wider py-3 hover:bg-primary-hover hover:text-black transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? t('contact.form.submittingButton') : <><Send className="w-4 h-4" /> {t('contact.form.submitButton')}</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
