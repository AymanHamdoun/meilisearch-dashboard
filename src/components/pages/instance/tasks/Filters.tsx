import React, { useState } from 'react';

const FilterDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    logitech: false,
    asus: false,
    canon: false,
  });

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <div className="relative inline-block">
      {/* Filter Button */}
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
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
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Status</h3>
            <div className="grid grid-cols-1 gap-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="logitech"
                  checked={selectedFilters.logitech}
                  onChange={handleFilterChange}
                />
                <span className="ml-2">EnQueued</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="asus"
                  checked={selectedFilters.asus}
                  onChange={handleFilterChange}
                />
                <span className="ml-2">Processing</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="canon"
                  checked={selectedFilters.canon}
                  onChange={handleFilterChange}
                />
                <span className="ml-2">Succeeded</span>
              </label>
            </div>
            {/* Add more filters as needed */}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Type</h3>
            <div className="grid grid-cols-1 gap-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="logitech"
                  checked={selectedFilters.logitech}
                  onChange={handleFilterChange}
                />
                <span className="ml-2">Indexing</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="asus"
                  checked={selectedFilters.asus}
                  onChange={handleFilterChange}
                />
                <span className="ml-2">Settings</span>
              </label>
            </div>
            {/* Add more filters as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;