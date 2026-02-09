"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Target, Briefcase, FileText, Calendar,
  Video, User, Settings, LogOut, MessageSquare, FolderOpen,
  Sparkles
} from 'lucide-react';

interface ClientSidebarProps {
  clientName: string;
  onNavigate?: () => void;
}

const menuItems = [
  { href: '/client-portal', label: 'Tableau de bord', icon: LayoutDashboard, emoji: '📊' },
  { href: '/client-portal/strategies', label: 'Stratégies', icon: Target, emoji: '🎯' },
  { href: '/client-portal/mandats', label: 'Mandats', icon: Briefcase, emoji: '📋' },
  { href: '/client-portal/factures', label: 'Factures', icon: FileText, emoji: '📄' },
  { href: '/client-portal/documents', label: 'Documents', icon: FolderOpen, emoji: '📁' },
  { href: '/client-portal/videos', label: 'Vidéos', icon: Video, emoji: '🎬' },
  { href: '/client-portal/calendrier', label: 'Calendrier', icon: Calendar, emoji: '📅' },
  { href: '/client-portal/contact', label: 'Contact', icon: MessageSquare, emoji: '💬' },
];

export function ClientSidebar({ clientName, onNavigate }: ClientSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/client-portal') {
      return pathname === '/client-portal';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/client-portal" onClick={onNavigate}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Espace Client</h1>
              <p className="text-xs font-bold text-slate-500 truncate max-w-[140px]">{clientName}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link href="/client-portal/profil" onClick={onNavigate}>
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === '/client-portal/profil'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5 text-slate-400" />
            <span className="font-semibold text-sm">Mon Profil</span>
          </motion.div>
        </Link>
        
        <button
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
