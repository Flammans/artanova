import { useState, forwardRef, useImperativeHandle } from 'react'
import { AnimatePresence } from 'framer-motion'
import Toast from './Toast'

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface ToastContainerHandles {
  addToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContainer = forwardRef<ToastContainerHandles>((_props, ref) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  // Function to add a new toast
  const addToast = (message: string, type: 'success' | 'error') => {
    const newToast = { id: Date.now(), message, type }
    setToasts((prevToasts) => [...prevToasts, newToast])
  }

  // Function to remove a toast by id
  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  // Expose the addToast function to parent components via ref
  useImperativeHandle(ref, () => ({
    addToast,
  }))

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)}/>
        ))}
      </AnimatePresence>
    </div>
  )
})

export default ToastContainer
