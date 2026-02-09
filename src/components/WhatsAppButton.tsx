import React from 'react';
import { PhoneIcon } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
  buttonText?: string;
  children?: React.ReactNode;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "Bonjour, j'ai besoin d'aide concernant BYZCLUB.",
  className = "",
  buttonText = "Contacter sur WhatsApp",
  children
}) => {
  // Format phone number (remove spaces, +, etc.)
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${className}`}
    >
      {children || (
        <>
          <PhoneIcon className="w-5 h-5" />
          <span>{buttonText}</span>
        </>
      )}
    </a>
  );
};

export default WhatsAppButton;
