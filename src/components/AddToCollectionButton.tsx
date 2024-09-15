import { Plus } from 'phosphor-react'

const AddToCollectionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-accent text-dark px-4 py-2 rounded-lg hover:bg-accent-dark flex items-center"
  >
    <Plus size={24} weight="bold" className="mr-2"/>
    Add to Collection
  </button>
)
export default AddToCollectionButton