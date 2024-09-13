import React from 'react';
import { motion } from 'framer-motion';

// Define prop types for the SectionTitle component
interface SectionTitleProps {
  titleText: string;
  subtitleText: string;
  titleTag: keyof JSX.IntrinsicElements; // Allows passing h1-h6 or other HTML elements
}

// SectionTitle component
const SectionTitle: React.FC<SectionTitleProps> = ({ titleText, subtitleText, titleTag: TitleTag }) => {
  // Define CSS classes for different title sizes based on the chosen tag
  const titleClass = {
    h1: 'text-5xl md:text-6xl',
    h2: 'text-4xl md:text-5xl',
    h3: 'text-3xl md:text-4xl',
    h4: 'text-2xl md:text-3xl',
    h5: 'text-xl md:text-2xl',
    h6: 'text-lg md:text-xl',
  };

  return (
    <div className="text-center pl-4 pr-4">
      {/* Motion wrapper for the title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Render the title with the appropriate tag and size */}
        <TitleTag className={`font-bold font-custom-headline ${titleClass[TitleTag]}`}>
          {titleText}
        </TitleTag>
      </motion.div>

      {/* Motion wrapper for the subtitle */}
      <motion.p
        className="text-lg md:text-xl mt-4 font-custom-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {subtitleText}
      </motion.p>
    </div>
  );
};

export default SectionTitle;
