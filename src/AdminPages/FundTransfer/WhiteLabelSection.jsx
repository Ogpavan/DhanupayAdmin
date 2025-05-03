import React, { useState } from "react";
import Table from "./CommonTable";

const WhiteLabelSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWhiteLabel, setSelectedWhiteLabel] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const WhiteLabels = [
    "WhiteLabel 1",
    "WhiteLabel 2",
    "WhiteLabel 3",
    "WhiteLabel 4",
    "WhiteLabel 5",
  ];

  const filteredWhiteLabels = WhiteLabels.filter((WhiteLabel) =>
    WhiteLabel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectWhiteLabel = (WhiteLabel) => {
    setSelectedWhiteLabel(WhiteLabel);
    setIsDropdownOpen(false);
    setSearchTerm(""); // Reset search term
  };

  const renderPaymentMethodFields = () => {
    switch (selectedPaymentMethod) {
      case "bank":
        return (
          <>
            <label className="block mb-2 text-sm font-semibold">Bank Name</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="text"
              placeholder="Enter Bank Name"
            />
            <label className="block mb-2 text-sm font-semibold">Account Number</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="text"
              placeholder="Enter Account Number"
            />
            <label className="block mb-2 text-sm font-semibold">IFSC Code</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="text"
              placeholder="Enter IFSC Code"
            />
          </>
        );
      case "wallet":
        return (
          <>
            <label className="block mb-2 text-sm font-semibold">Wallet Provider</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="text"
              placeholder="Enter Wallet Provider"
            />
            <label className="block mb-2 text-sm font-semibold">Wallet ID</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="text"
              placeholder="Enter Wallet ID"
            />
          </>
        );
      case "upi":
        return (
          <>
            <label className="block mb-2 text-sm font-semibold">UPI ID</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="text"
              placeholder="Enter UPI ID"
            />
          </>
        );
      case "cash":
        return (
          <>
            <label className="block mb-2 text-sm font-semibold">Receipt Number</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="text"
              placeholder="Enter Receipt Number"
            />
          </>
        );
      default:
        return null;
    }
  };

  const headers = [
    { label: "WhiteLabel Name", key: "WhiteLabel_name" },
    { label: "Payment Method", key: "payment_method" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
    { label: "Transaction ID", key: "transaction_id" },
  ];
  const data = [
    {
      WhiteLabel_name: "WhiteLabel 1",
      payment_method: "Bank Transfer",
      amount: "$500",
      date: "2025-05-01",
      transaction_id: "TX003",
    },
    {
      WhiteLabel_name: "WhiteLabel 2",
      payment_method: "UPI",
      amount: "$300",
      date: "2025-05-01",
      transaction_id: "TX004",
    },
  ];

  return (
    <div className="flex bg-gray-100  ">
      {/* Form Section */}
      <section className="w-1/3 p-4 bg-white shadow-md rounded-lg m-4">
        <h2 className="text-lg font-semibold mb-4">WhiteLabel Form</h2>
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
          <form>
            <div className="mb-4 relative">
              <label className="block mb-2 text-sm font-semibold">WhiteLabel Name</label>
              <div
                className="border rounded cursor-pointer p-2 bg-white"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                {selectedWhiteLabel || "Select WhiteLabel"}
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-lg">
                  <input
                    type="text"
                    className="w-full p-2 border-b"
                    placeholder="Search WhiteLabel"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <ul className="max-h-40 overflow-y-auto">
                    {filteredWhiteLabels.map((WhiteLabel, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-indigo-600 hover:text-white cursor-pointer"
                        onClick={() => handleSelectWhiteLabel(WhiteLabel)}
                      >
                        {WhiteLabel}
                      </li>
                    ))}
                    {filteredWhiteLabels.length === 0 && (
                      <li className="p-2 text-gray-500">No results found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <label className="block mb-2 text-sm font-semibold">Payment Method</label>
            <select
              className="block w-full mb-4 p-2 border rounded"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="bank">Bank Transfer</option>
              <option value="wallet">Wallet Transfer</option>
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
            </select>

            {renderPaymentMethodFields()}

            <label className="block mb-2 text-sm font-semibold">Enter Amount</label>
            <input
              className="block w-full mb-4 p-2 border rounded"
              type="number"
              placeholder="Enter Amount"
            />

            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Report Section */}
      <section className="w-2/3 p-4 bg-white shadow-md rounded-lg m-4">
        <h2 className="text-lg font-semibold mb-4">WhiteLabel Report</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <Table headers={headers} data={data} />
        </div>
      </section>
    </div>
  );
};

export default WhiteLabelSection;
