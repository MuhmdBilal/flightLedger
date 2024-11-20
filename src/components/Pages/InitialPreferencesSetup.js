import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { useAccount } from "wagmi";
import Web3 from "web3";
import { dataNFTAbi, dataNFTAddress } from "../../utils/dataNFT";
import { toast } from "react-toastify";
import {
  dataSellingMarketplaceAbi,
  dataSellingMarketplaceAddress,
} from "../../utils/dataSellingMarketplace";
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-bold mb-4"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};
const UserRegistrationAndSetup = ({
  handleSetupPreferences,
  flights,
  contract,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    location: "",
  });
  const web3 = new Web3(window.ethereum);
  const [encryptedData, setEncryptedData] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [prices, setPrices] = useState({});
  const [flightPrices, setFlightPrices] = useState({});
  const [shareType, setShareType] = useState("sharing");
  const [royaltyFee, setRoyaltyFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { address, isConnected } = useAccount();
  const [sharingData, setSharingData] = useState([]);
  const [flightData,setFlightData] = useState([])
  const [loadingAssetId, setLoadingAssetId] = useState(false);
  const [filterType, setFilterType] = useState("personalData");
  const [nftAmount, setNftAmount] = useState("");
  const [loadingFlightAssetId, setLoadingFlightAssetId] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleFlightData,setSingleFlightData] =  useState();
  const [isLoading,setIsLoading] = useState(true)
  const marketplaceIntegrateContract = () => {
    const marketplace = new web3.eth.Contract(
      dataSellingMarketplaceAbi,
      dataSellingMarketplaceAddress
    );
    return marketplace;
  };
  const [persoanlDataListLoading, setPersoanlDataListLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const dataNFTIntegrateContract = () => {
    const dataNft_Contract = new web3.eth.Contract(dataNFTAbi, dataNFTAddress);
    return dataNft_Contract;
  };
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
  const secretKey = "Asdzxc9900";
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const dataNFTContract = dataNFTIntegrateContract();
      const validatedPrices = {};
      const sumOfPrice = Object.keys(prices).reduce((total, attribute) => {
        validatedPrices[attribute] = prices[attribute] || "0";
        return total + Number(validatedPrices[attribute]);
      }, 0);
      let valueLocationWei;
      if (validatedPrices.location) {
        valueLocationWei = web3.utils.toWei(validatedPrices.location, "ether");
      }
      let valuePhoneNumbernnWei;
      if (validatedPrices.phoneNumber) {
        valuePhoneNumbernnWei = web3.utils.toWei(
          validatedPrices.phoneNumber,
          "ether"
        );
      }
      let valueUsernameWei;
      if (validatedPrices.username) {
        valueUsernameWei = web3.utils.toWei(validatedPrices.username, "ether");
      }
      if (address) {
        const useNameEncrypt = CryptoJS.AES.encrypt(
          formData?.username,
          secretKey
        ).toString();
        const phoneNumberEncrypt = CryptoJS.AES.encrypt(
          formData?.phoneNumber,
          secretKey
        ).toString();
        const locationEncrypt = CryptoJS.AES.encrypt(
          formData?.location,
          secretKey
        ).toString();

        if (shareType === "sharing") {
          await dataNFTContract.methods
            .register(
              useNameEncrypt,
              phoneNumberEncrypt,
              locationEncrypt,
              valueUsernameWei && valueUsernameWei > 0 ? valueUsernameWei : "0",
              valuePhoneNumbernnWei && valuePhoneNumbernnWei > 0
                ? valuePhoneNumbernnWei
                : "0",
              valueLocationWei && valueLocationWei > 0 ? valueLocationWei : "0",
              1,
              0
            )
            .send({ from: address, gas: 500000 });
          toast.success("User registration completed successfully.");
        } else {
          if (royaltyFee > 0 && royaltyFee < 1000) {
            await dataNFTContract.methods
              .register(
                useNameEncrypt,
                phoneNumberEncrypt,
                locationEncrypt,
                valueUsernameWei && valueUsernameWei > 0
                  ? valueUsernameWei
                  : "0",
                valuePhoneNumbernnWei && valuePhoneNumbernnWei > 0
                  ? valuePhoneNumbernnWei
                  : "0",
                valueLocationWei && valueLocationWei > 0
                  ? valueLocationWei
                  : "0",
                0,
                royaltyFee
              )
              .send({ from: address, gas: 500000 });
            toast.success("User registration completed successfully.");
          } else {
            toast.error("value must be greater then 0 and less than 1000");
          }
        }
        checkUserRegister();
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (error) {
      console.error("Error during registration and setup:", error);
    } finally {
      setLoading(false);
    }
  };
  const checkUserRegister = async () => {
    try {
      const dataNFTContract = dataNFTIntegrateContract();
      const marketContract = marketplaceIntegrateContract();
      let shareData = [];
      
      if (address) {
        setIsLoading(true)
        const isRegistered = await dataNFTContract.methods.isRegistered(address).call();
        setIsRegistered(isRegistered);
        const getUserRole = await dataNFTContract.methods.getUserRole(address).call();
        const userRoleNumber = Number(getUserRole);
        const getUserRoleOneData = async () => {
          const getDataIds = await dataNFTContract.methods.getDataIds(address).call();
          if(getDataIds.length){
            const getDataInfo = await dataNFTContract.methods.getDataInfo(address, Number(getDataIds[0])).call();
          if (!getDataInfo.isListed) {
            let locationAmount = Number(getDataInfo.locationAmount) / 1e18;
            let nameAmount = Number(getDataInfo.nameAmount) / 1e18;
            let phoneAmount = Number(getDataInfo.phoneAmount) / 1e18;
  
            const name = CryptoJS.AES.decrypt(getTokenInfo.name, secretKey);
              const nameDecryptedString = name.toString(CryptoJS.enc.Utf8);
              const phoneNo = CryptoJS.AES.decrypt(
                getTokenInfo.phoneNo,
                secretKey
              );
              const phoneNoDecryptedString = phoneNo.toString(
                CryptoJS.enc.Utf8
              );
              const location = CryptoJS.AES.decrypt(
                getTokenInfo.location,
                secretKey
              );
              const locationDecryptedString = location.toString(
                CryptoJS.enc.Utf8
              );;
  
            const object = {
              name:nameDecryptedString,
              phoneNo: phoneNoDecryptedString,
              location: locationDecryptedString,
              isAccessible: getDataInfo.isAccessible,
              owner: getDataInfo?.data_Owner,
              locationAmount: locationAmount.toFixed(4),
              nameAmount: nameAmount.toFixed(4),
              phoneAmount: phoneAmount.toFixed(4),
              role: Number(getDataInfo?.role),
              royaltyFee: 0,
              isListed: getDataInfo.isListed,
              toWei: Number(getDataInfo.attributesPrice),
              id: Number(getDataIds[0]),
            };
            shareData.push(object);
          }
          }
        };
        const getUserRoleOtherData = async () => {
          const getNFTIds = await dataNFTContract.methods.getNFTIds(address).call();
          const getAllListedNFTs = await marketContract.methods.getAllListedNFTs().call();
          const allUniqueTokenIds = [
            ...new Set([
              ...getNFTIds.map((id) => Number(id)).filter((id) => id !== 0),
              ...getAllListedNFTs.map((id) => Number(id)).filter((id) => id !== 0),
            ]),
          ];
          if (allUniqueTokenIds.length) {
            for (let NFTIds of allUniqueTokenIds) {
              const getListing = await marketContract.methods.getListing(dataNFTAddress, NFTIds).call();
              const getTokenInfo = await dataNFTContract.methods.getTokenInfo(getListing?.seller == "0x0000000000000000000000000000000000000000" ? address : getListing?.seller , NFTIds).call();
              
              if (!getTokenInfo.isListed) {
                let locationAmount = Number(getTokenInfo.locationAmount) / 1e18;
                let nameAmount = Number(getTokenInfo.nameAmount) / 1e18;
                let phoneAmount = Number(getTokenInfo.phoneNoAmount) / 1e18;
                           const name = CryptoJS.AES.decrypt(getTokenInfo.name, secretKey);
              const nameDecryptedString = name.toString(CryptoJS.enc.Utf8);
              const phoneNo = CryptoJS.AES.decrypt(
                getTokenInfo.phoneNo,
                secretKey
              );
              const phoneNoDecryptedString = phoneNo.toString(
                CryptoJS.enc.Utf8
              );
              const location = CryptoJS.AES.decrypt(
                getTokenInfo.location,
                secretKey
              );
              const locationDecryptedString = location.toString(
                CryptoJS.enc.Utf8
              );
  
                const object = {
                  name :nameDecryptedString,
                  phoneNo:phoneNoDecryptedString,
                  location:locationDecryptedString,
                  isAccessible: getTokenInfo.isAccessible,
                  owner: getTokenInfo?.data_Owner,
                  locationAmount: locationAmount.toFixed(4),
                  nameAmount: nameAmount.toFixed(4),
                  phoneAmount: phoneAmount.toFixed(4),
                  role: Number(getTokenInfo?.role),
                  id: NFTIds,
                  royaltyFee: Number(getTokenInfo.royaltyFee),
                  isListed: getTokenInfo.isListed,
                  seller: getListing?.seller == "0x0000000000000000000000000000000000000000" ? address : getListing?.seller,
                  sold: getListing.sold,
                  toWei: Number(getTokenInfo.attributesPrice),
                };
                shareData.push(object);
              }
            }
          }
        };
        await getUserRoleOneData();
        await getUserRoleOtherData();
  



        // Flight data
        const flightArray = []
        const getUserTokens = await dataNFTContract.methods.walletOfOwner(address).call();
        
        if(getUserTokens.length){
          for (let tokenId of getUserTokens) {
            const getListing = await marketContract.methods
            .getListing(dataNFTAddress, Number(tokenId))
            .call();
          const getTokenURI = await dataNFTContract.methods
            .getTokenURI(Number(tokenId))
            .call();
          const getUserInfo = await dataNFTContract.methods
            .getUserDetails(Number(tokenId))
            .call();
            if(getTokenURI){
              const flihtNumber = CryptoJS.AES.decrypt(getUserInfo.flightNo, secretKey);
              const flihtNumberDecryptedString = flihtNumber.toString(CryptoJS.enc.Utf8);
             
              if(!getUserInfo?.isListed){
                const object ={
                  title: getUserInfo?.title,
                  image:getTokenURI,
                  date: getUserInfo?.date,
                  isListed: getUserInfo?.isListed,
                  flightNumber: flihtNumberDecryptedString,
                  id: Number(tokenId)
                }
                flightArray.push(object)
              }
            }
            
          }
         
        }
        
        setFlightData(flightArray)
        setSharingData(shareData);
        setIsLoading(false)
      }
    } catch (e) {
      setIsLoading(false)
      console.log("Error in checkUserRegister:", e);
    } finally{
      setIsLoading(false)
    }
  };
  const sharingDataListForSale = async (asset) => {
    try {
      const dataNFTContract = dataNFTIntegrateContract();
      if (address) {
        setPersoanlDataListLoading(true);
        await dataNFTContract.methods
          .toggleDataListing(asset?.id)
          .send({ from: address });
        toast.success("Sharing Data Sale successfully.");
        checkUserRegister();
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setPersoanlDataListLoading(false);
    }
  };
  const handleNFTListSubmit = async (assets) => {
    try {
      if (address) {
        setLoadingAssetId(true);
        const dataNFTContract = dataNFTIntegrateContract();
        const marketContract = marketplaceIntegrateContract();
        const totalPrice =
          (parseFloat(assets.nameAmount) || 0) +
          (parseFloat(assets.phoneAmount) || 0) +
          (parseFloat(assets.locationAmount) || 0);
          
        const valueInWei = web3.utils.toWei(totalPrice, "ether");
        const approved = await dataNFTContract.methods
          .approve(dataSellingMarketplaceAddress, assets.id)
          .send({ from: address });
        if (approved) {
          const listNFT = await marketContract.methods
            .listTokenInfoNFT(dataNFTAddress, assets.id, valueInWei)
            .send({ from: address, gas: 500000 });
          if (listNFT) {
            toast.success("NFT Listed Successfully.");
            checkUserRegister();
          }
        }
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoadingAssetId(false);
    }
  };
  const handleFlightSubmit = async () => {
    try {
      setLoadingFlightAssetId(true);
      
      const dataNFTContract = dataNFTIntegrateContract();
      const marketContract = marketplaceIntegrateContract();
      const approved = await dataNFTContract.methods
        .approve(dataSellingMarketplaceAddress, singleFlightData.id)
        .send({ from: address });
      if (approved) {
        const valueInWei = web3.utils.toWei(nftAmount, "ether");
        const listNFT = await marketContract.methods
          .listCreatedInfoNFT(dataNFTAddress, singleFlightData.id, valueInWei)
          .send({ from: address, gas: 500000 });
        if (listNFT) {
          toast.success("NFT Listed Successfully.");
          checkUserRegister();
          setIsModalOpen(false)
        }
      }
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoadingFlightAssetId(false);
    }
  };
  useEffect(() => {
    checkUserRegister();
  }, [address]);
  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 main-content ">
      <div className="container mx-auto p-4">
      {
        isLoading ? (
          <div className="loading-state">
          <div className="loading"></div>
        </div>
        ): (
          <>
          <div className="mb-4">
            <label className="mr-4 font-bold">Filter by:</label>
            <button
              className={`mr-2 p-2 rounded ${
                filterType === "personalData"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilterType("personalData")}
            >
              Personal Data
            </button>
            <button
              className={`mr-2 p-2 rounded ${
                filterType === "flightData"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilterType("flightData")}
            >
              Flight Data
            </button>
          </div>
       <div>
        {
          filterType === "personalData" ? (
            <>
            {sharingData.length <= 0 ? (
            <></>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 d-flex justify-content-center">
            {
              sharingData?.map((items,index)=>{
                return (
                  <div className="" >
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">
                        {items.title}
                      </h3>
                      <p>Name: {items.name}</p>
                      <p>Phone No: {items.phoneNo}</p>
                      <p>Location: {items.location}</p>
                      <p>Name Price: {items.nameAmount} ETH</p>
                      <p>Phone Price: {items.phoneAmount} ETH</p>
                      <p>Location Price: {items.locationAmount} ETH</p>
                      {items.royaltyFee > 0 ? (
                        <p>RoyaltycFee: {items.royaltyFee} %</p>
                      ) : (
                        ""
                      )}
    
                      <>
                        {items.role == 1 ? (
                          <button
                            type="button"
                            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                            onClick={() => {
                              sharingDataListForSale(items);
                            }}
                            disabled={persoanlDataListLoading}
                          >
                            {persoanlDataListLoading
                              ? "Loading..."
                              : "List For Sale"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                            onClick={() => {
                              handleNFTListSubmit(items);
                            }}
                            disabled={loadingAssetId}
                          >
                            {loadingAssetId ? "Loading..." : "Convert NFT and List"}
                          </button>
                        )}
                      </>
                    </div>
                  </div>
                </div>
                )
              })
            }
            </div>
          )}
            </>
          ): <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flightData?.map((suggestion, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={suggestion.image} alt="Flight Image" className="w-full h-32 object-cover"/>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{suggestion.title}</h3>
                <p>Date: {suggestion.date}</p>
                <p>Flight Number: {suggestion.flightNumber.replace(/['"]/g, '')}</p>
                <button
                  type="button"
                  className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                  onClick={() => {
                    setIsModalOpen(true)
                    setSingleFlightData(suggestion)
                  }}
                >
                  Convert NFT and List
                </button>
              </div>
            </div>
          ))}
        </div>
          </>
        }
        </div>
      {!isRegistered &&
        <div className=" font-mono mt-8">
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-xl font-bold mb-2">
                Register and Setup Preferences
              </h3>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your location"
                  required
                />
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                  Select Attributes to Share
                </h4>
                {["username", "phoneNumber", "location"].map((attribute) => (
                  <div key={attribute} className="mb-2">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedAttributes.includes(attribute)}
                        onChange={() => handleAttributeChange(attribute)}
                      />
                      {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                    </label>
                    <input
                      type="number"
                      placeholder="Price in wei" // Updated placeholder to indicate prices are in wei
                      value={prices[attribute] || ""}
                      onChange={(e) =>
                        handlePriceChange(attribute, e.target.value)
                      }
                      disabled={!selectedAttributes.includes(attribute)}
                      className="ml-2 p-1 border rounded"
                    />
                  </div>
                ))}
              </div>

              <h4 className="text-lg font-bold mb-2">Set Flight Prices</h4>
              {flights.map((flight) => (
                <div key={flight.flightNumber} className="mb-4">
                  <label>Flight {flight.flightNumber}:</label>
                  <input
                    type="number"
                    placeholder="Price in wei" // Updated placeholder to indicate prices are in wei
                    value={flightPrices[flight.flightNumber] || ""}
                    onChange={(e) =>
                      handleFlightPriceChange(
                        flight.flightNumber,
                        e.target.value
                      )
                    }
                    className="ml-2 p-1 border rounded"
                  />
                </div>
              ))}

              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Choose Sharing Type</h3>
                <label className="block">
                  <input
                    type="radio"
                    value="sharing"
                    checked={shareType === "sharing"}
                    onChange={() => setShareType("sharing")}
                  />{" "}
                  Data Sharing
                </label>
                <label className="block mt-2">
                  <input
                    type="radio"
                    value="tokenization"
                    checked={shareType === "tokenization"}
                    onChange={() => setShareType("tokenization")}
                  />{" "}
                  Data as NFT
                </label>
              </div>

              {shareType === "tokenization" && (
                <div className="mt-4">
                  <label className="block text-lg font-bold mb-2 tooltip-container">
                    Set Royalty Fee (%)
                    <span className="info-icon">ℹ️</span>
                    <span className="tooltip-text">
                      The royalty fee is a percentage of the resale value that
                      you will receive each time the NFT is sold in the future.
                    </span>
                  </label>
                  <input
                    type="number"
                    value={royaltyFee}
                    onChange={(e) => setRoyaltyFee(e.target.value)}
                    placeholder="Enter royalty fee as a percentage"
                    className="p-1 border rounded w-full"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "Processing..." : "Register and Save Preferences"}
              </button>
            </div>
          </form>
        </div>
      }
          </>
        )
      }
      </div>
      
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div>
            <label
              htmlFor="from"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="text"
              id="from"
              name="from"
              value={nftAmount}
              onChange={(e) => setNftAmount(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
              required
            />
          </div>
          <button
            onClick={handleFlightSubmit}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
            disabled={loadingFlightAssetId}
          >
            {loadingFlightAssetId ? "Listing..." : "List"}
          </button>
      </Modal>
    </div>
  );
};

export default UserRegistrationAndSetup;
