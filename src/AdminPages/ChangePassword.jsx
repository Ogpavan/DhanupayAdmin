import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext.jsx';
import { ChartBar, CurrencyDollar } from 'phosphor-react';
import Swal from 'sweetalert2'; // SweetAlert library for alerts

function ChangePassword() {
  const { showLoader, hideLoader } = useLoader();

  // Dummy data to simulate API response
  const dummyData = [
    {
      title: 'Change Password',
      description: 'Update your password',
      icon: ChartBar,
    },
    {
      title: 'Change MPIN',
      description: 'Update your MPIN',
      icon: CurrencyDollar,
    },
  ];

  const [settingsData, setSettingsData] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldMpin, setOldMpin] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [confirmNewMpin, setConfirmNewMpin] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [modalVisible, setModalVisible] = useState(null); // Track which modal is visible

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      setSettingsData(dummyData);
      hideLoader();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Swal.fire('Error', 'All fields must be filled out!', 'error');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 25) {
      Swal.fire('Error', 'Password must be between 8 and 25 characters!', 'error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire('Error', 'New passwords do not match!', 'error');
      return;
    }

    setLoading(true);
    // Simulate an API call
    console.log("oldPassword:", oldPassword);
    console.log("newPassword:", newPassword);
    console.log("confirmNewPassword:", confirmNewPassword);
    setTimeout(() => {
      setLoading(false);
      setConfirmNewPassword('');
      setNewPassword('');
      setOldPassword('');
      // Assuming the API call was successful
      Swal.fire('Success', 'Password updated successfully!', 'success');
      setModalVisible(null); // Close the modal after password update
    }, 2000); // Simulate network delay
  };

  const handleMpinChange = () => {
    if (!oldMpin || !newMpin || !confirmNewMpin) {
      Swal.fire('Error', 'All fields must be filled out!', 'error');
      return;
    }

    if (newMpin.length !== 4 || isNaN(newMpin) || oldMpin.length !== 4 || isNaN(oldMpin)) {
      Swal.fire('Error', 'MPIN must be a 4-digit number!', 'error');
      return;
    }

    if (newMpin !== confirmNewMpin) {
      Swal.fire('Error', 'New MPINs do not match!', 'error');
      return;
    }

    setLoading(true);
    console.log("oldMpin:", oldMpin);
    console.log("newMpin:", newMpin);
    console.log("confirmNewMpin:", confirmNewMpin);
    // Simulate an API call for MPIN
    setTimeout(() => {
      setLoading(false);
      // Assuming the API call was successful
      setOldMpin('');
      setNewMpin('');
      setConfirmNewMpin('');
      Swal.fire('Success', 'MPIN updated successfully!', 'success');
      setModalVisible(null); // Close the modal after MPIN update
    }, 2000); // Simulate network delay
  };

  const openModal = (index) => {
    setModalVisible(index); // Open modal for specific setting card
  };

  const closeModal = () => {
    setModalVisible(null); // Close the modal
  };

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl font-semibold">Change Password</h2>
      <p className="mt-2 text-gray-600">Manage your Password or MPIN here</p>

      {/* Cards with icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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

      {/* Conditionally render modal for Password Change */}
      {modalVisible !== null && settingsData[modalVisible].title === 'Change Password' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold">Change Your Password</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your old password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your new password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Confirm your new password"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal} // Close modal if Cancel is clicked
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'} text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conditionally render modal for MPIN change */}
      {modalVisible !== null && settingsData[modalVisible].title === 'Change MPIN' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold">Change Your MPIN</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Old MPIN</label>
              <input
                type="password"
                value={oldMpin}
                onChange={(e) => setOldMpin(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your old MPIN"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">New MPIN</label>
              <input
                type="password"
                value={newMpin}
                onChange={(e) => setNewMpin(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your new MPIN"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Confirm New MPIN</label>
              <input
                type="password"
                value={confirmNewMpin}
                onChange={(e) => setConfirmNewMpin(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Confirm your new MPIN"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal} // Close modal if Cancel is clicked
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleMpinChange}
                disabled={loading}
                className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'} text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
              >
                {loading ? 'Updating...' : 'Change MPIN'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangePassword;
