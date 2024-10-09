import React, { useState } from 'react';
import { ethers } from 'ethers';

const UpdateFlight = ({ contract, flights, fetchUserData }) => {
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(0);
  const [newPrice, setNewPrice] = useState('');
  const [isShared, setIsShared] = useState(false);

  const handleFlightUpdate = async () => {
    if (!contract) return;
  
    try {
      const flight = flights[selectedFlightIndex];
      console.log('Selected flight index:', selectedFlightIndex);
      console.log('Selected flight data:', flight);
  
      const priceInWei = ethers.utils.parseEther(newPrice);
  
      const tx = await contract.updateFlight(
        selectedFlightIndex,  // Use selectedFlightIndex as the index
        flight.from,
        flight.to,
        flight.date,
        flight.isInternal === 'Yes',
        priceInWei,
        isShared
      );
      await tx.wait();
  
      console.log(`Flight ${flight.flightNumber} updated successfully.`);
      fetchUserData(); // Refresh the user data after update
    } catch (error) {
      console.error('Error updating flight:', error);
    }
  };
  

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-bold mb-2">Update Flight Information</h3>
      <div className="mb-4">
        <label className="block text-gray-700">Select Flight:</label>
        <select
          value={selectedFlightIndex}
          onChange={(e) => setSelectedFlightIndex(e.target.value)}
          className="p-2 border rounded w-full"
        >
          {flights.map((flight, index) => (
            <option key={index} value={index}>
              {`Flight ${flight.flightNumber} from ${flight.from} to ${flight.to}`}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">New Price (ETH):</label>
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">This flight will be shared in the marketplace</label>
        <input
          type="checkbox"
          checked={isShared}
          onChange={(e) => setIsShared(e.target.checked)}
          className="mr-2"
        />
        <span>{isShared ? 'Agree' : 'Agree'}</span>
      </div>
      <button
        onClick={handleFlightUpdate}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Flight
      </button>
    </div>
  );
};

export default UpdateFlight;
