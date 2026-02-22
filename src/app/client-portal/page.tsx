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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate payment progress percentage
  const paymentProgress = stats.invoices.montantTotal > 0 
    ? Math.round((stats.invoices.montantPaye / stats.invoices.montantTotal) * 100) 
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Modern Header - Mobile optimized */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="form-section !p-6 sm:!p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              Bonjour, {user?.client_name?.split(' ')[0] || 'Client'} 👋
            </h1>
            <p className="text-slate-500 font-bold text-sm sm:text-lg uppercase tracking-wide">Voici un aperçu de votre activité</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {clientInfo && (
              <div className="bg-orange-50 px-4 py-2.5 rounded-2xl border-2 border-orange-100 flex-1 sm:flex-none">
                <div className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Client depuis</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {new Date(clientInfo.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}

            {stats.mandats.enCours > 0 && (
              <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border-2 border-emerald-100 flex-1 sm:flex-none">
                <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Projets actifs</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  {stats.mandats.enCours} en cours
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modern Stats Cards - Standardized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { 
            label: 'Stratégies', 
            value: stats.strategies.total, 
            sub: `${stats.strategies.active} active${stats.strategies.active > 1 ? 's' : ''}`, 
            icon: Target, 
            href: '/client-portal/strategies', 
            bgColor: 'from-orange-500 to-orange-600',
            lightBg: 'bg-orange-50',
            textColor: 'text-orange-600'
          },
          { 
            label: 'Mandats', 
            value: stats.mandats.total, 
            sub: `${stats.mandats.enCours} en cours`, 
            icon: Briefcase, 
            href: '/client-portal/mandats', 
            bgColor: 'from-blue-500 to-blue-600',
            lightBg: 'bg-blue-50',
            textColor: 'text-blue-600'
          },
          { 
            label: 'Factures', 
            value: stats.invoices.total, 
            sub: `${stats.invoices.payees} payée${stats.invoices.payees > 1 ? 's' : ''}`, 
            icon: FileText, 
            href: '/client-portal/factures', 
            bgColor: 'from-purple-500 to-purple-600',
            lightBg: 'bg-purple-50',
            textColor: 'text-purple-600'
          },
          { 
            label: 'Montant Total', 
            value: `${stats.invoices.montantTotal.toLocaleString('fr-CH')}`, 
            sub: 'CHF TTC', 
            icon: DollarSign, 
            href: '/client-portal/factures', 
            bgColor: 'from-emerald-500 to-emerald-600',
            lightBg: 'bg-emerald-50',
            textColor: 'text-emerald-600'
          }
        ].map((stat, i) => (
          <Link href={stat.href} key={i}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="form-section !p-4 sm:!p-6 border-none hover:shadow-lg transition-all cursor-pointer h-full group"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              
              <div className="mb-3">
                <div className="text-xl sm:text-2xl font-black text-slate-900 mb-0.5 truncate">{stat.value}</div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
                
              <div className={`text-[10px] font-black ${stat.textColor} ${stat.lightBg} px-2.5 py-1 rounded-lg uppercase tracking-tight`}>
                {stat.sub}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Activity and Deadlines */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="form-section !p-0 overflow-hidden lg:col-span-2">
          <div className="p-6 sm:p-8 flex items-center justify-between border-b-2 border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Activité Récente</h3>
                <p className="text-xs font-bold text-slate-500 uppercase">Dernières actions</p>
              </div>
            </div>
            
            <Link href="/client-portal/mandats">
              <span className="btn btn-secondary !py-2 !px-4 text-xs font-black uppercase tracking-wider">
                Tout voir
              </span>
            </Link>
          </div>

          <div className="p-4 sm:p-6 space-y-3">
            {recentActivity.length > 0 ? recentActivity.slice(0, 4).map((activity, i) => (
              <motion.div 
                key={activity.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }} 
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  activity.type === 'strategy' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                  activity.type === 'invoice' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 
                  'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                  {activity.type === 'strategy' && <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  {activity.type === 'invoice' && <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  {activity.type === 'mandat' && <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 text-sm sm:text-base truncate">{activity.title}</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">{activity.action}</p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-black text-slate-900">
                    {new Date(activity.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    {new Date(activity.date).toLocaleDateString('fr-FR', { year: 'numeric' })}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs">Aucune activité récente</div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="form-section !p-0 overflow-hidden">
          <div className="p-6 sm:p-8 flex items-center justify-between border-b-2 border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Échéances</h3>
                <p className="text-xs font-bold text-slate-500 uppercase">À venir</p>
              </div>
            </div>
            
            <Link href="/client-portal/calendrier">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                Calendrier
              </span>
            </Link>
          </div>

          <div className="p-4 sm:p-6 space-y-3">
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((deadline, i) => {
              const daysLeft = Math.ceil((new Date(deadline.date).getTime() - Date.now()) / 86400000);
              const isUrgent = daysLeft <= 7;
              
              return (
                <motion.div 
                  key={deadline.id} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isUrgent 
                      ? 'bg-rose-50 border-rose-200' 
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    deadline.type === 'invoice' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {deadline.type === 'invoice' ? <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm truncate">{deadline.title}</p>
                    {deadline.amount && <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">{deadline.amount.toLocaleString('fr-CH')} CHF</p>}
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-xl text-center flex-shrink-0 min-w-[50px] ${
                    isUrgent ? 'bg-rose-600' : 'bg-slate-900'
                  }`}>
                    <p className="text-base font-black text-white leading-tight">
                      {daysLeft <= 0 ? '0j' : `${daysLeft}j`}
                    </p>
                    <p className="text-[8px] font-bold text-white/80 uppercase">
                      Restant
                    </p>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase">Aucune échéance</p>
              </div>
            )}
          </div>

          {/* Payment Progress */}
          {stats.invoices.montantTotal > 0 && (
            <div className="mt-4 p-6 bg-slate-50/50 border-t-2 border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paiements reçus</span>
                <span className="text-xs font-black text-emerald-600">{paymentProgress}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${paymentProgress}%` }} 
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" 
                />
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase">
                <span>{stats.invoices.montantPaye.toLocaleString('fr-CH')} CHF</span>
                <span>{stats.invoices.montantTotal.toLocaleString('fr-CH')} CHF</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="form-section !p-6 sm:!p-8">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
            Actions Rapides
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase mt-1">Accédez à vos outils</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { label: 'Stratégies', href: '/client-portal/strategies', gradient: 'from-orange-500 to-orange-600', icon: Target },
            { label: 'Factures', href: '/client-portal/factures', gradient: 'from-purple-500 to-purple-600', icon: FileText },
            { label: 'Mandats', href: '/client-portal/mandats', gradient: 'from-blue-500 to-blue-600', icon: Briefcase },
            { label: 'Contact', href: '/client-portal/contact', gradient: 'from-emerald-500 to-emerald-600', icon: MessageSquare },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <motion.div 
                whileHover={{ y: -4 }} 
                whileTap={{ scale: 0.98 }}
                className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50/10 transition-all group flex flex-col items-center sm:items-start text-center sm:text-left"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight">{action.label}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1 group-hover:text-orange-600 transition-colors">
                  Accéder <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
