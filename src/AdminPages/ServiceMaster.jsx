import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext.jsx';
import ServicePage from './ServicePage.jsx';
import ServiceCategory from './ServiceCategory.jsx';



function ServiceMaster() {
  const { showLoader, hideLoader } = useLoader();
  const [selectedOption, setSelectedOption] = useState(null); // State to track selected option

  useEffect(() => {
    showLoader(); // Show the loader when the component mounts

    const timer = setTimeout(() => {
      hideLoader(); // Hide the loader after a delay
    }, 1000);

    return () => clearTimeout(timer); // Clean up timeout
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Button styles for active and inactive states
  const getButtonClass = (option) => {
    return selectedOption === option 
      ? "px-4 py-2 bg-blue-500 text-white rounded-md"  // Active button style
      : "px-4 py-2 bg-gray-500 text-white rounded-md"; // Inactive button style
  };

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Service Master</h2>
          <p className="mt-2 text-gray-600">Manage your Services here</p>
        </div>

        {/* Option buttons */}
        <div className="mt-4 flex gap-x-4">
          <button 
            onClick={() => handleOptionSelect('category')} 
            className={getButtonClass('category')}
          >
            Service Categories
          </button>
          <button 
            onClick={() => handleOptionSelect('service')} 
            className={getButtonClass('service')}
          >
            Services
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on selection */}
      <div className="mt-4">
        {selectedOption === 'category' && <ServiceCategory />}
        {selectedOption === 'service' && <ServicePage />}
      </div>
    </div>
  );
}

export default ServiceMaster;
