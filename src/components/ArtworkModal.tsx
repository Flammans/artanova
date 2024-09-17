import React, { useRef, useState, useEffect, useCallback, MouseEvent, WheelEvent } from 'react'
import { X, CaretLeft, CaretRight } from 'phosphor-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Navigation, Pagination, A11y, EffectFade } from 'swiper/modules'
import FocusLock from 'react-focus-lock'
import { motion } from 'framer-motion'
import Artwork from '../types/artwork'
import DetailsButton from './DetailsButton'
import AddToCollectionButton from './AddToCollectionButton'

interface ArtworkModalProps {
  artwork: Artwork;
  artworks: Artwork[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, artworks, currentIndex, onClose, onPrev, onNext }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true)  // Loader state for image loading
  const [zoomLevel, setZoomLevel] = useState<number>(8)
  const [isZoomActive, setIsZoomActive] = useState<boolean>(true)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [isLensVisible, setIsLensVisible] = useState<boolean>(false)
  const zoomLensSize = 250
  const [animationKey, setAnimationKey] = useState<number>(0)

  // Disable scrolling on the main page when the modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Handle closing the modal when the 'Escape' key is pressed, toggle zoom with 'Ctrl', and navigate with 'ArrowLeft'/'ArrowRight'
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setTimeout(onClose, 300)  // Close modal after animation
      } else if (e.key === 'Control') {
        setIsZoomActive((prevState) => !prevState)  // Toggle zoom on/off
      } else if (e.key === 'ArrowLeft') {
        onPrev()  // Go to previous artwork
      } else if (e.key === 'ArrowRight') {
        onNext()  // Go to next artwork
      }
    },
    [onClose, onPrev, onNext]
  )

  // Add event listener for keyboard navigation and clean up on unmount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Trigger animation when the artwork changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1)  // Update key to trigger re-animation
  }, [currentIndex])

  // Handle closing the modal when clicking outside of it
  const handleClickOutside = (e: MouseEvent<HTMLDivElement>): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setTimeout(() => onClose(), 300)  // Close modal after animation completes
    }
  }

  // Handle mouse wheel scroll to zoom in and out
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (isZoomActive) {
      e.preventDefault()
      setZoomLevel((prevZoom) => Math.max(8, Math.max(2, prevZoom + (e.deltaY > 0 ? -1 : 1))))  // Adjust zoom level
    }
  }

  // Handle mouse move to update the position of the zoom lens
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCursorPos({ x, y })
    setIsLensVisible(true)  // Show the lens when mouse moves inside the image
  }

  // Hide the zoom lens when the mouse leaves the image
  const handleMouseLeave = () => {
    setIsLensVisible(false)
  }

  // Handle image loading to capture its dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget
    setImageSize({ width, height })
    setIsImageLoading(false)  // Disable loader after image has loaded
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
          onWheel={handleWheel}
          style={{ maxHeight: 'calc(100vh - 50px)' }}
        >
          {/* Close Button */}
          <button
            className="text-white text-xl absolute top-4 right-4"
            onClick={() => {
              setTimeout(() => onClose(), 300)
            }}
            aria-label="Close"
          >
            <X size={24} weight="bold"/>
          </button>

          {/* Artwork Title with animation */}
          <motion.h2
            key={animationKey}  // Changing key forces re-render and triggers animation
            className="text-3xl text-accent mb-4 font-serif"
            initial={{ opacity: 0, y: -20 }}  // Start position for animation
            animate={{ opacity: 1, y: 0 }}  // End position for animation
            transition={{ duration: 0.5 }}
          >
            {artwork.title}
          </motion.h2>
          <div className="relative">
            {/* Show loader if the image is still loading */}
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
              modules={[Navigation, Pagination, A11y, EffectFade]}
              navigation
              pagination={{ clickable: true }}
            >
              {artwork.images.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundPosition: `${(cursorPos.x / imageSize.width) * 100}% ${(cursorPos.y / imageSize.height) * 100}%`,
                      backgroundSize: `${zoomLevel * 100}%`,
                      height: 'auto',
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={image}
                      alt={`Artwork slide ${index}`}
                      className="w-full h-auto object-contain rounded-lg min-w-full"
                      onLoad={handleImageLoad}  // Set image size and disable loader on load
                    />

                    {/* Zoom lens simulation */}
                    {isZoomActive && isLensVisible && (
                      <div
                        className="absolute rounded-full border border-accent pointer-events-none"
                        style={{
                          width: `${zoomLensSize}px`,
                          height: `${zoomLensSize}px`,
                          top: cursorPos.y - zoomLensSize / 2,
                          left: cursorPos.x - zoomLensSize / 2,
                          backgroundImage: `url(${image})`,
                          backgroundPosition: `${(cursorPos.x / imageSize.width) * 100}% ${(cursorPos.y / imageSize.height) * 100}%`,
                          backgroundSize: `${zoomLevel * 100}%`,
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Zoom hint */}
          <div className="mt-4 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded-lg">
            You can toggle zoom by pressing <strong>Ctrl</strong>. Use the mouse wheel to zoom in and out.
          </div>

          {/* Artwork Details with animation */}
          <motion.div
            key={`details-${animationKey}`}  // Different key for details to trigger re-animation
            className="mt-6 space-y-2"
            initial={{ opacity: 0 }}  // Fade in animation for details
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {artwork.type && <p><strong>Type:</strong> {artwork.type}</p>}
            {artwork.artist && <p><strong>Artist:</strong> {artwork.artist}</p>}
            {artwork.date && <p><strong>Date:</strong> {artwork.date}</p>}
            {artwork.origin && <p><strong>Origin:</strong> {artwork.origin}</p>}
            {artwork.medium && <p><strong>Medium:</strong> {artwork.medium}</p>}
          </motion.div>

          {/* Buttons */}
          <motion.div className="flex space-x-4 mt-6">
            <DetailsButton
              onClick={() => window.open(artwork.url, '_blank')}
              text="Visit Source Website"
              color="#3B82F6"
            />

            <AddToCollectionButton
              onClick={() => alert(`Artwork "${artwork.title}" added to your collection!`)}
            />

            {/* Previous Button */}
            {artworks.length > 1 && currentIndex > 0 && (
              <motion.button
                onClick={onPrev}
                className="bg-accent text-dark px-4 py-2 rounded-lg hover:bg-accent-dark flex items-center"
              >
                <CaretLeft size={24} weight="bold" className="mr-2"/>
                Previous
              </motion.button>
            )}

            {/* Next Button */}
            {artworks.length > 1 && currentIndex < artworks.length - 1 && (
              <motion.button
                onClick={onNext}
                className="bg-accent text-dark px-4 py-2 rounded-lg hover:bg-accent-dark flex items-center"
              >
                Next
                <CaretRight size={24} weight="bold" className="ml-2"/>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </FocusLock>
    </motion.div>
  )
}

export default ArtworkModal
