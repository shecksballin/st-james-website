import { Fragment, useId, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { SITE, FAQS } from '../data/site.js';
import './Faqs.css';

/** Turns any mention of the club email inside an answer into a mailto link. */
function Answer({ text }) {
  const parts = text.split(SITE.email);
  if (parts.length === 1) return text;

  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <a className="sj-faq__mail" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
      )}
      {part}
    </Fragment>
  ));
}

export default function Faqs() {
  const uid = useId();
  // First question is open on mount; opening one closes the rest.
  const [open, setOpen] = useState(0);

  return (
    <main className="sj-faq">
      <div className="shell">
        <div className="sj-faq__inner">
          <Reveal as="header" className="sj-faq__head">
            <span className="eyebrow eyebrow--center">Good to know</span>
            <h1 className="sj-faq__title">
              Frequently Asked <span className="gradient-text">Q’s</span>
            </h1>
            <p className="lead sj-faq__lead">
              Dress code, ID, entry, lost property and functions — the short answers.
            </p>
          </Reveal>

          <Reveal delay={120} as="div" className="sj-faq__list">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              const buttonId = `${uid}-q-${i}`;
              const panelId = `${uid}-p-${i}`;

              return (
                <div
                  key={faq.q}
                  className={`sj-faq__item${isOpen ? ' sj-faq__item--open' : ''}`}
                >
                  <h2 className="sj-faq__row">
                    <button
                      type="button"
                      className="sj-faq__q"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span className="sj-faq__qText">{faq.q}</span>
                      <span className="sj-faq__mark" aria-hidden="true">
                        <span className="sj-faq__bar sj-faq__bar--h" />
                        <span className="sj-faq__bar sj-faq__bar--v" />
                      </span>
                    </button>
                  </h2>

                  <div
                    className="sj-faq__panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                  >
                    <div className="sj-faq__panelInner">
                      <p className="sj-faq__a">
                        <Answer text={faq.a} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>

          <div className="glass sj-faq__cta">
            <div className="sj-faq__ctaBody">
              <h2 className="sj-faq__ctaTitle">Still stuck?</h2>
              <p className="sj-faq__ctaText">Email us and a human will get back to you.</p>
              <a className="btn btn--primary sj-faq__ctaBtn" href={`mailto:${SITE.email}`}>
                Email the club
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
