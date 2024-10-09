import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';
import dataOwnership from '../../assets/images/dataOwnership.png';
import access from '../../assets/images/access.png'
import nft from '../../assets/images/nft.png';
import flight from '../../assets/images/flight.png';
import Typewriter from '../components/TypeWriter';
import Footer from '../Layout/Footer';
const Home = () => {
  const sampleText =` Welcome to FlightLedger Dapp`

   return (
    <div className="bg-gradient-to-r from-purple-400 to-Lilac-200">
      {/* Hero Section */}
     
      <section className="py-16 px-4 text-center font-mono">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-mono font-bold text-gray-900 mb-4 animate__animated animate__fadeIn"><Typewriter text={sampleText} /></h1>
          <p className="text-lg font-mono text-gray-700 mb-8 animate__animated animate__fadeIn">
          Unlock the Potential of Your Assets - Lend with Confidence and Reap the Rewards. 
          </p>
          <p className="text-lg font-mono text-gray-700 mb-8 animate__animated animate__fadeIn">

          Join us today to experience a new era of asset management and earn with confidence.
          </p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg shadow-lg animate__animated animate__fadeIn">
            Explore our offered services
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Carousel 
            showThumbs={false} 
            infiniteLoop 
            useKeyboardArrows 
            autoPlay 
            centerMode
            centerSlidePercentage={33.33} // Show 3 slides at a time
            showStatus={false}
          >
            <div className="feature-item mx-2 p-6 bg-white rounded-lg shadow-lg animate__animated animate__zoomIn">
              <h2 className="text-2xl font-mono font-bold text-gray-900 mb-4">Data Ownership</h2>
              <p className="text-gray-700 mb-4 font-mono">Control your personal data.</p>
              <img src={dataOwnership} alt="ownership" className="mx-auto animate__animated animate__bounceIn" />
            </div>
            <div className="feature-item mx-2 p-6 bg-white rounded-lg shadow-lg animate__animated animate__zoomIn">
              <h2 className="text-2xl font-mono font-bold text-gray-900 mb-4">Flight Management</h2>
              <p className="text-gray-700 mb-4 font-mono">ecord and track flight details.</p>
              <img src={flight} alt="flight" className="mx-auto animate__animated animate__bounceIn" />
            </div>
            <div className="feature-item mx-2 p-6 bg-white rounded-lg shadow-lg animate__animated animate__zoomIn">
              <h2 className="text-2xl font-mono font-bold text-gray-900 mb-4">NFT Integration</h2>
              <p className="text-gray-700 mb-4 font-mono">Mint and trade data NFTs.</p>
              <img src={nft} alt="nft" className="mx-auto animate__animated animate__bounceIn" />
            </div>
            <div className="feature-item mx-2 p-6 bg-white rounded-lg shadow-lg animate__animated animate__zoomIn">
              <h2 className="text-2xl font-mono font-bold text-gray-900 mb-4">Access Control</h2>
              <p className="text-gray-700 mb-4 font-mono">Grant or revoke data access.</p>
              <img src={access} alt="access" className="mx-auto animate__animated animate__bounceIn" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-mono font-bold text-gray-900 mb-8 animate__animated animate__fadeIn">Join thousands of users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4 bg-white rounded-lg shadow-lg animate__animated animate__fadeInUp">
              <h3 className="text-xl font-bold font-mono text-gray-900 mb-2">Total Value Locked</h3>
              <p className="text-3xl font-bold font-mono text-purple-500 animate__animated animate__fadeIn">{"$"}5.2B</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-lg animate__animated animate__fadeInUp animate__delay-1s">
              <h3 className="text-xl font-bold font-mono text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold font-mono text-purple-500 animate__animated animate__fadeIn">1.2M</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-lg animate__animated animate__fadeInUp animate__delay-2s">
              <h3 className="text-xl font-bold font-mono text-gray-900 mb-2">Transactions</h3>
              <p className="text-3xl font-bold font-mono text-purple-500 animate__animated animate__fadeIn">{"$"}20M+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
    </div>
  );
};

export default Home;
