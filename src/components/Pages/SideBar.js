import React from 'react';

const SideBar = ({ onSelectSection, selectedSection }) => {
  return (
    <div className="fixed top-0 left-0 bg-gradient-to-r from-purple-100 to-purple-300 text-white p-6 w-64 h-full shadow-lg z-20 font-mono"> {/* Increased z-index */}
      <div className="space-y-4 mt-16"> {/* Added margin to avoid overlapping with navbar */}
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
            selectedSection === 'personalInfo'
              ? 'bg-purple-800 text-white font-semibold'
              : 'bg-purple-500 text-gray-300 hover:bg-purple-500 hover:text-white'
          }`}
          onClick={() => onSelectSection('personalInfo')}
        >
          Personal Information
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
            selectedSection === 'flights'
              ? 'bg-purple-800 text-white font-semibold'
              : 'bg-purple-500 text-gray-300 hover:bg-purple-500 hover:text-white'
          }`}
          onClick={() => onSelectSection('flights')}
        >
          Flights Marketplace
        </button>
      </div>
    </div>
  );
};

export default SideBar;
