'use client';

import { useMemo, useRef, useState } from 'react';
import { estimator } from '@/lib/content';
import { gsap, useGsap, MQ } from '@/lib/motion';
import { Img } from './Img';

const STEPS = ['Project', 'Size', 'Spec', 'Contact'] as const;
const eur = (n: number) => '€' + (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : Math.round(n / 1000) + 'k');

/**
 * Four-step estimator: type → size → spec → contact. The summary on the right updates
 * live with an indicative cost range and build time. Demo only — nothing is sent.
 */
export default function Estimator() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [type, setType] = useState(estimator.types[0].id);
  const [area, setArea] = useState(6000);
  const [floors, setFloors] = useState(5);
  const [finish, setFinish] = useState(estimator.finishes[0].id);
  const [start, setStart] = useState('Next quarter');
  const [sent, setSent] = useState(false);

  const est = useMemo(() => {
    const t = estimator.types.find((x) => x.id === type)!;
    const f = estimator.finishes.find((x) => x.id === finish)!;
    const heightFactor = 1 + Math.max(0, floors - 6) * 0.015; // taller buildings cost more per m²
    const mid = area * t.rate * f.factor * heightFactor;
    const weeks = Math.round(10 + (area / 1000) * t.weeksPer1k * Math.sqrt(f.factor) + floors * 0.8);
    return { low: mid * 0.9, high: mid * 1.12, weeks, type: t, finish: f };
  }, [type, area, floors, finish]);

  useGsap(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('.est__card, .est__sum', { autoAlpha: 0, y: 40, stagger: 0.1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.est__grid', start: 'top 85%', once: true } });
    });
  });

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <section id="estimate" ref={root} className="est" aria-labelledby="est-title">
      <header className="est__head wrap">
        <p className="label mono">
          <span>06</span> {estimator.label}
        </p>
        <h2 id="est-title" className="h2">
          {estimator.title} <span className="hi">{estimator.em}</span>
        </h2>
      </header>

      <div className="est__grid wrap">
        <div className="est__card">
          <ol className="est__steps" aria-label="Steps">
            {STEPS.map((s, i) => (
              <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>
                <button onClick={() => i <= step && setStep(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span> {s}
                </button>
              </li>
            ))}
          </ol>

          {sent ? (
            <div className="est__panel">
              <p className="est__thanks">{estimator.thanks}</p>
            </div>
          ) : (
            <form
              className="est__panel"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < STEPS.length - 1) next();
                else setSent(true);
              }}
            >
              {step === 0 && (
                <fieldset>
                  <legend>What are you building?</legend>
                  <div className="est__types">
                    {estimator.types.map((t) => (
                      <label key={t.id} className={`est__type${type === t.id ? ' on' : ''}`}>
                        <input type="radio" name="type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} />
                        <span className="est__type-img">
                          <Img image={t.image} alt="" sizes="200px" />
                        </span>
                        <span>{t.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {step === 1 && (
                <fieldset>
                  <legend>How big?</legend>
                  <label className="est__range">
                    <span>
                      Gross floor area <b>{area.toLocaleString('en-US')} m²</b>
                    </span>
                    <input type="range" min={500} max={50000} step={500} value={area} onChange={(e) => setArea(Number(e.target.value))} />
                  </label>
                  <label className="est__range">
                    <span>
                      Floors above ground <b>{floors}</b>
                    </span>
                    <input type="range" min={1} max={30} step={1} value={floors} onChange={(e) => setFloors(Number(e.target.value))} />
                  </label>
                </fieldset>
              )}
              {step === 2 && (
                <fieldset>
                  <legend>Specification</legend>
                  <div className="est__seg" role="radiogroup" aria-label="Finish level">
                    {estimator.finishes.map((f) => (
                      <label key={f.id} className={finish === f.id ? 'on' : ''}>
                        <input type="radio" name="finish" value={f.id} checked={finish === f.id} onChange={() => setFinish(f.id)} />
                        {f.name}
                      </label>
                    ))}
                  </div>
                  <label className="est__select">
                    <span>Target start on site</span>
                    <select value={start} onChange={(e) => setStart(e.target.value)}>
                      {['This quarter', 'Next quarter', 'In 6 months', 'Within a year', 'Not sure yet'].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                </fieldset>
              )}
              {step === 3 && (
                <fieldset>
                  <legend>Where should we send the estimate?</legend>
                  <div className="est__fields">
                    <label>
                      <span>Name</span>
                      <input required autoComplete="name" />
                    </label>
                    <label>
                      <span>Work email</span>
                      <input type="email" required autoComplete="email" />
                    </label>
                    <label className="wide">
                      <span>Company</span>
                      <input autoComplete="organization" />
                    </label>
                    <label className="wide">
                      <span>Anything we should know?</span>
                      <textarea rows={3} />
                    </label>
                  </div>
                </fieldset>
              )}
              <div className="est__nav">
                {step > 0 && (
                  <button type="button" className="btn btn--ghost-dark" onClick={back}>
                    ← Back
                  </button>
                )}
                <button type="submit" className="btn btn--hi">
                  {step < STEPS.length - 1 ? 'Continue →' : 'Send my estimate'}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="est__sum" aria-live="polite" aria-label="Estimate summary">
          <p className="mono est__sum-k">Indicative estimate</p>
          <p className="est__sum-v">
            {eur(est.low)} <span>–</span> {eur(est.high)}
          </p>
          <dl>
            <div>
              <dt className="mono">Type</dt>
              <dd>{est.type.name}</dd>
            </div>
            <div>
              <dt className="mono">Area</dt>
              <dd>{area.toLocaleString('en-US')} m² · {floors} floors</dd>
            </div>
            <div>
              <dt className="mono">Spec</dt>
              <dd>{est.finish.name}</dd>
            </div>
            <div>
              <dt className="mono">Build time</dt>
              <dd>≈ {est.weeks} weeks on site</dd>
            </div>
            <div>
              <dt className="mono">Start</dt>
              <dd>{start}</dd>
            </div>
          </dl>
          <p className="est__fine mono">Ballpark only, excl. land, fees and VAT. Demo figures.</p>
        </aside>
      </div>
    </section>
  );
}
