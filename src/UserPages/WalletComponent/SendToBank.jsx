// SendToBank.jsx
import React from 'react';

const SendToBank = ({ selectedWallet }) => {
  return (
    <div className="p-4 border rounded-xl bg-gray-50">
      <h3 className="text-md font-semibold mb-2">Move Money to Bank</h3>
      <form className="space-y-3">
        <input
          type="number"
          placeholder="Enter amount to send"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Enter bank account number"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">
          Send to Bank
        </button>
      </form>
    </div>
  );
};

export default SendToBank;
