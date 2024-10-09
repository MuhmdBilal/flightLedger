import React, { useState } from 'react';

const DataSharing = ({ handleShareData }) => {
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [prices, setPrices] = useState({});
  const [shareType, setShareType] = useState('sharing');
  const [royaltyFee, setRoyaltyFee] = useState('');

  const handleAttributeChange = (attribute) => {
    setSelectedAttributes((prev) =>
      prev.includes(attribute)
        ? prev.filter((attr) => attr !== attribute)
        : [...prev, attribute]
    );
  };

  const handlePriceChange = (attribute, value) => {
    setPrices((prev) => ({ ...prev, [attribute]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleShareData(selectedAttributes, prices, shareType, royaltyFee);
  };

  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 main-content">
      <div className="container mx-auto p-4 font-mono">
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">Select Data to Share & Set Prices</h3>
            {['username', 'phoneNumber', 'location', 'flights'].map(attribute => (
              <div className="mb-4" key={attribute}>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleAttributeChange(attribute)}
                  />{' '}
                  {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                </label>
                <input
                  type="number"
                  placeholder="Price in ETH"
                  onChange={(e) => handlePriceChange(attribute, e.target.value)}
                  disabled={!selectedAttributes.includes(attribute)}
                  className="ml-2 p-1 border rounded"
                />
              </div>
            ))}
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Choose Sharing Type</h3>
              <label className="block">
                <input
                  type="radio"
                  value="sharing"
                  checked={shareType === 'sharing'}
                  onChange={() => setShareType('sharing')}
                />{' '}
                Data Sharing
              </label>
              <label className="block mt-2">
                <input
                  type="radio"
                  value="tokenization"
                  checked={shareType === 'tokenization'}
                  onChange={() => setShareType('tokenization')}
                />{' '}
                Data as NFT
              </label>
            </div>
            {shareType === 'tokenization' && (
              <div className="mt-4">
                <label className="block text-lg font-bold mb-2 tooltip-container">
                  Set Royalty Fee (%)
                  <span className="info-icon">ℹ️</span>
                  <span className="tooltip-text">
                    The royalty fee is a percentage of the resale value that you will receive each time the NFT is sold in the future.
                  </span>
                </label>
                <input
                  type="number"
                  value={royaltyFee}
                  onChange={(e) => setRoyaltyFee(e.target.value)}
                  placeholder="Enter royalty fee as a percentage"
                  className="p-1 border rounded w-full"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataSharing;
