import React from 'react';

const AssetCard = ({ asset, onSelect, onPurchase,purchaseLoading }) => {


  return (
    <div className="bg-white p-4 rounded shadow-md " 
    // onClick={onSelect}
    >
      {/* <h3 className="text-xl font-bold mb-2">{asset.title}</h3> */}
      <p>Name: {asset.isAccessible ? asset.name : "*******"}</p>
      <p>Phone No: {asset.isAccessible ? asset.phoneNo : "*******"}</p>
      <p>Location: {asset.isAccessible ? asset.location : "*******"}</p>
      <p>Price: {asset.isAccessible ? asset.price : "*******"} ETH</p>
      {
        asset?.role === 0 &&(
          <p>RoyaltycFee: {asset.isAccessible ? asset.royaltyFee : "*******"}</p>
        )
      }
      {!asset.isAccessible && (
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => {
            e.stopPropagation(); 
            onPurchase(asset);
          }}
        >

          {purchaseLoading ? "Loading..." : asset?.role === 0 ? "Convert NFT and List" : "List For Sale"}
        </button>
      )}
    </div>
  );
};

export default AssetCard;
