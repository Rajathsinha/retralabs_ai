import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '918217824384';
    const message = encodeURIComponent('Hello, I came across your website RetraLabs');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
      aria-label="Chat with Support on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
