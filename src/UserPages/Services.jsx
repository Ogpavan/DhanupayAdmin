// import React, { useEffect, useState } from 'react';
// import { useLoader } from '../context/LoaderContext.jsx';
// import { ChartBar, CurrencyDollar, Users } from 'phosphor-react';
// import Swal from 'sweetalert2'; // SweetAlert library for alerts

// function Services() {
//   const { showLoader, hideLoader } = useLoader();
  
//   // Dummy data to simulate API response
//   const dummyData = [
//       {
//         title: 'Recharges and bills payment',
//         description: 'Recharges and bills payment Services',
//         icon: ChartBar,
//       },
//       {
//         title: 'AEPS',
//         description: 'AEPS Services',
//         icon: CurrencyDollar,
//       },
//       {
//         title: 'Other Services',
//         description: 'Other Services',
//         icon: Users,
//       },
//     ];
  

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
//       <h2 className="text-2xl font-semibold">Our Services</h2>
//       <p className="mt-2 text-gray-600">All services are here</p>
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

// export default Services;


import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext.jsx';
import { ChartBar, CurrencyDollar, Users } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // for nested route rendering

function Services() {
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  const dummyData = [
    {
      title: 'Recharges and bills payment',
      description: 'Recharges and bills payment Services',
      icon: ChartBar,
    },
    {
      title: 'AEPS',
      description: 'AEPS Services',
      icon: CurrencyDollar,
    },
    {
      title: 'Other Services',
      description: 'Other Services',
      icon: Users,
    },
  ];

  const [settingsData, setSettingsData] = useState([]);

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      setSettingsData(dummyData);
      hideLoader();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openModal = (index) => {
    const selectedService = settingsData[index];

    if (selectedService.title === 'Recharges and bills payment') {
      navigate('recharges');
    } else if (selectedService.title === 'AEPS') {
      navigate('aeps');
    } else if (selectedService.title === 'Other Services') {
      navigate('OthersServices');
    }
  };

  return (
    <div>
      {/* <h2 className="text-2xl font-semibold">Our Services</h2> */}
      {/* <p className="mt-2 text-gray-600">All services are here</p> */}

      {/* <div className="grid grid-cols-3 gap-4 mt-6">
        {settingsData.map((setting, index) => (
          <div
            key={index}
            onClick={() => openModal(index)}
            className="bg-white p-6 shadow cursor-pointer rounded-lg flex items-center space-x-4"
          >
            <setting.icon size={32} color="#4A90E2" />
            <div>
              <h3 className="text-lg font-semibold">{setting.title}</h3>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </div>
          </div>
        ))}
      </div> */}

      {/* 👇 This is where nested components like <Recharges />, <AEPS /> will show up */}
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default Services;

