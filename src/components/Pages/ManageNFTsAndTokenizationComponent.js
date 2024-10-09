import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';

const TokenizedAttributesModal = ({ isOpen, onClose, tokenId, tokenizedAttributes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md w-1/2">
        <h3 className="text-xl font-bold mb-4">Tokenized Attributes for Token ID: {tokenId}</h3>
        <ul className="list-disc pl-5">
          {tokenizedAttributes.length > 0 ? (
            tokenizedAttributes.map((attribute, index) => (
              <li key={index}>{attribute}</li>
            ))
          ) : (
            <li>No tokenized attributes found.</li>
          )}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ManageNFTsAndTokenizationComponent = ({ contract, nftContract, address, fetchUserData, flights }) => {
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [royaltyFee, setRoyaltyFee] = useState('');
  const [price, setPrice] = useState(''); // Add state for price
  const [currentNFTs, setCurrentNFTs] = useState([]);
  const [previousNFTs, setPreviousNFTs] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [tokenizedAttributes, setTokenizedAttributes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [royalties, setRoyalties] = useState({});

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!contract || !nftContract || !address) return;

      try {
        const nftIds = await contract.getNFTsForUser(address);
        const currentNFTsFormatted = nftIds.map(id => id.toString());
        setCurrentNFTs(currentNFTsFormatted);

        const allNfts = await contract.getAllNFTs();
        const allNftsFormatted = allNfts.map(id => id.toString());

        const previousOwned = allNftsFormatted.filter(id => !currentNFTsFormatted.includes(id));
        setPreviousNFTs(previousOwned);

        const historyAndRoyaltyPromises = currentNFTsFormatted.map(async (tokenId) => {
          const history = await contract.getOwnershipTransferHistory(tokenId);
          console.log(history)
          const royalty = await nftContract.getTotalRoyalties(tokenId);
          console.log(royalty)
          return { tokenId, history, royalty };
        });

        const allDetails = await Promise.all(historyAndRoyaltyPromises);

        const royalties = {};

        allDetails.forEach(({ tokenId, history, royalty }) => {
          royalties[tokenId] = royalty;
          setTransferHistory(prev => [...prev, { tokenId, history }]);
        });

        setRoyalties(royalties);

      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    fetchNFTs();
  }, [contract, nftContract, address]);

  const handleFlightSelection = (flightIndex) => {
    setSelectedFlights((prevSelected) =>
      prevSelected.includes(flightIndex)
        ? prevSelected.filter((index) => index !== flightIndex)
        : [...prevSelected, flightIndex]
    );
  };
  

  const handleTokenizeFlights = async () => {
    if (!contract || selectedFlights.length === 0 || !royaltyFee || !price) return;
  
    try {
        // Fetch the total number of flights for the user
        const userFlights = await contract.getFlightsForUser(address);
        const totalFlights = userFlights.flightNumbers.length;
        console.log("Total flights available:", totalFlights);  

        // Map selected flight indices to their respective flight numbers
        const selectedFlightNumbers = selectedFlights.map(index => {
            const flightNumber = userFlights.flightNumbers[index];
            console.log(`Selected flight index: ${index}, flight number: ${flightNumber}`);
            return flightNumber;
        });

        // Validate selected flight numbers against stored flight numbers
        selectedFlightNumbers.forEach((flightNumber) => {
          console.log((userFlights.flightNumbers).toString())
            if (!userFlights.flightNumbers.includes(flightNumber)) {
                throw new Error(`Invalid flight number: ${flightNumber}`);
            }
        });

        const feeInBasisPoints = parseInt(royaltyFee, 10) * 100;
        const priceInWei = ethers.utils.parseEther(price.toString());

        console.log("Tokenizing flights:", selectedFlightNumbers);

        // Call the contract function to tokenize flights
        const tx = await contract.tokenizeFlights(selectedFlightNumbers, feeInBasisPoints.toString(), priceInWei);
        await tx.wait();
  
        console.log('Flights tokenized successfully');
        fetchUserData(); // Refresh user data
        toast.success('Flights tokenized successfully!');
    } catch (error) {
        console.error('Error tokenizing flights:', error);
        toast.error(`Error tokenizing flights: ${error.message}`);
    }
};

  
  

  const handleShowDetails = async (tokenId) => {
    try {
      const attributes = await contract.getTokenizedAttributes(address, tokenId);
      setTokenizedAttributes(attributes);
      setSelectedTokenId(tokenId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching tokenized attributes:', error);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-xl font-bold mb-4">Manage NFTs & Flight Tokenization</h3>

        <ul className="list-disc pl-5">
  {flights && flights.length > 0 ? (
    flights.map((flight, index) => (
      <li key={index} className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={selectedFlights.includes(index)}
            onChange={() => handleFlightSelection(index)}
          />{' '}
          Flight {flight.flightNumber} - From: {flight.from}, To: {flight.to}, Date: {flight.date}, Price: {flight.price} ETH
        </label>
      </li>
    ))
  ) : (
    <li>No flights available.</li>
  )}
</ul>


        <div className="mb-4">
          <label className="block text-lg font-semibold text-left">
            Royalty Fee (%)
            <input
              type="number"
              value={royaltyFee}
              onChange={(e) => setRoyaltyFee(e.target.value)}
              className="p-2 border rounded w-full mt-2"
              placeholder="Enter royalty fee percentage"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-left">
            NFT Price (ETH)
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-2 border rounded w-full mt-2"
              placeholder="Enter NFT price in ETH"
            />
          </label>
        </div>

        <button
          onClick={handleTokenizeFlights}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          disabled={selectedFlights.length === 0 || !royaltyFee || !price}
        >
          Tokenize Selected Flights
        </button>
      </div>
      <br />
      <div className="bg-white p-4 rounded shadow-md">
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-left">Your NFTs</h4>
          <table className="min-w-full bg-white border border-gray-200 mt-4">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Token ID</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Royalties Earned</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentNFTs.map((tokenId) => (
                <tr key={tokenId}>
                  <td className="py-2 px-4 border-b">{tokenId}</td>
                  <td className="py-2 px-4 border-b">Owned</td>
                  <td className="py-2 px-4 border-b">
                    {royalties[tokenId] ? ethers.utils.formatEther(royalties[tokenId]) + ' ETH' : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleShowDetails(tokenId)}
                      className="bg-blue-500 text-white font-bold py-1 px-3 rounded hover:bg-blue-700"
                    >
                      Show Details
                    </button>
                  </td>
                </tr>
              ))}
              {previousNFTs.map((tokenId) => (
                <tr key={tokenId}>
                  <td className="py-2 px-4 border-b">{tokenId}</td>
                  <td className="py-2 px-4 border-b">Previously Owned</td>
                  <td className="py-2 px-4 border-b">N/A</td>
                  <td className="py-2 px-4 border-b">N/A</td>
                  <td className="py-2 px-4 border-b">N/A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-left">NFT Transfer History</h4>
          <table className="min-w-full bg-white border border-gray-200 mt-4">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Token ID</th>
                <th className="py-2 px-4 border-b text-left">From</th>
                <th className="py-2 px-4 border-b text-left">To</th>
                <th className="py-2 px-4 border-b text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transferHistory.map(({ tokenId, history }) =>
                history.map((record, index) => (
                  <tr key={`${tokenId}-${index}`}>
                    <td className="py-2 px-4 border-b">{tokenId}</td>
                    <td className="py-2 px-4 border-b">{record.from}</td>
                    <td className="py-2 px-4 border-b">{record.to}</td>
                    <td className="py-2 px-4 border-b">{new Date(record.timestamp * 1000).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TokenizedAttributesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokenId={selectedTokenId}
        tokenizedAttributes={tokenizedAttributes}
      />
    </>
  );
};

export default ManageNFTsAndTokenizationComponent;