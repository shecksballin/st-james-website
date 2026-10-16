import Hero from '../components/Hero.jsx';
import Cards from '../components/Cards.jsx';
import About from '../components/About.jsx';
import Gram from '../components/Gram.jsx';
import Contact from '../components/Contact.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Cards />
      <hr className="rule" />
      <About />
      <hr className="rule" />
      <Gram />
      <hr className="rule" />
      <Contact />
    </>
  );
}
