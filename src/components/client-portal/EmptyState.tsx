"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconGradient?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  iconGradient = 'from-slate-500 to-slate-600',
  action
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="form-section !p-8 sm:!p-10 text-center max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-xl mb-6`}
        >
          <Icon className="w-12 h-12 text-white" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        
        <p className="text-slate-600 text-base mb-6 max-w-lg">
          {description}
        </p>
        
        {action && (
          <div className="mt-2">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}
