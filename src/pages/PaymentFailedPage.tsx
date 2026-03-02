import { X } from 'lucide-react';
import { Button } from '@heroui/react';

interface PaymentFailedPageProps {
  onNavigate: (page: string) => void;
}

export default function PaymentFailedPage({ onNavigate }: PaymentFailedPageProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-light text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. Please try again.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          If you continue to experience issues, please contact our support team.
        </p>
        <div className="flex gap-4 justify-center">
          <Button color="primary" onPress={() => onNavigate('checkout')} className="font-medium">
            Try Again
          </Button>
          <Button variant="bordered" onPress={() => onNavigate('home')} className="font-medium">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
