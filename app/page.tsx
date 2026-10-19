import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Blueprint from '@/components/Blueprint';
import Projects from '@/components/Projects';
import Programme from '@/components/Programme';
import Safety from '@/components/Safety';
import Estimator from '@/components/Estimator';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <Blueprint />
        <Projects />
        <Programme />
        <Safety />
        <Estimator />
      </main>
      <Footer />
    </>
  );
}
