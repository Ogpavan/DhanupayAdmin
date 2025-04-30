import React, { useState } from "react";

const DMTTransactions = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  // Example list of banks
  const banks = ["HDFC", "ICICI", "SBI", "Axis Bank", "PNB"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., make an API request)
    console.log("Form Submitted:", { selectedBank, name, number, accountNumber, ifsc });
  };

  return (
    <div className="flex gap-2 w-full pt-3">
      {/* Left section for DMT services */}
      <div className="min-w-[360px] bg-white p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Perform DMT</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Select Bank */}
          <div>
            <label htmlFor="bank" className="block text-sm font-medium">Select Bank</label>
            <select
              id="bank"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              <option value="">Select a Bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          {/* Enter Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Enter Name</label>
            <input
              id="name"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
          </div>

          {/* Enter Number */}
          <div>
            <label htmlFor="number" className="block text-sm font-medium">Enter Number</label>
            <input
              id="number"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter Mobile Number"
            />
          </div>

          {/* Enter Account Number */}
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium">Enter Account Number</label>
            <input
              id="accountNumber"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
            />
          </div>

          {/* Enter IFSC Code */}
          <div>
            <label htmlFor="ifsc" className="block text-sm font-medium">Enter IFSC Code</label>
            <input
              id="ifsc"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              placeholder="Enter IFSC Code"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedBank || !name || !number || !accountNumber || !ifsc}
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right section for DMT transactions */}
      <div className="w-full bg-white p-2 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Domestic Money Transfer Transactions</h2>
        <table className="w-full text-sm text-left border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-nowrap">Beneficiary Account</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Bank</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">RRN</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">213342437858</td>
              <td className="px-4 py-2 text-nowrap">John Doe</td>
              <td className="px-4 py-2">₹500</td>
              <td className="px-4 py-2">HDFC</td>
              <td className="px-4 py-2">10:30 AM</td>
              <td className="px-4 py-2">123456789</td>
              <td className="px-4 py-2">Success</td>
            </tr>
            {/* Add more rows for additional transactions */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DMTTransactions;
