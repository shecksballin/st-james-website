import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { CARDS } from '../data/site.js';
import './Cards.css';

/* Small inline chevron — nudges right when the card is hovered or focused. */
function ArrowRight() {
  return (
    <svg
      className="sj-cards__arrow"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12h14" />
      <path d="m12.75 5.75 6.25 6.25-6.25 6.25" />
    </svg>
  );
}

export default function Cards() {
  return (
    <section className="section sj-cards" aria-labelledby="sj-cards-title">
      <div className="shell">
        <header className="sj-cards__head">
          <Reveal className="sj-cards__head-main">
            <p className="eyebrow eyebrow--center">What’s On</p>
            <h2 id="sj-cards-title" className="section-title">
              Pick Your <span className="gradient-text">Night</span>
            </h2>
          </Reveal>

          <Reveal delay={90} className="sj-cards__head-aside">
            <p className="lead sj-cards__lead">Three rooms of reasons to come up the stairs.</p>
          </Reveal>
        </header>

        <div className="sj-cards__grid">
          {CARDS.map((card, i) => (
            <Reveal as="article" key={card.to} delay={i * 110} className="sj-cards__cell">
              <Link to={card.to} className="sj-cards__card">
                <img
                  className="sj-cards__img"
                  src={card.img}
                  alt={card.title}
                  width="1024"
                  height="630"
                  loading="lazy"
                  decoding="async"
                />

                {/* Pull the pink/red stage lighting back into our blue world. */}
                <span className="sj-cards__tint" aria-hidden="true" />
                <span className="sj-cards__wash" aria-hidden="true" />
                <span className="sj-cards__scrim" aria-hidden="true" />
                <span className="sj-cards__edge" aria-hidden="true" />

                <span className="sj-cards__index glass" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="sj-cards__body">
                  <h3 className="sj-cards__title">{card.title}</h3>
                  <span className="sj-cards__hair" aria-hidden="true" />

                  <span className="sj-cards__reveal">
                    <span className="sj-cards__reveal-in">
                      <span className="sj-cards__blurb">{card.blurb}</span>
                    </span>
                  </span>

                  <span className="sj-cards__cta">
                    {card.cta}
                    <ArrowRight />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
