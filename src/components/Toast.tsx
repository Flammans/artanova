import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {X, CheckCircle, WarningCircle} from 'phosphor-react'

interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error';
  removeToast: () => void;
}

const Toast: React.FC<ToastProps> = ({message, type, removeToast}) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Decrease the progress bar over 5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 0.5, 0))
    }, 25)

    // Automatically close the toast after 5 seconds
    const timeout = setTimeout(() => {
      removeToast()
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  const progressBarWidth = `${progress}%`

  return (
    <motion.div
      className={`relative flex items-start p-4 rounded-lg shadow-lg w-80 mb-4 text-white 
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
      initial={{opacity: 0, x: 50}}
      animate={{opacity: 1, x: 0}}
      exit={{opacity: 0, x: 50}}
    >
      <div className="mr-3">
        {type === 'success' ? (
          <CheckCircle size={32} weight="fill" className="text-white"/>
        ) : (
          <WarningCircle size={32} weight="fill" className="text-white"/>
        )}
      </div>
      <div className="flex-1">
        <p className="font-serif text-lg">{message}</p>
        <div className="w-full h-1 bg-white bg-opacity-20 mt-2 rounded">
          <div
            className="h-full bg-white transition-width ease-linear"
            style={{width: progressBarWidth}}
          />
        </div>
      </div>
      <button
        className="absolute top-2 right-2 text-white"
        onClick={removeToast}
        aria-label="Close"
      >
        <X size={24}/>
      </button>
    </motion.div>
  )
}

export default Toast
