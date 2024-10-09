import React, { useState } from 'react';

const Sidebar = ({ onSelectSection, userData }) => {
  const [selectedSection, setSelectedSection] = useState('personalInfo');

  const handleSelect = (section) => {
    setSelectedSection(section);
    onSelectSection(section);
  };

  return (
    <div className="fixed top-[64px] left-0 bg-gradient-to-r from-purple-200 to-purple-100 text-white p-6 w-64 h-full shadow-lg z-10 font-mono">
      <div className="space-y-4">
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
            selectedSection === 'personalInfo'
              ? 'bg-purple-800 text-white font-semibold'
              : 'bg-purple-500 text-gray-300 hover:bg-purple-500 hover:text-white'
          }`}
          onClick={() => handleSelect('personalInfo')}
        >
          Personal Information
        </button>

        {/* Conditionally render Update Sharing Preferences button */}
        {userData?.sharingType !== 'tokenizing' && (
          <button
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedSection === 'updatePreferences'
                ? 'bg-purple-800 text-white font-semibold'
                : 'bg-purple-500 text-gray-300 hover:bg-purple-500 hover:text-white'
            }`}
            onClick={() => handleSelect('updatePreferences')}
          >
            Update Sharing Preferences
          </button>
        )}

        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
            selectedSection === 'purchasedData'
              ? 'bg-purple-800 text-white font-semibold'
              : 'bg-purple-500 text-gray-300 hover:bg-purple-500 hover:text-white'
          }`}
          onClick={() => handleSelect('purchasedData')}
        >
          Purchased Data
        </button>

        {/* Conditionally render Manage NFTs and Flight Tokenization button */}
        {userData?.sharingType === 'tokenizing' && (
          <button
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedSection === 'manageNFTs'
                ? 'bg-purple-800 text-white font-semibold'
                : 'bg-purple-700 text-gray-300 hover:bg-purple-500 hover:text-white'
            }`}
            onClick={() => handleSelect('manageNFTs')}
          >
            Manage NFTs & Flight Tokenization
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
