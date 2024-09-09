import React, { useEffect, useState, useCallback } from 'react';
import { FaShareAlt, FaPalette, FaUsers, FaArchive } from 'react-icons/fa';

// Slide data with unique images and custom icon colors
const slides = [
  {
    icon: FaPalette,
    title: 'Curate Your Own Art Collections',
    description: 'Easily curate personalized art collections from various museums and galleries.',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
    iconColor: '#ff6347', // Tomato for palette
  },
  {
    icon: FaShareAlt,
    title: 'Share Collections with Friends',
    description: 'Collaborate and share your collections with friends and other users in just one click.',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
    iconColor: '#1e90ff', // DodgerBlue for sharing
  },
  {
    icon: FaUsers,
    title: 'Join a Community of Art Lovers',
    description: 'Connect with a vibrant community of art enthusiasts and discover new collections.',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
    iconColor: '#32cd32', // LimeGreen for community
  },
  {
    icon: FaArchive,
    title: 'Access a Vast Art Archive',
    description: 'Explore a wide range of artworks from museums, universities, and private collections.',
    imageUrlWebp: '/images/slider/slide-1.webp',
    imageUrlJpg: '/images/slider/slide-1.jpg',
    iconColor: '#ffa500', // Orange for archive
  },
];

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getRandomSize = () => {
  return {
    width: Math.floor(Math.random() * 40) + 80,
    height: Math.floor(Math.random() * 40) + 80,
  };
};

const Slider: React.FC = () => {
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

  useEffect(() => {
    setPaintingProperties(
      paintingProperties.map(() => ({
        color: getRandomColor(),
        size: getRandomSize(),
      }))
    );
  }, [currentPainting]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Keyboard navigation
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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextSlide, goToPrevSlide]);

  const { icon: Icon, title, description, imageUrlWebp, imageUrlJpg, iconColor } = slides[currentSlide];

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      {/* Background image */}
      <picture className="absolute inset-0 w-full h-full z-0">
        <source srcSet={imageUrlWebp} type="image/webp" />
        <source srcSet={imageUrlJpg} type="image/jpeg" />
        <img
          src={imageUrlJpg}
          alt="background"
          className="w-full h-full object-cover transition-filter duration-1000 ease-in-out filter blur-sm hover:blur-none"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      </picture>

      <h1 className="absolute top-40 left-2/2 transform -translate-x-1/2 text-4xl md:text-5xl font-bold z-20 text-center text-white animate-text-slide-in px-4">
        Explore Art Collections with Our Platform
      </h1>

      {/* Progress bar with random colored paintings */}
      <div className="relative z-20 flex items-center justify-center space-x-4 mb-8" style={{ height: '120px' }}>
        {paintingProperties.map((props, index) => (
          <svg
            key={index}
            width={props.size.width}
            height={props.size.height}
            viewBox={`0 0 ${props.size.width} ${props.size.height}`}
            className={`drawing-svg ${currentPainting === index ? 'fly-in' : 'fly-out'}`}
            style={{
              opacity: currentPainting === index ? 1 : 0.5,
              transition: 'all 0.8s ease',
            }}
          >
            <rect
              x="5"
              y="5"
              width={props.size.width - 10}
              height={props.size.height - 10}
              stroke={props.color}
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${(props.size.width + props.size.height) * 2}`}
              strokeDashoffset={
                (props.size.width + props.size.height) * 2 -
                (progress / 100) * (props.size.width + props.size.height) * 2
              }
            />
          </svg>
        ))}
      </div>

      {/* Slide content */}
      <div className="relative z-20 flex flex-col md:flex-row items-center p-8 w-4/5 max-w-xl mt-12 text-center md:text-left">
        <Icon
          className="text-8xl md:text-7xl mb-4 md:mb-0 md:mr-6 animate-icon-bounce"
          style={{ color: iconColor }}
        />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-text-fade-in">{title}</h2>
          <p className="text-lg animate-text-fade-in">{description}</p>
        </div>
      </div>

      {/* Manual slide controls */}
      <div className="flex space-x-4 mt-4 z-10">
        <button className="text-white" onClick={goToPrevSlide} aria-label="Previous Slide">
          &#10094;
        </button>
        <button className="text-white" onClick={goToNextSlide} aria-label="Next Slide">
          &#10095;
        </button>
      </div>

      {/* Slide progress indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 transition-all duration-300 cursor-pointer ${index === currentSlide ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </div>

      <style jsx>{`
          .animate-text-slide-in {
              animation: slideIn 0.6s ease-out forwards;
              opacity: 0;
          }

          @keyframes slideIn {
              0% {
                  transform: translateY(-50px);
                  opacity: 0;
              }
              100% {
                  transform: translateY(0);
                  opacity: 1;
              }
          }

          .animate-text-fade-in {
              animation: fadeIn 0.8s ease forwards;
              opacity: 0;
          }

          @keyframes fadeIn {
              to {
                  opacity: 1;
              }
          }

          .animate-icon-bounce {
              animation: iconBounce 1s ease-out infinite alternate;
          }

          @keyframes iconBounce {
              0% {
                  transform: scale(1);
              }
              100% {
                  transform: scale(1.1);
              }
          }
      `}</style>
    </div>
  );
};

export default Slider;
