import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'; // Import useAccount hook
import marketplace from '../../assets/icons/flight-booking.png';

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const buttonClassNames =
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-purple-900 focus:outline-none bg-white rounded-lg border border-purple-200 hover:bg-purple-100 hover:text-purple-700 focus:z-10 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-700 dark:bg-purple-800 dark:text-purple-400 dark:border-purple-600 dark:hover:text-white dark:hover:bg-purple-700 font-mono";
  const linkClassNames =
    "text-black hover:text-purple-700 font-mono text-xs md:text-sm"; // Adjusted text size


  return (
    <nav className="bg-gradient-to-r from-purple-400 to-grey-500 p-4 navbar">
      <div className="container mx-auto flex justify-between items-center">
      <div className="flex-none flex items-center">
          <Link to="/" className="text-black text-xl font-mono font-semibold flex items-center">
            FlightLedger
          </Link>
        </div>
        <div className="flex-grow">
          <ul className="flex justify-center space-x-8 mt-2"> {/* Increased space between links */}
            <li>
              
              <Link to="/marketplace" className={linkClassNames}>
                Marketplace
              </Link>
            </li>
            <li>
              <Link to="/book-trip" className={linkClassNames}>
                Book trip
              </Link>
            </li>
            <li>
              <Link to="/my-data-vault" className={linkClassNames}>
                My Data Vault
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-none">
          <ConnectButton className={buttonClassNames}>Connect Wallet</ConnectButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
