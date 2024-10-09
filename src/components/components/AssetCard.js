import React from 'react';

const AssetCard = ({ asset, onSelect, onPurchase }) => {
  const maskData = (data) => {
    if (!data) return ''; // Ensure data is defined
    return data.split('').map((char) => '*').join('');
  };

  return (
    <div className="bg-white p-4 rounded shadow-md cursor-pointer" onClick={onSelect}>
      <h3 className="text-xl font-bold mb-2">{asset.flightNumber}</h3>
      <p>From: {asset.purchased ? asset.from : maskData(asset.from)}</p>
      <p>To: {asset.purchased ? asset.to : maskData(asset.to)}</p>
      <p>Date: {asset.purchased ? asset.date : maskData(asset.date)}</p>
      <p>Price: {asset.price} ETH</p>
      {!asset.purchased && (
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the onSelect when clicking the button
            onPurchase(asset);
          }}
        >
          Purchase
        </button>
      )}
    </div>
  );
};

export default AssetCard;
