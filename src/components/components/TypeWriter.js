import React, { useState, useEffect } from 'react';

const Typewriter = ({ text }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const delay = 100; // Adjust the delay (in milliseconds) between characters
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, currentIndex]);

  return (
    <p className="text-lg font-mono text-gray-700 mb-8 animate__animated animate__fadeIn">
      {currentText}
    </p>
  );
};
export default Typewriter;