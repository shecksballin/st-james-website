import Reveal from './Reveal.jsx';
import { SITE } from '../data/site.js';
import './Gram.css';

/* Instagram glyph — rounded square + lens circle + flash dot. Inline only. */
function GramGlyph({ className = '' }) {
  return (
    <svg
      className={`sj-gram__glyph ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* The eight real stills we have, each with its own alt + spoken label. */
const SHOTS = [
  {
    src: '/assets/card-weekly-photos.jpg',
    alt: 'Three friends dancing together on the St James floor under pink and red lights',
    label: 'the dancefloor under pink light',
  },
  {
    src: '/assets/card-join-the-team.jpg',
    alt: 'A St James bartender pouring drinks, lit in pink and blue',
    label: 'a bartender mid-pour',
  },
  {
    src: '/assets/card-faqs.jpg',
    alt: 'Silhouettes of the St James crowd backlit in red and blue',
    label: 'the crowd in silhouette',
  },
  {
    src: '/assets/card-home.jpg',
    alt: 'A packed room facing the St James DJ booth under cyan light',
    label: 'the room facing the DJ booth',
  },
  {
    src: '/assets/hero-poster.jpg',
    alt: 'Wide shot of the St James main room part-way through a set',
    label: 'the main room mid-set',
  },
  {
    src: '/assets/frame-0.jpg',
    alt: 'The blue-lit main bar at St James',
    label: 'the blue-lit main bar',
  },
  {
    src: '/assets/frame-1.jpg',
    alt: 'Bottles backlit in blue behind the St James bar',
    label: 'bottles backlit in blue',
  },
  {
    src: '/assets/frame-2.jpg',
    alt: 'Late-night detail of the St James bar washed in blue',
    label: 'a late-night corner of the bar',
  },
];

/* Row two runs a different order so the two tracks never read as a mirror. */
const ROW_A = SHOTS;
const ROW_B = [5, 2, 7, 0, 4, 1, 6, 3].map(i => SHOTS[i]);

function Tile({ shot, duplicate }) {
  return (
    <a
      className="sj-gram__tile"
      href={SITE.instagram}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`View St James on Instagram — ${shot.label}`}
      aria-hidden={duplicate ? 'true' : undefined}
      tabIndex={duplicate ? -1 : undefined}
    >
      <img className="sj-gram__img" src={shot.src} alt={duplicate ? '' : shot.alt} loading="lazy" decoding="async" />
      <span className="sj-gram__wash" aria-hidden="true" />
      <span className="sj-gram__hover" aria-hidden="true">
        <GramGlyph className="sj-gram__glyph--tile" />
        <span className="sj-gram__hover-label">View on Instagram</span>
      </span>
    </a>
  );
}

function Row({ shots, direction }) {
  return (
    <div className={`sj-gram__row sj-gram__row--${direction}`}>
      <div className="sj-gram__track">
        <div className="sj-gram__set">
          {shots.map(shot => (
            <Tile key={`a-${shot.src}`} shot={shot} />
          ))}
        </div>
        <div className="sj-gram__set sj-gram__set--dup" aria-hidden="true">
          {shots.map(shot => (
            <Tile key={`b-${shot.src}`} shot={shot} duplicate />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Gram() {
  return (
    <section className="section section--tight sj-gram" aria-labelledby="sj-gram-title">
      <div className="shell">
        <Reveal as="header" className="sj-gram__head">
          <p className="eyebrow eyebrow--center">@stjamesnightclub</p>
          <h2 className="section-title" id="sj-gram-title">
            Follow Us On The <span className="gradient-text">Gram</span>
          </h2>
          <p className="lead sj-gram__lead">The night, the morning after, and everything in between.</p>
        </Reveal>
      </div>

      <Reveal as="div" delay={120} className="sj-gram__marquee">
        <Row shots={ROW_A} direction="left" />
        <Row shots={ROW_B} direction="right" />
        <span className="sj-gram__fade sj-gram__fade--l" aria-hidden="true" />
        <span className="sj-gram__fade sj-gram__fade--r" aria-hidden="true" />
      </Reveal>

      <div className="shell">
        <Reveal as="div" delay={200} className="sj-gram__cta-wrap">
          <a
            className="btn btn--primary sj-gram__cta"
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer noopener"
          >
            <GramGlyph />
            Follow @stjamesnightclub
          </a>
        </Reveal>
      </div>
    </section>
  );
}
