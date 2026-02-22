"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  emoji?: string;
  gradient?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  emoji,
  gradient = 'from-orange-500 to-amber-500',
  actions 
}: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="form-section !p-6 sm:!p-8 mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              {emoji && <span className="text-2xl">{emoji}</span>}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
