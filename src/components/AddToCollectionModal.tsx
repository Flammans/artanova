import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, PlusCircle, Sparkle, CaretDown, CaretUp } from 'phosphor-react'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { addArtworkToCollection, createCollection } from '../stores/collectionsSlice'
import ToastContainer from './ToastContainer'

interface AddToCollectionModalProps {
  artworkId: number;
  onClose: () => void;
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ artworkId, onClose }) => {
  const dispatch = useAppDispatch()
  const collections = useAppSelector((state) => state.collections.collections)

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCollections, setFilteredCollections] = useState(collections)
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const toastRef = useRef<{ addToast: (message: string, type: 'success' | 'error') => void } | null>(null)

  // Fetch collections on mount
  // useEffect(() => {
  //   dispatch(loadCollections())
  // }, [dispatch])

  // Update filtered collections based on search input
  useEffect(() => {
    setFilteredCollections(
      collections.filter((collection) =>
        collection.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, collections])

  const handleAddToCollection = async () => {
    if (selectedCollection) {
      try {
        await dispatch(addArtworkToCollection(selectedCollection, artworkId))
        toastRef.current?.addToast('Artwork successfully added to the collection.', 'success')
        onClose() // Close the modal after successful addition
      } catch (error) {
        toastRef.current?.addToast('Error adding artwork to the collection.', 'error')
      }
    }
  }

  const handleCreateCollection = async () => {
    if (newCollectionName.trim()) {
      try {
        await dispatch(createCollection(newCollectionName.trim()))
        setNewCollectionName('')
        toastRef.current?.addToast(
          `Collection "${newCollectionName}" created successfully. Don't forget to add the artwork to this collection!`,
          'success'
        )
      } catch (error) {
        console.error(error)
        toastRef.current?.addToast('Error creating the collection.', 'error')
      }
    }
  }

  const handleCollectionSelect = (uuid: string, title: string) => {
    setSelectedCollection(uuid)
    setSearchTerm(title)
    setDropdownOpen(false)
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 ml-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-dark p-8 rounded-lg shadow-lg max-w-lg w-full relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white"
            aria-label="Close modal"
          >
            <X size={24}/>
          </button>

          {/* Big icon with animation */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="text-accent"
              animate={{ rotate: [0, 20, -20, 0], transition: { repeat: Infinity, duration: 2 } }}
            >
              <Sparkle size={64} weight="fill"/>
            </motion.div>
          </div>

          {/* Modal Title */}
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">Add Artwork to Collection</h2>

          {/* Modal Description */}
          <p className="text-sm text-gray-400 mb-6 text-center">
            Select an existing collection or create a new one below.
          </p>

          {/* Searchable collection dropdown */}
          <div className="relative mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search or select a collection"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="w-full border border-gray-300 rounded-lg py-4 px-4 pr-12 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                {isDropdownOpen ? <CaretUp size={24}/> : <CaretDown size={24}/>}
              </button>
            </div>

            {/* Dropdown list */}
            {isDropdownOpen && (
              <ul className="absolute z-10 mt-2 max-h-40 w-full overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                {filteredCollections.length > 0 ? (
                  filteredCollections.map((collection) => (
                    <li
                      key={collection.uuid}
                      onClick={() => handleCollectionSelect(collection.uuid, collection.title)}
                      className={`px-4 py-2 cursor-pointer hover:bg-accent hover:text-white ${
                        selectedCollection === collection.uuid ? 'bg-accent text-white' : 'text-dark'
                      }`}
                    >
                      {collection.title}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No collections found</li>
                )}
              </ul>
            )}
          </div>

          {/* New collection input and button */}
          <p className="text-center text-sm text-gray-400 mb-4">Or create a new collection below</p>
          <div className="mb-4">
            <input
              type="text"
              placeholder="New collection name"
              className="w-full border border-gray-300 rounded-lg py-4 px-4 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreateCollection}
            className="w-full bg-accent text-white py-4 rounded-lg flex items-center justify-center hover:bg-accent-dark transition"
          >
            <PlusCircle size={24} className="mr-2"/>
            Create Collection
          </button>

          {/* Add to collection button */}
          <button
            onClick={handleAddToCollection}
            disabled={!selectedCollection}
            className="w-full mt-4 bg-accent text-white py-4 rounded-lg disabled:bg-gray-300 hover:bg-accent-dark transition disabled:cursor-not-allowed"
          >
            Add to Collection
          </button>
        </motion.div>
      </motion.div>

      {/* Toast Container for managing toasts inside the modal */}
      <ToastContainer ref={toastRef}/>
    </>
  )
}

export default AddToCollectionModal
