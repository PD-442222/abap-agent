import React from 'react';
import { cn } from '../../lib/utils.js';

export function Card({ className, children }) {
  return <div className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>;
}

export function CardHeader({ className, children }) {
  return <div className={cn('border-b border-slate-200 px-6 py-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-semibold text-slate-900', className)}>{children}</h3>;
}

export function CardContent({ className, children }) {
  return <div className={cn('px-6 py-4 space-y-3', className)}>{children}</div>;
}
