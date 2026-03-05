"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Target, Briefcase, FileText, Calendar,
  Video, User, LogOut, MessageSquare, FolderOpen,
  Sparkles, Lightbulb
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
    label: 'Projets',
    items: [
      { href: '/client-portal/mandats', label: 'Projets', icon: Briefcase },
      { href: '/client-portal/calendrier-editorial', label: 'Calendrier', icon: Calendar },
    ]
  },
  {
    label: 'Finances',
    items: [
      { href: '/client-portal/factures', label: 'Factures', icon: FileText },
    ]
  },
  {
    label: 'Livrables',
    items: [
      { href: '/client-portal/videos', label: 'Vidéos', icon: Video },
      { href: '/client-portal/documents', label: 'Documents', icon: FolderOpen },
    ]
  },
  {
    label: 'Idéation',
    items: [
      { href: '/client-portal/strategies', label: 'Stratégies', icon: Target },
      { href: '/client-portal/concept-approvals', label: 'Concepts', icon: Lightbulb },
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
    <div className="h-full flex flex-col bg-[#1A1A1A]">

      {/* ── Brand header ── */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/client-portal" onClick={onNavigate}>
          <div className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6633] to-[#FF4411] flex items-center justify-center shadow-lg shadow-[#FF6633]/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#FF6633] uppercase tracking-[0.2em]">Espace Client</p>
              <h1 className="text-sm font-black text-white leading-tight truncate max-w-[140px]">
                {clientName || 'Mon Espace'}
              </h1>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Avatar + nom ── */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 bg-white/[0.06] rounded-2xl px-3 py-3 border border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6633] to-[#FF4411] flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md shadow-[#FF6633]/30">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{clientName || 'Client'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-slate-400 font-medium">Connecté</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Séparateur ── */}
      <div className="mx-4 h-px bg-white/[0.07] mb-3" />

      {/* ── Navigation groupée ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.22em] px-3 py-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={onNavigate}>
                    <motion.div
                      whileHover={{ x: active ? 0 : 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-[#FF6633] shadow-lg shadow-[#FF6633]/30'
                          : 'hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        active
                          ? 'bg-white/20'
                          : 'bg-white/[0.06]'
                      }`}>
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <span className={`text-sm font-semibold flex-1 ${
                        active ? 'text-white' : 'text-slate-400'
                      }`}>
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Séparateur ── */}
      <div className="mx-4 h-px bg-white/[0.07]" />

      {/* ── Footer ── */}
      <div className="px-3 py-3 space-y-0.5">
        <Link href="/client-portal/profil" onClick={onNavigate}>
          <motion.div
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
              pathname === '/client-portal/profil'
                ? 'bg-[#FF6633] shadow-lg shadow-[#FF6633]/30'
                : 'hover:bg-white/[0.06]'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              pathname === '/client-portal/profil' ? 'bg-white/20' : 'bg-white/[0.06]'
            }`}>
              <User className={`w-4 h-4 ${pathname === '/client-portal/profil' ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <span className={`text-sm font-semibold ${
              pathname === '/client-portal/profil' ? 'text-white' : 'text-slate-400'
            }`}>Mon Profil</span>
          </motion.div>
        </Link>

        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { onNavigate?.(); logout(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">Déconnexion</span>
        </motion.button>
      </div>
    </div>
  );
}
