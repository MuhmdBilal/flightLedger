import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UpdateDataSharing = ({ handleUpdatePreferences, initialPreferences, initialPrices, flights, sharingType, contract }) => {
  const [selectedAttributes, setSelectedAttributes] = useState(initialPreferences || []);
  const [prices, setPrices] = useState(initialPrices || {});
  const [flightPrices, setFlightPrices] = useState({});

  useEffect(() => {
    if (initialPreferences) {
      setSelectedAttributes(initialPreferences);
    }
    if (initialPrices) {
      setPrices(initialPrices);
    }
  }, [initialPreferences, initialPrices]);

  const handleAttributeChange = (attribute) => {
    setSelectedAttributes((prev) =>
      prev.includes(attribute)
        ? prev.filter((attr) => attr !== attribute)
        : [...prev, attribute]
    );
  };

  const handlePriceChange = (attribute, value) => {
    setPrices((prev) => ({ ...prev, [attribute]: value }));
  };

  const handleFlightPriceChange = (flightNumber, value) => {
    setFlightPrices((prev) => ({ ...prev, [flightNumber]: value }));
  };

  const handleUpdateFlightPrices = async () => {
    console.log('handleUpdateFlightPrices called');
    if (!contract) return;

    try {
      console.log("Flights before processing:", JSON.stringify(flights));
      for (let flight of flights) {
        const newPrice = flightPrices[flight.flightNumber];
        const isPriceChanged = newPrice && newPrice !== flight.price;

        if (isPriceChanged) {
          const priceInWei = ethers.BigNumber.from(newPrice); // Assuming the input is in wei

          console.log(`Updating Flight ${flight.flightNumber}:`);
          console.log(`- Before Update: ${JSON.stringify(flight)}`);

          const tx = await contract.updateFlight(
            flight.flightNumber,
            flight.from,
            flight.to,
            flight.date,
            flight.isInternal === 'Yes',
            priceInWei,
            flight.isShared === 'Shared'
          );
          await tx.wait();

          console.log(`- After Update: ${JSON.stringify({
            flightNumber: flight.flightNumber,
            from: flight.from,
            to: flight.to,
            date: flight.date,
            isInternal: flight.isInternal,
            price: newPrice,
            isShared: flight.isShared,
          })}`);
        }
      }
    } catch (error) {
      console.error('Error updating flight prices:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Starting the update process...');

    // First, update flight prices
    await handleUpdateFlightPrices();

    // Then, update sharing preferences
    console.log('Updating sharing preferences...');
    await handleUpdatePreferences(selectedAttributes, prices, Object.keys(flightPrices), Object.values(flightPrices));

    console.log('Update process completed.');
  };

  return (
    <div className="container mx-auto p-4 font-mono">
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-bold mb-2">Update Sharing Preferences & Prices</h3>

          <p><strong>Sharing Type:</strong> {sharingType}</p> {/* Display the locked sharing type */}

          {['username', 'phoneNumber', 'location'].map((attribute) => (
            <div key={attribute} className="mb-4">
              <label>
                <input
                  type="checkbox"
                  checked={selectedAttributes.includes(attribute)}
                  onChange={() => handleAttributeChange(attribute)}
                />{' '}
                {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
              </label>
              <input
                type="number"
                placeholder="Price in wei" // Updated placeholder to reflect the input is in wei
                value={prices[attribute] || ''}
                onChange={(e) => handlePriceChange(attribute, e.target.value)}
                disabled={!selectedAttributes.includes(attribute)}
                className="ml-2 p-1 border rounded"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDataSharing;
