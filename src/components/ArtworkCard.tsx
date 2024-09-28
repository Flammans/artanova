import { MagnifyingGlass } from 'phosphor-react'
import { motion } from 'framer-motion'
import DetailsButton from './DetailsButton'
import AddToCollectionButton from './AddToCollectionButton'
import RemoveFromCollectionButton from './RemoveFromCollectionButton'
import { truncateText } from '../utils/textHelpers'
import Artwork from '../types/artwork'

interface ArtworkCardProps {
  artwork: Artwork,
  onViewDetails: () => void,
  isInCollectionPage?: boolean,
  collectionUuid?: string,
  fetchCollection?: () => void,
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onViewDetails, isInCollectionPage = false, collectionUuid, fetchCollection }) => (
  <motion.div
    className="relative bg-dark-800 p-4 rounded-lg group"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-serif mb-2">{truncateText(artwork.title, 100)}</h3>

    <div className="relative">
      <img
        src={artwork.preview}
        alt={artwork.title}
        className="w-full h-auto rounded-lg"
        onError={(e) => {
          const placeholder = `https://placehold.co/600x400?text=${encodeURIComponent(artwork.title)}`
          e.currentTarget.src = placeholder
        }}
      />
      <div
        className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={onViewDetails}
      >
        <MagnifyingGlass size={48} className="text-accent"/>
      </div>
    </div>

    <p className="text-sm text-secondary mt-2">
      {artwork.artist && <span>By {truncateText(artwork.artist, 100)}</span>}
      {artwork.date && <span> {artwork.date}</span>}
    </p>

    <div className="flex space-x-4 mt-4">
      <DetailsButton onClick={() => window.open(artwork.url, '_blank')} text="Visit Source Website" color="#3B82F6"/>
      {isInCollectionPage ? (
        <RemoveFromCollectionButton artworkId={artwork.id} collectionUuid={collectionUuid!} fetchCollection={fetchCollection}/>
      ) : (
        <AddToCollectionButton artworkId={artwork.id}/>
      )}
    </div>
  </motion.div>
)

export default ArtworkCard
