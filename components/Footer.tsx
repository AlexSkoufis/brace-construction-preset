'use client';

import { useEffect, useRef } from 'react';
import { company, nav } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Mark } from './Nav';
import { scrollToTarget } from './SmoothScroll';

/** Footer: hazard edge, offices, careers call, and a wordmark that stretches with scroll. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLParagraphElement>(null);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      // The wordmark widens from condensed to expanded as the footer arrives.
      const o = { w: 62 };
      gsap.to(o, {
        w: 125,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'bottom bottom', scrub: 0.6 },
        onUpdate: () => mark.current?.style.setProperty('--w', o.w.toFixed(1)),
      });
    });
  });

  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) mark.current?.style.setProperty('--w', '125');
  }, []);

  return (
    <footer id="footer" ref={root} className="ft">
      <div className="ft__top wrap">
        <div className="ft__brand">
          <a href="#top" className="nav__logo" onClick={(e) => (e.preventDefault(), scrollToTarget(0))}>
            <Mark />
            <span>{company.name}</span>
          </a>
          <p>{company.line}</p>
          <a href={`mailto:${company.email}`} className="ft__mail">
            {company.email}
          </a>
          <a href={company.phoneHref} className="ft__phone mono">
            {company.phone}
          </a>
        </div>
        {company.offices.map((o) => (
          <address key={o.city} className="ft__office">
            <p className="mono">{o.role}</p>
            <b>{o.city}</b>
            <span>{o.address}</span>
          </address>
        ))}
        <div className="ft__careers">
          <p className="mono">Careers</p>
          <b>We’re hiring site managers, engineers and apprentices.</b>
          <a href="#footer">Open roles →</a>
        </div>
      </div>
      <nav className="ft__nav wrap" aria-label="Footer">
        {nav.map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => (e.preventDefault(), scrollToTarget(n.href, { offset: -64 }))}>
            {n.label}
          </a>
        ))}
        <a href="#estimate" onClick={(e) => (e.preventDefault(), scrollToTarget('#estimate', { offset: -64 }))}>
          Estimate
        </a>
      </nav>
      <div className="ft__base wrap mono">
        <p>{company.disclaimer}</p>
        <p>
          © {new Date().getFullYear()} {company.full} · Concept by{' '}
          <a href={company.credit.href} target="_blank" rel="noreferrer">
            {company.credit.label}
          </a>
        </p>
      </div>
      <p ref={mark} className="ft__mark" aria-hidden="true">
        {company.name}
      </p>
    </footer>
  );
}
