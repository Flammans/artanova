import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface LogoProps {
  size?: number; // Size in pixels
}

const Logo: React.FC<LogoProps> = ({ size = 48 }) => {
  const navigate = useNavigate();  // Hook for navigation
  const location = useLocation();  // Hook to get current location

  // Handle click on logo
  const handleClick = () => {
    // If we are not on the homepage, navigate to it
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <motion.div
      className="font-serif font-bold text-gold focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer p-2"
      style={{ fontSize: `${size}px` }} // Dynamically set size
      tabIndex={0}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1, rotate: 3 }} // Slight rotate and scale on hover
      whileFocus={{ scale: 1.05, opacity: 0.9 }} // Slightly smaller and more transparent on focus
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      aria-label="Artanova Logo"
      onClick={handleClick} // Navigate on click
      onKeyPress={(e) => e.key === 'Enter' && handleClick()} // Handle "Enter" for keyboard users
    >
      Artanova
    </motion.div>
  );
};

export default Logo;
