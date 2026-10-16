import Reveal from './Reveal.jsx';
import { SITE, HOURS } from '../data/site.js';
import './Contact.css';

/* Only the three real trading nights map to a weekday — "Public Holiday Eves"
   deliberately has no entry here so it can never light up as "tonight". */
const WEEKDAY_INDEX = { Wednesday: 3, Friday: 5, Saturday: 6 };

function MailIcon() {
  return (
    <svg
      className="sj-contact__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.8" y="5" width="18.4" height="14" rx="3.4" />
      <path d="m4.4 7.8 6.3 4.5a2.2 2.2 0 0 0 2.6 0l6.3-4.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="sj-contact__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21.2s7-5.3 7-10.5a7 7 0 1 0-14 0c0 5.2 7 10.5 7 10.5Z" />
      <circle cx="12" cy="10.6" r="2.6" />
    </svg>
  );
}

/* "First Floor, 5 & 11A James St, Geelong, Vic 3220" -> two readable lines. */
function addressLines(address) {
  const parts = address.split(',').map(part => part.trim()).filter(Boolean);
  if (parts.length < 3) return [address];
  return [parts.slice(0, 2).join(', '), parts.slice(2).join(', ')];
}

export default function Contact() {
  const today = new Date().getDay();
  const mailto = `mailto:${SITE.email}`;
  const lines = addressLines(SITE.address);

  return (
    <section id="contact" className="section sj-contact">
      <div className="shell">
        <Reveal className="sj-contact__head">
          <span className="eyebrow eyebrow--center">Get in touch</span>
          <h2 className="section-title">Contact Us</h2>
        </Reveal>

        <Reveal delay={120} className="sj-contact__bloom">
          <div className="panel sj-contact__panel">
            <div className="sj-contact__grid">
              {/* ---------------------------- enquiries --------------------------- */}
              <div className="sj-contact__cell">
                <h3 className="sj-contact__label">Enquiries</h3>
                <p className="sj-contact__copy">
                  For bookings, functions and anything else, send us an email and we will get back to
                  you as soon as possible.
                </p>
                <a className="sj-contact__email" href={mailto}>
                  <span className="gradient-text">{SITE.email}</span>
                </a>
                <a className="btn btn--primary sj-contact__btn" href={mailto}>
                  <MailIcon />
                  Email us
                </a>
              </div>

              {/* ------------------------------ hours ----------------------------- */}
              <div className="sj-contact__cell">
                <h3 className="sj-contact__label">Opening Hours</h3>
                <ul className="sj-contact__hours">
                  {HOURS.map(row => {
                    const tonight = WEEKDAY_INDEX[row.day] === today;
                    return (
                      <li
                        key={row.day}
                        className={`sj-contact__hour${tonight ? ' is-tonight' : ''}`}
                      >
                        <span className="sj-contact__hourRow">
                          <span className="sj-contact__day">
                            {tonight && <span className="sj-contact__dot" aria-hidden="true" />}
                            {row.day}
                          </span>
                          <span className="sj-contact__leader" aria-hidden="true" />
                          <span className="sj-contact__time">{row.time}</span>
                        </span>
                        {tonight && <span className="sj-contact__chip">Open tonight</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ----------------------------- find us ---------------------------- */}
              <div className="sj-contact__cell">
                <h3 className="sj-contact__label">Find Us</h3>
                <address className="sj-contact__address">
                  {lines.map(line => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <a
                  className="btn btn--ghost sj-contact__btn"
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <PinIcon />
                  Get directions
                </a>
                <p className="sj-contact__note">First floor — look for the stairs.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
