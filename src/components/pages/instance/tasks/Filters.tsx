import React, { useState } from 'react';


interface FilterData {
  types: string[],
  statuses: string[]
}

const availableFilters: FilterData = {
  types: ["indexCreation","indexUpdate","indexDeletion","indexSwap","documentAdditionOrUpdate","documentDeletion","settingsUpdate","dumpCreation","taskCancelation","taskDeletion"],
  statuses: ["enqueued", "processing", "succeeded", "failed", "canceled"]
}

const FilterDropdown = ({applyFilters}) => {
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterData>({
    statuses: [],
    types: [],
  });

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="relative inline-block">
      <button
        className="bg-primary text-white font-bold py-2 px-4 rounded inline-flex items-center"
        onClick={toggleDropdown}
      >
        <span>Filter</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className='max-h-60 overflow-y-auto'>
            <StatusSection selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
            <TypesSection selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
          </div>
          <div className='p-2'>
            <button 
              className='border border-primary text-primary rounded-sm w-full py-1 transition-all ease-in-out hover:bg-primary hover:text-white'
              onClick={() => {applyFilters(selectedFilters)}}
              >Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;

const StatusSection = ({selectedFilters, setSelectedFilters}) => {
  return <div className="p-4">
    <h3 className="text-lg font-medium mb-2">Status</h3>
    <div className="grid grid-cols-1 gap-2">
      {availableFilters.statuses.map((status) => {
        return <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={selectedFilters.statuses.includes(status)}
            name={status}
            onChange={(e) => {
              const {name, checked} = e.target
              setSelectedFilters((prev) => {
                const newStatuses = checked
                ? [...prev.statuses, name] // Add the status if checked
                : prev.statuses.filter(status => status !== name); // Remove the status if not checked
            
                return {
                  ...prev,
                  statuses: newStatuses
                }
              })
            }}
          />
          <span className="ml-2">{status}</span>
        </label>
      })}
    </div>
    {/* Add more filters as needed */}
  </div>
}

const TypesSection = ({selectedFilters, setSelectedFilters}) => {
  return <div className="p-4">
    <h3 className="text-lg font-medium mb-2">Types</h3>
    <div className="grid grid-cols-1 gap-2">
      {availableFilters.types.map((type) => {
        return <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={selectedFilters.types.includes(type)}
            name={type}
            onChange={(e) => {
              const {name, checked} = e.target
              setSelectedFilters((prev) => {
                const newTypes = checked
                ? [...prev.types, name] // Add the status if checked
                : prev.types.filter(type => type !== name); // Remove the status if not checked
            
                return {
                  ...prev,
                  types: newTypes
                }
              })
            }}
          />
          <span className="ml-2">{type}</span>
        </label>
      })}
    </div>
    {/* Add more filters as needed */}
  </div>
}