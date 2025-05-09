import React, { useState } from "react";
import Table from "./CommonTable";

const DistributorSection = () => {
  const [selectedDistributor, setSelectedDistributor] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [amount, setAmount] = useState("");

  const distributors = ["Distributor 1", "Distributor 2", "Distributor 3"];
  const headers = [
    { label: "Distributor Name", key: "distributor_name" },
    { label: "Wallet", key: "wallet" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
    { label: "Transaction ID", key: "transaction_id" },
  ];
  const data = [
    {
      distributor_name: "Distributor 1",
      wallet: "Primary Wallet",
      amount: "$500",
      date: "2025-05-01",
      transaction_id: "TX003",
    },
  ];

  const handleTransfer = () => {
    if (!selectedDistributor || !selectedWallet || !amount) {
      alert("Please complete all fields.");
      return;
    }

    // Logic to handle the transfer (e.g., API call)
    console.log({
      recipient: selectedDistributor,
      wallet: selectedWallet,
      amount,
    });

    setAmount("");
  };

  return (
    <div className="flex bg-gray-100">
      {/* Form Section */}
      <section className="w-1/3 p-4 bg-white shadow-md rounded-lg m-4">
        <h2 className="text-lg font-semibold mb-4">Distributor Form</h2>
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
          <form>
            <label className="block mb-2 text-sm font-semibold">Distributor Name</label>
            <select
              className="block w-full mb-4 p-2 border rounded"
              value={selectedDistributor}
              onChange={(e) => setSelectedDistributor(e.target.value)}
            >
              <option value="">Select Distributor</option>
              {distributors.map((d, index) => (
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
        <h2 className="text-lg font-semibold mb-4">Distributor Report</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <Table headers={headers} data={data} />
        </div>
      </section>
    </div>
  );
};

export default DistributorSection;
