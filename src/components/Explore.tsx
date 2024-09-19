import { useRef, useEffect, useState, ChangeEvent } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import SectionTitle from './SectionTitle.tsx'
import { api } from '../utils/api.ts'
import Artwork from '../types/artwork.ts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import ArtworkModal from './ArtworkModal.tsx'
import Masonry from 'react-masonry-css'
import { MagnifyingGlass, CaretDown, CaretRight } from 'phosphor-react'
import { motion } from 'framer-motion'
import AddToCollectionButton from './AddToCollectionButton.tsx'
import DetailsButton from './DetailsButton.tsx'
import Loader from './Loader.tsx'
import throttle from 'lodash/throttle'

// Animated SVGs for various server errors
const ErrorSVG = ({ code }: { code: number }) => {
  const errorSVGs: { [key: number | string]: JSX.Element } = {
    400: (
      <svg className="h-24 w-24 text-accent animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.75L4.75 12H19.25L12 4.75Z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19.25V12M4.75 19.25H19.25"/>
      </svg>
    ),
    401: (
      <svg className="h-24 w-24 text-accent animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 9.75l4.5 4.5M14.25 9.75l-4.5 4.5"/>
      </svg>
    ),
    403: (
      <svg className="h-24 w-24 text-accent animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.25 12H4.75M12 19.25V12"/>
      </svg>
    ),
    404: (
      <svg className="h-24 w-24 text-accent animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 9.75l4.5 4.5M14.25 9.75l-4.5 4.5"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    500: (
      <svg className="h-24 w-24 text-accent animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.75L4.75 12H19.25L12 4.75Z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19.25V12M4.75 19.25H19.25"/>
      </svg>
    ),
    503: (
      <svg className="h-24 w-24 text-accent animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.75 12H19.25"/>
      </svg>
    ),
    default: (
      <svg className="h-24 w-24 text-accent animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2"/>
      </svg>
    )
  }

  return errorSVGs[code] || errorSVGs.default
}

// Custom error component with message
const ErrorMessage = ({ code, message }: { code: number, message: string }) => (
  <div className="flex flex-col items-center justify-center text-center text-white">
    <ErrorSVG code={code}/>
    <h2 className="text-4xl font-serif mt-6">{code} Error</h2>
    <p className="text-lg mt-4">{message}</p>
  </div>
)

const Explore = () => {
  const exploreSectionRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [error, setError] = useState<number | null>(null)
  const [selectedArtworkIndex, setSelectedArtworkIndex] = useState<number | null>(null)
  const searchQueryFromURL = searchParams.get('search') || ''
  const [searchQuery, setSearchQuery] = useState<string>(searchQueryFromURL)
  const [sortField, setSortField] = useState<string>('updatedAt')
  const [sortOrder, setSortOrder] = useState<string>('desc')
  const [filterTypes, setFilterTypes] = useState<{ [key: string]: number }>({})
  const [filterOrigins, setFilterOrigins] = useState<{ [key: string]: number }>({})
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [isFilterOriginsOpen, setIsFilterOriginsOpen] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [screensLeft, setScreensLeft] = useState<number>(0)

  const perPage = 100

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response: AxiosResponse<{ [key: string]: number }> = await api.get('/artworks/types')
        setFilterTypes(response.data)
      } catch (err) {
        console.error('Error fetching artwork types:', err)
      }
    }
    fetchTypes()

    const fetchOrigins = async () => {
      try {
        const response: AxiosResponse<{ [key: string]: number }> = await api.get('/artworks/origins')
        setFilterOrigins(response.data)
      } catch (err) {
        console.error('Error fetching artwork origins:', err)
      }
    }
    fetchOrigins()
  }, [])

  useEffect(() => {
    setSearchQuery(searchQueryFromURL)
  }, [searchQueryFromURL])

  let controller: AbortController

  const fetchData = async (reset: boolean = false) => {
    setIsLoading(true)
    try {
      if (controller) {
        controller.abort()
      }
      controller = new AbortController()
      const response: AxiosResponse<Artwork[]> = await api.get('/artworks', {
        params: {
          search: searchQuery,
          sort: sortField,
          order: sortOrder,
          types: selectedTypes.length > 0 ? selectedTypes.map(type => encodeURIComponent(type)).join(',') : undefined,
          origins: selectedOrigins.length > 0 ? selectedOrigins.map(origin => encodeURIComponent(origin)).join(',') : undefined,
          limit: perPage,
          cursor: !reset && artworks.length > 0 ? artworks[artworks.length - 1].id : undefined
        },
        signal: controller.signal
      })
      setError(null)
      setArtworks((prev) => [...prev, ...response.data.filter(artwork => !prev.find(a => a.id === artwork.id))])
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
  useEffect(() => {
    setArtworks([])
    fetchData(true)
  }, [searchQuery, sortField, sortOrder, selectedTypes, selectedOrigins])

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

  useEffect(() => {
    if (location.pathname === '/explore-collections') {
      exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  const truncateText = (text: string, limit: number = 100): string => {
    return text.length > limit ? text.slice(0, limit) + '...' : text
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    if (selectedValue === 'updatedAt') {
      setSortField('updatedAt')
      setSortOrder('desc')
    } else if (selectedValue === 'yearFrom') {
      setSortField('yearFrom')
      setSortOrder('asc')
    } else if (selectedValue === 'yearTo') {
      setSortField('yearTo')
      setSortOrder('desc')
    }
  }

  const handleTypeChange = (type: string, value: boolean) => {
    setSelectedTypes((prev) =>
      value ? [...prev, type] : prev.filter((t) => t !== type)
    )
  }

  const handleOriginChange = (origin: string, value: boolean) => {
    setSelectedOrigins((prev) =>
      value ? [...prev, origin] : prev.filter((t) => t !== origin)
    )
  }

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

  const breakpointColumnsObj = {
    default: 4,
    1920: 3,
    1280: 2,
    992: 2,
    700: 1
  }

  const sortedFilterTypes = Object.keys(filterTypes).sort()
  const sortedFilterOrigins = Object.keys(filterOrigins).sort()

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
              <MagnifyingGlass size={24} className="absolute left-4 text-dark"/>
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(e.currentTarget.value)}
              />
            </div>
          </div>

          {/* Sort and Order Buttons */}
          <div className="flex flex-col lg:flex-row lg:justify-between items-center w-full px-4 mb-6 gap-4">
            <div className="relative w-full lg:w-auto">
              <select
                value={sortField}
                onChange={handleSortChange}
                className="w-full px-4 py-2 rounded-lg bg-accent text-dark flex items-center gap-2 border border-accent appearance-none pr-14"
              >
                <option value="updatedAt">Sort by: Date Updated</option>
                <option value="yearFrom">Sort by: Oldest Artworks</option>
                <option value="yearTo">Sort by: Newest Artworks</option>
              </select>
              <CaretDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-dark" size={24}/>
            </div>
          </div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-full"
            columnClassName="masonry-grid_column"
          >
            {artworks.map((artwork, index) => {

              return (
                <motion.div
                  key={artwork.id}
                  className="relative bg-dark-800 p-4 rounded-lg group"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: artworks.length <= perPage ? index * 0.05 : 0 }}
                >
                  <h3 className="text-xl font-serif mb-2">{truncateText(artwork.title, 100)}</h3>

                  <div className="relative">
                    <img
                      src={artwork.preview}
                      alt={artwork.title}
                      className="w-full h-auto rounded-lg"
                      onError={(e) => {
                        const placeholder = 'https://placehold.co/600x400?text=' + encodeURIComponent(artwork.title)
                        if (e.currentTarget.src !== placeholder) {
                          e.currentTarget.src = placeholder
                        }
                      }}
                    />
                    <div
                      className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => setSelectedArtworkIndex(index)}
                    >
                      <MagnifyingGlass size={48} className="text-accent"/>
                    </div>
                  </div>

                  <p className="text-sm text-secondary mt-2">
                    {artwork.artist && <span>By {truncateText(artwork.artist, 100)}</span>}
                    {artwork.date && <span> {artwork.date}</span>}
                  </p>

                  <div className="flex space-x-4 mt-4">
                    <DetailsButton
                      onClick={() => window.open(artwork.url, '_blank')}
                      text="Visit Source Website"
                      color="#3B82F6"
                    />
                    <AddToCollectionButton onClick={() => console.log('click')}/>
                  </div>
                </motion.div>
              )

            })}
          </Masonry>

          {/* Error Handling */}
          {error && <ErrorMessage code={error} message="Failed to fetch artworks from server."/>}

          {/* Loading Spinner */}
          {isLoading && <Loader/>}

          {/* Popup to view artwork details */}
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

        {/* Filters Section */}
        <div className="w-full lg:w-1/4 lg:ml-4 mb-6 lg:mb-0 order-first lg:order-last">
          <div className="bg-dark-800 p-4 rounded-lg">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <h3 className="text-lg font-serif">Filter by Type</h3>
              {isFilterOpen ? <CaretDown size={24} className="text-accent"/> : <CaretRight size={24} className="text-accent"/>}
            </div>

            {isFilterOpen && (
              <div className="mt-4 grid grid-cols-1 gap-2">
                {sortedFilterTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      defaultChecked={selectedTypes.includes(type)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleTypeChange(type, event.target.checked)}
                      className="form-checkbox text-accent focus:ring-0"
                    />
                    <label className="text-white">
                      {type} ({filterTypes[type]})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="bg-dark-800 p-4 rounded-lg">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsFilterOriginsOpen(!isFilterOriginsOpen)}>
              <h3 className="text-lg font-serif">Filter by Origin</h3>
              {isFilterOriginsOpen ? <CaretDown size={24} className="text-accent"/> : <CaretRight size={24} className="text-accent"/>}
            </div>

            {isFilterOriginsOpen && (
              <div className="mt-4 grid grid-cols-1 gap-2">
                {sortedFilterOrigins.map((origin) => (
                  <div key={origin} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      defaultChecked={selectedTypes.includes(origin)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleOriginChange(origin, event.target.checked)}
                      className="form-checkbox text-accent focus:ring-0"
                    />
                    <label className="text-white">
                      {origin} ({filterOrigins[origin]})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Explore
