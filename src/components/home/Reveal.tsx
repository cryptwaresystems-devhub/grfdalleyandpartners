import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

// Visible by default; progressive enhancement never blocks reading or focus.
export function Reveal({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  const element = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'visible' | 'pending'>('visible');
  useEffect(() => {
    const node = element.current;
    if (!node || typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (node.getBoundingClientRect().top <= window.innerHeight) return;
    setState('pending');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setState('visible'); observer.disconnect(); }
    }, { rootMargin: '0px 0px 40px 0px', threshold: 0.05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={element} className={`reveal ${className}`} data-reveal={state} onFocusCapture={() => setState('visible')}>{children}</div>;
}
