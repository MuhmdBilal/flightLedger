import React from 'react';

const SearchFilter = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
};

export default SearchFilter;
