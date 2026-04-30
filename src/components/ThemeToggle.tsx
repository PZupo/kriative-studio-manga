
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <button 
      onClick={() => setDark(!dark)} 
      className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 text-sm"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
