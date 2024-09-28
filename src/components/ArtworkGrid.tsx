import Masonry from 'react-masonry-css'
import ArtworkCard from './ArtworkCard'
import Artwork from '../types/artwork'

interface ArtworkGridProps {
  artworks: Artwork[]; // Array of artworks to display
  onViewArtwork: (index: number) => void; // Function to open artwork details modal
  isInCollectionPage?: boolean; // Flag to determine if the grid is on the collection page
  collectionUuid?: string; // UUID of the collection
  fetchCollection?: () => void; // Function to refetch the collection
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onViewArtwork, isInCollectionPage, collectionUuid, fetchCollection }) => {
  // Configuration for Masonry columns based on the screen size
  const breakpointColumnsObj = {
    default: 4,   // Default 4 columns
    1920: 3,      // 3 columns for large screens
    1280: 2,      // 2 columns for medium screens
    992: 2,       // 2 columns for smaller screens
    700: 1,       // 1 column for mobile screens
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-full" // Ensures that Masonry container spans full width
      columnClassName="masonry-grid_column" // Class to style each column
    >
      {artworks.map((artwork, index) => (
        <div key={artwork.id}>
          <ArtworkCard
            artwork={artwork}
            onViewDetails={() => onViewArtwork(index)} // Pass index to handle artwork view
            isInCollectionPage={isInCollectionPage} // Flag to determine if the card is on the collection page
            collectionUuid={collectionUuid} // Pass collection UUID to the card
            fetchCollection={fetchCollection} // Function to refetch the collection
          />
        </div>
      ))}
    </Masonry>
  )
}

export default ArtworkGrid
