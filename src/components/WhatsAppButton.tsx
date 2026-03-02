import { MessageCircle } from 'lucide-react';
import { Button, Tooltip } from '@heroui/react';

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '918217824384';
    const message = encodeURIComponent('Hello, I came across your website RetraLabs');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip content="Chat with us" placement="left">
        <Button
          isIconOnly
          color="success"
          variant="solid"
          size="lg"
          onPress={handleWhatsAppClick}
          className="rounded-2xl shadow-lg hover:shadow-xl w-14 h-14"
          aria-label="Chat with Support on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </Tooltip>
    </div>
  );
}
