import { useRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SectionTitle from './SectionTitle.tsx'
import { api } from '../utils/api.ts'
import Artwork from '../types/artwork.ts'
import { AxiosResponse } from 'axios'
import ArtworkModal from './ArtworkModal.tsx'
import Masonry from 'react-masonry-css'
import DetailsButton from './DetailsButton'
import AddToCollectionButton from './AddToCollectionButton'
import { MagnifyingGlass } from 'phosphor-react'

const Explore = () => {
  const exploreSectionRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedArtworkIndex, setSelectedArtworkIndex] = useState<number | null>(null)

  // Fetch the artworks data from the API
  useEffect(() => {
    api.get('/artworks', {})
      .then((response: AxiosResponse<Artwork[]>) => {
        setArtworks(response.data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Scroll to explore section if location matches
  useEffect(() => {
    if (location.pathname === '/explore-collections') {
      exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedArtworkIndex(null)
  }

  // Handle navigating to the previous artwork in the modal
  const handlePrevArtwork = () => {
    if (selectedArtworkIndex !== null && selectedArtworkIndex > 0) {
      setSelectedArtworkIndex(selectedArtworkIndex - 1)
    }
  }

  // Handle navigating to the next artwork in the modal
  const handleNextArtwork = () => {
    if (selectedArtworkIndex !== null && selectedArtworkIndex < artworks.length - 1) {
      setSelectedArtworkIndex(selectedArtworkIndex + 1)
    }
  }

  // Masonry grid breakpoint columns configuration
  const breakpointColumnsObj = {
    default: 4, // 4 columns for large screens
    1100: 3, // 3 columns for medium screens
    992: 2, // 2 columns for smaller screens
    700: 1 // 1 column for mobile
  }

  return (
    <section
      id="explore-section"
      ref={exploreSectionRef}
      className="min-h-screen bg-dark text-white flex flex-col items-center justify-start pt-40"
    >
      {/* Section Title */}
      <SectionTitle
        titleText="Explore Artworks"
        subtitleText="Browse and Curate Your Own Art Collections from a World of Masterpieces."
        titleTag="h2"
      />
      <div className="mt-10 mb-5 w-full h-0.5 bg-accent"></div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <svg
            className="animate-spin h-12 w-12 text-accent"
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
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        // Masonry Grid for artworks
        <Masonry
          breakpointCols={breakpointColumnsObj} // Masonry columns config based on screen size
          className="flex w-full"
          columnClassName="masonry-grid_column" // Default class for columns
        >
          {/* Render each artwork */}
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="relative bg-dark-800 p-4 rounded-lg group"
            >
              <h3 className="text-xl font-serif mb-2">{artwork.title}</h3>

              {/* Preview image of the artwork with hover effect */}
              <div className="relative">
                <img
                  src={artwork.preview}
                  alt={artwork.title}
                  className="w-full h-auto rounded-lg"
                />
                {/* Magnifying glass icon appears on hover */}
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                     onClick={() => setSelectedArtworkIndex(index)} // Open modal when clicking on image or icon
                >
                  <MagnifyingGlass size={48} className="text-accent"/>
                </div>
              </div>

              {/* Artist and date, if available */}
              <p className="text-sm text-secondary mt-2">
                {artwork.artist && <span>By {artwork.artist}</span>}
                {artwork.date && <span>, {artwork.date}</span>}
              </p>

              {/* Buttons under each artwork */}
              <div className="flex space-x-4 mt-4">
                <DetailsButton
                  onClick={() => window.open(artwork.url, '_blank')}
                  text="Visit Source Website"
                  color="#3B82F6" // Custom background color for the button (blue)
                />
                <AddToCollectionButton
                  onClick={() => console.log('click')}
                />
              </div>
            </div>
          ))}
        </Masonry>
      )}

      {/* Popup to view artwork details */}
      {selectedArtworkIndex !== null && (
        <ArtworkModal
          artwork={artworks[selectedArtworkIndex]} // Pass the current artwork
          artworks={artworks} // Pass the full list of artworks for pagination
          currentIndex={selectedArtworkIndex} // Current index of the selected artwork
          onClose={handleCloseModal} // Close the modal
          onPrev={handlePrevArtwork} // Navigate to the previous artwork
          onNext={handleNextArtwork} // Navigate to the next artwork
        />
      )}
    </section>
  )
}

export default Explore
