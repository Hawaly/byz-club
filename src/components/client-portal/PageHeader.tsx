"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  gradient?: string;
  actions?: React.ReactNode;
  /** @deprecated use icon instead */
  emoji?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  gradient = 'from-orange-400 to-pink-500',
  actions,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 md:px-10 md:py-8 mb-4 md:mb-6 shadow-2xl"
    >
      {/* Déco */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl flex-shrink-0`}>
              <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-xl md:text-3xl font-black text-white leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-slate-400 text-sm font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
        )}
      </div>
    </motion.div>
  );
}
