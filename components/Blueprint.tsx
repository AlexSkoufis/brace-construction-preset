'use client';

import { useRef, useState } from 'react';
import { blueprint } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

/**
 * Drawing ↔ built comparison. The same photograph is shown twice: as a blueprint
 * (inverted, high-contrast lines screened onto blueprint blue, with grid and dimension
 * annotations) and as built. A native range input drives the divider, so it works with
 * mouse, touch and keyboard (arrow keys) without custom drag code.
 */
export default function Blueprint() {
  const root = useRef<HTMLElement>(null);
  const [pos, setPos] = useState(50);
  const posRef = useRef(50);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      // On entry the divider sweeps across once, showing both states.
      const o = { v: 92 };
      gsap.to(o, {
        v: 50,
        duration: 2.2,
        ease: 'expo.inOut',
        onUpdate: () => {
          posRef.current = o.v;
          setPos(o.v);
        },
        scrollTrigger: { trigger: '.bp__stage', start: 'top 70%', once: true },
      });
      gsap.from('.bp__spec', { autoAlpha: 0, y: 20, stagger: 0.07, duration: 1, scrollTrigger: { trigger: '.bp__specs', start: 'top 90%', once: true } });
    });
  });

  return (
    <section id="blueprint" ref={root} className="bp" aria-labelledby="bp-title">
      <header className="bp__head wrap">
        <p className="label mono">
          <span>02</span> {blueprint.label}
        </p>
        <h2 id="bp-title" className="h2">
          {blueprint.title} <span className="hi">{blueprint.em}</span>
        </h2>
        <p className="bp__text">{blueprint.text}</p>
      </header>

      {/* Edge detection: greyscale → Laplacian kernel → amplify. Turns the photo into line work. */}
      <svg width="0" height="0" className="sr-only" aria-hidden="true">
        <filter id="bp-edge" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="4" />
            <feFuncG type="linear" slope="4" />
            <feFuncB type="linear" slope="4" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="bp__stage wrap-in" style={{ '--pos': `${pos}%` } as React.CSSProperties}>
        <div className="bp__built">
          <Img image={blueprint.image} alt={`${blueprint.project}, as built`} sizes="100vw" />
          <span className="bp__tag bp__tag--r mono">As built · Week 58</span>
        </div>
        <div className="bp__draw" aria-hidden="true">
          <Img image={blueprint.image} alt="" sizes="100vw" className="bp__lines" />
          <span className="bp__ink" />
          <span className="bp__grid" />
          <svg className="bp__notes" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <g className="bp__dim">
              <line x1="60" y1="500" x2="620" y2="500" />
              <line x1="60" y1="490" x2="60" y2="510" />
              <line x1="620" y1="490" x2="620" y2="510" />
              <text x="320" y="490">64.80 m</text>
              <line x1="30" y1="90" x2="30" y2="470" />
              <line x1="20" y1="90" x2="40" y2="90" />
              <line x1="20" y1="470" x2="40" y2="470" />
              <text x="44" y="285">36.00 m</text>
            </g>
            <g className="bp__lvl">
              {[0, 1, 2, 3, 4].map((k) => (
                <g key={k}>
                  <line x1="80" y1={470 - k * 95} x2="700" y2={470 - k * 95} />
                  <text x="706" y={474 - k * 95}>
                    LVL {String(k * 2).padStart(2, '0')} +{(k * 8).toFixed(2)}
                  </text>
                </g>
              ))}
            </g>
            <text x="60" y="548" className="bp__title">
              HARBOUR POINT — ELEVATION A · 1:200 · TENDER ISSUE
            </text>
          </svg>
          <span className="bp__tag mono">Tender drawing · Week 0</span>
        </div>

        <span className="bp__handle" aria-hidden="true">
          <i />
          <b>⟷</b>
        </span>
        <input
          className="bp__range"
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          aria-label="Compare tender drawing and finished building"
          aria-valuetext={`${Math.round(pos)}% drawing`}
          onChange={(e) => setPos(Number(e.target.value))}
        />
      </div>

      <dl className="bp__specs wrap">
        <div className="bp__spec">
          <dt className="mono">Project</dt>
          <dd>{blueprint.project}</dd>
        </div>
        {blueprint.specs.map((s) => (
          <div key={s.k} className="bp__spec">
            <dt className="mono">{s.k}</dt>
            <dd>{s.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
