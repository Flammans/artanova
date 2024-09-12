import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Palette, ShareNetwork, Users, Archive } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import ScrollArrow from './ScrollArrow.tsx'
import ActionButton from './ActionButton.tsx'
import ParallaxImage from './ParallaxImage.tsx'

const slides = [
  {
    icon: Palette,
    title: 'Curate Your Own Art Collections',
    description: 'Easily curate personalized art collections from various museums and galleries.',
    iconColor: '#FFD700',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
  },
  {
    icon: ShareNetwork,
    title: 'Share Collections with Friends',
    description: 'Collaborate and share your collections with friends and other users in just one click.',
    iconColor: '#1C3D5A',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
  },
  {
    icon: Users,
    title: 'Join a Community of Art Lovers',
    description: 'Connect with a vibrant community of art enthusiasts and discover new collections.',
    iconColor: '#C0C0C0',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
  },
  {
    icon: Archive,
    title: 'Access a Vast Art Archive',
    description: 'Explore a wide range of artworks from museums, universities, and private collections.',
    iconColor: '#708090',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
  },
];

// Helper function to get a random color for paintings
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper function to get a random size for paintings in the progress bar
const getRandomSize = () => {
  return {
    width: Math.floor(Math.random() * 40) + 80,
    height: Math.floor(Math.random() * 40) + 80,
  };
};

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [currentPainting, setCurrentPainting] = useState<number>(0);
  const [paintingProperties, setPaintingProperties] = useState(() =>
    Array(4).fill(null).map(() => ({
      color: getRandomColor(),
      size: getRandomSize(),
    }))
  );
  const SLIDE_INTERVAL = 4000;

  // Update progress and handle slide transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 100 / (SLIDE_INTERVAL / 40);
        } else {
          setProgress(0);
          setCurrentPainting((prev) => (prev === paintingProperties.length - 1 ? 0 : prev + 1));
          setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
          return 0;
        }
      });
    }, 40);

    return () => clearInterval(interval);
  }, [paintingProperties]);

  // Update painting properties (random size and color) when the painting changes
  useEffect(() => {
    setPaintingProperties(
      paintingProperties.map(() => ({
        // color: getRandomColor(),
        color: '#d4af37',
        size: getRandomSize(),
      }))
    );
  }, [currentPainting]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextSlide();
      } else if (event.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (event.key === 'Enter') {
        goToNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  }, []);

  const { icon: Icon, title, description, iconColor, imageUrlWebp, imageUrlJpg } = slides[currentSlide];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-space bg-black text-white min-h-fit pb-40">
        {/* Main Hero content */}

        <ParallaxImage
          imageUrlWebp={imageUrlWebp}
          imageUrlJpg={imageUrlJpg}
          altText="British Museum"
        />


        <div className="text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold font-custom-headline"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Welcome to Artanova
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mt-4 font-custom-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Discover and curate the finest art collections from all over the world.
          </motion.p>
        </div>

        {/* Feature Slider */}
        <div className={'ml-auto mr-auto w-full flex justify-center overflow-hidden'} style={{ minHeight: '360px' }}>
          <motion.div
            className="relative z-20 flex flex-col md:flex-row items-center p-8 w-4/5 max-w-xl mt-12 text-center md:text-left"
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <Icon className="text-8xl md:text-7xl mb-4 md:mb-0 md:mr-6 opacity-60 scale-125" style={{ color: iconColor }}/>
            <div>
              <motion.h2
                className="text-2xl md:text-3xl font-bold mb-2 font-custom-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {title}
              </motion.h2>
              <motion.p
                className="text-lg font-custom-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {description}
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Manual slide controls */}
        <div className="flex space-x-4 mt-4 z-10">
          <button className="text-white opacity-30 hover:opacity-100" onClick={goToPrevSlide} aria-label="Previous Slide">
            &#10094;
          </button>
          <button className="text-white opacity-30 hover:opacity-100" onClick={goToNextSlide} aria-label="Next Slide">
            &#10095;
          </button>
        </div>

        <ActionButton text="Explore Collections" to="/explore-collections"/>

        {/* Down arrow to scroll to the next section */}
        <ScrollArrow targetId="explore-section" tooltipText="Explore Collections"/>
      </section>
    </>
  );
};

export default Hero;
