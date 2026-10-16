import Reveal from './Reveal.jsx';
import { ABOUT } from '../data/site.js';
import './About.css';

/* The venue name inside the heading gets the gradient treatment. */
const ACCENT = 'St James';

function splitHeading(heading) {
  const at = heading.indexOf(ACCENT);
  if (at === -1) return ['', heading, ''];
  return [heading.slice(0, at), ACCENT, heading.slice(at + ACCENT.length)];
}

export default function About() {
  const [before, accent, after] = splitHeading(ABOUT.heading);

  return (
    <section id="about" className="section sj-about">
      <div className="shell">
        <div className="sj-about__grid">
          <Reveal delay={0} className="sj-about__media-col">
            <figure className="sj-about__media">
              <div className="sj-about__frame">
                <img
                  className="sj-about__img"
                  src="/assets/card-home.jpg"
                  alt="The St James dance floor"
                  width="1024"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <span className="sj-about__wash" aria-hidden="true" />
                <span className="sj-about__scrim" aria-hidden="true" />
                <figcaption className="sj-about__badge glass">2 floors · 2 bars · 1 balcony</figcaption>
              </div>
            </figure>
          </Reveal>

          <Reveal delay={120} className="sj-about__text">
            <p className="eyebrow">The Venue</p>

            <h2 className="section-title sj-about__title">
              {before}
              <span className="gradient-text">{accent}</span>
              {after}
            </h2>

            <div className="sj-about__copy">
              {ABOUT.paragraphs.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="sj-about__genres">
              <p className="sj-about__genres-label">On rotation</p>
              <ul className="sj-about__chips">
                {ABOUT.genres.map(genre => (
                  <li key={genre} className="sj-about__chip glass">
                    <span className="sj-about__dot" aria-hidden="true" />
                    {genre}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="sj-about__stats">
              {ABOUT.stats.map(stat => (
                <div className="sj-about__stat" key={stat.label}>
                  <dt
                    className={`sj-about__stat-value gradient-text${
                      stat.value.length > 4 ? ' sj-about__stat-value--long' : ''
                    }`}
                  >
                    {stat.value}
                  </dt>
                  <dd className="sj-about__stat-label">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={220} as="aside" className="sj-about__strip" aria-label="Previous headliners">
          <p className="sj-about__strip-label">Previously on our decks</p>
          <ul className="sj-about__names">
            {ABOUT.headliners.map(name => (
              <li key={name} className="sj-about__name">
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
