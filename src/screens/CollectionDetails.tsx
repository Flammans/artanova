import React, {useEffect, useState, useRef} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import ShareButton from '../components/ShareButton'
import ArtworkGrid from '../components/ArtworkGrid'
import ArtworkModal from '../components/ArtworkModal'
import {api} from '../utils/api'
import Collection from '../types/collection'
import Loader from '../components/Loader'
import {Trash} from 'phosphor-react'
import ToastContainer from '../components/ToastContainer'
import NotFound from './NotFound.tsx'
import {deleteCollection} from '../stores/collectionsSlice.ts'
import {useAppDispatch, useAppSelector} from '../stores/hooks.ts'

const CollectionDetails: React.FC = () => {

  const userId = useAppSelector((state) => state.user.id)

  const {uuid} = useParams<{ uuid: string }>() // Get collection UUID from URL
  const dispatch = useAppDispatch()
  const navigate = useNavigate() // For redirecting after collection deletion
  const [collection, setCollection] = useState<Collection | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedArtworkIndex, setSelectedArtworkIndex] = useState<number | null>(null)
  const toastRef = useRef<{ addToast: (message: string, type: 'success' | 'error') => void } | null>(null) // Ref for managing toasts

  const fetchCollection = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/collections/${uuid}`)
      setCollection(response.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching collection:', error)
      setError('Failed to load collection')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCollection()
  }, [uuid])

  // Function to handle deleting the collection
  const handleDeleteCollection = async (collectionUuid: string) => {
    try {
      await dispatch(deleteCollection(collectionUuid))
      toastRef.current?.addToast('Collection deleted successfully!', 'success')
      navigate('/collections') // Redirect to collections page after deletion is successful
    } catch (error) {
      console.error(error)
      toastRef.current?.addToast('Error deleting the collection.', 'error')
    }
  }

  if (isLoading) {
    return <Loader/>
  }

  if (error || !collection) {
    return <NotFound/>
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
    if (selectedArtworkIndex !== null && selectedArtworkIndex < collection.elements.length - 1) {
      setSelectedArtworkIndex(selectedArtworkIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-dark text-white p-8 pt-40">
      {/* Section title */}
      <SectionTitle
        titleText={collection.title}
        subtitleText="Explore the artworks in this collection"
        titleTag="h2"
      />

      {/* Share Button aligned to the right */}
      <div className="flex justify-end mt-4">
        <ShareButton shareUrl={`${window.location.origin}/collections/${uuid}`}/>
      </div>

      {/* Artwork grid */}
      <ArtworkGrid
        artworks={collection.elements.map((element) => element.artwork)} // Map collection elements to artworks
        onViewArtwork={setSelectedArtworkIndex} // Handle artwork selection for the modal
        isInCollectionPage={collection.userId === userId} // Indicate that this is a collection page
        collectionUuid={uuid} // Pass collection UUID to the grid
        fetchCollection={fetchCollection} // Refetch collection after deleting an artwork
      />

      {/* Modal for artwork details */}
      {selectedArtworkIndex !== null && (
        <ArtworkModal
          artwork={collection.elements[selectedArtworkIndex].artwork}
          artworks={collection.elements.map((element) => element.artwork)}
          currentIndex={selectedArtworkIndex}
          onClose={handleCloseModal}
          onPrev={handlePrevArtwork}
          onNext={handleNextArtwork}
        />
      )}

      {/* Delete collection button */}
      {collection.userId === userId && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => handleDeleteCollection(collection.uuid)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition duration-300 ease-in-out"
            aria-label="Delete collection"
          >
            <Trash size={24}/>
            <span>Delete Collection</span>
          </button>
        </div>
      )}

      {/* Toast Container for managing toasts */}
      <ToastContainer ref={toastRef}/>
    </div>
  )
}

export default CollectionDetails
