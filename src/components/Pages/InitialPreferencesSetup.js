import React, { useState } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { useAccount } from "wagmi";
import Web3 from "web3";
import { dataNFTAbi, dataNFTAddress } from "../../utils/dataNFT";
import { toast } from "react-toastify";
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
  const { address, isConnected } = useAccount();
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
      const valueInWei = web3.utils.toWei(sumOfPrice, "ether");
      if (address) {
        // const isUserRegistered = await dataNFTContract.methods.isUserRegistered(address).call();
        // if(isUserRegistered){
        //   toast.error("Wallet address already register, please use another wallet address")
        //   return
        // }
        // const object = {
        //   username: formData?.username,
        //   phoneNumber: formData?.phoneNumber,
        //   location: formData?.location,
        //   userNamePrice: prices?.username,
        //   phoneNumberPrice: prices?.phoneNumber,
        //   locationPrice: prices?.location,
        //   shareType,
        // };
        // const stringifiedData = JSON.stringify(object);
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
            .register(useNameEncrypt, phoneNumberEncrypt, locationEncrypt, 1, 0, valueInWei)
            .send({ from: address, gas: 500000 });
          toast.success("User registration completed successfully.");
        } else {
          if (royaltyFee > 0 && royaltyFee < 1000) {
            await dataNFTContract.methods
              .register(useNameEncrypt, phoneNumberEncrypt, locationEncrypt,0, royaltyFee, valueInWei)
              .send({ from: address, gas: 500000 });
            toast.success("User registration completed successfully.");
          } else {
            toast.error("value must be greater then 0 and less than 1000");
          }
        }
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (error) {
      console.error("Error during registration and setup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 main-content">
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
                      required
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
                    required
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
                    handleFlightPriceChange(flight.flightNumber, e.target.value)
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
                    The royalty fee is a percentage of the resale value that you
                    will receive each time the NFT is sold in the future.
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
    </div>
  );
};

export default UserRegistrationAndSetup;
