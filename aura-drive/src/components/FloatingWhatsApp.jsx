import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { useTranslation } from 'react-i18next';

export default function FloatingWhatsApp() {
  const { t } = useTranslation();
  
  const handleWhatsAppClick = () => {
    const greeting = encodeURIComponent("Hello, I'm interested in renting a car!");
    window.open(`https://wa.me/212777543264?text=${greeting}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
}
