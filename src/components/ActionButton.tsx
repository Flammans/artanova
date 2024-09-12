import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  text: string;       // The text to display on the button
  to: string;         // The path to navigate to when the button is clicked
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, to }) => {
  const navigate = useNavigate();

  // Handle button click to navigate to the specified path
  const handleClick = () => {
    navigate(to);
  };

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
  );
};

export default ActionButton;
