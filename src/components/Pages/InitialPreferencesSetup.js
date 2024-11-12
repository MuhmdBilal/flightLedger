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
  const [loadingAssetId, setLoadingAssetId] = useState(false);
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
              valueUsernameWei > 0 ? valueUsernameWei : "0",
              valuePhoneNumbernnWei > 0 ? valuePhoneNumbernnWei : "0",
              valueLocationWei > 0 ? valueLocationWei : "0",
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
                valueUsernameWei > 0 ? valueUsernameWei : "0",
                valuePhoneNumbernnWei > 0 ? valuePhoneNumbernnWei : "0",
                valueLocationWei > 0 ? valueLocationWei : "0",
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

      if (address) {
        const isRegistered = await dataNFTContract.methods
          .isRegistered(address)
          .call();
        setIsRegistered(isRegistered);
        const getUserRole = await dataNFTContract.methods
          .getUserRole(address)
          .call();

        if (Number(getUserRole) === 1) {
          const getDataIds = await dataNFTContract.methods
            .getDataIds(address)
            .call();
          const getDataInfo = await dataNFTContract.methods
            .getDataInfo(address, Number(getDataIds[0]))
            .call();
          let locationAmount = Number(getDataInfo.locationAmount) / 1e18;
          let nameAmount = Number(getDataInfo.nameAmount) / 1e18;
          let phoneAmount = Number(getDataInfo.phoneAmount) / 1e18;
          const name = CryptoJS.AES.decrypt(getDataInfo.name, secretKey);
          const nameDecryptedString = name.toString(CryptoJS.enc.Utf8);
          const phoneNo = CryptoJS.AES.decrypt(getDataInfo.phoneNo, secretKey);
          const phoneNoDecryptedString = phoneNo.toString(CryptoJS.enc.Utf8);
          const location = CryptoJS.AES.decrypt(
            getDataInfo.location,
            secretKey
          );
          const locationDecryptedString = location.toString(CryptoJS.enc.Utf8);
          const object = {
            name: nameDecryptedString,
            phoneNo: phoneNoDecryptedString,
            location: locationDecryptedString,
            isAccessible: getDataInfo.isAccessible,
            owner: getDataInfo?.data_Owner,
            locationAmount: locationAmount.toFixed(2),
            nameAmount: nameAmount.toFixed(2),
            phoneAmount: phoneAmount.toFixed(2),
            role: Number(getDataInfo?.role),
            royaltyFee: 0,
            isListed: getDataInfo.isListed,
            toWei: Number(getDataInfo.attributesPrice),
            id: Number(getDataIds[0]),
          };
          setSharingData(object);
        } else {
          const getNFTIds = await dataNFTContract.methods
            .getNFTIds(address)
            .call();
          const getListing = await marketContract.methods
            .getListing(dataNFTAddress, Number(getNFTIds[0]))
            .call();
          const getTokenInfo = await dataNFTContract.methods
            .getTokenInfo(address, Number(getNFTIds[0]))
            .call();

          let locationAmount = Number(getTokenInfo.locationAmount) / 1e18;
          let nameAmount = Number(getTokenInfo.nameAmount) / 1e18;
          let phoneAmount = Number(getTokenInfo.phoneNoAmount) / 1e18;
          const name = CryptoJS.AES.decrypt(getTokenInfo.name, secretKey);
          const nameDecryptedString = name.toString(CryptoJS.enc.Utf8);
          const phoneNo = CryptoJS.AES.decrypt(getTokenInfo.phoneNo, secretKey);
          const phoneNoDecryptedString = phoneNo.toString(CryptoJS.enc.Utf8);
          const location = CryptoJS.AES.decrypt(
            getTokenInfo.location,
            secretKey
          );
          const locationDecryptedString = location.toString(CryptoJS.enc.Utf8);
          const object = {
            name: nameDecryptedString,
            phoneNo: phoneNoDecryptedString,
            location: locationDecryptedString,
            isAccessible: getTokenInfo.isAccessible,
            owner: getTokenInfo?.seller,
            locationAmount: locationAmount.toFixed(2),
            nameAmount: nameAmount.toFixed(2),
            phoneAmount: phoneAmount.toFixed(2),
            role: Number(getTokenInfo?.role),
            royaltyFee: 0,
            isListed: getTokenInfo.getListing,
            toWei: Number(getTokenInfo.attributesPrice),
            id: Number(getNFTIds[0]),
          };
          setSharingData(object);
        }
      }
    } catch (e) {
      console.log("e", e);
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
      console.log("assets", assets);

      setLoadingAssetId(true);
      const dataNFTContract = dataNFTIntegrateContract();
      const marketContract = marketplaceIntegrateContract();
      const totalPrice =
        (parseFloat(assets.nameAmount) || 0) +
        (parseFloat(assets.phoneAmount) || 0) +
        (parseFloat(assets.locationAmount) || 0);
      const approved = await dataNFTContract.methods
        .approve(dataSellingMarketplaceAddress, assets.id)
        .send({ from: address });
      if (approved) {
        const valueInWei = web3.utils.toWei(totalPrice, "ether");
        const listNFT = await marketContract.methods
          .listTokenInfoNFT(dataNFTAddress, assets.id, valueInWei)
          .send({ from: address, gas: 500000 });
        if (listNFT) {
          toast.success("NFT Listed Successfully.");
        }
      }
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoadingAssetId(false);
    }
  };
  useEffect(() => {
    checkUserRegister();
  }, [address]);
  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 main-content">
      {isRegistered ? (
        <div>
          {sharingData?.isListed ? (
            <>data move to Market palce</>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 d-flex justify-content-center">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">
                    {sharingData.title}
                  </h3>
                  <p>Name: {sharingData.name}</p>
                  <p>Phone No: {sharingData.phoneNo}</p>
                  <p>Location: {sharingData.location}</p>
                  <p>Name Price: {sharingData.nameAmount} ETH</p>
                  <p>Phone Price: {sharingData.phoneAmount} ETH</p>
                  <p>Location Price: {sharingData.locationAmount} ETH</p>
                  {sharingData.royaltyFee > 0 ? (
                    <p>RoyaltycFee: {sharingData.royaltyFee} </p>
                  ) : (
                    ""
                  )}

                  <>
                    {sharingData.role == 1 ? (
                      <button
                        type="button"
                        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                        onClick={() => {
                          sharingDataListForSale(sharingData);
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
                          handleNFTListSubmit(sharingData);
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
          )}
        </div>
      ) : (
        <div className="container mx-auto p-4 font-mono">
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
      )}
    </div>
  );
};

export default UserRegistrationAndSetup;
