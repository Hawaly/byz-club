"use client";

import { useState } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import WhatsAppButton from '@/components/WhatsAppButton';
import WhatsAppChat from '@/components/WhatsAppChat';
import {
  Mail, Phone, MessageSquare, User,
  CheckCircle, AlertCircle, Clock,
  HelpCircle, FileQuestion, Megaphone, 
  Calendar, FileText, ArrowRight,
  Smartphone
} from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  role_code: string;
  role_name: string;
  role_id: number; 
  client_id?: number;
  client_name?: string;
  first_name?: string;
  last_name?: string;
}

interface SupportTicket {
  id?: number;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  status?: 'new' | 'in_progress' | 'resolved';
  client_id: number;
  created_at?: string;
  updated_at?: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

export default function ContactPage() {
  // useRequireClient garantit que user existe ou redirige
  const { user } = useRequireClient() as { user: UserProfile, isLoading: boolean };
  
  const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  
  // Team members - in a real app, this would come from the database
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Account Manager',
      email: 'sophie.martin@urstory.agency',
      phone: '+41 22 123 45 67',
      avatar_url: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      role: 'Technical Support',
      email: 'thomas.dubois@urstory.agency',
      phone: '+41 22 123 45 68',
      avatar_url: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 3,
      name: 'Marie Lefèvre',
      role: 'Customer Success',
      email: 'marie.lefevre@urstory.agency',
      avatar_url: 'https://i.pravatar.cc/150?img=9'
    }
  ];
  
  const fetchRecentTickets = async () => {
    if (!user?.client_id) return;
    
    try {
      const { data, error } = await supabase
        .from('support_ticket')
        .select('*')
        .eq('client_id', user.client_id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setRecentTickets(data || []);
      setShowRecent(true);
    } catch (error) {
      console.error('Error fetching recent tickets:', error);
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <FileQuestion className="w-5 h-5 text-blue-500" />;
      case 'billing': return <FileText className="w-5 h-5 text-amber-500" />;
      case 'meeting': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'feedback': return <Megaphone className="w-5 h-5 text-purple-500" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Contact & Support</h1>
        <p className="text-gray-600">Besoin d'aide ? Contactez notre équipe ou créez un ticket de support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* WhatsApp Chat Section */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5" /> Contactez-nous directement
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Support instantané via WhatsApp</h3>
                <p className="text-gray-600">
                  Posez vos questions et recevez une assistance rapide directement sur WhatsApp.
                </p>
              </div>
              
              {/* WhatsApp Chat Component */}
              <WhatsAppChat 
                phoneNumber="+41221234567" 
                agentName="Sophie Martin"
                agentRole="Account Manager"
                agentAvatar="https://i.pravatar.cc/150?img=5"
                presetMessages={[
                  "Bonjour, j'ai une question concernant mon projet.",
                  "Je souhaiterais planifier une réunion.",
                  "J'ai un problème technique à résoudre.",
                  "Je voudrais discuter de mon forfait actuel."
                ]}
              />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">Vous préférez discuter directement?</p>
                <div className="flex justify-center">
                  <WhatsAppButton 
                    phoneNumber="+41221234567" 
                    message="Bonjour, j'ai besoin d'aide concernant mon projet BYZCLUB."
                    buttonText="Démarrer la discussion"
                    className="px-6 py-3 text-lg"
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Réponse rapide garantie</h4>
                    <p className="text-sm text-gray-500">Notre équipe répond généralement dans les 30 minutes pendant les heures de bureau.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* History Section */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" /> Historique de contact
              </h2>
              <button 
                onClick={fetchRecentTickets}
                className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
              >
                <Clock className="w-4 h-4" /> Afficher l'historique
              </button>
            </div>
            
            {showRecent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {recentTickets.length > 0 ? (
                  <div className="space-y-4">
                    {recentTickets.map(ticket => (
                      <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            {getCategoryIcon(ticket.category)}
                            <div>
                              <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1 mt-1">{ticket.message}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority === 'high' ? 'Haute' : ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {getStatusIcon(ticket.status || 'new')}
                              {ticket.status === 'resolved' ? 'Résolu' : ticket.status === 'in_progress' ? 'En traitement' : 'Nouveau'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                          <span>
                            Créé le {new Date(ticket.created_at || '').toLocaleDateString('fr-FR')}
                          </span>
                          
                          {/* WhatsApp Follow-up Button */}
                          <WhatsAppButton
                            phoneNumber="+41221234567"
                            message={`Suivi concernant la demande #${ticket.id} - ${ticket.subject}`}
                            buttonText="Suivre via WhatsApp"
                            className="!py-1 !px-3 text-xs"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <MessageSquare className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600">
                      Aucun historique de contact disponible
                    </p>
                  </Card>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Contactez-nous
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* WhatsApp Contact Button */}
              <div className="mb-4">
                <WhatsAppButton 
                  phoneNumber="+41221234567"
                  message="Bonjour, j'ai besoin d'assistance avec BYZCLUB."
                  className="w-full justify-center"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Téléphone / WhatsApp</h3>
                  <a href="tel:+41221234567" className="font-medium text-gray-900 hover:text-green-700 transition-colors">+41 22 123 45 67</a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <a href="mailto:support@urstory.agency" className="font-medium text-gray-900 hover:text-green-700 transition-colors">support@urstory.agency</a>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Horaires d'ouverture</h3>
                <p className="text-gray-700">Lundi - Vendredi: 9h - 18h</p>
                <p className="text-gray-700">Samedi - Dimanche: Fermé</p>
                <p className="mt-2 text-xs text-green-600 font-medium">Assistance WhatsApp disponible 24/7 - Réponse dans les 30 minutes pendant les heures de bureau</p>
              </div>
            </div>
          </Card>
          
          {/* Team Members */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5" /> Votre équipe
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <div className="mt-1 space-y-1 text-sm">
                        <a 
                          href={`mailto:${member.email}`} 
                          className="flex items-center gap-1 text-green-600 hover:text-green-800"
                        >
                          <Mail className="w-3 h-3" /> {member.email}
                        </a>
                        {member.phone && (
                          <a 
                            href={`tel:${member.phone}`} 
                            className="flex items-center gap-1 text-green-600 hover:text-green-800"
                          >
                            <Phone className="w-3 h-3" /> {member.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* WhatsApp Contact Button */}
                    <div className="flex-shrink-0">
                      <WhatsAppButton
                        phoneNumber={member.phone?.replace(/\s+/g, '') || '+41221234567'}
                        message={`Bonjour ${member.name}, je souhaite discuter de mon projet BYZCLUB.`}
                        className="!px-3 !py-2 text-xs" 
                      >
                        <Smartphone className="w-4 h-4 mr-1" /> Contacter
                      </WhatsAppButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* FAQ */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> FAQ
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-l-4 border-green-200 pl-3 py-1">
                <h3 className="font-medium text-gray-900">Comment modifier mon abonnement ?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Contactez-nous directement sur WhatsApp pour discuter des options disponibles pour votre compte.
                </p>
              </div>
              
              <div className="border-l-4 border-green-200 pl-3 py-1">
                <h3 className="font-medium text-gray-900">Quels sont les délais de réponse par WhatsApp ?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Nous répondons généralement aux messages WhatsApp dans les 30 minutes pendant les heures de bureau.
                </p>
              </div>
              
              <div className="border-l-4 border-green-200 pl-3 py-1">
                <h3 className="font-medium text-gray-900">Comment programmer une réunion ?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Envoyez-nous simplement un message WhatsApp en précisant vos disponibilités et le sujet de la réunion.
                </p>
              </div>
              
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <a href="#" className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium">
                    <span>Voir toutes les questions</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  
                  <WhatsAppButton
                    phoneNumber="+41221234567"
                    message="Bonjour, j'ai une question qui n'apparaît pas dans la FAQ."
                    className="!px-3 !py-1 text-xs"
                  >
                    <HelpCircle className="w-3 h-3 mr-1" /> Poser une question
                  </WhatsAppButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
