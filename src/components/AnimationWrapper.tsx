import { motion } from 'framer-motion'

interface AnimationWrapperProps {
  children: React.ReactNode;
}

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({ children }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.section>
)

export default AnimationWrapper
