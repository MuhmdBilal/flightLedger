import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import UserDataCard from '../components/UserDataCard';
import UserDataModal from '../components/UserDataModal';
import AssetCard from '../components/AssetCard';
import { ethers } from 'ethers';
import UserDataOwnershipABI from '../contractabi.json';
import ManageNFTsAndTokenizationComponent from './ManageNFTsAndTokenizationComponent';
import { useAccount } from 'wagmi';

const USER_DATA_AND_FLIGHTS_CONTRACT = '0x12811A76dBd05F81e64B48259FDdB4B7bEF40524';

const Marketplace = () => {
  const { address, isConnected } = useAccount();

  const [contract, setContract] = useState(null);
  const [selectedSection, setSelectedSection] = useState('personalInfo');
  const [usersData, setUsersData] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filterType, setFilterType] = useState('all'); // New filter state

  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(USER_DATA_AND_FLIGHTS_CONTRACT, UserDataOwnershipABI, signer);
          setContract(contractInstance);

          // Fetch all users data and flights
          await fetchUsersData(contractInstance);
          await fetchAllFlights(contractInstance);
        } catch (error) {
          console.error('Error connecting to the wallet:', error);
        }
      } else {
        console.error('Ethereum object not found, make sure you have MetaMask installed.');
      }
    };

    initializeContract();
  }, []);

  const fetchUsersData = async (contractInstance) => {
    try {
      const [
        owners,
        usernames,
        phoneNumbers,
        locations,
        attributesList,
        pricesList,
        sharingTypes
      ] = await contractInstance.getAllUsersInfo();

      const usersDataArray = owners.map((owner, index) => ({
        owner,
        username: usernames[index],
        phoneNumber: phoneNumbers[index],
        location: locations[index],
        attributes: attributesList[index],
        prices: pricesList[index].map(price => ethers.utils.formatEther(price)),
        sharingType: sharingTypes[index],
      }));

      setUsersData(usersDataArray);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAllFlights = async (contractInstance) => {
    try {
      // Use a Set to track flight numbers that have already been added
      const flightNumbersSet = new Set();
  
      const [
        owners,
        flightNumbers,
        fromLocations,
        toLocations,
        dates,
        internals,
        prices,
        isSharedArray
      ] = await contractInstance.getAllFlightsInfo();
  
      const uniqueFlights = flightNumbers.map((flightNumber, index) => {
        if (!flightNumbersSet.has(flightNumber.toString())) {
          flightNumbersSet.add(flightNumber.toString());
  
          return {
            flightNumber: flightNumber.toString(),
            owner: owners[index],
            from: fromLocations[index],
            to: toLocations[index],
            date: dates[index],
            isInternal: internals[index] ? 'Yes' : 'No',
            price: ethers.utils.formatEther(prices[index]),
            isShared: isSharedArray[index] ? 'Shared' : 'Not Shared',
          };
        }
        return null; // Return null for duplicates
      }).filter(flight => flight !== null); // Filter out null values
  
      setFlights(uniqueFlights); // Update state with unique flights
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handlePurchase = async (owner, selectedItems, userData) => {
    if (!contract || selectedItems.length === 0) return;
  
    try {
      // Handle prices correctly based on their format
      const totalCost = selectedItems.reduce((total, item) => {
        const itemIndex = userData.attributes.indexOf(item);
        let priceInWei;
  
        // Check if the price is in Ether (e.g., a small fractional value)
        if (userData.prices[itemIndex].includes(".")) {
          priceInWei = ethers.utils.parseUnits(userData.prices[itemIndex].toString(), 'ether');
        } else {
          // Otherwise, assume it's already in Wei
          priceInWei = ethers.BigNumber.from(userData.prices[itemIndex]);
        }
  
        return total.add(priceInWei);
      }, ethers.BigNumber.from(0));
  
      console.log(totalCost.toString());
      console.log(selectedItems);
  
      const transaction = await contract.purchasePersonalData(owner, selectedItems, {
        value: totalCost, // Send the total cost in wei
        gasLimit: ethers.utils.hexlify(2000000), // Adjust the gas limit as necessary
      });
  
      await transaction.wait();
      console.log('Purchase completed:', transaction);
    } catch (error) {
      console.error('Error purchasing data:', error);
    }
  };
  
  
  
  
  
  const filteredUsersData = usersData.filter(userData => {
    if (filterType === 'all') return true;
    return userData.sharingType === filterType;
  });

  const filteredFlights = flights.filter(flight => {
    if (filterType === 'all') return true;
    return flight.isShared === (filterType === 'sharing' ? 'Shared' : 'Not Shared');
  });

  const renderSection = () => {
    if (selectedSection === 'personalInfo') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredUsersData.map((userData) => (
            <UserDataCard 
              key={userData.owner} 
              userData={userData} 
              onSelect={() => setSelectedUserData(userData)} 
              onPurchase={(selectedItems) => handlePurchase(userData.owner, selectedItems, userData)} // Pass userData here
              connectedAddress={address} // Pass the connected wallet address
            />
          ))}
        </div>
      );
    } else if (selectedSection === 'flights') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredFlights.map((flight) => (
            <AssetCard 
              key={flight.flightNumber} 
              asset={flight} 
              onSelect={() => setSelectedFlight(flight)} 
              onPurchase={() => handlePurchase(flight.owner, [flight.flightNumber], selectedFlight)} // Pass flight data here if needed
            />
          ))}
        </div>
      );
    } else if (selectedSection === 'manageNFTs') {
      return <ManageNFTsAndTokenizationComponent contract={contract} address={address} fetchUserData={fetchUsersData} />;
    }
  };
  

  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 min-h-screen flex flex-col">

    <div className="bg-gradient-to-r from-purple-200 to-gray-500 main-content flex">
      <SideBar onSelectSection={setSelectedSection} selectedSection={selectedSection} />
      <div className="ml-64 container mx-auto p-4 font-mono"> {/* Adjusted margin-left */}
        <h2 className="text-2xl font-bold mb-4">
          {selectedSection === 'personalInfo' ? 'Data Marketplace' : 'Flights Marketplace'}
        </h2>

        {/* Filter Buttons */}
        <div className="mb-4">
          <label className="mr-4 font-bold">Filter by:</label>
          <button
            className={`mr-2 p-2 rounded ${filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`mr-2 p-2 rounded ${filterType === 'tokenizing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterType('tokenizing')}
          >
            tokenizing Data
          </button>
          <button
            className={`mr-2 p-2 rounded ${filterType === 'sharing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterType('sharing')}
          >
            Sharing Data
          </button>
        </div>

        {renderSection()}
        {selectedUserData && (
  <UserDataModal
    userData={selectedUserData}
    onClose={() => setSelectedUserData(null)}
    onPurchase={(selectedItems) => handlePurchase(selectedUserData.owner, selectedItems, selectedUserData)} // Pass userData here
  />
)}

        {selectedFlight && (
          <UserDataModal
            asset={selectedFlight}
            onClose={() => setSelectedFlight(null)}
            onPurchase={() => handlePurchase(selectedFlight.owner, [selectedFlight.flightNumber])}
          />
        )}
      </div>
    </div></div>
  );
};

export default Marketplace;
