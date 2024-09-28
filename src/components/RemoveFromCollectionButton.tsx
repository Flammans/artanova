import React from 'react'
import { Trash } from 'phosphor-react'
import { deleteElementFromCollection } from '../stores/collectionsSlice.ts'
import { useAppDispatch } from '../stores/hooks.ts'

interface RemoveFromCollectionButtonProps {
  artworkId: number;
  collectionUuid: string;
  fetchCollection: () => void;
}

const RemoveFromCollectionButton: React.FC<RemoveFromCollectionButtonProps> = ({ artworkId, collectionUuid, fetchCollection }) => {
  const dispatch = useAppDispatch()

  const handleRemove = async (collectionUuid: string, artworkId: number) => {
    try {
      await dispatch(deleteElementFromCollection(collectionUuid, artworkId))
      await fetchCollection()
    } catch (error) {
      console.error('Failed to remove artwork from collection:', error)
    }
  }

  return (
    <button
      onClick={() => handleRemove(collectionUuid, artworkId)}
      className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition duration-300 ease-in-out"
      aria-label="Remove from collection"
    >
      <Trash size={20}/>
      <span>Remove from Collection</span>
    </button>
  )
}

export default RemoveFromCollectionButton
