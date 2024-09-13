import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SectionTitle from './SectionTitle.tsx'

const Explore = () => {
  const exploreSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/explore-collections') {
      exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <section
      id="explore-section"
      ref={exploreSectionRef}
      className="h-screen bg-dark text-white flex flex-col items-center justify-start pt-40"
    >
      {/* Section Title */}
      <SectionTitle
        titleText="Explore Our Art Collections"
        subtitleText="Browse and Curate Your Own Art Collections from a World of Masterpieces."
        titleTag="h2"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div className="bg-dark-800 p-6 rounded-lg">Exhibit 1</div>
        <div className="bg-dark-800 p-6 rounded-lg">Exhibit 2</div>
        <div className="bg-dark-800 p-6 rounded-lg">Exhibit 3</div>
        <div className="bg-dark-800 p-6 rounded-lg">Exhibit 4</div>
        <div className="bg-dark-800 p-6 rounded-lg">Exhibit 5</div>
        <div className="bg-dark-800 p-6 rounded-lg">Exhibit 6</div>
      </div>
    </section>
  );
};

export default Explore;