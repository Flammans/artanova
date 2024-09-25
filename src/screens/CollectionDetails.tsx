import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { motion } from 'framer-motion'
import ShareButton from '../components/ShareButton'
import { api } from '../utils/api.ts'
import Collection from '../types/collection.ts'

const CollectionDetails: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>() // Get collection UUID from URL
  const [collection, setCollection] = useState<Collection | null>(null)

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await api.get(`/collections/${uuid}`)
        setCollection(response.data)
      } catch (error) {
        console.error('Error fetching collection:', error)
      }
    }

    fetchCollection()
  }, [uuid])

  if (!collection) {
    return <div className="text-white">Collection not found.</div>
  }

  return (
    <div className="min-h-screen bg-dark text-white p-8 pt-40">
      <SectionTitle titleText={collection.title} subtitleText="Explore the artworks in this collection" titleTag="h2"/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {collection.elements.map((element) => (
          <motion.div
            key={element.id}
            className="bg-secondary p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={element.artwork.preview}
              alt={element.artwork.title}
              className="rounded-lg object-cover w-full h-48"
            />
            <h3 className="text-xl font-semibold mt-4">{element.artwork.title}</h3>
            <p className="mt-2 text-gray-700">{element.artwork.origin}</p>
          </motion.div>
        ))}
      </div>

      {/* Use ShareButton component */}
      <ShareButton shareUrl={`${window.location.origin}/collections/${uuid}`}/>
    </div>
  )
}

export default CollectionDetails
