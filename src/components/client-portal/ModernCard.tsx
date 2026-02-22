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
}

export function ModernCard({
  title,
  subtitle,
  icon: Icon,
  gradient = 'from-orange-500 to-orange-600',
  headerAction,
  children,
  className = '',
  noPadding = false
}: ModernCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`form-section !p-0 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 sm:p-8 flex items-center justify-between border-b-2 border-slate-50">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs font-bold text-slate-500 uppercase">{subtitle}</p>
            )}
          </div>
        </div>
        
        {headerAction}
      </div>

      {/* Content */}
      <div className={noPadding ? '' : 'p-4 sm:p-6'}>
        {children}
      </div>
    </motion.div>
  );
}
