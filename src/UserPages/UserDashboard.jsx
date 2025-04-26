import { CurrencyDollar, ChartBar, Users } from 'phosphor-react';
import { useLoader } from '../context/LoaderContext.jsx'
import { useEffect } from 'react';


export default function UserDashboard() {

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
      <h2 className="text-2xl font-semibold">Welcome to Dhanupay </h2>
      <p className="mt-2 text-gray-600">Here’s a summary of your key data</p>

      {/* Cards with icons */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-6 shadow rounded-lg flex items-center space-x-4">
          <ChartBar size={32} color="#4A90E2" />
          <div>
            <h3 className="text-lg font-semibold">Sales Overview</h3>
            <p className="text-sm text-gray-600">Track your sales performance</p>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-lg flex items-center space-x-4">
          <CurrencyDollar size={32} color="#4A90E2" />
          <div>
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-sm text-gray-600">Total revenue generated</p>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-lg flex items-center space-x-4">
          <Users size={32} color="#4A90E2" />
          <div>
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-sm text-gray-600">Manage user accounts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
