import React from 'react';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  fullWidthMobile?: boolean; // w-full on mobile if true
  tooltip?: string;
}

export default function GhostButton({ children, onClick, className = '', ariaLabel, icon, fullWidthMobile = false, tooltip }: Props) {
  const widthClass = fullWidthMobile ? 'w-full sm:w-auto' : 'w-auto';

  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${widthClass} mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 px-3 py-2 h-10 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 font-medium border border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800`}
      >
        {icon}
        <span className="text-sm font-normal">{children}</span>
      </button>

      {tooltip && (
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 bg-slate-800 dark:bg-slate-700 text-slate-200 dark:text-slate-300 px-3 py-1 text-xs rounded whitespace-nowrap pointer-events-none z-10 shadow-lg">
          {tooltip}
        </span>
      )}
    </div>
  );
}
