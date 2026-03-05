"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  href?: string;
  gradient?: string;
  /** @deprecated kept for backward compat */
  lightBg?: string;
  /** @deprecated kept for backward compat */
  textColor?: string;
  tagClass?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  href,
  gradient = 'from-orange-400 to-pink-500',
  tagClass = 'bg-orange-50 text-orange-600',
  delay = 0,
}: StatCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative bg-white rounded-2xl border border-slate-200 p-4 md:p-5 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer overflow-hidden h-full"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-2xl font-black text-slate-900 mb-0.5 truncate">{value}</p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">{label}</p>
      {subtitle && (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg inline-block ${tagClass}`}>
          {subtitle}
        </span>
      )}
    </motion.div>
  );

  return href ? <Link href={href} className="h-full block">{content}</Link> : content;
}
