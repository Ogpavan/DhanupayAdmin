import React, { useState } from "react";
import Table from "./CommonTable";

const RetailerSection = () => {
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [amount, setAmount] = useState("");

  const Retailers = ["Retailer 1", "Retailer 2", "Retailer 3"];
  const headers = [
    { label: "Retailer Name", key: "Retailer_name" },
    { label: "Wallet", key: "wallet" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
    { label: "Transaction ID", key: "transaction_id" },
  ];
  const data = [
    {
      Retailer_name: "Retailer 1",
      wallet: "Primary Wallet",
      amount: "$500",
      date: "2025-05-01",
      transaction_id: "TX003",
    },
  ];

  const handleTransfer = () => {
    if (!selectedRetailer || !selectedWallet || !amount) {
      alert("Please complete all fields.");
      return;
    }

    // Logic to handle the transfer (e.g., API call)
    console.log({
      recipient: selectedRetailer,
      wallet: selectedWallet,
      amount,
    });

    setAmount("");
  };

  return (
    <div className="flex bg-gray-100">
      {/* Form Section */}
      <section className="w-1/3 p-4 bg-white shadow-md rounded-lg m-4">
        <h2 className="text-lg font-semibold mb-4">Retailer Form</h2>
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
          <form>
            <label className="block mb-2 text-sm font-semibold">Retailer Name</label>
            <select
              className="block w-full mb-4 p-2 border rounded"
              value={selectedRetailer}
              onChange={(e) => setSelectedRetailer(e.target.value)}
            >
              <option value="">Select Retailer</option>
              {Retailers.map((d, index) => (
                <option key={index} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-semibold">Select Wallet</label>
            <select
              className="block w-full mb-4 p-2 border rounded"
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
            >
              <option value="">Select Wallet</option>
              <option value="Primary Wallet">Primary Wallet</option>
              <option value="Incentive Wallet">Incentive Wallet</option>
            </select>

            <label className="block mb-2 text-sm font-semibold">Enter Amount</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              onClick={handleTransfer}
            >
              Transfer Funds
            </button>
          </form>
        </div>
      </section>

      {/* Report Section */}
      <section className="w-2/3 p-4 bg-white shadow-md rounded-lg m-4">
        <h2 className="text-lg font-semibold mb-4">Retailer Report</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <Table headers={headers} data={data} />
        </div>
      </section>
    </div>
  );
};

export default RetailerSection;
