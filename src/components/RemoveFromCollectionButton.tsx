import React from 'react'
import { api } from '../utils/api'
import { Trash } from 'phosphor-react'

interface RemoveFromCollectionButtonProps {
  elementId: number;
  collectionUuid: string;
}

const RemoveFromCollectionButton: React.FC<RemoveFromCollectionButtonProps> = ({ elementId, collectionUuid }) => {
  const handleRemove = async (collectionUuid: string, elementId: number) => {
    try {
      await api.delete(`/collections/${collectionUuid}/elements/${elementId}`)
      //@TODO
    } catch (error) {
      console.error('Failed to remove artwork from collection:', error)
    }
  }

  return (
    <button
      onClick={() => handleRemove(collectionUuid, elementId)}
      className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition duration-300 ease-in-out"
      aria-label="Remove from collection"
    >
      <Trash size={20}/>
      <span>Remove from Collection</span>
    </button>
  )
}

export default RemoveFromCollectionButton
