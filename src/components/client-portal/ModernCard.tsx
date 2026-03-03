"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  gradient?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  delay?: number;
}

export function ModernCard({
  title,
  subtitle,
  icon: Icon,
  gradient = 'from-orange-400 to-pink-500',
  headerAction,
  children,
  className = '',
  noPadding = false,
  delay = 0,
}: ModernCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-black text-slate-900 text-base leading-tight">{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
      </div>

      {/* Content */}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </motion.div>
  );
}
