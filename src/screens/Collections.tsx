import React, { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { fetchCollections, createCollection, deleteCollection } from '../stores/collectionsSlice'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { motion } from 'framer-motion'
import ShareButton from '../components/ShareButton'
import { Trash, MagnifyingGlass, PlusCircle } from 'phosphor-react'
import ToastContainer from '../components/ToastContainer'

const Collections: React.FC = () => {
  const dispatch = useAppDispatch()
  const collections = useAppSelector((state) => state.collections.collections)
  const userId = useAppSelector((state) => state.user.id)
  const toastRef = useRef<{ addToast: (message: string, type: 'success' | 'error') => void } | null>(null)

  // State for search input
  const [searchTerm, setSearchTerm] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    // Fetch collections from the API
    dispatch(fetchCollections())
  }, [dispatch])

  // Function to delete a collection
  const handleDelete = async (collectionUuid: string) => {
    try {
      await dispatch(deleteCollection(collectionUuid))
      toastRef.current?.addToast('Collection deleted successfully!', 'success')
    } catch (error) {
      console.error(error)
      toastRef.current?.addToast('Error deleting the collection.', 'error')
    }
  }

  // Function to create a new collection
  const handleCreateCollection = async () => {
    if (newCollectionName.trim()) {
      try {
        await dispatch(createCollection(newCollectionName.trim()))
        setNewCollectionName('')
        toastRef.current?.addToast(`Collection "${newCollectionName}" created successfully!`, 'success')
      } catch (error) {
        console.error(error)
        toastRef.current?.addToast('Error creating the collection.', 'error')
      }
    }
  }

  // Filter collections based on search term
  const filteredCollections = collections.filter((collection) =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Animation settings for collection items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Initial hidden state
    visible: {
      opacity: 1,
      y: 0,
      transition: (custom: number) => ({
        delay: custom * 0.2, // Delay for each item based on its index
        duration: 0.5,
      }),
    },
  }

  return (
    <div className="min-h-screen bg-dark text-white p-8 pt-40">
      <SectionTitle titleText="Your Collections" subtitleText="Explore and manage your collections" titleTag="h1"/>

      {/* Flex container for search and new collection input */}
      <div className="relative w-full mx-auto mb-10 mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full lg:w-1/2">
          <div className="relative flex items-center">
            <MagnifyingGlass size={24} className="absolute left-4 text-dark"/>
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
              aria-label="Search collections"
            />
          </div>
        </div>

        {/* New collection input and button */}
        <div className="relative w-full lg:w-1/2 flex items-center">
          <input
            type="text"
            placeholder="New collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="w-full pl-4 pr-4 py-4 text-lg border rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
            aria-label="New collection name"
          />
          <button
            onClick={handleCreateCollection}
            className="w-fit pl-4 pr-4 py-2 flex items-center bg-accent text-white rounded-lg hover:bg-accent-dark transition ml-2"
          >
            <PlusCircle size={40} className="mr-2"/>
            Create Collection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.uuid}
              className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg relative"
              initial="hidden"
              animate="visible"
              custom={index} // Pass index to animate with staggered delay
              variants={itemVariants}
            >
              {/* Link to the collection page */}
              <Link to={`/collections/${collection.uuid}`} className="text-black hover:text-gray-500">
                <h3 className="text-2xl font-semibold pb-16 pr-20">{collection.title}</h3>
              </Link>

              {/* ShareButton component to share the collection */}
              <div className="absolute bottom-4 right-4">
                <ShareButton shareUrl={`${window.location.origin}/collections/${collection.uuid}`}/>
              </div>

              {/* Delete collection button (only visible if the current user is the creator) */}
              {collection.userId === userId && (
                <button
                  onClick={() => handleDelete(collection.uuid)}
                  className="absolute top-5 right-4 text-red-500 hover:text-red-700 flex items-center"
                  aria-label={`Delete collection ${collection.title}`}
                >
                  <Trash size={24} weight="bold" className="w-6 h-6"/>
                  <span className="ml-1 text-sm">Delete</span>
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No collections found.</p>
        )}
      </div>

      {/* Toast Container for managing toasts */}
      <ToastContainer ref={toastRef}/>
    </div>
  )
}

export default Collections
