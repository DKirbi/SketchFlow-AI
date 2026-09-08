import { useEffect, useState } from 'react';

function readVar(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Re-read a LOFI CSS variable when `html` theme attributes change. */
export function useLofiCssVar(name: string): string {
  const [value, setValue] = useState(() => readVar(name));

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setValue(readVar(name));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
    return () => observer.disconnect();
  }, [name]);

  return value;
}
