'use client';

import { useEffect, useRef } from 'react';
import { hero, stats } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';
import Odometer from './Odometer';
import { scrollToTarget } from './SmoothScroll';

const W_MIN = 68;
const W_MAX = 125;
const W_REST = 88;
const FLOORS = 8;
const FLOOR_M = 4; // metres per level, for the readout
// On portrait screens the landscape photo covers a tall stage, so it renders much wider than the viewport.
const HERO_SIZES = '(orientation: portrait) 170vh, 100vw';

/**
 * Hero — "blueprint to building".
 * 1. The photograph first appears as a blueprint (SVG edge filter on blueprint blue).
 * 2. It is then built floor by floor: an amber construction line rises, revealing the real
 *    photo level by level while a readout reports level, height and structure progress.
 * 3. Scrolling pins the stage and the rounded frame expands to full bleed as the headline lifts.
 * The headline letters swell and compress around the pointer (variable width axis).
 * Reduced motion: the finished photo in a static frame.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const scanLabel = useRef<HTMLElement>(null);
  const progress = useRef<HTMLElement>(null);

  // Kinetic headline (variable width follows the pointer; slow wave on touch).
  useEffect(() => {
    const h = title.current;
    if (!h || !window.matchMedia(MQ.motion).matches) return;
    const letters = [...h.querySelectorAll<HTMLElement>('.k')];
    const cur = letters.map(() => W_REST);
    let mx: number | null = null;
    let raf = 0;
    const fine = window.matchMedia(MQ.fine).matches;
    const el = root.current!;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') mx = e.clientX;
    };
    const onLeave = () => (mx = null);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    const tick = (t: number) => {
      letters.forEach((l, i) => {
        let target = W_REST;
        const r = l.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        if (mx !== null) {
          const d = (mx - cx) / (window.innerWidth * 0.16);
          target = W_MIN + (W_MAX - W_MIN) * Math.exp(-d * d);
        } else if (!fine) {
          target = W_REST + Math.sin(t / 900 - cx / 180) * 16;
        }
        cur[i] += (target - cur[i]) * 0.12;
        l.style.setProperty('--w', cur[i].toFixed(1));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useGsap(root, () => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const f = frame.current!;
      gsap.set(f, { '--cut': '100%' });

      const setReadout = (cut: number) => {
        const built = (100 - cut) / 100; // 0..1
        const lvl = Math.min(FLOORS, Math.floor(built * FLOORS + 0.001));
        if (scanLabel.current) scanLabel.current.textContent = `LVL ${String(lvl).padStart(2, '0')} · +${(lvl * FLOOR_M).toFixed(2)} m`;
        if (progress.current) progress.current.textContent = built >= 0.999 ? 'Topped out ✓' : `Structure ${Math.round(built * 100)}%`;
      };
      setReadout(100);

      // Intro: headline rises, blueprint fades in, then the building goes up floor by floor.
      const o = { cut: 100 };
      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .from('.hero__mask .hero__line', { yPercent: 105, stagger: 0.1, duration: 1.2, ease: 'expo.out' })
        .from('.hero__kicker, .hero__side > *', { autoAlpha: 0, y: 20, stagger: 0.07, duration: 1 }, 0.4)
        .from('.hero__blue', { autoAlpha: 0, scale: 1.04, duration: 1.2, ease: 'power2.out' }, 0.3)
        .from('.hero__chip', { autoAlpha: 0, y: 12, stagger: 0.1, duration: 0.7 }, 0.9)
        .set('.hero__scan', { autoAlpha: 1 }, 1.1);
      for (let k = 1; k <= FLOORS; k++) {
        intro.to(o, {
          cut: 100 - (k / FLOORS) * 100,
          duration: 0.26,
          ease: 'power3.inOut',
          onUpdate: () => {
            f.style.setProperty('--cut', `${o.cut}%`);
            setReadout(o.cut);
          },
        }, k === 1 ? 1.2 : '+=0.09');
      }
      intro
        .to('.hero__scan', { autoAlpha: 0, duration: 0.4 }, '+=0.15')
        .to('.hero__chip--progress', { backgroundColor: '#14161a', color: '#ffffff', duration: 0.4 }, '<')
        .fromTo('.hero__built picture', { scale: 1.06 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, '<');

      // Scroll: the photo drifts (parallax) while the copy lifts and fades.
      const st = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
      st.fromTo('.hero__built picture, .hero__blue picture', { yPercent: 0 }, { yPercent: 12, duration: 1 }, 0)
        .to(top.current, { yPercent: -18, autoAlpha: 0, duration: 0.7 }, 0)
        .to('.hero__chips', { yPercent: -60, autoAlpha: 0, duration: 0.5 }, 0);

      // Pointer parallax on the photograph.
      const px = gsap.quickTo('.hero__shift', 'x', { duration: 1, ease: 'power3.out' });
      const py = gsap.quickTo('.hero__shift', 'y', { duration: 1, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        px((e.clientX / window.innerWidth - 0.5) * -24);
        py((e.clientY / window.innerHeight - 0.5) * -16);
      };
      window.addEventListener('pointermove', move, { passive: true });
      return () => window.removeEventListener('pointermove', move);
    });

    mm.add(MQ.motion, () => {
      gsap.from('.hero__stat', { autoAlpha: 0, y: 30, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.hero__stats', start: 'top 90%', once: true } });
    });
  });

  return (
    <>
      <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
        {/* Edge detection for the blueprint layer: greyscale → Laplacian → amplify. */}
        <svg width="0" height="0" className="sr-only" aria-hidden="true">
          <filter id="hero-edge" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="4" />
              <feFuncG type="linear" slope="4" />
              <feFuncB type="linear" slope="4" />
            </feComponentTransfer>
          </filter>
        </svg>

        <div ref={frame} className="hero__frame">
          <div className="hero__shift">
            <div className="hero__blue" aria-hidden="true">
              <Img image="hero" alt="" sizes={HERO_SIZES} className="hero__lines" />
              <span className="hero__ink" />
              <span className="hero__grid" />
            </div>
            <div className="hero__built">
              <Img image="hero" alt="Tower crane over a concrete frame under construction" sizes={HERO_SIZES} priority />
            </div>
          </div>
          <span className="hero__shade" aria-hidden="true" />
          <span className="hero__scan" aria-hidden="true">
            <em ref={scanLabel}>LVL 00 · +0.00 m</em>
          </span>
        </div>

        <div className="hero__chips wrap">
          <span className="hero__chip">
            <i aria-hidden="true" /> Harbour Point · Rotterdam
          </span>
          <span className="hero__chip hero__chip--progress" aria-hidden="true">
            <b ref={progress}>Topped out ✓</b>
          </span>
          <span className="hero__chip">
            <i className="live" aria-hidden="true" /> 23 sites active today
          </span>
        </div>

        <div ref={top} className="hero__top wrap">
          <div className="hero__head">
            <p className="hero__kicker mono">{hero.kicker}</p>
            <h1 id="hero-title" ref={title} className="hero__title" aria-label={hero.words.join(' ')}>
              {hero.words.map((w, i) => (
                <span key={w} className={`hero__mask${i === 1 ? ' hero__mask--hi' : ''}`} aria-hidden="true">
                  <span className="hero__line">
                    {[...w].map((c, j) => (
                      <span key={j} className="k">
                        {c === ' ' ? ' ' : c}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>
          </div>
          <div className="hero__side">
            <p className="hero__lede">{hero.lede}</p>
            <div className="hero__ctas">
              <a href="#estimate" className="btn btn--light" onClick={(e) => (e.preventDefault(), scrollToTarget('#estimate', { offset: -64 }))}>
                {hero.primary} <span aria-hidden="true">→</span>
              </a>
              <a href="#projects" className="btn btn--glass" onClick={(e) => (e.preventDefault(), scrollToTarget('#projects', { offset: -64 }))}>
                {hero.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      <dl className="hero__stats wrap">
        {stats.map((s) => (
          <div key={s.label} className="hero__stat">
            <dt className="mono">{s.label}</dt>
            <dd>
              <Odometer value={s.value} decimals={s.decimals} />
              <span className="hero__suffix">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
