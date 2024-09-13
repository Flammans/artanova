import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Slide {
  icon: React.ElementType;  // Slide icon component
  title: string;            // Title of the slide
  description: string;      // Description of the slide
  iconColor: string;        // Color of the icon
}

interface SliderProps {
  slides: Slide[];          // Array of slides passed as props
  animationType: 'slide' | 'fade'; // Animation type: 'slide' or 'fade'
}

const FeatureSlider: React.FC<SliderProps> = ({ slides, animationType }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const SLIDE_INTERVAL = 4000; // 4-second interval for automatic slide transition

  // Function to go to the next slide
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  }, [slides.length]);

  // Function to go to the previous slide
  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  }, [slides.length]);

  // Automatically change slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, SLIDE_INTERVAL);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [goToNextSlide]);

  // Handle keyboard navigation (left and right arrow keys)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextSlide();
      } else if (event.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  const { icon: Icon, title, description, iconColor } = slides[currentSlide];

  // Define animations based on the chosen animation type
  const animationVariants = animationType === 'slide'
    ? {
      initial: { opacity: 0, x: 100 },   // Slide in from the right
      animate: { opacity: 1, x: 0 },     // Move to the center
      exit: { opacity: 0, x: -100 },     // Slide out to the left
    }
    : {
      initial: { opacity: 0 },           // Fade in from invisible
      animate: { opacity: 1 },           // Fade to visible
      exit: { opacity: 0 },              // Fade out to invisible
    };

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Slide content animation */}
      <motion.div
        className="flex flex-col md:flex-row items-center p-8 w-full max-w-xl mt-12 text-center md:text-left min-w-fit"
        key={currentSlide}
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        exit={animationVariants.exit}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {/* Icon with dynamic color */}
        <Icon className="text-8xl md:text-7xl mb-4 md:mb-0 md:mr-6 scale-125" style={{ color: iconColor }} />
        <div>
          {/* Slide title animation */}
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {title}
          </motion.h2>

          {/* Slide description animation */}
          <motion.p
            className="text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>

      {/* Slider controls */}
      <div className="flex space-x-4 mt-4">
        {/* Button to go to the previous slide */}
        <button
          className="text-white opacity-30 hover:opacity-100"
          onClick={goToPrevSlide}
          aria-label="Previous Slide"
        >
          &#10094;
        </button>
        {/* Button to go to the next slide */}
        <button
          className="text-white opacity-30 hover:opacity-100"
          onClick={goToNextSlide}
          aria-label="Next Slide"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default FeatureSlider;
