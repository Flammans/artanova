import { useState, useRef, useEffect } from 'react'
import { CaretDown, Check } from 'phosphor-react' // Icon for dropdown and checkmark
import { motion, AnimatePresence } from 'framer-motion'

interface SortAndFilterProps {
  sortField: string;
  onSortChange: (value: string) => void;
}

const SortAndFilter: React.FC<SortAndFilterProps> = ({ sortField, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sortOptions = [
    { value: 'updatedAt', label: 'Sort by: Date Updated' },
    { value: 'yearFrom', label: 'Sort by: Oldest Artworks' },
    { value: 'yearTo', label: 'Sort by: Newest Artworks' },
  ]

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (value: string) => {
    onSortChange(value)
    setIsOpen(false) // Close dropdown after selecting
  }

  return (
    <div className="relative w-full lg:max-w-[300px]" ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full px-4 py-2 bg-accent text-dark font-bold text-lg
          rounded-lg border-2 border-accent hover:bg-primary hover:text-accent
          transition-colors duration-300 ease-in-out focus:outline-none
          focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center justify-between
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Display current selected option */}
        <span>{sortOptions.find((option) => option.value === sortField)?.label}</span>
        <CaretDown size={24} className="text-dark"/>
      </button>

      {/* Dropdown options */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute w-full bg-white shadow-lg rounded-lg mt-2 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {sortOptions.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-accent hover:text-primary flex justify-between items-center ${
                  option.value === sortField ? 'bg-accent text-primary' : 'text-dark'
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
                {option.value === sortField && <Check size={20} className="text-primary"/>}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SortAndFilter
