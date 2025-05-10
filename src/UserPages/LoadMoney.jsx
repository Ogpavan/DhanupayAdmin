import React, { useState } from 'react';
import Swal from 'sweetalert2';

function LoadMoney({ selectedWallet }) {
  const [loadAmount, setLoadAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [view, setView] = useState("default");  // Track view mode (default or form)

  const handleLoadWallet = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!loadAmount || !fullName || !email || !phone) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      return;
    }
  
    // Show a success alert with the submitted data
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: `Amount: ₹${loadAmount}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}`,
    });
  
    // Optionally, reset the form
    setLoadAmount('');
    setFullName('');
    setEmail('');
    setPhone('');
  };

  if (!selectedWallet) {
    return null; // Handle case where selectedWallet is not defined (e.g., if it's not passed)
  }

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center pt-6">{selectedWallet?.walletType}</h2>
        <h2 className="text-xl font-semibold text-center mb-2">Load Money to Wallet</h2>
      </div>
          <div className=" text-center">
            <form onSubmit={handleLoadWallet} className="space-y-4 mt-4 text-left max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={loadAmount}
                  onChange={(e) => setLoadAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile Number"
                  maxLength={10}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                Proceed to Pay
              </button>
            </form>
          </div>
     
    </>
  );
}

export default LoadMoney;
