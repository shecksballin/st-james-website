import { Link } from 'react-router-dom';
import { SITE, FOOTER_NAV } from '../data/site.js';
import './Footer.css';

function InstagramIcon() {
  return (
    <svg
      className="sj-foot__glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <path d="M16.9 7.1h.01" strokeWidth={2.1} />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sj-foot">
      <div className="shell sj-foot__inner">
        <div className="sj-foot__top">
          <Link className="sj-foot__brand" to="/" aria-label="St James — home">
            <img
              src="/assets/st-james-logo-white.png"
              alt="St James Bar + Club"
              width="66"
              height="34"
            />
          </Link>

          <nav className="sj-foot__nav" aria-label="Footer">
            {FOOTER_NAV.map(item => (
              <Link key={item.to} className="sj-foot__link" to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            className="glass sj-foot__social"
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="St James on Instagram"
          >
            <InstagramIcon />
          </a>
        </div>

        <hr className="rule sj-foot__rule" />

        <div className="sj-foot__bottom">
          <p className="sj-foot__copy">© {year} St James Nightclub. All rights reserved.</p>
          <p className="sj-foot__place">
            <span>Geelong, Victoria</span>
            <span className="sj-foot__chip">18+</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
