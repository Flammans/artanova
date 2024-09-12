import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero.tsx'

const Home = () => {
  const exploreSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/explore-collections') {
      exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div>
      <Hero/>
      <section id="explore-section" ref={exploreSectionRef} className="h-screen bg-dark text-white flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-8">Explore Art Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-dark-800 p-6 rounded-lg">Exhibit 1</div>
          <div className="bg-dark-800 p-6 rounded-lg">Exhibit 2</div>
          <div className="bg-dark-800 p-6 rounded-lg">Exhibit 3</div>
          <div className="bg-dark-800 p-6 rounded-lg">Exhibit 4</div>
          <div className="bg-dark-800 p-6 rounded-lg">Exhibit 5</div>
          <div className="bg-dark-800 p-6 rounded-lg">Exhibit 6</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
