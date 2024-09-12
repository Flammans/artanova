import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: number; // Size in pixels
}

const Logo: React.FC<LogoProps> = ({ size = 48 }) => {
  return (
    <motion.div
      className="font-serif font-bold text-gold focus:outline-none focus:ring-4 focus:ring-accent"
      style={{ fontSize: `${size}px` }} // Dynamically set size
      tabIndex={0}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1, rotate: 3 }} // Slight rotate and scale on hover
      whileFocus={{ scale: 1.05, opacity: 0.9 }} // Slightly smaller and more transparent on focus
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      aria-label="Artanova Logo"
    >
      Artanova
    </motion.div>
  );
};

export default Logo;
