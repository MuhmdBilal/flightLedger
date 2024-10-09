// src/components/ContractInteraction.js
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useReadContract, WagmiProvider } from 'wagmi';
import UserDataOwnershipABI from './abi.json';

const USER_DATA_AND_FLIGHTS_CONTRACT = '0x12811A76dBd05F81e64B48259FDdB4B7bEF40524';

const ContractInteraction = () => {
  const { address } = useAccount();
  const provider = WagmiProvider();
  console.log(provider)
  console.log(provider.getSigner())
  const contract = useReadContract({
    addressOrName: USER_DATA_AND_FLIGHTS_CONTRACT,
    contractInterface: UserDataOwnershipABI,
    signerOrProvider: provider.getSigner(),
  });

  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const data = await contract.getUserData(address, "username");
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserData();
    }
  }, [address]);

  const shareData = async () => {
    try {
      const tx = await contract.updateSharingPreferences(
        ["username", "phoneNumber", "location"], // Example attributes
        [ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.3")]
      );
      await tx.wait();
      console.log('Data shared successfully');
    } catch (error) {
      console.error('Error sharing data:', error);
    }
  };
  console.log(contract)

  return (
    <div>
      <h2>Contract Interaction</h2>
      {userData && <p>Your Data: {userData}</p>}
      <button onClick={fetchUserData}>Fetch User Data</button>
      <button onClick={shareData}>Share Data</button>
    </div>
  );
};

export default ContractInteraction;
