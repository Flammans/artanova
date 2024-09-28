import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { scroller } from 'react-scroll'

interface ActionButtonProps {
  text: string;       // The text to display on the button
  to: string;         // The path to navigate to
  targetId?: string;  // Optional: The ID of the section to scroll to
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, to, targetId }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Function to handle the navigation or scrolling
  const handleClick = () => {
    if (location.pathname === '/' && targetId) {
      // If already on the homepage, scroll to the target section
      scroller.scrollTo(targetId, {
        smooth: true,
        duration: 600,
        offset: -50,  // Offset for fixed header, if needed
      })
    } else {
      // If not on the homepage, navigate to the homepage and scroll to the target
      navigate(to)

      // After navigation, scroll to the target section on the new page
      if (targetId) {
        setTimeout(() => {
          scroller.scrollTo(targetId, {
            smooth: true,
            duration: 600,
            offset: -50,
          })
        }, 100) // Delay to ensure the page has loaded
      }
    }
  }

  return (
    <motion.button
      className="
        mt-6 px-8 py-3
        bg-accent text-primary font-bold text-lg
        rounded-lg border-2 border-accent
        hover:bg-primary hover:text-accent
        transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
      "
      onClick={handleClick}
      aria-label={text}
    >
      {text}
    </motion.button>
  )
}

export default ActionButton
