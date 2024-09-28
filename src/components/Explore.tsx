import { useRef, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { api } from '../utils/api'
import throttle from 'lodash/throttle'
import { MagnifyingGlass } from 'phosphor-react' // Import search icon
import SectionTitle from './SectionTitle'
import SortAndFilter from './SortAndFilter'
import ArtworkGrid from './ArtworkGrid'
import ArtworkModal from './ArtworkModal'
import FilterPanel from './FilterPanel'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'
import { motion } from 'framer-motion'
import Artwork from '../types/artwork'

const Explore = () => {
  const exploreSectionRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<number | null>(null)
  const [sortField, setSortField] = useState<string>('updatedAt')
  const [sortOrder, setSortOrder] = useState<string>('desc')
  const [filterTypes, setFilterTypes] = useState<{ [key: string]: number }>({})
  const [filterOrigins, setFilterOrigins] = useState<{ [key: string]: number }>({})
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [screensLeft, setScreensLeft] = useState<number>(0)
  const [selectedArtworkIndex, setSelectedArtworkIndex] = useState<number | null>(null)
  const perPage = 100
  let controller: AbortController | undefined

  // Scroll to the explore section when URL contains `/explore-collections`
  useEffect(() => {
    if (location.pathname === '/explore-collections') {
      exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      navigate('/', { replace: true })
    }
  }, [location, navigate])

  // Fetch artwork types and origins for filtering
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.get('/artworks/types')
        setFilterTypes(response.data)
      } catch (err) {
        console.error('Error fetching artwork types:', err)
      }
    }
    fetchTypes()

    const fetchOrigins = async () => {
      try {
        const response = await api.get('/artworks/origins')
        setFilterOrigins(response.data)
      } catch (err) {
        console.error('Error fetching artwork origins:', err)
      }
    }
    fetchOrigins()
  }, [])

  // Fetch data from the API, ensuring we handle errors and support pagination
  const fetchData = async (reset: boolean = false) => {
    setIsLoading(true)
    try {
      if (controller) {
        controller.abort()
      }
      controller = new AbortController()

      const response = await api.get('/artworks', {
        params: {
          search: searchQuery,
          sort: sortField,
          order: sortOrder,
          types: selectedTypes.length > 0 ? selectedTypes.join(',') : undefined,
          origins: selectedOrigins.length > 0 ? selectedOrigins.join(',') : undefined,
          limit: perPage,
          cursor: !reset && artworks.length > 0 ? artworks[artworks.length - 1].id : undefined,
        },
        signal: controller.signal,
      })

      setError(null)
      // Prevent duplicates by filtering out artworks already in the list
      setArtworks((prev) => [...prev, ...response.data.filter((artwork: { id: number }) => !prev.find(a => a.id === artwork.id))])
      setHasMore(response.data.length === perPage)
      setIsLoading(false)
    } catch (err) {
      if (axios.isCancel(err)) {
        return
      }
      if (err instanceof AxiosError) {
        setError(err.response?.status || 500)
      } else {
        setError(500)
      }
      setHasMore(false)
      setIsLoading(false)
    }
  }

  // Fetch new data when filters, sort, or search query changes
  useEffect(() => {
    setArtworks([])
    fetchData(true)
  }, [searchQuery, sortField, sortOrder, selectedTypes, selectedOrigins])

  // Handle infinite scroll
  useEffect(() => {
    const updatePosition = () => {
      setScreensLeft((document.body.scrollHeight - window.scrollY - window.innerHeight) / window.innerHeight)
    }
    window.addEventListener('scroll', throttle(updatePosition, 100))
    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  useEffect(() => {
    if (screensLeft < 2 && hasMore && !isLoading) {
      fetchData()
    }
  }, [screensLeft])

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortField(value)
    setSortOrder(value === 'updatedAt' || value === 'yearTo' ? 'desc' : 'asc')
  }

  // Handle type and origin filter changes
  const handleTypeChange = (type: string, value: boolean) => {
    setSelectedTypes((prev) => (value ? [...prev, type] : prev.filter((t) => t !== type)))
  }

  const handleOriginChange = (origin: string, value: boolean) => {
    setSelectedOrigins((prev) => (value ? [...prev, origin] : prev.filter((o) => o !== origin)))
  }

  // Modal handling
  const handleCloseModal = () => {
    setSelectedArtworkIndex(null)
  }

  const handlePrevArtwork = () => {
    if (selectedArtworkIndex !== null && selectedArtworkIndex > 0) {
      setSelectedArtworkIndex(selectedArtworkIndex - 1)
    }
  }

  const handleNextArtwork = () => {
    if (selectedArtworkIndex !== null && selectedArtworkIndex < artworks.length - 1) {
      setSelectedArtworkIndex(selectedArtworkIndex + 1)
    }
  }

  return (
    <motion.section
      id="explore-section"
      ref={exploreSectionRef}
      className="min-h-screen bg-dark text-white flex flex-col items-center justify-start pt-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <SectionTitle
        titleText="Explore Artworks"
        subtitleText="Browse and Curate Your Own Art Collections from a World of Masterpieces."
        titleTag="h2"
      />
      <motion.div className="mt-10 mb-5 w-full h-0.5 bg-accent"/>

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-3/4 pt-4">
          {/* Search Field */}
          <div className="relative w-full px-4 mb-4">
            <div className="relative flex items-center">
              <MagnifyingGlass size={24} className="absolute left-4 text-dark"/> {/* Search icon */}
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
                onKeyDown={(e) => e.key === 'Enter' && fetchData(true)}
              />
            </div>
          </div>

          {/* Sort and Filter */}
          <div className="px-4 mb-6"> {/* Wrapper to align with content */}
            <SortAndFilter sortField={sortField} onSortChange={handleSortChange}/>
          </div>

          {/* Artwork Grid */}
          <ArtworkGrid
            artworks={artworks}
            onViewArtwork={setSelectedArtworkIndex} // Function to open modal
          />

          {/* Modal for artwork details */}
          {selectedArtworkIndex !== null && (
            <ArtworkModal
              artwork={artworks[selectedArtworkIndex]}
              artworks={artworks}
              currentIndex={selectedArtworkIndex}
              onClose={handleCloseModal}
              onPrev={handlePrevArtwork}
              onNext={handleNextArtwork}
            />
          )}
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filterTypes={filterTypes}
          filterOrigins={filterOrigins}
          selectedTypes={selectedTypes}
          selectedOrigins={selectedOrigins}
          onTypeChange={handleTypeChange}
          onOriginChange={handleOriginChange}
        />
      </div>

      {/* Error handling */}
      {error && <ErrorMessage code={error} message="Failed to load artworks from the server."/>}

      {/* Loading spinner */}
      {isLoading && <Loader/>}
    </motion.section>
  )
}

export default Explore
