import React from 'react';

const FlightModal = ({ flight, onClose, onPurchase }) => {
  const handlePurchase = () => {
    onPurchase();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Purchase Flight {flight.flightNumber}</h2>
        <p>From: {flight.from}</p>
        <p>To: {flight.to}</p>
        <p>Date: {flight.date}</p>
        <p>Price: {flight.price} ETH</p>

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

export default FlightModal;
