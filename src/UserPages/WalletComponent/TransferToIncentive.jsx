// TransferToIncentive.jsx
import React from 'react';

const TransferToIncentive = ({ selectedWallet }) => {
  return (
    <div className="p-4 border rounded-xl bg-gray-50">
      <h3 className="text-md font-semibold mb-2">Transfer to Incentive Wallet</h3>
      <form className="space-y-3">
        <input
          type="number"
          placeholder="Enter amount to transfer"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
          Transfer
        </button>
      </form>
    </div>
  );
};

export default TransferToIncentive;
