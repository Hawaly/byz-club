"use client";

import '../dashboard-globals.css';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRequireClient, useAuth } from '@/contexts/SimpleAuthContext';
import { ClientSidebar } from '@/components/client-portal/ClientSidebar';
import { 
  X, Bell, User, LogOut, MessageSquare, Sparkles,
  LayoutDashboard, Briefcase, FileText, Video, Calendar,
  Target, FolderOpen, Lightbulb, MoreHorizontal, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BOTTOM_NAV = [
  { href: '/client-portal',                      label: 'Accueil',   icon: LayoutDashboard },
  { href: '/client-portal/mandats',              label: 'Projets',   icon: Briefcase       },
  { href: '/client-portal/calendrier-editorial', label: 'Planning',  icon: Calendar        },
  { href: '/client-portal/videos',               label: 'Vidéos',    icon: Video           },
  { href: '/client-portal/factures',             label: 'Finances',  icon: FileText        },
];

const MORE_NAV = [
  { href: '/client-portal/strategies',       label: 'Stratégies', icon: Target      },
  { href: '/client-portal/documents',        label: 'Documents',  icon: FolderOpen  },
  { href: '/client-portal/concept-approvals', label: 'Concepts',  icon: Lightbulb   },
  { href: '/client-portal/profil',           label: 'Mon Profil', icon: User        },
];

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/client-portal':                     'Dashboard',
  '/client-portal/strategies':          'Stratégies',
  '/client-portal/concept-approvals':   'Concepts',
  '/client-portal/mandats':             'Projets',
  '/client-portal/factures':            'Factures',
  '/client-portal/documents':           'Documents',
  '/client-portal/videos':              'Vidéos',
  '/client-portal/calendrier-editorial':  'Calendrier',
  '/client-portal/profil':              'Mon Profil',
};

export default function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  const { user, isLoading } = useRequireClient();
  const { logout } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsMoreOpen(false); }, [pathname]);

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

      {/* ── Sidebar Desktop uniquement ── */}
      <aside className="w-[260px] hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto shadow-2xl shadow-black/20 flex-shrink-0 z-30">
        <ClientSidebar clientName={user.client_name || ''} />
      </aside>

      {/* ── Contenu principal ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">

            {/* Logo mobile uniquement */}
            <div className="flex items-center gap-3 md:hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6633] to-[#FF4411] flex items-center justify-center shadow-md shadow-[#FF6633]/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-black text-slate-900 leading-none">{pageTitle}</h2>
            </div>

            {/* Titre desktop */}
            <div className="hidden md:flex items-center gap-3">
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <h2 className="text-base font-black text-slate-900 leading-none">{pageTitle}</h2>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
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
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6633] to-[#FF4411] flex items-center justify-center text-white font-black text-xs shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  {(user.client_name || 'CL').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                </motion.div>
              </Link>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-24 md:pb-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* ── Footer desktop ── */}
        <footer className="hidden md:block bg-white border-t border-slate-200 py-3 px-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} urstory.ch — Tous droits réservés
        </footer>
      </div>

      {/* ── Bottom Nav Mobile ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch h-16">
          {BOTTOM_NAV.map((item) => {
            const isActive = item.href === '/client-portal'
              ? pathname === '/client-portal'
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center justify-center h-full gap-0.5 px-1"
                >
                  <div className={`relative flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FF6633] shadow-lg shadow-[#FF6633]/30'
                      : 'bg-transparent'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[9px] font-bold leading-none tracking-wide ${
                    isActive ? 'text-[#FF6633]' : 'text-slate-400'
                  }`}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* Bouton Plus */}
          <button className="flex-1" onClick={() => setIsMoreOpen(true)}>
            <motion.div
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center justify-center h-full gap-0.5 px-1"
            >
              <div className={`relative flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200 ${
                MORE_NAV.some(i => pathname.startsWith(i.href))
                  ? 'bg-[#FF6633] shadow-lg shadow-[#FF6633]/30'
                  : 'bg-transparent'
              }`}>
                <MoreHorizontal className={`w-5 h-5 ${
                  MORE_NAV.some(i => pathname.startsWith(i.href)) ? 'text-white' : 'text-slate-400'
                }`} strokeWidth={1.8} />
              </div>
              <span className={`text-[9px] font-bold leading-none tracking-wide ${
                MORE_NAV.some(i => pathname.startsWith(i.href)) ? 'text-[#FF6633]' : 'text-slate-400'
              }`}>Plus</span>
            </motion.div>
          </button>
        </div>
      </nav>

      {/* ── Drawer "Plus" Mobile ── */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div
              key="more-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setIsMoreOpen(false)}
            />
            <motion.div
              key="more-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-3xl shadow-2xl pb-8"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              <div className="px-5 pb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Plus de pages</h3>
                <div className="space-y-1">
                  {MORE_NAV.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors ${
                            isActive
                              ? 'bg-[#FF6633]/10 text-[#FF6633]'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-[#FF6633] shadow-md shadow-[#FF6633]/30' : 'bg-slate-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          </div>
                          <span className={`font-semibold text-base flex-1 ${
                            isActive ? 'text-[#FF6633]' : 'text-slate-800'
                          }`}>{item.label}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Déconnexion */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={logout}
                    className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl hover:bg-red-50 text-slate-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-semibold text-base text-red-500">Déconnexion</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating Chat — desktop uniquement ── */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        className="hidden md:flex fixed bottom-8 right-8 w-13 h-13 p-3.5 bg-gradient-to-br from-[#FF6633] to-pink-500 text-white rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl z-30 items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
