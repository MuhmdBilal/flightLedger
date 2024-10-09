import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import UserDataOwnershipABI from '../contractabi.json';
import { ethers } from 'ethers';
import dubai from '../../assets/cities/dubai.jpeg';
import cairo from '../../assets/cities/b6.jpg';
import london from '../../assets/cities/london.jpg';
import paris from '../../assets/cities/paris.jpg';
import newYork from '../../assets/cities/new-york.jpeg';
import tokyo from '../../assets/cities/tokyo.jpg';
import madrid from '../../assets/cities/Madrid.jpg';
import berlin from '../../assets/cities/berlin.jpg';
import sydney from '../../assets/cities/sydney.jpg';
import toronto from '../../assets/cities/toronto.png';

import abha from '../../assets/cities/internal/abha.jpg';
import mecca from '../../assets/cities/internal/mecca.jpg';
import tabuk from '../../assets/cities/internal/tabuk.jpg';
import jeddah from '../../assets/cities/internal/jedah.jpg';
import riyadh from '../../assets/cities/internal/riadh.jpg';
import khobar from '../../assets/cities/internal/khobar.jpg';
import dammam from '../../assets/cities/internal/dammam.jpg';
import taif from '../../assets/cities/internal/taif.jpg';
import medinah from '../../assets/cities/internal/medina.jpg';
import planeIcon from '../../assets/icons/book.png';
const USER_DATA_AND_FLIGHTS_CONTRACT = '0x12811A76dBd05F81e64B48259FDdB4B7bEF40524';


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

const BookTrip = () => {
  const [tripDetails, setTripDetails] = useState({
    from: '',
    to: '',
    date: '',
    flightNumber: '',
    isInternal: true,
  });
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tripSuggestions, setTripSuggestions] = useState([]);
  const [filterType, setFilterType] = useState('internal'); // internal or external
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum && address && isConnected) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(USER_DATA_AND_FLIGHTS_CONTRACT, UserDataOwnershipABI, signer);
        setContract(contractInstance);
      }
    };

    init();
  }, [address, isConnected]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const internalSuggestions = [
        {
          from: 'Riyadh',
          to: 'Jeddah',
          date: '2024-09-01',
          image: jeddah,
          flightNumber: 'RYD123',
          isInternal: true,
        },
        {
          from: 'Dammam',
          to: 'Medina',
          date: '2024-09-10',
          image: medinah,
          flightNumber: 'DAM456',
          isInternal: true,
        },
        {
          from: 'Mecca',
          to: 'Taif',
          date: '2024-09-15',
          image: taif,
          flightNumber: 'MEC789',
          isInternal: true,
        },
        {
          from: 'Jeddah',
          to: 'Riyadh',
          date: '2024-10-05',
          image: riyadh,
          flightNumber: 'JED101',
          isInternal: true,
        },
        {
          from: 'Abha',
          to: 'Khobar',
          date: '2024-10-12',
          image: khobar,
          flightNumber: 'ABH202',
          isInternal: true,
        },
        {
          from: 'Tabuk',
          to: 'Dammam',
          date: '2024-11-01',
          image: dammam,
          flightNumber: 'TBK303',
          isInternal: true,
        },
        {
          from: 'Taif',
          to: 'Medina',
          date: '2024-11-15',
          image: medinah,
          flightNumber: 'TAF404',
          isInternal: true,
        },
        {
          from: 'Khobar',
          to: 'Mecca',
          date: '2024-12-01',
          image: mecca,
          flightNumber: 'KHB505',
          isInternal: true,
        },
        {
          from: 'Riyadh',
          to: 'Abha',
          date: '2024-12-15',
          image: abha,
          flightNumber: 'RYD606',
          isInternal: true,
        },
        {
          from: 'Jizan',
          to: 'Tabuk',
          date: '2024-12-20',
          image: tabuk,
          flightNumber: 'JZN707',
          isInternal: true,
        },
      ];
      
      
      const externalSuggestions = [
        {
          from: 'Riyadh',
          to: 'Dubai',
          date: '2024-09-15',
          image: dubai,
          flightNumber: 'RYD789',
          isInternal: false,
        },
        {
          from: 'Jeddah',
          to: 'Cairo',
          date: '2024-09-20',
          image: cairo,
          flightNumber: 'JED101',
          isInternal: false,
        },
        {
          from: 'Dammam',
          to: 'London',
          date: '2024-10-05',
          image: london,
          flightNumber: 'DAM202',
          isInternal: false,
        },
        {
          from: 'Medina',
          to: 'Paris',
          date: '2024-10-12',
          image: paris,
          flightNumber: 'MED303',
          isInternal: false,
        },
        {
          from: 'Riyadh',
          to: 'New York',
          date: '2024-11-01',
          image: newYork,
          flightNumber: 'RYD404',
          isInternal: false,
        },
        {
          from: 'Jeddah',
          to: 'Tokyo',
          date: '2024-11-15',
          image: tokyo,
          flightNumber: 'JED505',
          isInternal: false,
        },
        {
          from: 'Khobar',
          to: 'Berlin',
          date: '2024-12-01',
          image: berlin,
          flightNumber: 'KHB606',
          isInternal: false,
        },
        {
          from: 'Tabuk',
          to: 'Sydney',
          date: '2024-12-15',
          image: sydney,
          flightNumber: 'TBK707',
          isInternal: false,
        },
        {
          from: 'Abha',
          to: 'Madrid',
          date: '2024-12-20',
          image: madrid,
          flightNumber: 'ABH808',
          isInternal: false,
        },
        {
          from: 'Taif',
          to: 'Toronto',
          date: '2025-01-10',
          image: toronto,
          flightNumber: 'TAF909',
          isInternal: false,
        },
      ];

      if (filterType === 'internal') {
        setTripSuggestions(internalSuggestions);
      } else {
        setTripSuggestions(externalSuggestions);
      }
    };

    fetchSuggestions();
  }, [filterType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripDetails({
      ...tripDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!contract) {
      console.error('Contract is not initialized');
      setErrorMessage('Smart contract is not initialized.');
      setLoading(false);
      return;
    }

    try {
      const flightNumberAsInt = parseInt(tripDetails.flightNumber.match(/\d+/)[0], 10);
      const transaction = await contract.createFlight(
        tripDetails.from,
        tripDetails.to,
        tripDetails.date,
        tripDetails.isInternal,
        flightNumberAsInt
      );
      await transaction.wait();
      console.log('Trip booked successfully:', transaction);
      setSuccessMessage('Trip booked successfully!');

      // Reset form after successful booking
      setTripDetails({
        from: '',
        to: '',
        date: '',
        flightNumber: '',
        isInternal: filterType === 'internal',
      });
      setIsModalOpen(false); // Close the modal after booking
    } catch (error) {
      console.error('Error booking trip:', error);
      setErrorMessage('There was an error booking the trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openModalWithTrip = (trip) => {
    setTripDetails(trip);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-r from-purple-200 to-gray-500 min-h-screen flex flex-col">
      <div className="container mx-auto p-4 font-mono flex-grow">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
      Book a Flight
          <img
            src={planeIcon}
            alt="Plane Icon"
            className="w-10 h-10 mr-16" // Adjust size with `w` and `h` classes
          />
          
        </h2>        <div className="flex justify-center mb-4">
          <button
            onClick={() => setFilterType('internal')}
            className={`px-4 py-2 rounded-l-lg ${filterType === 'internal' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            Internal Flights
          </button>
          <button
            onClick={() => setFilterType('external')}
            className={`px-4 py-2 rounded-r-lg ${filterType === 'external' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            External Flights
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tripSuggestions.map((suggestion, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={suggestion.image} alt="Flight Image" className="w-full h-32 object-cover"/>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{suggestion.from} to {suggestion.to}</h3>
                <p>Date: {suggestion.date}</p>
                <p>Flight Number: {suggestion.flightNumber}</p>
                <button
                  type="button"
                  className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
                  onClick={() => openModalWithTrip(suggestion)}
                >
                  Book This Flight
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                From
              </label>
              <input
                type="text"
                id="from"
                name="from"
                value={tripDetails.from}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
                required
                readOnly
              />
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                To
              </label>
              <input
                type="text"
                id="to"
                name="to"
                value={tripDetails.to}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
                required
                readOnly
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={tripDetails.date}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
                required
                readOnly
              />
            </div>
            <div>
              <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700">
                Flight Number
              </label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={tripDetails.flightNumber}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
                required
                readOnly
              />
            </div>
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Flight'}
            </button>
            {successMessage && (
              <div className="mt-4 text-green-600 font-bold">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 text-red-600 font-bold">
                {errorMessage}
              </div>
            )}
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default BookTrip;
