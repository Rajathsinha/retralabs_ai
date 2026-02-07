import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = '918217824384';
    const message = encodeURIComponent('Hello, I came across your website RetraLabs');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <div
        className={`bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg transition-all duration-300 ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        Chat with us
      </div>
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat with Support on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
