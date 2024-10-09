import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-8 w-full">
      <div className="max-w-4xl mx-auto">
        <p>&copy; 2024 Flight Ledger. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="#" className="text-white hover:text-green-500">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              {/* Social media icon */}
            </svg>
          </a>
          {/* Add more social media icons as needed */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
