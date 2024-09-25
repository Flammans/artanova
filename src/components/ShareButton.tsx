import React, { useRef } from 'react'
import { ShareNetwork } from 'phosphor-react'
import ToastContainer from './ToastContainer' // Import ToastContainer

interface ShareButtonProps {
  shareUrl: string; // URL to share
  message?: string; // Optional message, default: 'Share Collection'
}

const ShareButton: React.FC<ShareButtonProps> = ({ shareUrl, message = 'Share Collection' }) => {
  // Reference to the toast container
  const toastRef = useRef<{ addToast: (message: string, type: 'success' | 'error') => void } | null>(null)

  const handleShare = () => {
    // Copy the shareUrl to the clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        // Show success toast when the link is copied
        toastRef.current?.addToast('Link copied to clipboard!', 'success')
      })
      .catch(() => {
        // Show error toast if copying fails
        toastRef.current?.addToast('Failed to copy the link.', 'error')
      })
  }

  return (
    <>
      <button
        className="flex items-center mt-4 text-blue-500 hover:text-blue-700 transition"
        onClick={handleShare}
      >
        <ShareNetwork size={24} className="mr-2"/>
        {message}
      </button>

      {/* Toast Container for managing toasts */}
      <ToastContainer ref={toastRef}/>
    </>
  )
}

export default ShareButton
