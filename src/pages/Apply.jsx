import { useRef, useState } from 'react';

import Reveal from '../components/Reveal.jsx';
import { SITE } from '../data/site.js';
import './Apply.css';

/* ------------------------------- icons -------------------------------- */
/* Inline only — stroke inherits currentColor so every icon picks up its
   parent's state (muted, blue on hover, white inside a gradient mark). */

const svg = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

function IconTick(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...svg} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.2 12.3 10.9 15l4.9-5.4" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...svg} strokeWidth={2.6} {...props}>
      <path d="M5 12.6 9.6 17 19 7" />
    </svg>
  );
}

function IconUpload(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...svg} {...props}>
      <path d="M12 16V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  );
}

function IconFile(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...svg} {...props}>
      <path d="M14 3H7a1.6 1.6 0 0 0-1.6 1.6v14.8A1.6 1.6 0 0 0 7 21h10a1.6 1.6 0 0 0 1.6-1.6V7.6Z" />
      <path d="M14 3v4.6h4.6" />
    </svg>
  );
}

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...svg} strokeWidth={1.9} {...props}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

/* ------------------------------ helpers ------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = {
  first: '',
  last: '',
  dob: '',
  phone: '',
  email: '',
  bartender: false,
  door: false,
  over18: '',
  other: '',
};

/* Validation runs in visual order so the "focus the first problem" jump
   always lands on the field the eye is already heading towards. */
const ORDER = ['first', 'last', 'dob', 'phone', 'email', 'positions', 'over18', 'other'];

const REASSURANCE = [
  '18+ only',
  'RSA helpful, not essential',
  'We keep every application on file',
];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* --------------------------------------------------------------------- */

export default function Apply() {
  const [values, setValues] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [sent, setSent] = useState(false);

  const controls = useRef({});
  const fileInput = useRef(null);

  const bind = key => el => {
    controls.current[key] = el;
  };

  /* Clearing an error the moment the field is touched again keeps the form
     from nagging while someone is mid-fix. */
  const set = (key, value, clears = key) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => (prev[clears] ? { ...prev, [clears]: undefined } : prev));
  };

  function validate(v) {
    const next = {};
    if (!v.first.trim()) next.first = 'Please enter your first name.';
    if (!v.last.trim()) next.last = 'Please enter your last name.';
    if (!v.dob) next.dob = 'Please enter your date of birth.';
    if (!v.phone.trim()) next.phone = 'Please enter a phone number we can reach you on.';
    if (!v.email.trim()) next.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(v.email.trim())) next.email = 'That email address does not look quite right.';
    if (!v.bartender && !v.door) next.positions = 'Please choose at least one position.';
    if (!v.over18) next.over18 = 'Please let us know whether you are 18 or over.';
    else if (v.over18 === 'no') next.over18 = 'St James is a strictly 18+ venue, so we can only take applications from over-18s.';
    if (!v.other.trim()) next.other = 'Please tell us a little about your experience.';
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    const firstBad = ORDER.find(key => found[key]);
    if (firstBad) {
      const el = controls.current[firstBad];
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }
    // Nothing leaves the browser — this is a front-end rebuild, not a backend.
    setSent(true);
  }

  function reset() {
    setValues(EMPTY);
    setFile(null);
    setErrors({});
    setSent(false);
  }

  function takeFile(picked) {
    if (picked) setFile(picked);
  }

  function clearFile() {
    setFile(null);
    if (fileInput.current) fileInput.current.value = '';
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    takeFile(event.dataTransfer?.files?.[0]);
  }

  function onDragOver(event) {
    event.preventDefault();
    setDragging(true);
  }

  function onDragLeave(event) {
    event.preventDefault();
    // Ignore the leave events fired while crossing the zone's own children.
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setDragging(false);
  }

  const err = key => (errors[key] ? 'is-error' : '');
  const describe = key => (errors[key] ? `sj-apply-${key}-error` : undefined);

  return (
    <div className="sj-apply">
      <div className="shell">
        {/* ------------------------------ header ------------------------------ */}
        <Reveal as="header" className="sj-apply__head">
          <p className="eyebrow eyebrow--center">Careers</p>
          <h1 className="sj-apply__title">
            Join Our Team
            <br />
            <span className="gradient-text">At St James!</span>
          </h1>
          <p className="lead sj-apply__lead">
            If you’re interested in joining our team of bar and door staff, let us know by filling in the form
            below.
          </p>
        </Reveal>

        <div className="sj-apply__grid">
          {/* ------------------------------ media ----------------------------- */}
          <div className="sj-apply__col sj-apply__col--media">
            <Reveal className="sj-apply__media" delay={80}>
              <figure className="sj-apply__frame">
                <img
                  className="sj-apply__img"
                  src="/assets/card-join-the-team.jpg"
                  alt="A bartender at work behind the St James bar"
                  width="1024"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <span className="sj-apply__duo" aria-hidden="true" />
                <span className="sj-apply__scrim" aria-hidden="true" />
                <figcaption className="glass sj-apply__chip">Bar &amp; Door Staff</figcaption>
              </figure>
            </Reveal>

            <Reveal as="ul" className="sj-apply__points" delay={180}>
              {REASSURANCE.map(point => (
                <li className="sj-apply__point" key={point}>
                  <IconTick className="sj-apply__point-icon" />
                  <span>{point}</span>
                </li>
              ))}
            </Reveal>
          </div>

          {/* ------------------------------ form ------------------------------ */}
          <div className="sj-apply__col sj-apply__col--form">
            <Reveal delay={140}>
              {sent ? (
                <section className="panel sj-apply__panel sj-apply__done" aria-live="polite">
                  <span className="sj-apply__done-badge" aria-hidden="true">
                    <IconCheck />
                  </span>
                  <h2 className="sj-apply__done-title">Application received</h2>
                  <p className="sj-apply__done-copy">
                    Thanks — we’ve got your details and someone from the venue will be in touch. If you’d like to
                    send a resume through as well, email it to{' '}
                    <a className="sj-apply__link" href={`mailto:${SITE.managerEmail}`}>
                      {SITE.managerEmail}
                    </a>
                    .
                  </p>
                  <button type="button" className="btn btn--ghost" onClick={reset}>
                    Submit another
                  </button>
                </section>
              ) : (
                <form className="panel sj-apply__panel" onSubmit={handleSubmit} noValidate>
                  <div className="sj-apply__fields">
                    {/* 1 — name ----------------------------------------------- */}
                    <div className="sj-apply__field">
                      <span className="sj-apply__label" id="sj-apply-name-label">
                        Your Name <span className="sj-apply__req" aria-hidden="true">*</span>
                      </span>
                      <div className="sj-apply__row sj-apply__row--tight">
                        <div className="sj-apply__cell">
                          <label className="sj-apply__vh" htmlFor="sj-apply-first">
                            First name
                          </label>
                          <input
                            id="sj-apply-first"
                            ref={bind('first')}
                            className={`sj-apply__control ${err('first')}`}
                            type="text"
                            name="first"
                            placeholder="First"
                            autoComplete="given-name"
                            required
                            aria-invalid={errors.first ? 'true' : undefined}
                            aria-describedby={describe('first')}
                            value={values.first}
                            onChange={e => set('first', e.target.value)}
                          />
                          {errors.first && (
                            <p className="sj-apply__error" id="sj-apply-first-error" role="alert">
                              {errors.first}
                            </p>
                          )}
                        </div>
                        <div className="sj-apply__cell">
                          <label className="sj-apply__vh" htmlFor="sj-apply-last">
                            Last name
                          </label>
                          <input
                            id="sj-apply-last"
                            ref={bind('last')}
                            className={`sj-apply__control ${err('last')}`}
                            type="text"
                            name="last"
                            placeholder="Last"
                            autoComplete="family-name"
                            required
                            aria-invalid={errors.last ? 'true' : undefined}
                            aria-describedby={describe('last')}
                            value={values.last}
                            onChange={e => set('last', e.target.value)}
                          />
                          {errors.last && (
                            <p className="sj-apply__error" id="sj-apply-last-error" role="alert">
                              {errors.last}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2 + 3 — date of birth / phone --------------------------- */}
                    <div className="sj-apply__row">
                      <div className="sj-apply__field">
                        <label className="sj-apply__label" htmlFor="sj-apply-dob">
                          Date of Birth <span className="sj-apply__req" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="sj-apply-dob"
                          ref={bind('dob')}
                          className={`sj-apply__control sj-apply__control--date ${err('dob')}`}
                          type="date"
                          name="dob"
                          autoComplete="bday"
                          required
                          aria-invalid={errors.dob ? 'true' : undefined}
                          aria-describedby={describe('dob')}
                          value={values.dob}
                          onChange={e => set('dob', e.target.value)}
                        />
                        {errors.dob && (
                          <p className="sj-apply__error" id="sj-apply-dob-error" role="alert">
                            {errors.dob}
                          </p>
                        )}
                      </div>

                      <div className="sj-apply__field">
                        <label className="sj-apply__label" htmlFor="sj-apply-phone">
                          Phone number <span className="sj-apply__req" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="sj-apply-phone"
                          ref={bind('phone')}
                          className={`sj-apply__control ${err('phone')}`}
                          type="tel"
                          name="phone"
                          inputMode="tel"
                          placeholder="04__ ___ ___"
                          autoComplete="tel"
                          required
                          aria-invalid={errors.phone ? 'true' : undefined}
                          aria-describedby={describe('phone')}
                          value={values.phone}
                          onChange={e => set('phone', e.target.value)}
                        />
                        {errors.phone && (
                          <p className="sj-apply__error" id="sj-apply-phone-error" role="alert">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 4 — email ---------------------------------------------- */}
                    <div className="sj-apply__field">
                      <label className="sj-apply__label" htmlFor="sj-apply-email">
                        Email address <span className="sj-apply__req" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="sj-apply-email"
                        ref={bind('email')}
                        className={`sj-apply__control ${err('email')}`}
                        type="email"
                        name="email"
                        inputMode="email"
                        placeholder="you@email.com"
                        autoComplete="email"
                        required
                        aria-invalid={errors.email ? 'true' : undefined}
                        aria-describedby={describe('email')}
                        value={values.email}
                        onChange={e => set('email', e.target.value)}
                      />
                      {errors.email && (
                        <p className="sj-apply__error" id="sj-apply-email-error" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* 5 + 6 — position / 18+ ---------------------------------- */}
                    <div className="sj-apply__row">
                      <fieldset
                        className={`sj-apply__fieldset ${err('positions')}`}
                        aria-describedby={describe('positions')}
                      >
                        <legend className="sj-apply__label">
                          What Position Would You Like To Apply For?{' '}
                          <span className="sj-apply__req" aria-hidden="true">*</span>
                        </legend>
                        <div className="sj-apply__choices">
                          <label className="sj-apply__choice">
                            <input
                              className="sj-apply__choice-input"
                              ref={bind('positions')}
                              type="checkbox"
                              name="position"
                              value="bartender"
                              checked={values.bartender}
                              onChange={e => set('bartender', e.target.checked, 'positions')}
                            />
                            <span className="sj-apply__mark" aria-hidden="true">
                              <IconCheck className="sj-apply__mark-tick" />
                            </span>
                            <span className="sj-apply__choice-text">Bartender</span>
                          </label>
                          <label className="sj-apply__choice">
                            <input
                              className="sj-apply__choice-input"
                              type="checkbox"
                              name="position"
                              value="door"
                              checked={values.door}
                              onChange={e => set('door', e.target.checked, 'positions')}
                            />
                            <span className="sj-apply__mark" aria-hidden="true">
                              <IconCheck className="sj-apply__mark-tick" />
                            </span>
                            <span className="sj-apply__choice-text">Door Staff</span>
                          </label>
                        </div>
                        {errors.positions && (
                          <p className="sj-apply__error" id="sj-apply-positions-error" role="alert">
                            {errors.positions}
                          </p>
                        )}
                      </fieldset>

                      <fieldset
                        className={`sj-apply__fieldset ${err('over18')}`}
                        aria-describedby={describe('over18')}
                      >
                        <legend className="sj-apply__label">
                          Are You 18+ <span className="sj-apply__req" aria-hidden="true">*</span>
                        </legend>
                        <div className="sj-apply__choices">
                          <label className="sj-apply__choice">
                            <input
                              className="sj-apply__choice-input"
                              ref={bind('over18')}
                              type="radio"
                              name="over18"
                              value="yes"
                              checked={values.over18 === 'yes'}
                              onChange={() => set('over18', 'yes')}
                            />
                            <span className="sj-apply__mark sj-apply__mark--radio" aria-hidden="true" />
                            <span className="sj-apply__choice-text">Yes</span>
                          </label>
                          <label className="sj-apply__choice">
                            <input
                              className="sj-apply__choice-input"
                              type="radio"
                              name="over18"
                              value="no"
                              checked={values.over18 === 'no'}
                              onChange={() => set('over18', 'no')}
                            />
                            <span className="sj-apply__mark sj-apply__mark--radio" aria-hidden="true" />
                            <span className="sj-apply__choice-text">No</span>
                          </label>
                        </div>
                        {errors.over18 && (
                          <p className="sj-apply__error" id="sj-apply-over18-error" role="alert">
                            {errors.over18}
                          </p>
                        )}
                      </fieldset>
                    </div>

                    {/* 7 — other information ---------------------------------- */}
                    <div className="sj-apply__field">
                      <label className="sj-apply__label" htmlFor="sj-apply-other">
                        Other Information <span className="sj-apply__req" aria-hidden="true">*</span>
                      </label>
                      <p className="sj-apply__help" id="sj-apply-other-help">
                        Please provide any previous experience or workplaces and useful information such as ‘I can
                        make cocktails’ or ‘I have my RSA’.
                      </p>
                      <textarea
                        id="sj-apply-other"
                        ref={bind('other')}
                        className={`sj-apply__control sj-apply__textarea ${err('other')}`}
                        name="other"
                        rows={5}
                        required
                        aria-invalid={errors.other ? 'true' : undefined}
                        aria-describedby={
                          errors.other ? 'sj-apply-other-help sj-apply-other-error' : 'sj-apply-other-help'
                        }
                        value={values.other}
                        onChange={e => set('other', e.target.value)}
                      />
                      {errors.other && (
                        <p className="sj-apply__error" id="sj-apply-other-error" role="alert">
                          {errors.other}
                        </p>
                      )}
                    </div>

                    {/* 8 — resume --------------------------------------------- */}
                    <div className="sj-apply__field">
                      <span className="sj-apply__label">Attach Resume</span>
                      <p className="sj-apply__help" id="sj-apply-resume-help">
                        If you have a resume, please attach it to your application below, or email it to{' '}
                        <a className="sj-apply__link" href={`mailto:${SITE.managerEmail}`}>
                          {SITE.managerEmail}
                        </a>{' '}
                        after you fill this form in.
                      </p>

                      <div
                        className={`sj-apply__drop ${dragging ? 'is-drag' : ''} ${file ? 'has-file' : ''}`}
                        onDragOver={onDragOver}
                        onDragEnter={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                      >
                        <input
                          id="sj-apply-resume"
                          ref={fileInput}
                          className="sj-apply__file-input"
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          aria-describedby="sj-apply-resume-help"
                          onChange={e => takeFile(e.target.files?.[0])}
                        />

                        {file ? (
                          <div className="sj-apply__file">
                            <span className="sj-apply__file-icon" aria-hidden="true">
                              <IconFile />
                            </span>
                            <span className="sj-apply__file-meta">
                              <span className="sj-apply__file-name">{file.name}</span>
                              <span className="sj-apply__file-size">{formatSize(file.size)}</span>
                            </span>
                            <button
                              type="button"
                              className="sj-apply__file-remove"
                              onClick={clearFile}
                              aria-label={`Remove ${file.name}`}
                            >
                              <IconX />
                            </button>
                          </div>
                        ) : (
                          <label className="sj-apply__drop-label" htmlFor="sj-apply-resume">
                            <span className="sj-apply__drop-icon" aria-hidden="true">
                              <IconUpload />
                            </span>
                            <span className="sj-apply__drop-title">Choose a file or drag it here</span>
                            <span className="sj-apply__drop-hint">PDF, DOC or DOCX</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="rule sj-apply__rule" />

                  <button type="submit" className="btn btn--primary btn--lg btn--block">
                    Submit Application
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
