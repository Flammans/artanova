import { SignOut } from 'phosphor-react'

const LogoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-red-light text-secondary px-4 py-2 rounded-lg hover:bg-red-dark flex items-center transition"
  >
    <SignOut size={24} weight="bold" className="mr-2"/>
    Logout
  </button>
)

export default LogoutButton
