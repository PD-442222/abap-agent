import React from 'react';
import { cn } from '../../lib/utils.js';

export const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200',
      className,
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = 'Select';
