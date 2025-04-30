import React, { useState } from "react";
import fingerprint from "/fingerprint-scan.gif";

const AadhaarPayTransactions = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [fingerprintCaptured, setFingerprintCaptured] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Capture current date and time
    const currentDate = new Date().toLocaleString();

    // Store transaction details
    setTransactionDetails({
      aadhaarNumber,
      name,
      mobileNumber,
      amount,
      date: currentDate,
      fingerprintStatus: "Scanned Successfully",
    });

    console.log("Transaction Initiated:", {
      aadhaarNumber,
      name,
      mobileNumber,
      amount,
      fingerprintCaptured,
    });
  };

  const handleFingerprintCapture = () => {
    // Simulate fingerprint capture process
    setShowPopup(true);
    setTimeout(() => {
      alert("Fingerprint captured successfully!");
      setFingerprintCaptured(true);
      setShowPopup(false);
    }, 3000); // Simulate a 3-second delay for capturing fingerprint
  };

  return (
    <div className="flex gap-4 w-full p-4">
      {/* Popup for Fingerprint Capture */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={fingerprint} alt="Fingerprint" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-4">Fingerprint Scanner</h3>
            <p className="text-sm text-gray-700">Fingerprint machine connected. Waiting for user to press finger...</p>
          </div>
        </div>
      )}

      {/* Left Section for Aadhaar Pay Form */}
      <div className="min-w-[360px] bg-white p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Aadhaar Pay</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Aadhaar Number */}
          <div>
            <label htmlFor="aadhaarNumber" className="block text-sm font-medium">
              Aadhaar Number
            </label>
            <input
              id="aadhaarNumber"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="Enter Aadhaar Number"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter Mobile Number"
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
            />
          </div>

          {/* Fingerprint Capture */}
          <div>
            <button
              type="button"
              className={`w-full mt-4 py-2 text-white rounded-md ${
                fingerprintCaptured ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={handleFingerprintCapture}
              disabled={fingerprintCaptured}
            >
              {fingerprintCaptured ? "Fingerprint Captured" : "Capture Fingerprint"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !aadhaarNumber || !name || !mobileNumber || !amount || !fingerprintCaptured
            }
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Section for Transaction Details */}
      <div className="w-full bg-white p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        {transactionDetails ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Aadhaar Number</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Mobile Number</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Fingerprint Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">{transactionDetails.aadhaarNumber}</td>
                <td className="border px-4 py-2">{transactionDetails.name}</td>
                <td className="border px-4 py-2">{transactionDetails.mobileNumber}</td>
                <td className="border px-4 py-2">₹{transactionDetails.amount}</td>
                <td className="border px-4 py-2">{transactionDetails.date}</td>
                <td className="border px-4 py-2">{transactionDetails.fingerprintStatus}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700 text-sm">Fill in the form to see transaction details here after submission.</p>
        )}
      </div>
    </div>
  );
};

export default AadhaarPayTransactions;
