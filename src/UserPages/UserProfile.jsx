// import React from 'react'

// function UserProfile() {
//   return (
//     <div>
//       {/* <h1>Profile</h1> */}
//       <h2 className="text-2xl font-semibold">Profile</h2>
//     </div>
//   )
// }

// export default UserProfile



import React, { useEffect } from 'react';
import { useLoader } from '../context/LoaderContext.jsx' // Make sure path is correct

function UserProfile() {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    showLoader(); // Show loader immediately

    const timer = setTimeout(() => {
      hideLoader(); // Hide after 3 seconds
    }, 3000);

    // Cleanup function to clear timer if component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this only runs once
  

  return (
    <div className="p-8">
      {/* <h1>Profile</h1> */}
      <h2 className="text-2xl font-semibold">Profile</h2>
    </div>
  );
}

export default UserProfile;
