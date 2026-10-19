'use client';

import { useRef, useState } from 'react';
import { services } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

/**
 * Services as a large accordion. One row open at a time; the open row reveals its detail
 * and the photograph beside the list switches to match. Built on <button aria-expanded>
 * so it works with keyboard and screen readers; height animates via CSS grid rows.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.svc', { autoAlpha: 0, y: 40, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.svc__list', start: 'top 85%', once: true } });
      gsap.from('.services__title .l > span', { yPercent: 110, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.services__title', start: 'top 85%', once: true } });
    });
  });

  return (
    <section id="services" ref={root} className="services" aria-labelledby="services-title">
      <header className="services__head wrap">
        <p className="label mono">
          <span>01</span> What we build
        </p>
        <h2 id="services-title" className="services__title h2">
          <span className="l">
            <span>Five trades.</span>
          </span>
          <span className="l">
            <span className="hi">One contract.</span>
          </span>
        </h2>
      </header>
      <div className="services__grid wrap">
        <ol className="svc__list">
          {services.map((s, i) => {
            const isOpen = i === open;
            return (
              <li key={s.no} className={`svc${isOpen ? ' is-open' : ''}`}>
                <h3>
                  <button id={`svc-b-${i}`} aria-expanded={isOpen} aria-controls={`svc-p-${i}`} onClick={() => setOpen(isOpen ? -1 : i)} onPointerEnter={() => window.matchMedia(MQ.fine).matches && setOpen(i)}>
                    <span className="svc__no mono">{s.no}</span>
                    <span className="svc__title">{s.title}</span>
                    <span className="svc__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`svc-p-${i}`} role="region" aria-labelledby={`svc-b-${i}`} className="svc__panel">
                  <div className="svc__inner">
                    <p>{s.text}</p>
                    <ul className="svc__points">
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <div className="svc__thumb">
                      <Img image={s.image} alt="" sizes="92vw" />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="services__photo" aria-hidden="true">
          {services.map((s, i) => (
            <div key={s.no} className={`services__img${i === Math.max(0, open) ? ' on' : ''}`}>
              <Img image={s.image} alt="" sizes="(min-width: 1024px) 40vw, 1px" />
            </div>
          ))}
          <span className="services__tag mono">
            {services[Math.max(0, open)].no} / {String(services.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
