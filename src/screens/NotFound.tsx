import { motion } from 'framer-motion';
import ActionButton from '../components/ActionButton.tsx'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white">
      {/* New SVG Animation */}
      <motion.div
        className="mb-8"
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rotating square */}
          <motion.rect
            x="25"
            y="25"
            width="50"
            height="50"
            stroke="#FFD700"
            strokeWidth="5"
            fill="transparent"
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          {/* Smaller square */}
          <motion.rect
            x="35"
            y="35"
            width="30"
            height="30"
            stroke="#FFD700"
            strokeWidth="3"
            fill="transparent"
            initial={{ rotate: 0 }}
            animate={{ rotate: -180 }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </svg>
      </motion.div>

      {/* Error Code */}
      <h1 className="text-8xl md:text-9xl font-bold text-gold mb-4">
        404
      </h1>

      {/* Error Description */}
      <p className="text-lg md:text-xl text-gray-300">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Action button to navigate back home */}
      <ActionButton text="Go Back Home" to="/" />
    </div>
  );
};

export default NotFound;
