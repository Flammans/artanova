import React, { useRef, useState, useEffect, useCallback, MouseEvent } from 'react'
import { X, CaretLeft, CaretRight } from 'phosphor-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Navigation, Pagination, A11y, EffectFade, Thumbs } from 'swiper/modules'
import FocusLock from 'react-focus-lock'
import { motion } from 'framer-motion'
import Artwork from '../types/artwork'
import DetailsButton from './DetailsButton'
import AddToCollectionButton from './AddToCollectionButton'
import Loader from './Loader'

interface ArtworkModalProps {
  artwork: Artwork;
  artworks: Artwork[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  artworks,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isImageLoading, setIsImageLoading] = useState<boolean[]>(Array(artwork.images.length).fill(true))
  const [animationKey, setAnimationKey] = useState<number>(0)
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

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
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onPrev()
      } else if (e.key === 'ArrowRight') {
        onNext()
      }
    },
    [onClose, onPrev, onNext]
  )

  // Add event listener for keyboard navigation and clean up on unmounting
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Reset image loading state and trigger animation when the artwork changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1) // Update key to trigger re-animation
    setIsImageLoading(Array(artwork.images.length).fill(true)) // Reset loading state for new artwork
  }, [currentIndex, artwork.images.length])

  // Handle image loading to disable loader for the loaded image
  const handleImageLoad = (index: number) => {

    setIsImageLoading((prev) => {
      const newLoadingState = [...prev]
      newLoadingState[index] = false // Disable loader for the loaded image
      return newLoadingState
    })
  }

  // Handle closing the modal when clicking outside of it
  const handleClickOutside = (e: MouseEvent<HTMLDivElement>): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
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
          // onWheel={handleWheel}
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* Close Button */}
          <button
            className="text-white text-xl absolute top-4 right-4"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} weight="bold"/>
          </button>

          {/* Artwork Title with animation */}
          <motion.h2
            key={animationKey}
            className="text-3xl text-accent mb-4 font-serif"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {artwork.title}
          </motion.h2>

          <div className="relative">
            {/* Swiper slider with fade effect and thumbs */}
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              fadeEffect={{ crossFade: true }}
              modules={[Navigation, Pagination, A11y, EffectFade, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              style={{ width: '100%' }} // Ensure slider is always full width
            >
              {artwork.images.map((image: string, index: number) => (
                <SwiperSlide key={index} style={{ width: '100%', minWidth: '100%' }}> {/* Ensures the slide takes 100% width */}
                  <div className="relative flex bg-accent bg-opacity-20" style={{ minHeight: '500px' }}>
                    {/* Show loader while the image is loading */}
                    {isImageLoading[index] && (
                      <div className="absolute inset-0 flex justify-center items-center bg-dark">
                        <Loader/>
                      </div>
                    )}

                    {/* Image that is always rendered but hidden until it's loaded */}
                    <img
                      src={image}
                      alt={`Artwork ${index}`}
                      className="w-full h-auto object-contain duration-500"
                      style={{
                        opacity: isImageLoading[index] ? 0 : 1, // Use opacity to hide image until it's loaded
                      }}
                      onLoad={() => handleImageLoad(index)}
                    />

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Conditionally render Thumbnail Swiper */}
            {artwork.images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
                className="mt-4"
              >
                {artwork.images.map((image: string, index: number) => (
                  <SwiperSlide key={index} style={{ width: '250px', height: '250px' }}> {/* Ensure thumbnails are 250x250px */}
                    <div className="relative w-full h-full flex justify-center items-center bg-accent bg-opacity-10">
                      {/* Loader for thumbnail */}
                      {isImageLoading[index] && (
                        <div className="absolute inset-0 flex justify-center items-center">
                          <Loader/>
                        </div>
                      )}

                      {/* Thumbnail image */}
                      <img
                        src={image}
                        alt={`Thumbnail ${index}`}
                        className="object-cover w-full h-full rounded-lg"
                        style={{
                          opacity: isImageLoading[index] ? 0 : 1, // Use opacity for thumbnail as well
                        }}
                        onLoad={() => handleImageLoad(index)} // Ensure thumbnail also hides loader when loaded
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Artwork Details with animation */}
          <motion.div
            key={`details-${animationKey}`}
            className="mt-6 space-y-2"
            initial={{ opacity: 0 }}
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

            <AddToCollectionButton artworkId={artwork.id}/>

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
