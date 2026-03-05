"use client";

import { useState, useEffect } from 'react';
import { useRequireClient } from '@/contexts/SimpleAuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import {
  ArrowUpRight, ChevronRight, Activity, Target, FileText, 
  Briefcase, CheckCircle, Clock, Building2, Calendar,
  TrendingUp, DollarSign, AlertCircle, Download, Eye, MessageSquare
} from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useRequireClient();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    strategies: { total: 0, active: 0 },
    mandats: { total: 0, enCours: 0 },
    invoices: {
      total: 0,
      montantTotal: 0,
      montantPaye: 0,
      payees: 0,
      enAttente: 0
    }
  });
  // Définir les interfaces pour les activités et échéances
  interface ActivityItem {
    id: string;
    type: 'strategy' | 'invoice' | 'mandat';
    title: string;
    action: string;
    date: string;
  }
  
  interface DeadlineItem {
    id: string;
    type: 'invoice' | 'mandat';
    title: string;
    date: string;
    amount?: number;
  }
  
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<DeadlineItem[]>([]);
  const [clientInfo, setClientInfo] = useState<any>(null);

  // Fetch client data
  useEffect(() => {
    if (!user?.client_id) return;
    
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data in parallel
        const [strategiesRes, invoicesRes, mandatsRes, clientRes] = await Promise.all([
          supabase.from('social_media_strategy').select('*').eq('client_id', user.client_id),
          supabase.from('invoice').select('*').eq('client_id', user.client_id),
          supabase.from('mandat').select('*').eq('client_id', user.client_id),
          supabase.from('client').select('*').eq('id', user.client_id).single()
        ]);
        
        // Calculate statistics
        const strategies = strategiesRes.data || [];
        const invoices = invoicesRes.data || [];
        const mandats = mandatsRes.data || [];
        
        setStats({
          strategies: { 
            total: strategies.length, 
            active: strategies.filter(s => s.status === 'actif').length 
          },
          mandats: { 
            total: mandats.length, 
            enCours: mandats.filter(m => m.status === 'en_cours').length 
          },
          invoices: {
            total: invoices.length,
            montantTotal: invoices.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0),
            montantPaye: invoices.filter(inv => inv.status === 'payee').reduce((sum, inv) => sum + (inv.total_ttc || 0), 0),
            payees: invoices.filter(inv => inv.status === 'payee').length,
            enAttente: invoices.filter(inv => inv.status === 'envoyee').length
          }
        });

        // Generate recent activity
        const activity = [
          ...strategies.slice(0, 2).map(s => ({ 
            id: `strat-${s.id}`, 
            type: 'strategy' as const, 
            title: `Stratégie v${s.version}`,
            action: s.status === 'actif' ? 'Stratégie activée' : 'Stratégie mise à jour',
            date: s.created_at
          })),
          ...invoices.slice(0, 2).map(i => ({ 
            id: `inv-${i.id}`, 
            type: 'invoice' as const,
            title: `Facture ${i.invoice_number}`,
            action: i.status === 'payee' ? 'Facture payée' : 'Facture émise',
            date: i.issue_date
          })),
          ...mandats.slice(0, 2).map(m => ({ 
            id: `mandat-${m.id}`, 
            type: 'mandat' as const,
            title: m.title,
            action: 'Mandat mis à jour',
            date: m.updated_at || m.created_at
          }))
        ];
        
        // Sort by date
        activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivity(activity);

        // Generate upcoming deadlines
        const deadlines = [
          ...invoices.filter(inv => inv.status === 'envoyee' && inv.due_date).map(inv => ({
            id: `inv-${inv.id}`, 
            type: 'invoice' as const, 
            title: `Facture ${inv.invoice_number}`,
            amount: inv.total_ttc,
            date: inv.due_date
          })),
          ...mandats.filter(m => m.status === 'en_cours' && m.end_date).map(m => ({
            id: `mand-${m.id}`, 
            type: 'mandat' as const, 
            title: m.title,
            date: m.end_date
          }))
        ];
        
        // Sort by date (closest first)
        deadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setUpcomingDeadlines(deadlines.slice(0, 5));

        // Set client info
        setClientInfo(clientRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const paymentProgress = stats.invoices.montantTotal > 0
    ? Math.round((stats.invoices.montantPaye / stats.invoices.montantTotal) * 100)
    : 0;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  })();

  return (
    <div className="space-y-6">

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 md:p-10 shadow-2xl"
      >
        {/* Déco circles */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-pink-500/10 blur-2xl" />

        <div className="relative z-10">
          {/* Mobile: compact row */}
          <div className="flex items-center justify-between sm:hidden">
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-0.5">{greeting} 👋</p>
              <h1 className="text-2xl font-black text-white leading-tight">
                {user?.client_name?.split(' ')[0] || 'Bienvenue'}
              </h1>
            </div>
            {stats.mandats.enCours > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-right">
                <p className="text-[9px] text-emerald-400 font-black uppercase">Actifs</p>
                <p className="text-white font-black text-lg leading-none flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {stats.mandats.enCours}
                </p>
              </div>
            )}
          </div>

          {/* Desktop: original layout */}
          <div className="hidden sm:flex sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-1">{greeting} 👋</p>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {user?.client_name?.split(' ')[0] || 'Bienvenue'}
              </h1>
              <p className="text-slate-400 mt-1.5 text-sm font-medium">
                Voici un aperçu de votre activité en temps réel
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {clientInfo && (
                <div className="bg-white/5 backdrop-blur border border-white/10 px-4 py-3 rounded-2xl">
                  <p className="text-[9px] text-orange-400 font-black uppercase tracking-widest">Client depuis</p>
                  <p className="text-white font-bold text-sm mt-0.5">
                    {new Date(clientInfo.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              )}
              {stats.mandats.enCours > 0 && (
                <div className="bg-emerald-500/10 backdrop-blur border border-emerald-500/20 px-4 py-3 rounded-2xl">
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Projets actifs</p>
                  <p className="text-white font-bold text-sm mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    {stats.mandats.enCours} en cours
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            label: 'Stratégies', value: stats.strategies.total,
            sub: `${stats.strategies.active} active${stats.strategies.active > 1 ? 's' : ''}`,
            icon: Target, href: '/client-portal/strategies',
            gradient: 'from-orange-400 to-pink-500', glow: 'shadow-orange-500/20',
            tag: 'bg-orange-50 text-orange-600',
          },
          {
            label: 'Mandats', value: stats.mandats.total,
            sub: `${stats.mandats.enCours} en cours`,
            icon: Briefcase, href: '/client-portal/mandats',
            gradient: 'from-blue-500 to-violet-500', glow: 'shadow-blue-500/20',
            tag: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Factures', value: stats.invoices.total,
            sub: `${stats.invoices.payees} payée${stats.invoices.payees > 1 ? 's' : ''}`,
            icon: FileText, href: '/client-portal/factures',
            gradient: 'from-purple-500 to-fuchsia-500', glow: 'shadow-purple-500/20',
            tag: 'bg-purple-50 text-purple-600',
          },
          {
            label: 'Total Facturé',
            value: stats.invoices.montantTotal.toLocaleString('fr-CH'),
            sub: 'CHF TTC',
            icon: DollarSign, href: '/client-portal/factures',
            gradient: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-500/20',
            tag: 'bg-emerald-50 text-emerald-600',
          },
        ].map((card, i) => (
          <Link key={i} href={card.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl border border-slate-200 p-4 md:p-5 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 md:mb-4 shadow-lg ${card.glow} group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <p className="text-xl md:text-2xl font-black text-slate-900 mb-0.5 truncate">{card.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 md:mb-3">{card.label}</p>
              <span className={`text-[10px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg ${card.tag}`}>{card.sub}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* ── Activité + Échéances ── */}
      <div className="grid gap-4 md:gap-5 lg:grid-cols-3">

        {/* Activité récente */}
        <div className="lg:col-span-2 bg-white rounded-2xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Activité Récente</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Dernières actions</p>
              </div>
            </div>
            <Link href="/client-portal/mandats">
              <span className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1">
                Tout voir <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="p-3 md:p-5 space-y-1 md:space-y-2">
            {recentActivity.length > 0 ? recentActivity.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl md:rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.type === 'strategy' ? 'bg-gradient-to-br from-orange-400 to-pink-500' :
                  item.type === 'invoice'  ? 'bg-gradient-to-br from-purple-500 to-fuchsia-500' :
                                             'bg-gradient-to-br from-blue-500 to-violet-500'
                }`}>
                  {item.type === 'strategy' && <Target className="w-4.5 h-4.5 text-white" />}
                  {item.type === 'invoice'  && <FileText className="w-4.5 h-4.5 text-white" />}
                  {item.type === 'mandat'   && <Briefcase className="w-4.5 h-4.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.action}</p>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">
                  {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </motion.div>
            )) : (
              <div className="text-center py-14">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400 font-semibold">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>

        {/* Échéances + progression */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-md shadow-rose-500/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Échéances</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">À venir</p>
              </div>
            </div>
            <Link href="/client-portal/calendrier-editorial">
              <span className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                Calendrier <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="p-3 md:p-5 space-y-2 flex-1">
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((dl, i) => {
              const days = Math.ceil((new Date(dl.date).getTime() - Date.now()) / 86400000);
              const urgent = days <= 7;
              return (
                <motion.div
                  key={dl.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
                    urgent ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-transparent hover:border-slate-200'
                  } transition-all`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    dl.type === 'invoice' ? 'bg-gradient-to-br from-purple-500 to-fuchsia-500' : 'bg-gradient-to-br from-blue-500 to-violet-500'
                  }`}>
                    {dl.type === 'invoice'
                      ? <FileText className="w-4 h-4 text-white" />
                      : <Briefcase className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{dl.title}</p>
                    {dl.amount && <p className="text-[10px] text-slate-500 mt-0.5">{dl.amount.toLocaleString('fr-CH')} CHF</p>}
                  </div>
                  <div className={`px-2.5 py-1.5 rounded-xl text-center flex-shrink-0 ${urgent ? 'bg-rose-600' : 'bg-slate-800'}`}>
                    <p className="text-sm font-black text-white leading-none">{days <= 0 ? '0' : days}</p>
                    <p className="text-[8px] text-white/70 uppercase font-bold">j</p>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400 font-semibold">Aucune échéance</p>
              </div>
            )}
          </div>

          {stats.invoices.montantTotal > 0 && (
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paiements reçus</span>
                <span className="text-xs font-black text-emerald-600">{paymentProgress}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${paymentProgress}%` }}
                  transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                <span>{stats.invoices.montantPaye.toLocaleString('fr-CH')} CHF</span>
                <span>{stats.invoices.montantTotal.toLocaleString('fr-CH')} CHF</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Accès rapides ── */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-1 h-7 bg-gradient-to-b from-orange-400 to-pink-500 rounded-full" />
          <div>
            <h3 className="font-black text-slate-900 text-base md:text-lg">Accès Rapides</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">Vos outils en un clic</p>
          </div>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory md:hidden">
          {[
            { label: 'Stratégies',  href: '/client-portal/strategies',          gradient: 'from-orange-400 to-pink-500',   icon: Target },
            { label: 'Factures',    href: '/client-portal/factures',             gradient: 'from-purple-500 to-fuchsia-500', icon: FileText },
            { label: 'Projets',     href: '/client-portal/mandats',              gradient: 'from-blue-500 to-violet-500',    icon: Briefcase },
            { label: 'Calendrier',  href: '/client-portal/calendrier-editorial', gradient: 'from-rose-400 to-red-500',       icon: Calendar },
            { label: 'Contact',     href: '/client-portal/contact',              gradient: 'from-emerald-400 to-teal-500',   icon: MessageSquare },
          ].map((a, i) => (
            <Link key={i} href={a.href} className="snap-start flex-shrink-0">
              <motion.div
                whileTap={{ scale: 0.94 }}
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-slate-50 active:bg-slate-100 border border-slate-100 w-[88px] text-center"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-md`}>
                  <a.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-slate-800 text-xs leading-tight">{a.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Stratégies',  href: '/client-portal/strategies',  gradient: 'from-orange-400 to-pink-500',   icon: Target },
            { label: 'Factures',    href: '/client-portal/factures',     gradient: 'from-purple-500 to-fuchsia-500', icon: FileText },
            { label: 'Projets',     href: '/client-portal/mandats',      gradient: 'from-blue-500 to-violet-500',    icon: Briefcase },
            { label: 'Contact',     href: '/client-portal/contact',      gradient: 'from-emerald-400 to-teal-500',   icon: MessageSquare },
          ].map((a, i) => (
            <Link key={i} href={a.href}>
              <motion.div
                whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-50 hover:bg-white border-2 border-transparent hover:border-slate-200 hover:shadow-lg transition-all cursor-pointer text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <a.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{a.label}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide flex items-center justify-center gap-0.5 mt-0.5 group-hover:text-orange-500 transition-colors">
                    Accéder <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
