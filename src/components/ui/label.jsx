import React from 'react';
import { cn } from '../../lib/utils.js';

export function Label({ className, children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className={cn('block text-sm font-medium text-slate-700', className)}>
      {children}
    </label>
  );
}
