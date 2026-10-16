import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Apply from './pages/Apply.jsx';
import Photos from './pages/Photos.jsx';
import Faqs from './pages/Faqs.jsx';

/**
 * Routes carry hashes (`/#about`, `/#contact`) so the single-page home can be
 * linked into from anywhere. React Router won't scroll for us, so we do it
 * here: hash wins, otherwise every navigation lands at the top.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  // Chrome restores the previous scroll offset on reload, which lands you
  // mid-page on a site whose whole point is the full-screen hero.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (hash) {
      // The target may still be mounting on a fresh page load.
      const id = hash.slice(1);
      let frames = 0;
      const tick = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (frames++ < 30) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
      return;
    }
    // 'auto' would defer to `scroll-behavior: smooth`, and a smooth scroll can
    // be cancelled mid-flight — leaving the page parked halfway down.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/faqs" element={<Faqs />} />
          {/* Keep the old WordPress permalinks working. */}
          <Route path="/nightlife-photos" element={<Navigate to="/photos" replace />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
