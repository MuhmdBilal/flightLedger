import React, { useState, useEffect } from 'react';
import Register from './Register';
import UpdateDataSharing from './UpdateDataSharing';
import InitialPreferencesSetup from './InitialPreferencesSetup';
import Sidebar from '../components/Sidebar';
import { useAccount } from 'wagmi';
import UserDataOwnershipABI from '../contractabi.json';
import NFTABI from '../nftabi.json';
import { ethers } from 'ethers';
import UpdateFlight from './UpdateFlight';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageNFTsAndTokenizationComponent from './ManageNFTsAndTokenizationComponent';
import datavault from '../../assets/icons/vault.png';

const USER_DATA_AND_FLIGHTS_CONTRACT = '0x12811A76dBd05F81e64B48259FDdB4B7bEF40524';
const NFT_CONTRACT = '0x129d7eFd979501f4f7ebB2570f12d7F9A7e91A87';

const MyData = () => {
  const [currentSection, setCurrentSection] = useState('personalInfo');
  const [nftSales, setNftSales] = useState([]);
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem('isRegistered') === 'true';
  });
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [sellType, setSellType] = useState(() => localStorage.getItem('shareType') || '');
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    phoneNumber: '',
    location: '',
    totalNFTs: '0',
    totalEarnings: '0',
    totalFlights: '0',
    isDataShared: false,
    sharingPreferences: {},
    dataPrices: {},
    tokenIds: [],
    tokenizedAttributes: {},
    flights: [],
    sharingType: '',
    nfts: [],
  });

  const fetchUserData = async () => {
    if (!contract || !nftContract || !address) {
      console.log('fetchUserData: Contract or address not available');
      return;
    }
    try {
      setLoading(true);

      console.log('Fetching user data...');
      const userDataFromContract = await contract.getPersonalData(address);
      console.log('User data fetched:', userDataFromContract);

      const userDataFromContractString = {
        owner: userDataFromContract[0],
        username: userDataFromContract[1],
        phoneNumber: userDataFromContract[2],
        location: userDataFromContract[3],
        sharingType: userDataFromContract[4],
        attributes: userDataFromContract[5],
        prices: userDataFromContract[6].map(price => {
          console.log('Price in wei:', price.toString());
          return ethers.utils.formatEther(price);
        }),
      };

      const attributes = userDataFromContractString.attributes;
      const sharingPreferences = {};
      const dataPrices = {};
      for (let i = 0; i < attributes.length; i++) {
        sharingPreferences[attributes[i]] = true;
        dataPrices[attributes[i]] = ethers.utils.formatEther(userDataFromContract[6][i]);
      }

      console.log('sharingPreferences:', sharingPreferences);
      console.log('dataPrices:', dataPrices);

      const flights = await contract.getFlightsForUser(address);
      console.log('flights:', flights);
      const formattedFlights = flights.flightNumbers.map((flightNumber, index) => ({
        flightNumber: flightNumber.toString(),
        from: flights.fromLocations[index],
        to: flights.toLocations[index],
        date: flights.dates[index],
        isInternal: flights.internals[index] ? 'Yes' : 'No',
        price: ethers.utils.formatEther(flights.prices[index]),
        isShared: flights.isSharedArray[index] ? 'Shared' : 'Not Shared',
      }));

      console.log('Formatted Flights:', formattedFlights);

      // Fetch NFTs data
      const nfts = await nftContract.getNFTsForUser(address);
      console.log('NFTs:', nfts);

      const formattedNFTs = await Promise.all(
        nfts.map(async (tokenId) => {
          const tokenizedAttributes = await contract.getTokenizedAttributes(address, tokenId);
          const royaltyFee = await nftContract.getRoyaltyFee(tokenId);
          const totalRoyalties = await nftContract.getTotalRoyalties(tokenId);
          console.log(royaltyFee);

          return {
            id: tokenId.toString(),
            tokenizedAttributes, // The attributes that were tokenized
            royaltyFee: ethers.utils.formatEther(royaltyFee),
            totalRoyalties: ethers.utils.formatEther(totalRoyalties),
          };
        })
      );

      console.log('User NFTs:', formattedNFTs);

      setUserData({
        ...userDataFromContractString,
        sharingPreferences,
        dataPrices,
        flights: formattedFlights,
        nfts: formattedNFTs, // Add NFTs data to the userData state
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching user data');
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPurchasedData = async () => {
    if (!contract || !address) {
      console.log('fetchPurchasedData: Contract or address not available');
      return;
    }
    try {
      setLoading(true);
  
      console.log('Fetching purchased personal data...');
      const purchasedPersonalData = await contract.getPurchasedPersonalData(address, address); // Assuming you are fetching data where the user is both buyer and seller
      console.log('Purchased personal data:', purchasedPersonalData);
  
      console.log('Fetching purchased flight data...');
      const purchasedFlightData = await contract.getPurchasedFlights(address, address); // Again assuming buyer is same as seller for demonstration
      console.log('Purchased flight data:', purchasedFlightData);
  
      // You can process this data further if needed
      const formattedPurchasedPersonalData = purchasedPersonalData.map((attribute, index) => ({
        attribute,
        price: userData.dataPrices[attribute], // Assuming you already have the price in userData
      }));
  
      const formattedPurchasedFlightData = purchasedFlightData.map((flightNumber, index) => {
        const flight = userData.flights.find(f => f.flightNumber === flightNumber.toString());
        return flight ? { ...flight, price: ethers.utils.formatEther(flight.price) } : null;
      }).filter(Boolean); // Filter out null values
  
      console.log('Formatted Purchased Personal Data:', formattedPurchasedPersonalData);
      console.log('Formatted Purchased Flight Data:', formattedPurchasedFlightData);
  
      // Update your state with the purchased data
      setUserData(prevData => ({
        ...prevData,
        purchasedPersonalData: formattedPurchasedPersonalData,
        purchasedFlightData: formattedPurchasedFlightData,
      }));
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error fetching purchased data');
      console.error('Error fetching purchased data:', error);
    }
  };
  

  const checkUserRegistration = async () => {
    if (!contract || !address) {
      console.log('checkUserRegistration: Contract or address not available');
      return;
    }

    try {
      console.log('Checking user registration...');
      const registered = await contract.isUserRegistered(address);
      console.log('User registration status:', registered);
      setIsRegistered(registered);
      localStorage.setItem('isRegistered', registered);

      if (registered) {
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error checking user registration:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum && address && isConnected) {
        console.log('Initializing contract...');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(USER_DATA_AND_FLIGHTS_CONTRACT, UserDataOwnershipABI, signer);
        const nftContractInstance = new ethers.Contract(NFT_CONTRACT, NFTABI, signer);

        setContract(contractInstance);
        setNftContract(nftContractInstance);

        await checkUserRegistration();
        if (currentSection === 'purchasedData' && contract && address) {
          fetchPurchasedData();
        }
      } else {
        console.log('Ethereum provider not found or user not connected');
      }
    };

    init();
  }, [address, isConnected, currentSection]);

  useEffect(() => {
    if (contract && nftContract && isRegistered) {
      fetchUserData();
    }
  }, [contract, nftContract, isRegistered]);

  const handleSetupPreferences = async (selectedAttributes, prices, flightNumbers, flightPrices, tokenize, royaltyFee) => {
    console.log('handleSetupPreferences from my data');
    console.log('Selected Attributes:', selectedAttributes);
    console.log('Prices:', prices);
    console.log('Flight Numbers:', flightNumbers);
    console.log('Flight Prices:', flightPrices);
    console.log('Selected sharing type:', tokenize ? 'tokenization' : 'sharing');
    console.log('Royalty Fee:', royaltyFee);

    if (!contract) return;

    try {
      console.log('Setting up sharing preferences...');

      if (tokenize) {
        console.log('Calling tokenizeUserData with:', {
          selectedAttributes,
          royaltyFee,
        });

        // Tokenization logic here...
      } else {
        const parsedPrices = Object.values(prices).map((price) => {
          console.log('Parsing attribute price in wei:', price);
          if (!price || isNaN(price) || Number(price) < 0) {
            console.error(`Error parsing price: ${price}`);
            throw new Error(`Invalid price: ${price}`);
          }
          return ethers.BigNumber.from(price.toString());
        });

        console.log('Calling updateSharingPreferences with:', {
          selectedAttributes,
          parsedPrices,
        });

        await contract.updateSharingPreferences(selectedAttributes, parsedPrices);

        console.log('Sharing preferences set successfully!');
      }

      await fetchUserData();
      setEditingPreferences(false);
      setIsRegistered(true);
      localStorage.setItem('isRegistered', true);
    } catch (error) {
      console.error('Error setting sharing preferences:', error);
    }
  };

  console.log('Rendering MyData component...');
  console.log('isRegistered:', isRegistered);
  console.log('userData:', userData);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'personalInfo':
        return (
          <div className="bg-white p-4 rounded shadow-md">
            
            <h3 className="text-xl font-bold mb-2 flex items-center">
  Personal Information
  <img
    src={datavault}
    alt="datavault"
    className="w-10 h-10 ml-2" // Adjust size and margin-left with `w`, `h`, and `ml` classes
  />
</h3>

            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
            <p><strong>Location:</strong> {userData.location}</p>
            <p>Sharing Type: {userData.sharingType}</p>

            <p><strong>Total Flights:</strong> {userData.totalFlights}</p>

            {userData.flights && userData.flights.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Flights</h3>
                <ul className="list-disc pl-5">
                  {userData.flights.map((flight, index) => (
                    <li key={index}>
                      <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                      <p><strong>From:</strong> {flight.from}</p>
                      <p><strong>To:</strong> {flight.to}</p>
                      <p><strong>Date:</strong> {flight.date}</p>
                      <p><strong>Internal:</strong> {flight.isInternal}</p>
                      <p><strong>Price:</strong> {flight.price} ETH</p>
                      <p><strong>Status:</strong> {flight.isShared}</p>
                      <br />
                    </li>
                  ))}
                  {userData.nfts && userData.nfts.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-bold mb-2">NFTs</h3>
                      <ul className="list-disc pl-5">
                        {userData.nfts.map((nft, index) => (
                          <li key={index}>
                            <p><strong>NFT ID:</strong> {nft.id ? nft.id.toString() : 'N/A'}</p>
                            <p><strong>Owner:</strong> {address}</p>
                            <p><strong>Royalty Fee:</strong> {nft.royaltyFee ? `${nft.royaltyFee} ETH` : 'N/A'}</p>
                            <p><strong>Total Royalties Earned:</strong> {nft.totalRoyalties} ETH</p>
                            <br />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      case 'updatePreferences':
        return (
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">Update Sharing Preferences</h3>
            <div className="mb-4">
              <h4 className="text-lg font-bold mb-2">Your current shared data</h4>
              <ul className="list-disc pl-5">
                {userData.attributes.map((attribute, index) => (
                  <li key={index}>
                    <p><strong>{attribute.charAt(0).toUpperCase() + attribute.slice(1)}:</strong> {userData.dataPrices[attribute]} ETH</p>
                  </li>
                ))}
                {userData.flights
                  .filter((flight) => flight.isShared === 'Shared')
                  .map((flight, index) => (
                    <li key={index}>
                      <p><strong>Flight {flight.flightNumber}:</strong> {flight.price} ETH</p>
                    </li>
                  ))}
              </ul>
            </div>

            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setEditingPreferences(true)}
            >
              Update Sharing Preferences
            </button>

            {editingPreferences && (
              <>
                <UpdateDataSharing
                  handleUpdatePreferences={handleSetupPreferences}
                  initialPreferences={userData.attributes}
                  initialPrices={userData.dataPrices}
                  flights={userData.flights}
                  sharingType={sellType}
                />
                <UpdateFlight
                  contract={contract}
                  flights={userData.flights}
                  fetchUserData={fetchUserData}
                />
              </>
            )}
          </div>
        );
        case 'purchasedData':
          return (
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-xl font-bold mb-2">Purchased Data</h3>
        
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <h4 className="text-lg font-bold mt-4">Personal Data</h4>
                  {userData.purchasedPersonalData && userData.purchasedPersonalData.length > 0 ? (
                    <table className="table-auto w-full mt-2">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Attribute</th>
                          <th className="px-4 py-2">Price (ETH)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.purchasedPersonalData.map((data, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-2">{data.attribute}</td>
                            <td className="border px-4 py-2">{data.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No personal data purchased.</p>
                  )}
        
                  <h4 className="text-lg font-bold mt-4">Flight Data</h4>
                  {userData.purchasedFlightData && userData.purchasedFlightData.length > 0 ? (
                    <table className="table-auto w-full mt-2">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Flight Number</th>
                          <th className="px-4 py-2">From</th>
                          <th className="px-4 py-2">To</th>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Price (ETH)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.purchasedFlightData.map((flight, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-2">{flight.flightNumber}</td>
                            <td className="border px-4 py-2">{flight.from}</td>
                            <td className="border px-4 py-2">{flight.to}</td>
                            <td className="border px-4 py-2">{flight.date}</td>
                            <td className="border px-4 py-2">{flight.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No flight data purchased.</p>
                  )}
                </>
              )}
            </div>
          );
        
        return (
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold mb-2">NFT Sales</h3>
            <p><strong>Total NFTs Sold:</strong> {userData.totalNFTs}</p>
            <p><strong>Total Earnings:</strong> {userData.totalEarnings} ETH</p>
            <table className="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th className="px-4 py-2">NFT ID</th>
                  <th className="px-4 py-2">Sale Date</th>
                  <th className="px-4 py-2">Price (ETH)</th>
                </tr>
              </thead>
              <tbody>
                {nftSales.map((sale, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{sale.nftId}</td>
                    <td className="border px-4 py-2">{sale.saleDate}</td>
                    <td className="border px-4 py-2">{sale.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'manageNFTs':
        return (
          <ManageNFTsAndTokenizationComponent
            contract={contract}
            nftContract={nftContract}
            address={address}
            fetchUserData={fetchUserData}
            flights={userData.flights} // Pass the flights prop here

          />
        );
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 min-h-screen flex flex-col">
      {isRegistered === null ? (
        <div>Loading...</div>
      ) : !isRegistered ? (
        <div className="relative bg-gradient-to-r from-purple-200 to-gray-500 main-content" style={{ height: '100vh' }}>
          <div>
            <InitialPreferencesSetup handleSetupPreferences={handleSetupPreferences} flights={userData.flights} contract={contract} />
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-200 to-gray-500 main-content flex">
          <Sidebar onSelectSection={setCurrentSection} userData={userData} />
          <div className="ml-64 container mx-auto p-4 font-mono flex-grow">
            {renderCurrentSection()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyData;
