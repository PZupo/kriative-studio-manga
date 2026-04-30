
import React from 'react';

export default function UserProfileMenu({ name, planLabel }: { name: string, planLabel: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 py-1.5 rounded-full">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold opacity-50 uppercase">{name}</span>
        <span className="text-[9px] text-brand-teal font-black">{planLabel}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
        {name.charAt(0)}
      </div>
    </div>
  );
}
