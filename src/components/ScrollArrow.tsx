import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { CaretDown } from '@phosphor-icons/react';

interface ScrollArrowProps {
  targetId: string;   // The ID of the section to scroll to
  tooltipText?: string; // Optional tooltip text to display above the arrow
}

const ScrollArrow: React.FC<ScrollArrowProps> = ({ targetId, tooltipText = "Scroll to next section" }) => {
  const [isHovering, setIsHovering] = useState(false); // Track hover state

  return (
    <motion.div
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer text-accent flex flex-col items-center"
      onMouseEnter={() => setIsHovering(true)}  // Detect hover start
      onMouseLeave={() => setIsHovering(false)} // Detect hover end
    >
      {/* Tooltip text above the arrow, dynamic text */}
      <span className="text-sm text-secondary mb-3">{tooltipText}</span>

      <ScrollLink
        to={targetId}
        smooth={true}
        duration={600}
        offset={-50}
        tabIndex={0}  // Allow keyboard navigation
        aria-label={tooltipText}
      >
        <motion.div
          animate={{
            scaleY: isHovering ? 1.4 : 1,       // Stretch vertically on hover
            scaleX: isHovering ? 0.8 : 1,       // Compress horizontally on hover
          }}
          transition={{
            type: 'spring',                    // Smooth spring animation
            stiffness: 300,                    // Control springiness
            damping: 20,                       // Control bounce effect
          }}
        >
          {/* Icon with dynamic transformation */}
          <motion.div
            className="transition-transform"
            initial={{ opacity: 0.7, scale: 1 }}  // Initial state
            animate={{ opacity: 1, scaleY: [1, 1.2, 1], scaleX: [1, 0.9, 1] }} // Pulsating with deformation
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} // Infinite pulsing
          >
            <CaretDown size={32} weight="bold" className="text-accent" />
          </motion.div>
        </motion.div>
      </ScrollLink>
    </motion.div>
  );
};

export default ScrollArrow;
