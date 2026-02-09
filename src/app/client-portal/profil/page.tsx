"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import {
  User, Building2, Mail, Phone, MapPin,
  Edit2, Save, X, Check, AlertCircle, Loader2,
  Globe, Key, Lock, Shield, BriefcaseBusiness
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
  phone?: string;
  position?: string;
}

interface ClientDetails {
  id: number;
  name: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  website?: string;
  company_type?: string;
  industry?: string;
  logo_url?: string;
  created_at: string;
}

export default function ProfilePage() {
  // useRequireClient garantit que user existe ou redirige
  const { user: authUser } = useRequireClient() as { user: UserProfile, isLoading: boolean };
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    if (!authUser || !authUser.client_id) return;
    
    async function fetchProfileData() {
      setIsLoading(true);
      
      try {
        // Fetch user profile with role and client info
        const { data: userData, error: userError } = await supabase
          .from('app_user')
          .select(`
            *,
            role:role_id (id, name, code),
            client:client_id (*)
          `)
          .eq('id', authUser.id)
          .single();
        
        if (userError) throw userError;
        
        // Extract client info
        const clientData = userData.client;
        
        // Format user data
        const formattedUser = {
          ...userData,
          role_code: userData.role.code,
          role_name: userData.role.name,
          client_name: clientData?.name
        };
        
        setUserProfile(formattedUser);
        setEditedProfile(formattedUser);
        setClientDetails(clientData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfileData();
  }, [authUser]);
  
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile(userProfile || {});
    setFormError(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Update user profile
      const { error } = await supabase
        .from('app_user')
        .update({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          phone: editedProfile.phone,
          position: editedProfile.position
        })
        .eq('id', userProfile.id);
      
      if (error) throw error;
      
      // Update local state
      setUserProfile({
        ...userProfile,
        ...editedProfile
      });
      
      setIsEditingProfile(false);
      setFormSuccess('Profil mis à jour avec succès');
      
      // Clear success message after a delay
      setTimeout(() => {
        setFormSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setFormError(error.message || 'Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChangePassword = async () => {
    setIsSubmitting(true);
    setFormError(null);
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      setIsSubmitting(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Call password change API
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Échec de la modification du mot de passe');
      }
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setChangePasswordMode(false);
      setFormSuccess('Mot de passe modifié avec succès');
      
      // Clear success message after a delay
      setTimeout(() => {
        setFormSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error changing password:', error);
      setFormError(error.message || 'Une erreur est survenue lors du changement de mot de passe');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Votre Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et vos préférences de compte</p>
      </div>

      {/* Success Message */}
      {formSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3"
        >
          <Check className="w-5 h-5" />
          <p>{formSuccess}</p>
        </motion.div>
      )}

      {/* Error Message */}
      {formError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          <p>{formError}</p>
        </motion.div>
      )}

      {/* User Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Informations Personnelles</h2>
            {!isEditingProfile && !changePasswordMode && (
              <button 
                onClick={handleProfileEdit}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Modifier
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {isEditingProfile ? (
            /* Edit Profile Form */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={editedProfile.first_name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={editedProfile.last_name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userProfile?.email || ''}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editedProfile.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poste / Fonction
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={editedProfile.position || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Votre poste dans l'entreprise"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleSaveProfile}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Enregistrer</>
                  )}
                </button>
              </div>
            </div>
          ) : changePasswordMode ? (
            /* Change Password Form */
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Entrez un nouveau mot de passe"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setChangePasswordMode(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Modification en cours...</>
                  ) : (
                    <><Key className="w-4 h-4" /> Modifier le mot de passe</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Profile Display */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nom complet</h3>
                    <p className="text-gray-900 font-medium mt-1">
                      {userProfile?.first_name && userProfile?.last_name ? 
                        `${userProfile.first_name} ${userProfile.last_name}` : 
                        'Non renseigné'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{userProfile?.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{userProfile?.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Entreprise</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{userProfile?.client_name || 'Non renseigné'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Poste / Fonction</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{userProfile?.position || 'Non renseigné'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type de compte</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{userProfile?.role_name || 'Client'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setChangePasswordMode(true)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Lock className="w-4 h-4" /> 
                  Changer mon mot de passe
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Company Information */}
      {clientDetails && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Informations Société</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nom de l'entreprise</h3>
                  <p className="text-gray-900 font-medium mt-1">{clientDetails.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <p className="text-gray-900">
                      {clientDetails.address ? (
                        <>
                          {clientDetails.address}<br />
                          {clientDetails.postal_code} {clientDetails.city}<br />
                          {clientDetails.country}
                        </>
                      ) : (
                        'Adresse non renseignée'
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{clientDetails.phone || 'Non renseigné'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Site web</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4 text-gray-500" />
                    {clientDetails.website ? (
                      <a 
                        href={clientDetails.website.startsWith('http') ? clientDetails.website : `https://${clientDetails.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {clientDetails.website}
                      </a>
                    ) : (
                      <p className="text-gray-900">Non renseigné</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Secteur d'activité</h3>
                  <p className="text-gray-900 mt-1">{clientDetails.industry || 'Non renseigné'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Security Section */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5" /> Sécurité
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Dernière connexion</h3>
              <p className="text-gray-600">Aujourd'hui à 14:25</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Double authentification</h3>
              <p className="text-gray-600 mb-2">Protégez votre compte avec la double authentification.</p>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Activer la double authentification
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
