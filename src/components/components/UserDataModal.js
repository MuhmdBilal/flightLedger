import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UserDataModal = ({ userData, onClose, onPurchase }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(ethers.BigNumber.from(0));

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      let priceSum = ethers.BigNumber.from(0);
      userData.attributes.forEach((attribute, index) => {
        if (selectedItems.includes(attribute)) {
          try {
            // Convert the price from Ether to wei before creating a BigNumber
            const priceInWei = ethers.utils.parseUnits(userData.prices[index], 'ether');
            priceSum = priceSum.add(priceInWei);
          } catch (error) {
            console.error('Error parsing price:', error);
          }
        }
      });
      setTotalPrice(priceSum);
    };

    calculateTotalPrice();
  }, [selectedItems, userData.attributes, userData.prices]);

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

  const isAttributeShared = (attribute) => {
    return userData.attributes && userData.attributes.includes(attribute);
  };

  const renderData = (data) => {
    return '******';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Purchase Data from {formatAddress(userData.owner)}</h2>

        {isAttributeShared('username') && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={selectedItems.includes('username')}
                onChange={() => handleItemToggle('username')}
              />
              Username: {renderData(userData.username)} -- Price: {userData.prices[0]} wei
            </label>
          </div>
        )}

        {isAttributeShared('phoneNumber') && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={selectedItems.includes('phoneNumber')}
                onChange={() => handleItemToggle('phoneNumber')}
              />
              Phone Number: {renderData(userData.phoneNumber)} -- Price: {userData.prices[1]} wei
            </label>
          </div>
        )}

        {isAttributeShared('location') && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={selectedItems.includes('location')}
                onChange={() => handleItemToggle('location')}
              />
              Location: {renderData(userData.location)} -- Price: {userData.prices[2]} wei
            </label>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handlePurchase}
          >
            Purchase for {totalPrice.toString()} wei
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

export default UserDataModal;
