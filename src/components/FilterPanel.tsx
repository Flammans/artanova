import { ChangeEvent, useState } from 'react'
import { CaretDown, CaretRight } from 'phosphor-react'

interface FilterPanelProps {
  filterTypes: { [key: string]: number };
  filterOrigins: { [key: string]: number };
  selectedTypes: string[];
  selectedOrigins: string[];
  onTypeChange: (type: string, value: boolean) => void;
  onOriginChange: (origin: string, value: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterTypes,
  filterOrigins,
  selectedTypes,
  selectedOrigins,
  onTypeChange,
  onOriginChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [isFilterOriginsOpen, setIsFilterOriginsOpen] = useState<boolean>(false)

  return (
    <div className="w-full lg:w-1/4 lg:ml-4 mb-6 lg:mb-0">
      {/* Filter by Type */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <h3 className="text-lg font-serif">Filter by Type</h3>
          {isFilterOpen ? <CaretDown size={24} className="text-accent"/> : <CaretRight size={24} className="text-accent"/>}
        </div>

        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 gap-2">
            {Object.keys(filterTypes).sort().map((type) => (
              <div key={type} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => onTypeChange(type, event.target.checked)}
                  className="form-checkbox text-accent focus:ring-0"
                />
                <label className="text-white">
                  {type} ({filterTypes[type]})
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter by Origin */}
      <div className="bg-dark-800 p-4 rounded-lg">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsFilterOriginsOpen(!isFilterOriginsOpen)}>
          <h3 className="text-lg font-serif">Filter by Origin</h3>
          {isFilterOriginsOpen ? <CaretDown size={24} className="text-accent"/> : <CaretRight size={24} className="text-accent"/>}
        </div>

        {isFilterOriginsOpen && (
          <div className="mt-4 grid grid-cols-1 gap-2">
            {Object.keys(filterOrigins).sort().map((origin) => (
              <div key={origin} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedOrigins.includes(origin)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => onOriginChange(origin, event.target.checked)}
                  className="form-checkbox text-accent focus:ring-0"
                />
                <label className="text-white">
                  {origin} ({filterOrigins[origin]})
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterPanel
