import React from "react";

const MPOSTransactions = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">M-POS Transactions</h2>
      <table className="w-full text-sm text-left border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Card Number</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Bank</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">RRN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">XXXX-XXXX-XXXX-9012</td>
            <td className="px-4 py-2">Anjali Mehta</td>
            <td className="px-4 py-2">₹750</td>
            <td className="px-4 py-2">AXIS</td>
            <td className="px-4 py-2">01:15 PM</td>
            <td className="px-4 py-2">654321987</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MPOSTransactions;
