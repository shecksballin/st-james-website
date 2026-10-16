import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, SITE } from '../data/site.js';
import './Navbar.css';

const RHYTHM = ['Wed', 'Fri', 'Sat'];
const CONDENSE_AT = 40;

/* ------------------------------ icons ------------------------------ */

function BurgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 9.25h15" />
      <path d="M4.5 14.75h9.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6.5 6.5l11 11" />
      <path d="M17.5 6.5l-11 11" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21.2c4.2-4 6.3-7.3 6.3-10.1a6.3 6.3 0 1 0-12.6 0c0 2.8 2.1 6.1 6.3 10.1Z" />
      <circle cx="12" cy="10.7" r="2.4" />
    </svg>
  );
}

/* --------------------------- active route --------------------------- */

function isCurrent(to, location) {
  const [rawPath, hash] = to.split('#');
  const path = rawPath || '/';
  if (location.pathname !== path) return false;
  if (hash) return location.hash === `#${hash}`;
  return path !== '/' || !location.hash;
}

/* ------------------------------ navbar ------------------------------ */

export default function Navbar() {
  const location = useLocation();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  const burgerRef = useRef(null);
  const closeRef = useRef(null);
  const overlayRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  /* Condense past ~40px. rAF-throttled, passive, no layout read per event. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setCondensed(window.scrollY > CONDENSE_AT);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Any navigation closes the overlay. */
  useEffect(() => {
    setOpen(false);
  }, [location.key, location.pathname, location.hash]);

  /* Scroll lock, focus move, Esc, and a minimal focus cycle while open. */
  useEffect(() => {
    if (!open) return undefined;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const barWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (barWidth > 0) body.style.paddingRight = `${barWidth}px`;

    const frame = requestAnimationFrame(() => {
      closeRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const root = overlayRef.current;
      if (!root) return;
      const nodes = root.querySelectorAll('a[href], button:not([disabled])');
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = root.contains(active);
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(frame);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      const active = document.activeElement;
      if (!active || active === body || overlayRef.current?.contains(active)) {
        burgerRef.current?.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const onScrimClick = event => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <>
      <header className={`sj-nav${condensed ? ' is-condensed' : ''}`}>
        <div className="shell sj-nav__row">
          <div className="sj-nav__bar" aria-hidden="true" />

          <div className="sj-nav__cluster sj-nav__cluster--left">
            <button
              ref={burgerRef}
              type="button"
              className="sj-nav__pill sj-nav__burger"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="sj-nav-overlay"
              onClick={() => setOpen(true)}
            >
              <BurgerIcon />
            </button>

            <p className="sj-nav__pill sj-nav__rhythm">
              <span className="sj-nav__dot" aria-hidden="true" />
              <span className="sj-nav__days">
                {RHYTHM.map((day, i) => (
                  <span key={day}>
                    {i > 0 && <span className="sj-nav__slash" aria-hidden="true">/</span>}
                    {day}
                  </span>
                ))}
              </span>
            </p>
          </div>

          <Link to="/" className="sj-nav__brand" aria-label={`${SITE.name} — home`}>
            <img
              className="sj-nav__logo"
              src="/assets/st-james-logo-white.png"
              alt="St James Bar + Club"
              width="960"
              height="496"
              decoding="async"
            />
          </Link>

          <div className="sj-nav__cluster sj-nav__cluster--right">
            <a
              className="sj-nav__pill sj-nav__place"
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <PinIcon />
              <span>Geelong CBD</span>
            </a>

            <Link to="/apply" className="btn btn--primary btn--sm sj-nav__cta">
              <span className="sj-nav__cta-long">Join The Team</span>
              <span className="sj-nav__cta-short">Apply</span>
            </Link>
          </div>
        </div>
      </header>

      <div
        id="sj-nav-overlay"
        ref={overlayRef}
        className={`sj-nav__overlay${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        onClick={onScrimClick}
      >
        <div className="shell sj-nav__sheet" onClick={onScrimClick}>
          <div className="sj-nav__overlay-head">
            <Link to="/" className="sj-nav__overlay-brand" onClick={close}>
              <img
                src="/assets/st-james-logo-white.png"
                alt="St James Bar + Club"
                width="960"
                height="496"
                decoding="async"
              />
            </Link>
            <button
              ref={closeRef}
              type="button"
              className="sj-nav__pill sj-nav__close"
              aria-label="Close menu"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="sj-nav__menu-wrap" aria-label="Primary">
            <ul className="sj-nav__menu">
              {NAV.map((item, i) => {
                const active = isCurrent(item.to, location);
                return (
                  <li
                    key={item.to}
                    className="sj-nav__menu-item"
                    style={{ '--sj-i': i }}
                  >
                    <NavLink
                      to={item.to}
                      end
                      onClick={close}
                      aria-current={active ? 'page' : 'false'}
                      className={`sj-nav__menu-link${active ? ' is-active' : ''}`}
                    >
                      <span className="sj-nav__index" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="sj-nav__label">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <hr className="rule sj-nav__overlay-rule" />

          <div className="sj-nav__overlay-foot">
            <div className="sj-nav__foot-links">
              <a className="sj-nav__foot-link" href={`mailto:${SITE.email}`} onClick={close}>
                {SITE.email}
              </a>
              <a
                className="sj-nav__foot-link"
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={close}
              >
                Instagram
              </a>
            </div>
            <p className="sj-nav__foot-addr muted">{SITE.address}</p>
          </div>
        </div>
      </div>
    </>
  );
}
