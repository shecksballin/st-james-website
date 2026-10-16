import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Reveal from '../components/Reveal.jsx';
import './Photos.css';

/* --------------------------------------------------------------------------
   The albums. Real nights only — Wednesday, Friday and Saturday — with the
   covers rotated through the venue stills so no two neighbours repeat.
   -------------------------------------------------------------------------- */
const ALBUMS = [
  { id: 'a1', title: 'Saturday 14 February', night: 'Saturday', date: '2026-02-14', count: 148, cover: '/assets/card-weekly-photos.jpg' },
  { id: 'a2', title: 'Friday 13 March', night: 'Friday', date: '2026-03-13', count: 96, cover: '/assets/frame-1.jpg' },
  { id: 'a3', title: 'Saturday 18 April', night: 'Saturday', date: '2026-04-18', count: 212, cover: '/assets/card-home.jpg' },
  { id: 'a4', title: 'Wednesday 13 May', night: 'Wednesday', date: '2026-05-13', count: 74, cover: '/assets/frame-2.jpg' },
  { id: 'a5', title: 'Friday 12 June', night: 'Friday', date: '2026-06-12', count: 131, cover: '/assets/card-faqs.jpg' },
  { id: 'a6', title: 'Saturday 18 July', night: 'Saturday', date: '2026-07-18', count: 188, cover: '/assets/frame-0.jpg' },
  { id: 'a7', title: 'Wednesday 12 August', night: 'Wednesday', date: '2026-08-12', count: 63, cover: '/assets/card-join-the-team.jpg' },
  { id: 'a8', title: 'Friday 18 September', night: 'Friday', date: '2026-09-18', count: 164, cover: '/assets/frame-3.jpg' },
  { id: 'a9', title: 'Saturday 3 October', night: 'Saturday', date: '2026-10-03', count: 237, cover: '/assets/hero-poster.jpg' },
];

/* Build the Date from the ISO string, then render it the Australian way. */
function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function coverAlt(album) {
  return `Dancefloor at St James on ${album.title}`;
}

/* ------------------------------- icons ----------------------------------- */
const ICON = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' };

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="sj-photos__ico" {...ICON}>
      <circle cx="11" cy="11" r="6.6" />
      <path d="m16.2 16.2 4 4" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="sj-photos__ico" {...ICON}>
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="sj-photos__ico sj-photos__ico--arrow" {...ICON}>
      <path d="M12 4.8v14.4" />
      <path d="m6.4 13.4 5.6 5.8 5.6-5.8" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="sj-photos__ico" {...ICON}>
      <rect x="3.6" y="3.6" width="7" height="7" rx="2" />
      <rect x="13.4" y="3.6" width="7" height="7" rx="2" />
      <rect x="3.6" y="13.4" width="7" height="7" rx="2" />
      <rect x="13.4" y="13.4" width="7" height="7" rx="2" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="sj-photos__ico" {...ICON}>
      <rect x="3.4" y="5" width="5.4" height="5.4" rx="1.7" />
      <rect x="3.4" y="13.6" width="5.4" height="5.4" rx="1.7" />
      <path d="M11.6 7.7h9M11.6 16.3h9" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="sj-photos__ico sj-photos__ico--xs" {...ICON}>
      <path d="M3.4 8.9A2.2 2.2 0 0 1 5.6 6.7h1.5l1.2-1.9h6.4l1.2 1.9h1.5a2.2 2.2 0 0 1 2.2 2.2v7.3a2.2 2.2 0 0 1-2.2 2.2H5.6a2.2 2.2 0 0 1-2.2-2.2Z" />
      <circle cx="12" cy="12.4" r="3.1" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 48 48" className="sj-photos__empty-ico" {...ICON} strokeWidth={1.4}>
      <circle cx="21" cy="21" r="12.4" />
      <path d="m30 30 8 8" />
      <path d="m17 17 8 8M25 17l-8 8" />
    </svg>
  );
}

/* -------------------------------- page ----------------------------------- */
export default function Photos() {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [dir, setDir] = useState('desc');
  const [view, setView] = useState('grid');
  const [active, setActive] = useState(null);

  const triggerRef = useRef(null);
  const modalRef = useRef(null);
  const searchRef = useRef(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? ALBUMS.filter(a => a.title.toLowerCase().includes(q) || a.night.toLowerCase().includes(q))
      : ALBUMS.slice();

    rows.sort((a, b) => {
      const cmp = sortKey === 'name' ? a.title.localeCompare(b.title, 'en-AU') : a.date.localeCompare(b.date);
      return dir === 'asc' ? cmp : -cmp;
    });

    return rows;
  }, [query, sortKey, dir]);

  const openAlbum = (album, event) => {
    triggerRef.current = event.currentTarget;
    setActive(album);
  };

  const closeAlbum = useCallback(() => setActive(null), []);

  /* Esc, a focus trap and a body-scroll lock, all while the modal is up. */
  useEffect(() => {
    if (!active) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (modalRef.current) modalRef.current.focus();

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAlbum();
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;

      const stops = modalRef.current.querySelectorAll('button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])');
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, closeAlbum]);

  /* Hand focus back to the card that opened the modal. */
  useEffect(() => {
    if (active) return;
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger && typeof trigger.focus === 'function') trigger.focus();
  }, [active]);

  const clearSearch = () => {
    setQuery('');
    if (searchRef.current) searchRef.current.focus();
  };

  const count = visible.length;
  const dirLabel = dir === 'asc' ? 'Sort descending' : 'Sort ascending';

  return (
    <div className="sj-photos">
      <div className="shell">
        <Reveal as="header" className="sj-photos__head">
          <p className="eyebrow">Gallery</p>
          <h1 className="sj-photos__h1">
            Nightlife Photo <span className="gradient-text">Albums</span>
          </h1>
          <p className="lead sj-photos__lead">
            Every Wednesday, Friday and Saturday, shot on the floor. Find yourself, tag yourself, send it to the group
            chat.
          </p>
        </Reveal>

        <Reveal delay={120} className="sj-photos__toolbar glass">
          <div className="sj-photos__search">
            <SearchIcon />
            <input
              ref={searchRef}
              id="sj-photos-search"
              className="sj-photos__input"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search albums or nights"
              aria-label="Search albums by title or night"
              autoComplete="off"
            />
            {query ? (
              <button type="button" className="sj-photos__clear" onClick={clearSearch} aria-label="Clear search">
                <ClearIcon />
              </button>
            ) : null}
          </div>

          <div className="sj-photos__controls">
            <div className="sj-photos__sort" role="group" aria-label="Sort albums">
              <div className="sj-photos__seg">
                <button
                  type="button"
                  className="sj-photos__seg-btn"
                  aria-pressed={sortKey === 'date'}
                  onClick={() => setSortKey('date')}
                >
                  Date
                </button>
                <button
                  type="button"
                  className="sj-photos__seg-btn"
                  aria-pressed={sortKey === 'name'}
                  onClick={() => setSortKey('name')}
                >
                  Name
                </button>
              </div>
              <button
                type="button"
                className={`sj-photos__icon-btn${dir === 'asc' ? ' is-asc' : ''}`}
                onClick={() => setDir(d => (d === 'asc' ? 'desc' : 'asc'))}
                aria-label={dirLabel}
                title={dirLabel}
              >
                <ArrowIcon />
              </button>
            </div>

            <div className="sj-photos__seg sj-photos__seg--view" role="group" aria-label="Album layout">
              <button
                type="button"
                className="sj-photos__seg-btn sj-photos__seg-btn--icon"
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                onClick={() => setView('grid')}
              >
                <GridIcon />
              </button>
              <button
                type="button"
                className="sj-photos__seg-btn sj-photos__seg-btn--icon"
                aria-pressed={view === 'list'}
                aria-label="List view"
                onClick={() => setView('list')}
              >
                <ListIcon />
              </button>
            </div>
          </div>

          <p className="sj-photos__count" aria-live="polite">
            {count} {count === 1 ? 'album' : 'albums'}
          </p>
        </Reveal>

        {count === 0 ? (
          <Reveal delay={80} className="sj-photos__empty glass">
            <EmptyIcon />
            <p className="sj-photos__empty-line">No albums match that search.</p>
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearSearch}>
              Clear search
            </button>
          </Reveal>
        ) : (
          <Reveal delay={80} className={view === 'grid' ? 'sj-photos__grid' : 'sj-photos__list'}>
            {visible.map(album =>
              view === 'grid' ? (
                <button
                  key={album.id}
                  type="button"
                  className="sj-photos__card"
                  onClick={event => openAlbum(album, event)}
                  aria-haspopup="dialog"
                >
                  <span className="sj-photos__cover">
                    <img src={album.cover} alt={coverAlt(album)} width="1024" height="768" loading="lazy" decoding="async" />
                    <span className="sj-photos__wash" aria-hidden="true" />
                    <span className="sj-photos__chip sj-photos__chip--night glass">{album.night}</span>
                    <span className="sj-photos__chip sj-photos__chip--count glass">
                      <CameraIcon />
                      {album.count}
                    </span>
                  </span>
                  <span className="sj-photos__meta">
                    <span className="sj-photos__name">{album.title}</span>
                    <span className="sj-photos__date">{formatDate(album.date)}</span>
                  </span>
                </button>
              ) : (
                <button
                  key={album.id}
                  type="button"
                  className="sj-photos__row"
                  onClick={event => openAlbum(album, event)}
                  aria-haspopup="dialog"
                >
                  <span className="sj-photos__thumb">
                    <img src={album.cover} alt={coverAlt(album)} width="128" height="128" loading="lazy" decoding="async" />
                    <span className="sj-photos__wash" aria-hidden="true" />
                  </span>
                  <span className="sj-photos__name sj-photos__name--row">{album.title}</span>
                  <span className="sj-photos__chip sj-photos__chip--row glass">{album.night}</span>
                  <span className="sj-photos__rowcount">
                    <CameraIcon />
                    {album.count}
                  </span>
                  <span className="sj-photos__date sj-photos__date--row">{formatDate(album.date)}</span>
                </button>
              )
            )}
          </Reveal>
        )}
      </div>

      {active ? (
        <div
          className="sj-photos__overlay"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeAlbum();
          }}
        >
          <div
            className="sj-photos__modal panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sj-photos-modal-title"
            ref={modalRef}
            tabIndex={-1}
          >
            <div className="sj-photos__modal-media">
              <img src={active.cover} alt={coverAlt(active)} width="1280" height="720" />
              <span className="sj-photos__wash sj-photos__wash--modal" aria-hidden="true" />
            </div>

            <div className="sj-photos__modal-body">
              <h2 className="sj-photos__modal-title" id="sj-photos-modal-title">
                {active.title}
              </h2>

              <ul className="sj-photos__modal-meta">
                <li>{active.night}</li>
                <li>{formatDate(active.date)}</li>
                <li>{active.count} photos</li>
              </ul>

              <div className="sj-photos__modal-actions">
                <button type="button" className="btn btn--primary">
                  Download album
                </button>
                <button type="button" className="btn btn--ghost" onClick={closeAlbum}>
                  Close
                </button>
              </div>

              <p className="sj-photos__note">
                Albums are shared through the club’s Drive — ask at the booth for the link.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
