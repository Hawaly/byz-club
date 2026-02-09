import React, { useState } from 'react';
import Image from 'next/image';
import { Send, X } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface WhatsAppChatProps {
  phoneNumber: string;
  agentName?: string;
  agentRole?: string;
  agentAvatar?: string;
  presetMessages?: string[];
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  phoneNumber,
  agentName = "Sophie Martin",
  agentRole = "Account Manager",
  agentAvatar = "https://i.pravatar.cc/150?img=5",
  presetMessages = [
    "Bonjour, j'ai besoin d'aide concernant mon projet.",
    "Je souhaiterais prendre rendez-vous.",
    "J'ai une question technique sur mes vidéos.",
    "J'aimerais discuter de mon forfait."
  ]
}) => {
  const [message, setMessage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setMessage(preset);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (selectedPreset && e.target.value !== selectedPreset) {
      setSelectedPreset(null);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 flex items-center gap-3">
        <div className="relative">
          {agentAvatar ? (
            <Image 
              src={agentAvatar} 
              alt={agentName} 
              width={48} 
              height={48} 
              className="rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-xl font-bold">{agentName.charAt(0)}</span>
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">{agentName}</h2>
          <p className="text-sm text-green-50">{agentRole}</p>
        </div>
      </div>

      {/* Chat Body */}
      <div className="p-4 bg-[#E5DDD5] h-64 overflow-y-auto flex flex-col">
        <div className="bg-white self-start max-w-[80%] p-3 rounded-lg shadow-sm mb-6">
          <p className="text-gray-800">
            Bonjour! Comment puis-je vous aider aujourd'hui?
          </p>
          <span className="text-xs text-gray-500 mt-1 block">10:30</span>
        </div>

        {/* Simulate WhatsApp bubbles */}
        <div className="bg-[#DCF8C6] self-end max-w-[80%] p-3 rounded-lg shadow-sm mb-6">
          <p className="text-gray-800">
            Je suis intéressé(e) par vos services de vidéo marketing.
          </p>
          <span className="text-xs text-gray-500 mt-1 block">10:31</span>
        </div>

        <div className="bg-white self-start max-w-[80%] p-3 rounded-lg shadow-sm">
          <p className="text-gray-800">
            Excellent! Envoyez-moi un message directement sur WhatsApp et nous pourrons discuter de vos besoins.
          </p>
          <span className="text-xs text-gray-500 mt-1 block">10:32</span>
        </div>
      </div>

      {/* Preset Messages */}
      <div className="bg-gray-50 p-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Messages fréquents:</p>
        <div className="flex flex-wrap gap-2">
          {presetMessages.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetSelect(preset)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                selectedPreset === preset
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {preset.length > 25 ? `${preset.substring(0, 25)}...` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-3 bg-white flex items-end gap-2 border-t border-gray-200">
        <textarea
          value={message}
          onChange={handleInputChange}
          placeholder="Votre message..."
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500 resize-none"
          rows={2}
        />
        <WhatsAppButton 
          phoneNumber={phoneNumber}
          message={message}
          className="h-10 px-3 py-2"
        >
          <Send className="w-5 h-5" />
        </WhatsAppButton>
      </div>
    </div>
  );
};

export default WhatsAppChat;
