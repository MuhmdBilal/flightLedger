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
      Object.keys(prices).forEach((attribute) => {
        validatedPrices[attribute] = prices[attribute] || "0";
      });

      // let parsedFlightPrices = [];
      // let flightNumbers = [];

      // if (flights && flights.length > 0) {
      //   const validatedFlightPrices = {};
      //   Object.keys(flightPrices).forEach((flightNumber) => {
      //     validatedFlightPrices[flightNumber] = flightPrices[flightNumber] || "0";
      //   });

      //   parsedFlightPrices = Object.values(validatedFlightPrices).map((price) => {
      //     return ethers.BigNumber.from(price); // Convert the string to a BigNumber representing wei
      //   });
      //   flightNumbers = Object.keys(validatedFlightPrices);
      // }
      if (address) {
        if (shareType === "sharing") {
          const object = {
            phoneNumber: formData?.phoneNumber,
            location: formData?.location,
            userNamePrice: prices?.username,
            phoneNumberPrice: prices?.phoneNumber,
            locationPrice: prices?.location,
            shareType,
          };
          const stringifiedData = JSON.stringify(object);
          const ciphertext = CryptoJS.AES.encrypt(
            stringifiedData,
            secretKey
          ).toString();

          await dataNFTContract.methods
            .storeData(formData?.username, ciphertext)
            .send({ from: address });
            toast.success('User registration completed successfully.');
        } else{
          if(royaltyFee <25){
            const object1 = {
              phoneNumber: formData?.phoneNumber,
              location: formData?.location,
              userNamePrice: prices?.username,
              phoneNumberPrice: prices?.phoneNumber,
              locationPrice: prices?.location,
              shareType,
              royaltyFee
            };
            const imageUrl = "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            const stringifiedData = JSON.stringify(object1);
            const ciphertext = CryptoJS.AES.encrypt(
              stringifiedData,
              secretKey
            ).toString();
             await dataNFTContract.methods.create(formData?.username,true, ciphertext,imageUrl, royaltyFee).send({ from: address });
            toast.success('User registration completed successfully.');
          } else{
            toast.error("value must be less than 25")
          }
        }
        
      } else {
        toast.error("Please Wallet Connect First!");
      }
      // const parsedRoyaltyFee = royaltyFee ? parseInt(royaltyFee, 10) : 0;

      // Register user and setup preferences
      // const selectedAttributesArray = selectedAttributes || [];
      // const priceArray = selectedAttributesArray.map(attr =>
      //   ethers.BigNumber.from(validatedPrices[attr] || "0") // Treat prices as wei
      // );

      //  setEncryptedData(ciphertext);
      // const tx = await contract.storePersonalData(

      //   selectedAttributesArray,
      //   priceArray,
      //   shareType === 'tokenization' ? 'tokenizing' : 'sharing'
      // );

      // const receipt = await tx.wait();

      // if (receipt.status === 1) {
      //   console.log('User registration completed successfully.');

      //   if (shareType === 'tokenization') {
      //     console.log('Proceeding to tokenize user data...');

      //     // Calculate the total price of the NFT by summing up all the attribute prices
      //     const totalPrice = priceArray.reduce((total, price) => total.add(price), ethers.BigNumber.from(0));
      //     console.log('totalPrice', totalPrice)

      //     await contract.tokenizeUserData(
      //       selectedAttributesArray,
      //       parsedRoyaltyFee.toString(),
      //       totalPrice.toString() // Pass the total price as the third parameter
      //     );
      //     console.log('User data tokenized successfully!');
      //   }

      //   if (flightNumbers.length > 0) {
      //     for (let flight of flights) {
      //       if (flightPrices[flight.flightNumber] && flightPrices[flight.flightNumber] !== flight.price) {
      //         const priceInWei = ethers.BigNumber.from(flightPrices[flight.flightNumber]); // Treat as wei
      //         const isShared = priceInWei.gt(0); // Set isShared to true if price is greater than 0
      //         await contract.updateFlight(
      //           flight.flightNumber,
      //           flight.from,
      //           flight.to,
      //           flight.date,
      //           flight.isInternal === 'Yes',
      //           priceInWei,
      //           isShared // Pass the isShared value to the smart contract
      //         );
      //         console.log(`Flight ${flight.flightNumber} updated successfully with price: ${flightPrices[flight.flightNumber]} wei and isShared: ${isShared}`);
      //       }
      //     }
      //   }

      //   // handleSetupPreferences(
      //   //   selectedAttributes,
      //   //   validatedPrices,
      //   //   flightNumbers,
      //   //   parsedFlightPrices,
      //   //   shareType === 'tokenization',
      //   //   parsedRoyaltyFee
      //   // );
      // } else {
      //   console.error('Registration transaction failed:', receipt);
      //   alert('Registration failed. Please try again.');
      // }
    } catch (error) {
      console.error("Error during registration and setup:", error);
      alert(
        "An error occurred during registration. Please check your inputs and try again."
      );
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
                    />{" "}
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
