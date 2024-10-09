import React, { useState } from 'react';

const UserDataCard = ({ userData, onSelect, onPurchase, connectedAddress }) => {
  const [isPurchased, setIsPurchased] = useState(false);

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if userData.flights is undefined, if so initialize it as an empty array
  const flights = userData.flights || [];

  // Function to check if an attribute is shared
  const isAttributeShared = (attribute) => {
    return userData.attributes && userData.attributes.includes(attribute);
  };

  const handlePurchase = async () => {
    try {
      await onPurchase();
      setIsPurchased(true);
    } catch (error) {
      console.error('Error purchasing data:', error);
    }
  };

  const renderData = (data) => {
    return isPurchased ? data : '******';
  };

  const renderPrice = (index) => {
    let priceIndex = 0;
    for (let i = 0; i <= index; i++) {
      if (isAttributeShared(userData.attributes[i])) {
        priceIndex++;
      }
    }
    return userData.prices && userData.prices[priceIndex - 1];
  };

  const isOwner = connectedAddress === userData.owner;

  return (
    <div
      className={`p-4 border rounded-md shadow-sm cursor-pointer bg-white ${
        isOwner ? 'pointer-events-none' : '' // Disable clicks if user is the owner
      }`}
      onClick={() => !isOwner && onSelect()} // Only call onSelect if not the owner
    >
      <h3 className="text-xl font-bold">Owner: {formatAddress(userData.owner)}</h3>

      {isAttributeShared('username') && (
        <p>Username: {renderData(userData.username)} -- Price: {renderPrice(0)} ETH</p>
      )}

      {isAttributeShared('phoneNumber') && (
        <p>Phone: {renderData(userData.phoneNumber)} -- Price: {renderPrice(1)} ETH</p>
      )}

      {isAttributeShared('location') && (
        <p>Location: {renderData(userData.location)} -- Price: {renderPrice(2)} ETH</p>
      )}

      {flights.length > 0 && (
        <div className="mt-2">
          <h4 className="font-bold">Shareable Flights:</h4>
          <ul>
            {flights.map((flight, index) => (
              <li key={index}>
                Flight Number: {renderData(flight.flightNumber)}, From: {renderData(flight.from)}, To: {renderData(flight.to)}, Date: {renderData(flight.date)}, Price: {flight.price} ETH
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isPurchased && (
  <button 
    className={`mt-4 font-bold py-2 px-4 rounded ${
      isOwner
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-purple-500 hover:bg-purple-700 text-white'
    }`} 
    onClick={handlePurchase}
    disabled={isOwner}
  >
    {isOwner ? "You're the owner of this data" : "Buy"}
  </button>
)}

    </div>
  );
};

export default UserDataCard;
