import React, { useState } from 'react';

const PersonalDataModal = ({ userData, onClose, onPurchase }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemToggle = (item) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };

  const handlePurchase = () => {
    onPurchase(selectedItems);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Purchase Data from {userData.owner}</h2>

        {userData.attributes.map((attribute, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={selectedItems.includes(attribute)}
                onChange={() => handleItemToggle(attribute)}
              />
              {attribute}: {userData.prices[index]} ETH
            </label>
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handlePurchase}
          >
            Purchase
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDataModal;
