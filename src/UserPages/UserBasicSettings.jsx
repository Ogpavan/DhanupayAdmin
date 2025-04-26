import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext.jsx';
import { ChartBar, CurrencyDollar, Users } from 'phosphor-react'; /// Assuming you're using react-feather for icons

function UserBasicSettings() {
  const { showLoader, hideLoader } = useLoader();
  
  // Dummy data to simulate API response
  const dummyData = [
    {
      title: 'Change Password',
      description: 'Update your password',
      icon: ChartBar, // Using ChartBar icon for this setting
    },
    {
      title: 'Revenue',
      description: 'Total revenue generated',
      icon: CurrencyDollar, // Using CurrencyDollar icon for this setting
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      icon: Users, // Using Users icon for this setting
    },
  ];

  const [settingsData, setSettingsData] = useState([]); // State to hold settings data

  useEffect(() => {
    showLoader(); // Show loader immediately





    //  // Simulate fetching data from API
    //  fetch('/api/settings') // Replace with your actual API URL
    //  .then((response) => response.json())
    //  .then((data) => {
    //    setSettingsData(data); // Store the API response in state
    //    hideLoader(); // Hide loader after data is fetched
    //  })
    //  .catch((error) => {
    //    console.error('Error fetching settings data:', error);
    //    hideLoader(); // Hide loader even if there's an error
    //  });


    // Simulate a delay to mimic fetching data
    const timer = setTimeout(() => {
      setSettingsData(dummyData); // Use the dummy data after the delay
      hideLoader(); // Hide loader after setting data
    }, 1000);

    // Cleanup function to clear the timer if component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Basic Settings</h2>
      <p className="mt-2 text-gray-600">Manage your settings here</p>

      {/* Cards with icons */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {settingsData.map((setting, index) => (
          <div key={index} className="bg-white p-6 shadow rounded-lg flex items-center space-x-4">
            <setting.icon size={32} color="#4A90E2" /> {/* Dynamic icon */}
            <div>
              <h3 className="text-lg font-semibold">{setting.title}</h3>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserBasicSettings;
