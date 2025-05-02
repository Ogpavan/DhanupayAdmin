// import React, { useEffect, useState } from 'react';
// import { useLoader } from '../context/LoaderContext.jsx';
// import { ChartBar, CurrencyDollar, DeviceMobile, Money, Users } from 'phosphor-react';
// import Swal from 'sweetalert2'; // SweetAlert library for alerts

// function UserReports() {
//   const { showLoader, hideLoader } = useLoader();
  
//   // Dummy data to simulate API response
//   const dummyData = [
//     {
//         title: 'AEPS Report',
//         description: 'Aadhaar Enabled Payment System transaction details',
//         icon: ChartBar,
//       },
//       {
//         title: 'MATM Report',
//         description: 'Merchant ATM withdrawal details',
//         icon: Money, // Phosphor icon for ATM transactions
//       },
//       {
//         title: 'DMT Report',
//         description: 'Domestic Money Transfer transactions',
//         icon: Money, // Relevant Phosphor icon for money transfers
//       },
//       {
//         title: 'Cash Deposit Report',
//         description: 'Cash deposit details in bank accounts',
//         icon: Money, // Icon for cash deposit
//       },
//       {
//         title: 'Mobile Recharge Report',
//         description: 'Details of mobile recharge transactions',
//         icon: DeviceMobile, // Phosphor icon for mobile recharge
//       },
//       {
//         title: 'Bill Payment Report',
//         description: 'Utility bill payment transaction details',
//         icon: DeviceMobile, // Phosphor icon for bill payments
//       },
//       {
//         title: 'Move To Bank Report',
//         description: 'Funds transferred to bank account details',
//         icon: DeviceMobile, // Icon for move-to-bank transactions
//       },
//       {
//         title: 'Ledger Report',
//         description: 'Detailed account ledger report',
//         icon: DeviceMobile, // Icon representing ledger details
//       }
      
//   ];

//   const [settingsData, setSettingsData] = useState([]);
//   const [showPasswordForm, setShowPasswordForm] = useState(false); // To toggle password change form visibility
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const [loading, setLoading] = useState(false); // Loading state for API call
//   const [modalVisible, setModalVisible] = useState(null); // Track which modal is visible

//   useEffect(() => {
//     showLoader();
//     const timer = setTimeout(() => {
//       setSettingsData(dummyData);
//       hideLoader();
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handlePasswordChange = () => {
//     if (newPassword !== confirmNewPassword) {
//       Swal.fire('Error', 'New passwords do not match!', 'error');
//       return;
//     }

//     setLoading(true);
//     // Simulate an API call
//     setTimeout(() => {
//       setLoading(false);
//       // Assuming the API call was successful
//       Swal.fire('Success', 'Password updated successfully!', 'success');
//       setModalVisible(null); // Close the modal after password update
//     }, 2000); // Simulate network delay
//   };

//   const openModal = (index) => {
//     setModalVisible(index); // Open modal for specific setting card
//   };

//   const closeModal = () => {
//     setModalVisible(null); // Close the modal
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold">Reports</h2>
//       <p className="mt-2 text-gray-600">View Your All Reports Here</p>

//       {/* Cards with icons */}
//       <div className="grid grid-cols-3 gap-4 mt-6">
//         {settingsData.map((setting, index) => (
//           <div key={index}  onClick={() => openModal(index)} className="bg-white p-6 shadow cursor-pointer rounded-lg flex items-center space-x-4">
//             <setting.icon size={32} color="#4A90E2" />
//             <div>
//               <h3 className="text-lg font-semibold">{setting.title}</h3>
//               <p className="text-sm text-gray-600">{setting.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Conditionally render modal for each setting */}
//       {modalVisible !== null && settingsData[modalVisible].title === 'Change Password' && (
//         <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold">Change Your Password</h2>
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-600">Old Password</label>
//               <input
//                 type="password"
//                 value={oldPassword}
//                 onChange={(e) => setOldPassword(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Enter your old password"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-600">New Password</label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Enter your new password"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
//               <input
//                 type="password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Confirm your new password"
//               />
//             </div>
//             <div className="mt-6 flex justify-end space-x-4">
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePasswordChange}
//                 disabled={loading}
//                 className={`${
//                   loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
//                 } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
//               >
//                 {loading ? 'Updating...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}


     
//       {/* Conditionally render modal for each setting */}
//       {modalVisible !== null && settingsData[modalVisible].title !== 'Change Password' && (
//         <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//            <h2 className="text-xl font-semibold">{settingsData[modalVisible].title}</h2>
//             {/* <h2 className="text-xl font-semibold">Change Your Password</h2> */}
//             {/* <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-600">Old Password</label>
//               <input
//                 type="password"
//                 value={oldPassword}
//                 onChange={(e) => setOldPassword(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Enter your old password"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-600">New Password</label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Enter your new password"
//               />
//             </div>
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
//               <input
//                 type="password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Confirm your new password"
//               />
//             </div> */}
//             <div className="mt-6 flex justify-end space-x-4">
//               <button
//                 onClick={closeModal} // Close modal if Cancel is clicked
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePasswordChange}
//                 disabled={loading}
//                 className={`${
//                   loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
//                 } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
//               >
//                 {loading ? 'Updating...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// export default UserReports;




import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext.jsx';
import { ChartBar, Money, DeviceMobile } from 'phosphor-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function UserReports() {
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate(); // Initialize useNavigate
  const dummyData = [
    {
      title: 'AEPS Report',
      description: 'Aadhaar Enabled Payment System transaction details',
      icon: ChartBar,
    },
    {
      title: 'MATM Report',
      description: 'Merchant ATM withdrawal details',
      icon: Money,
    },
    {
      title: 'DMT Report',
      description: 'Domestic Money Transfer transactions',
      icon: Money,
    },
    {
      title: 'Mobile Recharge Report',
      description: 'Details of mobile recharge transactions',
      icon: DeviceMobile,
    }
  ];

  const [settingsData, setSettingsData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [modalVisible, setModalVisible] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // Store the selected report

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      setSettingsData(dummyData);
      hideLoader();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDateSelection = () => {
    if (!fromDate || !toDate) {
      Swal.fire('Error', 'Please select both dates!', 'error');
      return;
    }

    // Create an object to pass the data
    const reportData = {
      title: selectedReport.title,
      fromDate,
      toDate,
    };

    // Redirect to a new route with selected dates and report data as state
    navigate(`/reports/${selectedReport.title.toLowerCase()}`, {
      state: { reportData }, // Passing the report data as state to the new route
    });

    setModalVisible(null); // Close the modal after navigating
  };

  const openModal = (index) => {
    setSelectedReport(settingsData[index]); // Store the selected report data
    setModalVisible(index); // Open modal for specific setting
  };

  const closeModal = () => {
    setModalVisible(null); // Close the modal
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Reports</h2>
      <p className="mt-2 text-gray-600">View Your All Reports Here</p>

      {/* Cards with icons */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {settingsData.map((setting, index) => (
          <div key={index} onClick={() => openModal(index)} className="bg-white p-6 shadow cursor-pointer rounded-lg flex items-center space-x-4">
            <setting.icon size={32} color="#4A90E2" />
            <div>
              <h3 className="text-lg font-semibold">{setting.title}</h3>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Date Selection Modal */}
      {modalVisible !== null && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Select Date Range</h2>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button onClick={handleDateSelection} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserReports;
