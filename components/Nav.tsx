'use client';

import { useEffect, useState } from 'react';
import { company, nav } from '@/lib/content';
import { getLenis, scrollToTarget } from './SmoothScroll';

/** Brand mark: a steel angle bracket — the thing that holds a frame together. */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      <path d="M2 2 H8 V14 H20 V20 H2 Z" />
      <rect x="11" y="2" width="9" height="9" className="mark__hi" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 30);
      // White nav while the bar still overlaps the full-bleed hero photo.
      const hero = document.getElementById('top');
      setOnHero(!!hero && hero.getBoundingClientRect().bottom > 64);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(href, { offset: -64 }), open ? 150 : 0);
  };

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${onHero ? ' on-hero' : ''}${open ? ' is-open' : ''}`}>
      <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')} aria-label={`${company.full} — home`}>
        <Mark />
        <span>{company.name}</span>
      </a>
      <nav className="nav__links" aria-label="Primary">
        {nav.map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)}>
            {n.label}
          </a>
        ))}
      </nav>
      <div className="nav__aux">
        <a href={company.phoneHref} className="nav__phone">
          {company.phone}
        </a>
        <a href="#estimate" className="nav__cta" onClick={(e) => go(e, '#estimate')}>
          Get an estimate
        </a>
        <button className="nav__burger" aria-expanded={open} aria-controls="mnav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          <i />
          <i />
        </button>
      </div>
      <div id="mnav" className="nav__sheet" hidden={!open}>
        {nav.map((n, i) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} style={{ '--i': i } as React.CSSProperties}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {n.label}
          </a>
        ))}
        <a href="#estimate" className="nav__sheet-cta" onClick={(e) => go(e, '#estimate')}>
          Get an estimate →
        </a>
      </div>
    </header>
  );
}
