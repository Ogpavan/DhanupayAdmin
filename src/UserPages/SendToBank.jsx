import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { CaretLeft } from 'phosphor-react'; // Back arrow icon

function SendToBank({ selectedWallet, setView }) {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [bankAccounts] = useState([
    { id: '1', name: 'Bank Account 1' },
    { id: '2', name: 'Bank Account 2' },
    { id: '3', name: 'Bank Account 3' },
  ]); // Mock bank accounts

  const handleTransfer = (e) => {
    e.preventDefault();
    
    // Basic form validation (ensure fields are filled)
    if (!selectedAccount || !transferAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      return;
    }

    // Handle transfer logic here (e.g., validate the data and make API call)
    console.log('Transfer initiated', { selectedAccount, transferAmount });

    // Show success alert
    Swal.fire({
      icon: 'success',
      title: 'Transfer Successful!',
      text: `₹${transferAmount} has been transferred to ${bankAccounts.find(acc => acc.id === selectedAccount)?.name}`,
    });

    // Optionally, reset form values after transfer
    setSelectedAccount('');
    setTransferAmount('');
  };

  if (!selectedWallet) {
    return null; // Handle case where selectedWallet is not defined (e.g., if it's not passed)
  }

  return (
    <>
     <div className="p-6">
        <h2 className="text-2xl font-semibold text-center pt-6">{selectedWallet?.walletType}</h2>
        <h2 className="text-xl font-semibold text-center mb-2">Load Money to Wallet</h2>
     
        <div className="pt-1"> 
          {/* Transfer Form */}
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">-- Select Account --</option>
                {bankAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount"
                max={selectedWallet?.amount} // Use the selected wallet's amount limit
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md font-semibold">
              Transfer
            </button>
          </form>
        </div> 
        </div>
    
    </>
  );
}

export default SendToBank;
