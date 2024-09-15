import React from 'react'
import { LinkSimple } from 'phosphor-react'

interface DetailsButtonProps {
  onClick: () => void;
  text: string;
  color?: string; // Color for background of the button
}

const DetailsButton: React.FC<DetailsButtonProps> = ({ onClick, text, color }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 flex items-center rounded-lg hover:bg-opacity-80 transition`}
    style={{
      backgroundColor: color || '#d4af37', // Default background color (gold) or custom
      color: '#FFFFFF',
    }}
  >
    <LinkSimple size={24} weight="bold" className="mr-2"/>
    {text}
  </button>
)

export default DetailsButton
