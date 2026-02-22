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
  lightBg?: string;
  textColor?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  href,
  gradient = 'from-orange-500 to-orange-600',
  lightBg = 'bg-orange-50',
  textColor = 'text-orange-600',
  delay = 0
}: StatCardProps) {
  const content = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="form-section !p-4 sm:!p-6 border-none hover:shadow-lg transition-all cursor-pointer h-full group"
    >
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </div>
      
      <div className="mb-3">
        <div className="text-xl sm:text-2xl font-black text-slate-900 mb-0.5 truncate">{value}</div>
        <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</div>
      </div>
      
      {subtitle && (
        <div className={`text-[10px] font-black ${textColor} ${lightBg} px-2.5 py-1 rounded-lg uppercase tracking-tight inline-block`}>
          {subtitle}
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
