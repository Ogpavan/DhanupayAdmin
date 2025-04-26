import React, { useEffect } from 'react'
import { useLoader } from '../context/LoaderContext.jsx'

function UserBasicSettings() {

  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    showLoader(); // Show loader immediately

    const timer = setTimeout(() => {
      hideLoader(); // Hide after 3 seconds
    }, 1000);

    // Cleanup function to clear timer if component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this only runs once
  
  return (
    <div>
      
      <h2 className="text-2xl font-semibold">Basic Settings</h2>
    </div>
  )
}

export default UserBasicSettings;
