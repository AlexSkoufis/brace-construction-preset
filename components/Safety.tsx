'use client';

import { useEffect, useRef, useState } from 'react';
import { clients, company, safety, testimonial } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import Odometer from './Odometer';

const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso + 'T00:00:00').getTime()) / 86_400_000);

/** Safety & sustainability: live days-without-incident odometer, hazard-tape marquee, certs, carbon, client voice. */
export default function Safety() {
  const root = useRef<HTMLElement>(null);
  // Start from a fixed value so server and client agree; the real count arrives after mount.
  const [days, setDays] = useState(1000);

  useEffect(() => {
    setDays(daysSince(company.lastIncident));
    const id = window.setInterval(() => setDays(daysSince(company.lastIncident)), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.cert, .green__item', { autoAlpha: 0, y: 30, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.safety__grid', start: 'top 85%', once: true } });
      gsap.from('.voice blockquote', { autoAlpha: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.voice', start: 'top 85%', once: true } });
    });
  });

  const tape = [...safety.stripe, ...safety.stripe];

  return (
    <section id="safety" ref={root} className="safety" aria-labelledby="safety-title">
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...tape, ...tape].map((t, i) => (
            <span key={i}>
              <i /> {t}
            </span>
          ))}
        </div>
      </div>

      <div className="safety__top wrap">
        <div>
          <p className="label mono">
            <span>05</span> {safety.label}
          </p>
          <h2 id="safety-title" className="h2">
            {safety.title} <span className="hi">{safety.em}</span>
          </h2>
          <p className="safety__text">{safety.text}</p>
        </div>
        <div className="counter">
          <p className="counter__k mono">Days without a lost-time incident</p>
          <p className="counter__v">
            <Odometer value={days} />
          </p>
          <p className="counter__note mono">Across all 23 active sites · updated live</p>
        </div>
      </div>

      <div className="safety__grid wrap">
        <ul className="certs" aria-label="Certifications">
          {safety.certs.map((c) => (
            <li key={c.code} className="cert">
              <b>{c.code}</b>
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
        <dl className="green">
          {safety.green.map((g) => (
            <div key={g.k} className="green__item">
              <dd>{g.v}</dd>
              <dt>{g.k}</dt>
            </div>
          ))}
        </dl>
      </div>

      <figure className="voice wrap">
        <blockquote>“{testimonial.quote}”</blockquote>
        <figcaption className="mono">
          <b>{testimonial.who}</b> — {testimonial.role}
        </figcaption>
      </figure>

      <div className="clients" aria-label="Clients">
        <div className="clients__track">
          {[...clients, ...clients].map((c, i) => (
            <span key={i} aria-hidden={i >= clients.length || undefined}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
