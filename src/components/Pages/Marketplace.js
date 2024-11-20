import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import UserDataCard from "../components/UserDataCard";
import UserDataModal from "../components/UserDataModal";
import AssetCard from "../components/AssetCard";
import { ethers } from "ethers";
import UserDataOwnershipABI from "../contractabi.json";
import ManageNFTsAndTokenizationComponent from "./ManageNFTsAndTokenizationComponent";
import { useAccount } from "wagmi";
import Web3 from "web3";
import { dataNFTAbi, dataNFTAddress } from "../../utils/dataNFT";
import CryptoJS from "crypto-js";
import {
  dataSellingMarketplaceAbi,
  dataSellingMarketplaceAddress,
} from "../../utils/dataSellingMarketplace";
import { toast } from "react-toastify";
const USER_DATA_AND_FLIGHTS_CONTRACT =
  "0x12811A76dBd05F81e64B48259FDdB4B7bEF40524";

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
const Marketplace = () => {
  const { address, isConnected } = useAccount();

  const [contract, setContract] = useState(null);
  const [selectedSection, setSelectedSection] = useState("personalInfo");
  const [usersData, setUsersData] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [storeData, setStoreData] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleNftValue, setSingleNftValue] = useState(null);
  const [nftAmount, setNftAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [delisNftLoading, setDelisNftLoading] = useState(null);
  const [buyNftLoading, setBuyNftLoading] = useState(null);
  const [personalNFTData, setPersonalNFTData] = useState([]);
  const [marketPlaceNFTData, setmarketPlaceNFTData] = useState([]);
  const [persoanlDataListLoading, setPersoanlDataListLoading] = useState(false);
  const [loadingAssetId, setLoadingAssetId] = useState(null);
  const [flightDelistLoading,setFlightDelistLoading] = useState(false);
  const [flightBuyLoading,setFlightBuyLoading]= useState(false);
  const [persoanlDataDelistLoading, setPersoanlDeliataListLoading] =
    useState(false);
  const secretKey = "Asdzxc9900";
  const web3 = new Web3(window.ethereum);
  const dataNFTIntegrateContract = () => {
    const dataNft_Contract = new web3.eth.Contract(dataNFTAbi, dataNFTAddress);
    return dataNft_Contract;
  };
  const marketplaceIntegrateContract = () => {
    const marketplace = new web3.eth.Contract(
      dataSellingMarketplaceAbi,
      dataSellingMarketplaceAddress
    );
    return marketplace;
  };
  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(
            USER_DATA_AND_FLIGHTS_CONTRACT,
            UserDataOwnershipABI,
            signer
          );
          setContract(contractInstance);
          await fetchUsersData(contractInstance);
          await fetchAllFlights(contractInstance);
        } catch (error) {
          console.error("Error connecting to the wallet:", error);
        }
      } else {
        console.error(
          "Ethereum object not found, make sure you have MetaMask installed."
        );
      }
    };

    initializeContract();
  }, []);

  const fetchUsersData = async (contractInstance) => {
    try {
      // const [
      //   owners,
      //   usernames,
      //   phoneNumbers,
      //   locations,
      //   attributesList,
      //   pricesList,
      //   sharingTypes,
      // ] = await contractInstance.getAllUsersInfo();
      // const usersDataArray = owners.map((owner, index) => ({
      //   owner,
      //   username: usernames[index],
      //   phoneNumber: phoneNumbers[index],
      //   location: locations[index],
      //   attributes: attributesList[index],
      //   prices: pricesList[index].map((price) =>
      //     ethers.utils.formatEther(price)
      //   ),
      //   sharingType: sharingTypes[index],
      // }));
      // setUsersData(usersDataArray);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
 
  const fetchAllFlights = async (contractInstance) => {
    try {
      // const flightNumbersSet = new Set();

      // const [
      //   owners,
      //   flightNumbers,
      //   fromLocations,
      //   toLocations,
      //   dates,
      //   internals,
      //   prices,
      //   isSharedArray,
      // ] = await contractInstance.getAllFlightsInfo();

      // const uniqueFlights = flightNumbers
      //   .map((flightNumber, index) => {
      //     if (!flightNumbersSet.has(flightNumber.toString())) {
      //       flightNumbersSet.add(flightNumber.toString());

      //       return {
      //         flightNumber: flightNumber.toString(),
      //         owner: owners[index],
      //         from: fromLocations[index],
      //         to: toLocations[index],
      //         date: dates[index],
      //         isInternal: internals[index] ? "Yes" : "No",
      //         price: ethers.utils.formatEther(prices[index]),
      //         isShared: isSharedArray[index] ? "Shared" : "Not Shared",
      //       };
      //     }
      //     return null;
      //   })
      //   .filter((flight) => flight !== null);

      // setFlights(uniqueFlights);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handlePurchase = async (owner, selectedItems, userData) => {
    if (!contract || selectedItems.length === 0) return;

    try {
      // const totalCost = selectedItems.reduce((total, item) => {
      //   const itemIndex = userData.attributes.indexOf(item);
      //   let priceInWei;
      //   if (userData.prices[itemIndex].includes(".")) {
      //     priceInWei = ethers.utils.parseUnits(
      //       userData.prices[itemIndex].toString(),
      //       "ether"
      //     );
      //   } else {
      //     priceInWei = ethers.BigNumber.from(userData.prices[itemIndex]);
      //   }
      //   return total.add(priceInWei);
      // }, ethers.BigNumber.from(0));
      // console.log(totalCost.toString());
      // console.log(selectedItems);
      // const transaction = await contract.purchasePersonalData(
      //   owner,
      //   selectedItems,
      //   {
      //     value: totalCost,
      //     gasLimit: ethers.utils.hexlify(2000000),
      //   }
      // );
      // await transaction.wait();
      // console.log("Purchase completed:", transaction);
    } catch (error) {
      console.error("Error purchasing data:", error);
    }
  };

  // .................add functionalty ..............//

  const getSharingData = async () => {
    try {
      const dataNFTContract = dataNFTIntegrateContract();
      const marketContract = marketplaceIntegrateContract();
      if (address) {
        let marketPlacefNFTArray = [];
        const nextDataId = await dataNFTContract.methods
          .getDataIds(address)
          .call();
        const getNFTIds = await dataNFTContract.methods
          .getNFTIds(address)
          .call();
        const getAllListedNFTs = await marketContract.methods
          .getAllListedNFTs()
          .call();
        const allUniqueTokenIds = [
          ...new Set([
            ...getNFTIds.map((id) => Number(id)).filter((id) => id !== 0),
            ...getAllListedNFTs
              .map((id) => Number(id))
              .filter((id) => id !== 0),
          ]),
        ];
        if (allUniqueTokenIds.length) {
          for (let NFTIds of allUniqueTokenIds) {
            const getListing = await marketContract.methods
              .getListing(dataNFTAddress, NFTIds)
              .call();
            const getTokenInfo = await dataNFTContract.methods
              .getTokenInfo(getListing?.seller, NFTIds)
              .call();
              console.log("getTokenInfo.phoneAmount", getTokenInfo);
              
              let locationAmount = Number(getTokenInfo.locationAmount) / 1e18;
            let nameAmount = Number(getTokenInfo.nameAmount) / 1e18;
            let phoneAmount = Number(getTokenInfo.phoneNoAmount) / 1e18;
            let price = Number(getTokenInfo.attributesPrice) / 1e18;
            const name = CryptoJS.AES.decrypt(getTokenInfo.name, secretKey);
            const nameDecryptedString = name.toString(CryptoJS.enc.Utf8);
            const phoneNo = CryptoJS.AES.decrypt(
              getTokenInfo.phoneNo,
              secretKey
            );
            const phoneNoDecryptedString = phoneNo.toString(CryptoJS.enc.Utf8);
            const location = CryptoJS.AES.decrypt(
              getTokenInfo.location,
              secretKey
            );
            const locationDecryptedString = location.toString(
              CryptoJS.enc.Utf8
            );
            if (getTokenInfo.isListed) {
              const object = {
                name: nameDecryptedString,
                phoneNo: phoneNoDecryptedString,
                location: locationDecryptedString,
                isAccessible: getTokenInfo.isAccessible,
                owner: getTokenInfo?.data_Owner,
                locationAmount: locationAmount.toFixed(4),
                nameAmount: nameAmount.toFixed(4),
                phoneAmount: phoneAmount.toFixed(4),
                role: Number(getTokenInfo?.role),
                id: NFTIds,
                royaltyFee: Number(getTokenInfo.royaltyFee),
                isListed: getTokenInfo.isListed,
                seller: getListing.seller,
                sold: getListing.sold,
                toWei: Number(getTokenInfo.attributesPrice),
              };
              marketPlacefNFTArray.push(object);
            }
          }
        }
        setmarketPlaceNFTData(marketPlacefNFTArray);
        //personal data
        let NFTArray = [];

        // if (getNFTIds.length) {
        //   for (let j = 0; j < getNFTIds.length; j++) {
        //     const getTokenInfo = await dataNFTContract.methods
        //       .getTokenInfo(address, Number(getNFTIds[j]))
        //       .call();
        //     let price = Number(getTokenInfo.attributesPrice) / 1e18;
        //     const name = CryptoJS.AES.decrypt(getTokenInfo.name, secretKey);
        //     const nameDecryptedString = name.toString(CryptoJS.enc.Utf8);
        //     const phoneNo = CryptoJS.AES.decrypt(
        //       getTokenInfo.phoneNo,
        //       secretKey
        //     );
        //     const phoneNoDecryptedString = phoneNo.toString(CryptoJS.enc.Utf8);
        //     const location = CryptoJS.AES.decrypt(
        //       getTokenInfo.location,
        //       secretKey
        //     );
        //     const locationDecryptedString = location.toString(
        //       CryptoJS.enc.Utf8
        //     );

        //     if (!getTokenInfo.isListed) {
        //       const object = {
        //         name: nameDecryptedString,
        //         phoneNo: phoneNoDecryptedString,
        //         location: locationDecryptedString,
        //         isAccessible: getTokenInfo.isAccessible,
        //         owner: getTokenInfo?.data_Owner,
        //         price: price,
        //         role: Number(getTokenInfo?.role),
        //         id: Number(getNFTIds[j]),
        //         royaltyFee: Number(getTokenInfo.royaltyFee),
        //         isListed: getTokenInfo.isListed,
        //       };
        //       NFTArray.push(object);
        //     }
        //   }
        //   setPersonalNFTData(NFTArray);
        // }

        let array = [];
        // data sharing
        const getListedDataIds = await dataNFTContract.methods
          .getListedDataIds()
          .call();
        if (getListedDataIds.length) {
          for (let sharingIds of getListedDataIds) {
            const viewStoredData = await dataNFTContract.methods
              .hasPaidForAccess(Number(sharingIds), address)
              .call();
            const getDataOwner = await dataNFTContract.methods
              .getDataOwner(Number(sharingIds))
              .call();
            const getDataInfo = await dataNFTContract.methods
              .getDataInfo(getDataOwner, Number(sharingIds))
              .call();
            let locationAmount = Number(getDataInfo.locationAmount) / 1e18;
            let nameAmount = Number(getDataInfo.nameAmount) / 1e18;
            let phoneAmount = Number(getDataInfo.phoneAmount) / 1e18;
            const name = CryptoJS.AES.decrypt(getDataInfo.name, secretKey);
            const nameDecryptedString = name.toString(CryptoJS.enc.Utf8);
            const phoneNo = CryptoJS.AES.decrypt(
              getDataInfo.phoneNo,
              secretKey
            );
            const phoneNoDecryptedString = phoneNo.toString(CryptoJS.enc.Utf8);
            const location = CryptoJS.AES.decrypt(
              getDataInfo.location,
              secretKey
            );
            const locationDecryptedString = location.toString(
              CryptoJS.enc.Utf8
            );
            if (getDataInfo.isListed) {
              const object = {
                name: nameDecryptedString,
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
                id: sharingIds,
                viewStoredData: viewStoredData,
              };
              array.push(object);
              // console.log("object", object);
            }
          }
        }

        setStoreData(array);
      }
    } catch (e) {
      console.log("e", e);
    }
  };
  const getNFTData = async () => {
    try {
      const dataNFTContract = dataNFTIntegrateContract();
      const marketContract = marketplaceIntegrateContract();

      if (address) {
        let array = [];
        const getAllListedNFTs = await marketContract.methods
        .getAllListedCreatedNFTs().call();
        for (let tokenId of getAllListedNFTs) {
          const getListing = await marketContract.methods
            .getListing(dataNFTAddress, Number(tokenId))
            .call();
            
          const getTokenURI = await dataNFTContract.methods
            .getTokenURI(Number(tokenId))
            .call();
          const getTokenInfo = await dataNFTContract.methods
            .getUserInfo(getListing.seller,Number(tokenId))
            .call();
          const bytes = CryptoJS.AES.decrypt(
            getTokenInfo?.flightNo,
            secretKey
          );
          const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
          let price = Number(getListing.price) / 1e18;
          const object = {
            title: getTokenInfo.title,
            royaltyFee: Number(getTokenInfo.royaltyFee),
            date: getTokenInfo?.date,
            flight: decryptedString,
            image: getTokenURI,
            id: Number(tokenId),
            mintId: Number(tokenId),
            isListed: getListing.isListed,
            sold: getListing.sold,
            seller: getListing.seller,
            price: price.toFixed(4),
            toWeiPrice: Number(getListing.price)
          };
          array.push(object);
        }
        setNftData(array);
      }
    } catch (e) {
      console.log("e", e);
    }
  };

  const purchaseSgaringData = async (asset) => {
    try {
      const dataNFTContract = dataNFTIntegrateContract();
      if (address) {
        setPurchaseLoading(true);
        const valueInWei = web3.utils.toWei("0.001", "ether");
        const payForAccess = await dataNFTContract.methods
          .payForAccess(asset.id)
          .send({
            from: address,
            value: valueInWei,
          });
        toast.success("Data purchase successfully.");
        getSharingData();
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setPurchaseLoading(false);
    }
  };
  const sharingDataListForSale = async (asset) => {
    try {
      const dataNFTContract = dataNFTIntegrateContract();
      if (address) {
        const totalPrice =
          (parseFloat(asset.nameAmount) || 0) +
          (parseFloat(asset.phoneAmount) || 0) +
          (parseFloat(asset.locationAmount) || 0);
        const valueInWei = web3.utils.toWei(totalPrice, "ether");
        setPersoanlDataListLoading(true);
        await dataNFTContract.methods
          .payForAccess(asset?.id)
          .send({ from: address, value: valueInWei });
        toast.success("Sharing Data Sale successfully.");
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setPersoanlDataListLoading(false);
    }
  };
  useEffect(() => {
    getSharingData();
    getNFTData();
  }, [address]);

  const filteredUsersData = usersData.filter((userData) => {
    if (filterType === "all") return true;
    return userData.sharingType === filterType;
  });
  const filteredFlights = flights.filter((flight) => {
    if (filterType === "all") return true;
    return (
      flight.isShared === (filterType === "sharing" ? "Shared" : "Not Shared")
    );
  });
  const sharingDataDelistForSale = async (flight) => {
    try {
      const dataNFTContract = dataNFTIntegrateContract();
      if (address) {
        setPersoanlDeliataListLoading(true);
        const toggleDataDelisting = await dataNFTContract.methods
          .toggleDataDelisting(flight.id)
          .send({ from: address });
        if (toggleDataDelisting) {
          toast.success("Sharing Data Delsit successfully.");
          getSharingData();
        }
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setPersoanlDeliataListLoading(false);
    }
  };
  const renderSection = () => {
    if (selectedSection === "personalInfo") {
      return (
        <div className="">
          {filterType === "sharing" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {storeData?.map((flight, index) => (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{flight.title}</h3>
                    <p>
                      Name:
                      {flight.owner === address ? flight.name : "********"}
                    </p>
                    <p>
                      Phone No:
                      {flight.owner === address ? flight.phoneNo : "********"}
                    </p>
                    <p>
                      Location:
                      {flight.owner === address ? flight.location : "********"}
                    </p>
                    <p>
                      Name Price:
                      {flight.owner === address ||
                      (flight.viewStoredData && flight.nameAmount > 0)
                        ? flight.nameAmount
                        : "********"}
                      ETH
                    </p>
                    <p>
                      Phone Price:
                      {flight.owner === address ||
                      (flight.viewStoredData && flight.phoneAmount > 0)
                        ? flight.phoneAmount
                        : "********"}
                      ETH
                    </p>
                    <p>
                      Location Price:
                      {flight.owner === address ||
                      (flight.viewStoredData && flight.locationAmount > 0)
                        ? flight.locationAmount
                        : "********"}
                      ETH
                    </p>
                    <>
                      {flight.owner === address ? (
                        <button
                          type="button"
                          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                          onClick={() => {
                            sharingDataDelistForSale(flight);
                          }}
                          disabled={persoanlDataDelistLoading}
                        >
                          {persoanlDataDelistLoading ? "Loading..." : "Delsit"}
                        </button>
                      ) : (
                        <>
                          {!flight.viewStoredData && (
                            <button
                              type="button"
                              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                              onClick={() => {
                                sharingDataListForSale(flight);
                              }}
                              disabled={persoanlDataListLoading}
                            >
                              {persoanlDataListLoading
                                ? "Loading..."
                                : "Buy Now"}
                            </button>
                          )}
                        </>
                      )}
                    </>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filterType === "tokenizing" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {marketPlaceNFTData?.map((flight, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{flight.title}</h3>
                      <p>Name: {flight.seller === address ? flight.name: "********"}</p>
                      <p>Phone No: {flight.seller === address ?flight.phoneNo: "********"}</p>
                      <p>Location: {flight.seller === address ?flight.location: "********"} ETH</p>
                      <p>
                      Name Price:
                      {flight.seller === address 
                        ? flight.nameAmount
                        : "********"}
                      ETH
                    </p>
                    <p>
                      Phone Price:
                      {flight.seller === address 
                        ? flight.phoneAmount
                        : "********"}
                      ETH
                    </p>
                    <p>
                      Location Price:
                      {flight.seller === address 
                        ? flight.locationAmount
                        : "********"}
                      ETH
                    </p>
                      <p>RoyaltycFee: {flight.seller === address ? flight.royaltyFee : "********"} %</p>
                      <>
                        {flight?.seller === address ? (
                          <>
                            {!flight?.sold && (
                              <button
                                type="button"
                                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                                onClick={() => {
                                  nftDelist(flight.id);
                                }}
                                disabled={!!delisNftLoading}
                              >
                                {delisNftLoading == flight.id? "Loading..." : "Delist"}
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                            onClick={() => {
                              buyDataNFT(flight);
                            }}
                            disabled={!!buyNftLoading}
                          >
                            {buyNftLoading == flight.id ? "Loading..." : "Buy NFT"}
                          </button>
                        )}
                      </>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      );
    } else if (selectedSection === "flights") {
      return (
        <div className="">
          {filterType === "sharing" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* {storeData?.map((flight) => (
                <AssetCard
                  key={flight.flightNumber}
                  asset={flight}
                  onSelect={() => setSelectedFlight(flight)}
                  onPurchase={purchaseSgaringData}
                  purchaseLoading={purchaseLoading}
                />
              ))} */}
            </div>
          ) : (
            filterType === "tokenizing" && (
              <div className="">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nftData?.map((suggestion, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              {
                suggestion.seller === address && <img src={suggestion.image} alt="Flight Image" className="w-full h-32 object-cover"/>
              }
              
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{suggestion.seller === address ? suggestion.title : "*********"}</h3>
                <p>Date: {suggestion.seller === address ?suggestion.date : "*********"}</p>
                <p>Flight Number: {suggestion.seller === address ?suggestion.flight.replace(/['"]/g, '') : "*********"}</p>
                <>
                        {suggestion?.seller === address ? (
                          <>
                            {!suggestion?.sold && (
                              <button
                                type="button"
                                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                                onClick={() => {
                                  flightDelist(suggestion.id);
                                }}
                                disabled={flightDelistLoading}
                              >
                                {flightDelistLoading ? "Loading..." : "Delist"}
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                            onClick={() => {
                              buyFlightNFT(suggestion);
                            }}
                            disabled={flightBuyLoading}
                          >

                            {flightBuyLoading ? "Loading..." : "Buy NFT"}
                          </button>
                        )}
                      </>
              </div>
            </div>
          ))}
        </div>
              
              </div>
            )
          )}
        </div>
      );
    } else if (selectedSection === "manageNFTs") {
      return (
        <ManageNFTsAndTokenizationComponent
          contract={contract}
          address={address}
          fetchUserData={fetchUsersData}
        />
      );
    }
  };
  const nftDelist = async (id) => {
    try {
      setDelisNftLoading(id);
      const marketContract = marketplaceIntegrateContract();
      if (address) {
        await marketContract.methods
          .delistTokenNFT(dataNFTAddress, id)
          .send({ from: address });
        toast.success("NFT delisted successfully.");
        getSharingData();
        // getNFTData()
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setDelisNftLoading(nul);
    }
  };
  const buyDataNFT = async (flight) => {
    try {
      setBuyNftLoading(flight.id);
      
      const marketContract = marketplaceIntegrateContract();
      if (address) {
        const totalPrice =
        (parseFloat(flight.nameAmount) || 0) +
        (parseFloat(flight.phoneAmount) || 0) +
        (parseFloat(flight.locationAmount) || 0);
      const valueInWei = web3.utils.toWei(totalPrice, "ether");
        await marketContract.methods
          .buyTokenNFT(dataNFTAddress, flight?.id)
          .send({ from: address, value: valueInWei, gas: 500000 });
        toast.success("NFT Buy successfully.");
        // getNFTData()
        getSharingData();
      } else {
        toast.error("Please Wallet Connect First!");
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setBuyNftLoading(null);
    }
  };
  const flightDelist = async(flightId)=>{
    try{
      const marketContract = marketplaceIntegrateContract();
      setFlightDelistLoading(true)
      if (address) {
        await marketContract.methods
          .delistCreatedNFT(dataNFTAddress, flightId)
          .send({ from: address });
        toast.success("Flight NFT delisted successfully.");
        getNFTData();
        getSharingData();
      } else {
        toast.error("Please Wallet Connect First!");
      }
    }catch(e){
      console.log("e", e);
    } finally {
      setFlightDelistLoading(false);
    }
  }
  const buyFlightNFT = async(flight)=>{
    try{
      
      const marketContract = marketplaceIntegrateContract();
      setFlightBuyLoading(true)
      if (address) {
        if(flight.seller === address){
          toast.error("You cannot buy your own Flight NFT");
          return
        }
        await marketContract.methods
          .buyCreatedNFT(dataNFTAddress, flight.id)
          .send({ from: address, value: flight.toWeiPrice });
        toast.success("Flight NFT Buy successfully.");
        getNFTData();
        getSharingData();
      } else {
        toast.error("Please Wallet Connect First!");
      }
    }catch(e){
      console.log("e", e);
    } finally {
      setFlightBuyLoading(false);
    }
  }

  
  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-purple-200 to-gray-500 main-content flex">
        <SideBar
          onSelectSection={setSelectedSection}
          selectedSection={selectedSection}
        />
        <div className="ml-64 container mx-auto p-4 font-mono">
          <h2 className="text-2xl font-bold mb-4">
            {selectedSection === "personalInfo"
              ? "Data Marketplace"
              : "Flights Marketplace"}
          </h2>
          <div className="mb-4">
            <label className="mr-4 font-bold">Filter by:</label>
            <button
              className={`mr-2 p-2 rounded ${
                filterType === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilterType("all")}
            >
              All
            </button>
            <button
              className={`mr-2 p-2 rounded ${
                filterType === "tokenizing"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilterType("tokenizing")}
            >
              tokenizing Data
            </button>
            <button
              className={`mr-2 p-2 rounded ${
                filterType === "sharing"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilterType("sharing")}
            >
              Sharing Data
            </button>
          </div>

          {renderSection()}
          {selectedUserData && (
            <UserDataModal
              userData={selectedUserData}
              onClose={() => setSelectedUserData(null)}
              onPurchase={(selectedItems) =>
                handlePurchase(
                  selectedUserData.owner,
                  selectedItems,
                  selectedUserData
                )
              }
            />
          )}
          {selectedFlight && (
            <UserDataModal
              asset={selectedFlight}
              onClose={() => setSelectedFlight(null)}
              onPurchase={() =>
                handlePurchase(selectedFlight.owner, [
                  selectedFlight.flightNumber,
                ])
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
