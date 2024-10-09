import React from 'react';

const PersonalDataCard = ({ userData, onSelect, connectedAddress }) => {
  const isOwner = connectedAddress === userData.owner;

  return (
    <div
      className={`p-4 border rounded-md shadow-sm cursor-pointer bg-white`}
      onClick={() => !isOwner && onSelect()}
    >
      <h3 className="text-xl font-bold">Owner: {userData.owner}</h3>
      <p>Username: {userData.username}</p>
      <p>Phone Number: {userData.phoneNumber}</p>
      <p>Location: {userData.location}</p>
      <p>Price: {userData.price} ETH</p>
      {isOwner && <p className="text-gray-500">You own this data</p>}
    </div>
  );
};

export default PersonalDataCard;
