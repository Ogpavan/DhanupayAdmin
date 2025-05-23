// AddMoney.jsx
import React from 'react';

const AddMoney = () => {
  return (
    <div className="p-4 border rounded-xl bg-gray-50">
      <h3 className="text-md font-semibold mb-2">Add Money to AEPS Wallet</h3>
      <form className="space-y-3">
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Add Money
        </button>
      </form>
    </div>
  );
};

export default AddMoney;
