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
  iconGradient = 'from-slate-400 to-slate-500',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center py-16 px-6 max-w-md mx-auto"
    >
      <motion.div
        whileHover={{ scale: 1.08, rotate: 4 }}
        className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-xl shadow-slate-200 mb-6`}
      >
        <Icon className="w-10 h-10 text-white" />
      </motion.div>

      <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{description}</p>

      {action && <div>{action}</div>}
    </motion.div>
  );
}
