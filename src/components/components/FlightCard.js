import React from 'react';

const FlightCard = ({ flight, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md cursor-pointer" onClick={onSelect}>
      <h3 className="text-xl font-bold mb-2">Flight Number: {flight.flightNumber}</h3>
      <p>From: {flight.from}</p>
      <p>To: {flight.to}</p>
      <p>Date: {flight.date}</p>
      <p>Price: {flight.price} ETH</p>
      <p>Status: {flight.isShared}</p>
    </div>
  );
};

export default FlightCard;
