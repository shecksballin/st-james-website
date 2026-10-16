import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import ElectricLogo from './ElectricLogo.jsx';
import Reveal from './Reveal.jsx';
import { SITE } from '../data/site.js';

import './Hero.css';

const LOGO_SRC = '/assets/st-james-logo-white.png';
const POSTER_SRC = '/assets/hero-poster.jpg';

/** Builds the nocookie embed URL from the ids that live in site.js. */
function buildEmbedSrc(id, loopEnd) {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id,
    controls: '0',
    showinfo: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    start: '0',
    end: String(loopEnd),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export default function Hero() {
  // Nothing WebGL / iframe shaped renders until we are definitely on the client,
  // so the very first paint is just the poster — never a black or empty frame.
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [logoLit, setLogoLit] = useState(false);
  const logoLitRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const videoSrc = useMemo(
    () => buildEmbedSrc(SITE.heroVideoId, SITE.heroVideoLoopEnd),
    []
  );

  // Fired every frame by the WebGL logo; the ref guard keeps it to one setState.
  const handleLogoRender = useCallback(() => {
    if (logoLitRef.current) return;
    logoLitRef.current = true;
    setLogoLit(true);
  }, []);

  const scrollToAbout = useCallback(() => {
    if (typeof document === 'undefined') return;
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduce ? 'auto' : 'smooth';
    const target = document.getElementById('about');
    if (target) {
      target.scrollIntoView({ behavior, block: 'start' });
      return;
    }
    window.scrollTo({ top: window.innerHeight, left: 0, behavior });
  }, []);

  return (
    <section className="sj-hero" id="top">
      {/* ---------------------------- media ---------------------------- */}
      <div className="sj-hero__media" aria-hidden="true">
        <img
          className={`sj-hero__poster${videoReady ? ' is-gone' : ''}`}
          src={POSTER_SRC}
          alt=""
          width="1280"
          height="720"
          decoding="async"
          fetchPriority="high"
        />
        {mounted ? (
          <iframe
            className={`sj-hero__video${videoReady ? ' is-live' : ''}`}
            src={videoSrc}
            title="St James venue reel"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            aria-hidden="true"
            /* `load` fires when the player chrome is ready, not when frames
               start — fading the poster right then exposes YouTube's buffering
               spinner dead centre of the hero. Give playback a beat first. */
            onLoad={() => {
              window.setTimeout(() => setVideoReady(true), 1200);
            }}
          />
        ) : null}
      </div>

      {/* --------------------------- overlays -------------------------- */}
      <div className="sj-hero__scrim" aria-hidden="true" />
      <div className="sj-hero__wash" aria-hidden="true" />
      <div className="sj-hero__vignette" aria-hidden="true" />
      <div className="sj-hero__topfade" aria-hidden="true" />
      <div className="sj-hero__edge" aria-hidden="true" />

      {/* --------------------------- content --------------------------- */}
      <div className="sj-hero__inner shell">
        <div className="sj-hero__content">
          <div className="sj-hero__logo">
            <img
              className={`sj-hero__logo-img${logoLit ? ' is-gone' : ''}`}
              src={LOGO_SRC}
              alt="St James Bar + Club"
              width="960"
              height="496"
              decoding="async"
            />
            {mounted ? (
              <div className="sj-hero__logo-canvas" aria-hidden="true">
                <ElectricLogo
                  src={LOGO_SRC}
                  color="#fcfdff"
                  glowColor="#3B82F6"
                  scale={0.52}
                  strands={2}
                  bend={0.25}
                  crackle={1.15}
                  arcs={0.65}
                  speed={1.5}
                  interactive
                  glow={1.35}
                  thickness={1.1}
                  flicker={0.35}
                  cursorRadius={45}
                  theme="dark"
                  onRender={handleLogoRender}
                />
              </div>
            ) : null}
          </div>

          <Reveal as="h1" className="sj-hero__title" delay={80}>
            <span className="sj-hero__title-line">Three Nights. Two Floors. —</span>
            <span className="sj-hero__title-line gradient-text">
              One Geelong Institution.
            </span>
          </Reveal>

          <Reveal as="p" className="sj-hero__sub" delay={200}>
            <span className="sj-hero__sub-line">
              Wednesday, Friday &amp; Saturday. RnB, Party, Top 40, Minimal and
              Tech-House.
            </span>
            <span className="sj-hero__sub-line">
              Two bars, an open air balcony, doors 10pm &rsquo;til 7am.
            </span>
          </Reveal>

          <Reveal className="sj-hero__actions" delay={320}>
            <Link className="btn btn--primary btn--lg" to="/apply">
              Join The Team
            </Link>
            <Link className="btn btn--ghost btn--lg" to="/photos">
              See The Photos
            </Link>
          </Reveal>
        </div>
      </div>

      {/* -------------------------- scroll cue ------------------------- */}
      <button
        type="button"
        className="sj-hero__cue"
        onClick={scrollToAbout}
        aria-label="Scroll to About"
      >
        <span className="sj-hero__cue-track" aria-hidden="true">
          <span className="sj-hero__cue-dot" />
        </span>
        <span className="sj-hero__cue-label" aria-hidden="true">
          Scroll
        </span>
      </button>
    </section>
  );
}
