"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Target, Briefcase, FileText, Calendar,
  Video, User, LogOut, MessageSquare, FolderOpen,
  Sparkles, Lightbulb, ChevronRight, Zap
} from 'lucide-react';

interface ClientSidebarProps {
  clientName: string;
  onNavigate?: () => void;
}

const menuGroups = [
  {
    label: 'Vue d\'ensemble',
    items: [
      { href: '/client-portal', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Créativité',
    items: [
      { href: '/client-portal/strategies', label: 'Stratégies', icon: Target },
      { href: '/client-portal/concept-approvals', label: 'Concepts', icon: Lightbulb },
    ]
  },
  {
    label: 'Business',
    items: [
      { href: '/client-portal/mandats', label: 'Mandats', icon: Briefcase },
      { href: '/client-portal/factures', label: 'Factures', icon: FileText },
      { href: '/client-portal/documents', label: 'Documents', icon: FolderOpen },
    ]
  },
  {
    label: 'Contenu',
    items: [
      { href: '/client-portal/videos', label: 'Vidéos', icon: Video },
      { href: '/client-portal/calendrier', label: 'Calendrier', icon: Calendar },
    ]
  },
  {
    label: 'Support',
    items: [
      { href: '/client-portal/contact', label: 'Contact', icon: MessageSquare },
    ]
  },
];

export function ClientSidebar({ clientName, onNavigate }: ClientSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/client-portal') return pathname === '/client-portal';
    return pathname.startsWith(href);
  };

  const initials = clientName
    ? clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'CL';

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">

      {/* ── Brand header ── */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <Link href="/client-portal" onClick={onNavigate}>
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em]">Espace Client</p>
              <h1 className="text-sm font-black text-white leading-tight truncate max-w-[140px]">
                {clientName || 'Mon Espace'}
              </h1>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Avatar + nom ── */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-3 py-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{clientName || 'Client'}</p>
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Connecté</p>
          </div>
          <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        </div>
      </div>

      {/* ── Navigation groupée ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={onNavigate}>
                    <motion.div
                      whileHover={{ x: active ? 0 : 3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                        active
                          ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active-pill"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-orange-400 to-pink-500 rounded-full"
                        />
                      )}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        active
                          ? 'bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-500/30'
                          : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      </div>
                      <span className={`text-sm font-semibold flex-1 ${active ? 'text-white' : ''}`}>
                        {item.label}
                      </span>
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link href="/client-portal/profil" onClick={onNavigate}>
          <motion.div
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              pathname === '/client-portal/profil'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Mon Profil</span>
          </motion.div>
        </Link>

        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { onNavigate?.(); logout(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">Déconnexion</span>
        </motion.button>
      </div>
    </div>
  );
}
