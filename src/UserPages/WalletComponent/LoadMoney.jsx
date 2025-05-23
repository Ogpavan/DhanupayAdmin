// LoadMoney.jsx
import React, { useState } from 'react';

const LoadMoney = () => {
  const [method, setMethod] = useState('bank');

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${method === 'bank' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setMethod('bank')}
        >
          Load via Bank
        </button>
        <button
          className={`px-4 py-2 rounded ${method === 'pg' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setMethod('pg')}
        >
          Load via PG
        </button>
      </div>

      {method === 'bank' ? (
        <div className="p-4 border rounded-xl bg-gray-50">
          <h3 className="font-semibold mb-2">Company Bank Details</h3>
          <p className="text-sm text-gray-600">Account Name: ABC Pvt Ltd</p>
          <p className="text-sm text-gray-600">Account No: 1234567890</p>
          <p className="text-sm text-gray-600">IFSC: ABCD0123456</p>
          <p className="text-sm text-gray-600">Bank: XYZ Bank</p>
        </div>
      ) : (
        <form className="p-4 border rounded-xl bg-gray-50 space-y-3">
          <h3 className="font-semibold mb-2">Load via Payment Gateway</h3>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Proceed to Pay
          </button>
        </form>
      )}
    </div>
  );
};

export default LoadMoney;
