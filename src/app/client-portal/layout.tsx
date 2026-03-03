"use client";

import '../dashboard-globals.css';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRequireClient, useAuth } from '@/contexts/SimpleAuthContext';
import { ClientSidebar } from '@/components/client-portal/ClientSidebar';
import { 
  Menu, X, Bell, User, LogOut, MessageSquare, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/client-portal':                     'Dashboard',
  '/client-portal/strategies':          'Stratégies',
  '/client-portal/concept-approvals':   'Concepts',
  '/client-portal/mandats':             'Mandats',
  '/client-portal/factures':            'Factures',
  '/client-portal/documents':           'Documents',
  '/client-portal/videos':              'Vidéos',
  '/client-portal/calendrier':          'Calendrier',
  '/client-portal/contact':             'Contact',
  '/client-portal/profil':              'Mon Profil',
};

export default function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  const { user, isLoading } = useRequireClient();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const pageTitle = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname === key || pathname.startsWith(key + '/')
  )?.[1] ?? 'Espace Client';

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-slate-300 font-semibold text-sm">Chargement de votre espace…</p>
        </div>
      </div>
    );
  }

  /* ── Non autorisé ── */
  if (!user || !user.client_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-sm px-8 py-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white font-bold text-lg mb-2">Accès non autorisé</p>
          <p className="text-slate-400 text-sm mb-6">Vous n'avez pas les droits pour accéder au portail client.</p>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all text-sm"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Sidebar Desktop ── */}
      <aside className="w-[260px] hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto shadow-2xl shadow-black/20 flex-shrink-0 z-30">
        <ClientSidebar clientName={user.client_name || ''} />
      </aside>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed top-0 left-0 h-full w-[260px] z-50 md:hidden shadow-2xl"
            >
              <ClientSidebar clientName={user.client_name || ''} onNavigate={() => setIsMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Contenu principal ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">

            {/* Gauche */}
            <div className="flex items-center gap-3">
              {/* Bouton hamburger mobile */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsMobileMenuOpen(v => !v)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isMobileMenuOpen ? 'x' : 'menu'}
                    initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Séparateur + titre */}
              <div className="h-6 w-px bg-slate-200 hidden md:block" />
              <div>
                <h2 className="text-base font-black text-slate-900 leading-none">{pageTitle}</h2>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 hidden sm:block">
                  {user.client_name}
                </p>
              </div>
            </div>

            {/* Droite */}
            <div className="flex items-center gap-1.5">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-orange-50 text-slate-500 hover:text-orange-500 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
              </button>

              <Link href="/client-portal/profil">
                <motion.div
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  {(user.client_name || 'CL').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                </motion.div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="hidden md:block bg-white border-t border-slate-200 py-3 px-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} urstory.ch — Tous droits réservés
        </footer>
      </div>

      {/* Floating Chat */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-5 md:right-8 w-13 h-13 p-3.5 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl z-30"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
