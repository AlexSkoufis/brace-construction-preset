'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { projects, sectors } from '@/lib/content';
import { useGsap, MQ, ScrollTrigger } from '@/lib/motion';
import { Img } from './Img';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);

type Filter = (typeof sectors)[number];

/**
 * Projects grid with sector filters. Filtering uses GSAP Flip: the layout is captured
 * before React re-renders, then cards glide to their new cells while leavers fade out
 * and newcomers scale in. Reduced motion: cards simply appear/disappear.
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const flipState = useRef<Flip.FlipState | null>(null);

  const choose = (f: Filter) => {
    if (f === filter || !grid.current) return;
    if (window.matchMedia(MQ.motion).matches) flipState.current = Flip.getState(grid.current.querySelectorAll('.prj'));
    setFilter(f);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) {
      ScrollTrigger.refresh(); // reduced motion: no animation, still re-measure
      return;
    }
    flipState.current = null;
    Flip.from(state, {
      targets: grid.current.querySelectorAll('.prj'),
      duration: 0.8,
      ease: 'power3.inOut',
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.in' }),
      // The grid's height changed: re-measure every pinned/scrubbed section below it.
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.prj', { autoAlpha: 0, y: 50, stagger: 0.06, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.prj__grid', start: 'top 85%', once: true } });
    });
  });

  const count = (f: Filter) => (f === 'All' ? projects.length : projects.filter((p) => p.sector === f).length);

  return (
    <section id="projects" ref={root} className="projects" aria-labelledby="projects-title">
      <header className="projects__head wrap">
        <p className="label mono">
          <span>03</span> Selected projects
        </p>
        <h2 id="projects-title" className="h2">
          Built, handed over, <span className="hi">still standing.</span>
        </h2>
        <div className="filters" role="group" aria-label="Filter by sector">
          {sectors.map((s) => (
            <button key={s} className={s === filter ? 'on' : ''} aria-pressed={s === filter} onClick={() => choose(s)}>
              {s}
              <sup>{count(s)}</sup>
            </button>
          ))}
        </div>
      </header>

      <ul ref={grid} className="prj__grid wrap" aria-live="polite">
        {projects.map((p, i) => {
          const hidden = filter !== 'All' && p.sector !== filter;
          return (
            <li key={p.name} className={`prj${hidden ? ' is-hidden' : ''}${i === 0 ? ' prj--lead' : ''}`} data-flip-id={p.name} aria-hidden={hidden}>
              <a href="#estimate" tabIndex={hidden ? -1 : 0}>
                <div className="prj__media">
                  <Img image={p.image} alt={p.name} sizes="(min-width: 1024px) 33vw, 92vw" />
                  <span className="prj__sector mono">{p.sector}</span>
                  <span className="prj__go" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="prj__body">
                  <h3>{p.name}</h3>
                  <p className="mono">
                    {p.place} · {p.year}
                  </p>
                  <dl>
                    <div>
                      <dt className="mono">Value</dt>
                      <dd>{p.value}</dd>
                    </div>
                    <div>
                      <dt className="mono">Scale</dt>
                      <dd>{p.size}</dd>
                    </div>
                  </dl>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
