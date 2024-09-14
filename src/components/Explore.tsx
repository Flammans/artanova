import { useRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SectionTitle from './SectionTitle.tsx'
import { api } from '../utils/api.ts'
import Artwork from '../types/artwork.ts'
import { AxiosResponse } from 'axios'
import ArtworkModal from './ArtworkModal.tsx'

const Explore = () => {
  const exploreSectionRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  useEffect(() => {
    api.get('/artworks', {}).then((response: AxiosResponse<Artwork[]>) => {
      setArtworks(response.data)
    }).catch((err) => {
      setError(err.message)
    }).finally(() => {
      setIsLoading(false)
    })

  }, [])

  useEffect(() => {
    if (location.pathname === '/explore-collections') {
      exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Render each artwork */}
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-dark-800 p-6 rounded-lg cursor-pointer hover:bg-dark-600"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <h3 className="text-xl font-serif">{artwork.title}</h3>
              {/* Preview image of the artwork */}
              <img src={artwork.preview} alt={artwork.title} className="w-full h-auto mt-4 rounded-lg"/>
            </div>
          ))}
        </div>
      )}

      {/* Popup to view artwork details */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </section>
  )
}

export default Explore