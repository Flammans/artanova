import { useState } from 'react'
import { Plus } from 'phosphor-react'
import AddToCollectionModal from './AddToCollectionModal.tsx'
import { useAppSelector } from '../stores/hooks.ts'
import { useNavigate } from 'react-router-dom'

const AddToCollectionButton: React.FC<{ artworkId: number }> = ({ artworkId }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const user = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  const handleOpenModal = () => {
    console.log(user.token)
    if (user.token) {
      setModalOpen(true)
    } else {
      navigate('/login')
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-accent text-dark px-4 py-2 rounded-lg hover:bg-accent-dark flex items-center"
      >
        <Plus size={24} weight="bold" className="mr-2"/>
        Add to Collection
      </button>

      {isModalOpen && (
        <AddToCollectionModal
          artworkId={artworkId}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default AddToCollectionButton
