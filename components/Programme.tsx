'use client';

import { useRef, useState } from 'react';
import { programme } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';

const W = programme.weeks;
const TICKS = Array.from({ length: W / 4 + 1 }, (_, i) => i * 4);

/**
 * Process as a live programme (Gantt chart). Pinned; scrolling moves the "today" line
 * across 64 weeks, each phase bar fills as it progresses, and a readout reports the week,
 * the phases on site now and overall completion. Reduced motion: the finished chart.
 */
export default function Programme() {
  const root = useRef<HTMLElement>(null);
  const [week, setWeek] = useState(W);
  const weekRef = useRef(W);

  useGsap(root, () => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      el.classList.add('is-pinned');
      const fills = [...el.querySelectorAll<HTMLElement>('.gantt__fill')];
      const today = el.querySelector<HTMLElement>('.gantt__today')!;
      const apply = (t: number) => {
        today.style.left = `${(t / W) * 100}%`;
        programme.phases.forEach((p, i) => {
          const f = Math.max(0, Math.min(1, (t - p.from) / (p.to - p.from)));
          fills[i].style.transform = `scaleX(${f})`;
          fills[i].parentElement!.classList.toggle('is-live', t > p.from && t < p.to);
        });
        const wk = Math.round(t);
        if (wk !== weekRef.current) {
          weekRef.current = wk;
          setWeek(wk);
        }
      };
      apply(0);
      const o = { t: 0 };
      gsap.to(o, {
        t: W,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        onUpdate: () => apply(o.t),
      });
      return () => {
        el.classList.remove('is-pinned');
        apply(W);
      };
    });
  });

  const live = programme.phases.filter((p) => week > p.from && week < p.to);
  const done = programme.phases.reduce((a, p) => a + Math.max(0, Math.min(1, (week - p.from) / (p.to - p.from))) * (p.to - p.from), 0);
  const total = programme.phases.reduce((a, p) => a + (p.to - p.from), 0);

  return (
    <section id="process" ref={root} className="prog" aria-labelledby="prog-title">
      <div className="prog__stage">
        <header className="prog__head wrap">
          <div>
            <p className="label mono">
              <span>04</span> {programme.label}
            </p>
            <h2 id="prog-title" className="h2">
              {programme.title} <span className="hi">{programme.em}</span>
            </h2>
          </div>
          <div className="prog__readout" aria-live="polite">
            <p className="prog__week">
              <span className="mono">Week</span>
              <b>{String(week).padStart(2, '0')}</b>
              <span className="mono">/ {W}</span>
            </p>
            <p className="prog__pct mono">{Math.round((done / total) * 100)}% complete</p>
            <p className="prog__live mono">{live.length ? `On site: ${live.map((p) => p.name).join(' · ')}` : week >= W ? 'Handed over' : 'Mobilising'}</p>
          </div>
        </header>

        <div className="gantt wrap" role="table" aria-label={`Typical programme, ${W} weeks`}>
          <div className="gantt__axis" role="row" aria-hidden="true">
            <span className="gantt__label" />
            <div className="gantt__track">
              {TICKS.map((t) => (
                <span key={t} className="gantt__tick mono" style={{ left: `${(t / W) * 100}%` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {programme.phases.map((p) => (
            <div key={p.name} className="gantt__row" role="row">
              <span className="gantt__label" role="rowheader">
                <b>{p.name}</b>
                <small>{p.note}</small>
              </span>
              <div className="gantt__track" role="cell" aria-label={`Weeks ${p.from} to ${p.to}`}>
                <span className="gantt__bar" style={{ left: `${(p.from / W) * 100}%`, width: `${((p.to - p.from) / W) * 100}%` }}>
                  <span className="gantt__fill" />
                  <span className="gantt__wk mono">
                    w{p.from}–{p.to}
                  </span>
                </span>
              </div>
            </div>
          ))}
          <div className="gantt__todaywrap" aria-hidden="true">
            <span className="gantt__label" />
            <div className="gantt__track">
              <span className="gantt__today">
                <em className="mono">Today</em>
              </span>
            </div>
          </div>
          <p className="prog__text">{programme.text}</p>
        </div>
      </div>
    </section>
  );
}
