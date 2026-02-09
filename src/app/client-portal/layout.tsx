"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRequireClient, useAuth } from '@/contexts/SimpleAuthContext';
import { ClientSidebar } from '@/components/client-portal/ClientSidebar';
import { 
  Sparkles, Menu, X, ArrowRight, Bell, 
  User, LogOut, MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export default function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  const { user, isLoading } = useRequireClient();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const pathname = usePathname();
  
  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 rounded-full animate-pulse mx-auto" />
          <div className="w-8 h-8 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          <p className="text-gray-600 font-semibold mt-8">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // User not authorized
  if (!user || !user.client_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 font-semibold mt-4 text-lg">Erreur d'accès</p>
          <p className="text-gray-600 mt-2">Vous n'avez pas les autorisations nécessaires pour accéder au portail client.</p>
          <button 
            onClick={logout}
            className="mt-6 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-800 font-medium transition-colors inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 hidden md:block border-r border-gray-200/60 bg-white/80 backdrop-blur-sm h-screen sticky top-0 overflow-y-auto shadow-sm">
        <ClientSidebar clientName={user.client_name || ''} />
      </aside>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-72 z-50 md:hidden shadow-2xl"
            >
              <ClientSidebar 
                clientName={user.client_name || ''} 
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-[60] p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center md:hidden"
        aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isMobileMenuOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isMobileMenuOpen ? 'open' : 'closed'}
            initial={{ opacity: 0, rotate: isMobileMenuOpen ? -90 : 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: isMobileMenuOpen ? 90 : -90 }}
            transition={{ duration: 0.2 }}
          >
            {isMobileMenuOpen ? <X size={20} className="text-slate-700" /> : <Menu size={20} className="text-slate-700" />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top Header - Mobile optimized */}
        <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20">
          <div className="flex justify-between items-center px-4 md:px-8 py-3 md:py-4 min-h-[4rem] sm:min-h-[4.5rem]">
            {/* Left side - Dynamic title */}
            <div className="flex items-center gap-3 pl-12 md:pl-0">
              <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 uppercase tracking-tight truncate leading-tight">
                {pathname === '/client-portal' && '📊 Tableau de bord'}
                {pathname.startsWith('/client-portal/strategies') && '🎯 Stratégies'}
                {pathname === '/client-portal/mandats' && '📋 Mandats'}
                {pathname === '/client-portal/videos' && '🎬 Vidéos'}
                {pathname === '/client-portal/factures' && '📄 Factures'}
                {pathname === '/client-portal/calendrier' && '📅 Calendrier'}
                {pathname === '/client-portal/profil' && '👤 Profil'}
                {pathname === '/client-portal/settings' && '⚙️ Paramètres'}
              </h1>
            </div>
            
            {/* Right side - user actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={() => setShowNotifications(true)}
                aria-label="Notifications"
                className="p-2.5 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all relative active:scale-95"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
              
              <Link href="/client-portal/profil" aria-label="Mon profil">
                <span className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all active:scale-95 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </span>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer - hidden on mobile */}
        <footer className="hidden md:block bg-white/60 backdrop-blur-sm border-t border-slate-200 py-4 px-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} urstory.ch - Tous droits réservés
        </footer>
      </main>
      
      {/* Floating Chat Button - adjusted for mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMessaging(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl flex items-center justify-center z-20 active:scale-95"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
