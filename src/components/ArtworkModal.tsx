import React, { useRef, useState, useEffect, useCallback, MouseEvent, WheelEvent } from 'react'
import { X, Share, Plus } from 'phosphor-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'
import 'swiper/swiper.min.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Navigation, Pagination, A11y, EffectFade } from 'swiper'
import FocusLock from 'react-focus-lock'
import { motion } from 'framer-motion'
import Artwork from '../types/artwork'

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [zoomLevel, setZoomLevel] = useState<number>(8) // Default zoom level (8x)
  const [isZoomActive, setIsZoomActive] = useState<boolean>(true) // Zoom is active by default
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 }) // Cursor position
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 }) // Image size
  const [isLensVisible, setIsLensVisible] = useState<boolean>(false) // Lens visibility state
  const zoomLensSize = 150 // Size of the zoom lens

  // Disable scrolling on the main page when the modal is open
  useEffect(() => {
    setIsVisible(true)
    document.body.style.overflow = 'hidden' // Prevent scroll when modal is open
    return () => {
      document.body.style.overflow = '' // Re-enable scroll when modal is closed
    }
  }, [])

  // Handle closing the modal when the 'Escape' key is pressed or toggle zoom with 'Ctrl'
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setIsVisible(false)
        setTimeout(onClose, 300) // Close modal after animation
      } else if (e.key === 'Control') {
        setIsZoomActive((prevState) => !prevState) // Toggle zoom on/off
      }
    },
    [onClose]
  )

  // Add event listener for the 'Escape' key and 'Ctrl' key
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown) // Cleanup on unmount
    }
  }, [handleKeyDown])

  // Handle closing the modal when clicking outside of it
  const handleClickOutside = (e: MouseEvent<HTMLDivElement>): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsVisible(false)
      setTimeout(() => onClose(), 300) // Close modal after animation completes
    }
  }

  // Handle sharing the artwork using the Web Share API
  const handleShare = (): void => {
    const shareData = {
      title: artwork.title,
      text: `Check out this artwork: ${artwork.title}`,
      url: artwork.url,
    }

    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error('Share failed:', error))
    } else {
      alert('Sharing is not supported in your browser.')
    }
  }

  // Handle adding the artwork to the collection
  const handleAddToCollection = (): void => {
    alert(`Artwork "${artwork.title}" added to your collection!`)
  }

  // Handle mouse wheel scroll to zoom in and out
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (isZoomActive) {
      e.preventDefault()
      setZoomLevel((prevZoom) => Math.max(8, Math.max(2, prevZoom + (e.deltaY > 0 ? -1 : 1)))) // Adjust zoom level between 2x and 8x
    }
  }

  // Handle mouse move to update the position of the zoom lens
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate the cursor position without restricting it to image boundaries
    setCursorPos({ x, y })
    setIsLensVisible(true) // Show the lens when mouse moves inside the image
  }

  // Hide the zoom lens when the mouse leaves the image
  const handleMouseLeave = () => {
    setIsLensVisible(false) // Hide the zoom lens without resetting coordinates
  }

  // Handle image loading to capture its dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget
    setImageSize({ width, height })
    setIsImageLoading(false) // Image is loaded, hide the loader
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClickOutside}
    >
      <FocusLock className="w-full flex items-center justify-center">
        <motion.div
          ref={modalRef}
          className="bg-dark p-8 rounded-lg w-full max-w-5xl relative overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          onWheel={handleWheel} // Handle zoom with mouse wheel
        >
          <button
            className="text-white text-xl absolute top-4 right-4"
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(), 300)
            }}
            aria-label="Close"
          >
            <X size={24} weight="bold"/>
          </button>

          <motion.h2
            className="text-3xl text-accent mb-4 font-serif"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {artwork.title}
          </motion.h2>

          <div
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave} // Hide zoom lens when mouse leaves
          >
            {isImageLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-dark">
                <svg
                  className="animate-spin h-10 w-10 text-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            )}

            {/* Swiper slider with fade effect */}
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              onSwiper={(swiper: SwiperType) => console.log('Swiper instance:', swiper)}
              onImagesReady={() => setIsImageLoading(false)} // Hide spinner after images are ready
              modules={[Navigation, Pagination, A11y, EffectFade]} // Enable fade effect
              navigation
              pagination={{ clickable: true }}
              a11y={{ prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide' }}
            >
              {artwork.images.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundPosition: `${(cursorPos.x / imageSize.width) * 100}% ${
                        (cursorPos.y / imageSize.height) * 100
                      }%`,
                      backgroundSize: `${zoomLevel * 100}%`,
                      height: 'auto',
                    }}
                  >
                    <img
                      src={image}
                      alt={`Artwork slide ${index}`}
                      className="w-full h-auto object-contain rounded-lg min-w-full"
                      onLoad={handleImageLoad} // Set image size and hide loader
                    />
                    {/* Zoom lens simulation */}
                    {isZoomActive && isLensVisible && (
                      <div
                        className="absolute rounded-full border border-accent pointer-events-none" // Prevent lens from blocking mouse events
                        style={{
                          width: `${zoomLensSize}px`,
                          height: `${zoomLensSize}px`,
                          top: cursorPos.y - zoomLensSize / 2,
                          left: cursorPos.x - zoomLensSize / 2,
                          backgroundImage: `url(${image})`,
                          backgroundPosition: `${(cursorPos.x / imageSize.width) * 100}% ${
                            (cursorPos.y / imageSize.height) * 100
                          }%`,
                          backgroundSize: `${zoomLevel * 100}%`,
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Zoom hint */}
            <div className="mt-4 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded-lg">
              You can toggle zoom by pressing <strong>Ctrl</strong>. Use the mouse wheel to zoom in and out.
            </div>
          </div>

          <motion.div className="mt-6 space-y-2">
            {artwork.type && <p><strong>Type:</strong> {artwork.type}</p>}
            {artwork.artist && <p><strong>Artist:</strong> {artwork.artist}</p>}
            {artwork.date && <p><strong>Date:</strong> {artwork.date}</p>}
            {artwork.origin && <p><strong>Origin:</strong> {artwork.origin}</p>}
            {artwork.medium && <p><strong>Medium:</strong> {artwork.medium}</p>}
          </motion.div>

          <motion.div className="flex space-x-4 mt-6">
            <motion.button
              className="bg-accent text-dark px-4 py-2 rounded-lg hover:bg-accent-dark flex items-center"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share size={24} weight="bold" className="mr-2"/>
              Share
            </motion.button>

            <motion.button
              className="bg-accent text-dark px-4 py-2 rounded-lg hover:bg-accent-dark flex items-center"
              onClick={handleAddToCollection}
              aria-label="Add to Collection"
            >
              <Plus size={24} weight="bold" className="mr-2"/>
              Add to Collection
            </motion.button>
          </motion.div>
        </motion.div>
      </FocusLock>
    </motion.div>
  )
}

export default ArtworkModal
