import React, { useState } from "react";
import cardInsertImage from "/CardMachine.gif"; // Replace with actual path to card insert image

const MicroATMTransactions = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [cardInserted, setCardInserted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [deviceType, setDeviceType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store transaction details
    const currentDate = new Date().toLocaleString();

    setTransactionDetails({
      mobileNumber,
      amount,
      deviceType,
      date: currentDate,
      cardStatus: "Card Read Successfully",
    });

    console.log("Transaction Initiated:", {
      mobileNumber,
      amount,
      deviceType,
      cardInserted,
    });
  };

  const handleCardInsert = () => {
    // Simulate card insertion process
    setShowPopup(true);
    setTimeout(() => {
      alert("Card read successfully!");
      setCardInserted(true);
      setShowPopup(false);
    }, 3000); // Simulate a 3-second delay for card reading
  };

  return (
    <div className="flex gap-2 w-full pt-3">
      {/* Popup for Card Insertion */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={cardInsertImage} alt="Card Insert" className="w-20 h-20 mx-auto rounded-full mb-4" />
            <h3 className="text-lg font-bold mb-4">Card Reader</h3>
            <p className="text-sm text-gray-700">Please insert the card...</p>
          </div>
        </div>
      )}

      {/* Left Section for Micro ATM Form */}
      <div className="min-w-[360px] bg-white p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Micro ATM</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Device Type</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deviceType"
                  value="Mswipe"
                  checked={deviceType === "Mswipe"}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="mr-2"
                />
                Mswipe
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deviceType"
                  value="mPOS"
                  checked={deviceType === "mPOS"}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="mr-2"
                />
                mPOS
              </label>
            </div>
          </div>

          {/* Card Insertion */}
          <div>
            <button
              type="button"
              className={`w-full mt-4 py-2 text-white rounded-md ${
                cardInserted ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={handleCardInsert}
              disabled={cardInserted}
            >
              {cardInserted ? "Card Read Successfully" : "Insert Card"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!mobileNumber || !amount || !deviceType || !cardInserted}
            className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Continue
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
                <th className="border px-4 py-2">Mobile Number</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Device Type</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Card Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">{transactionDetails.mobileNumber}</td>
                <td className="border px-4 py-2">₹{transactionDetails.amount}</td>
                <td className="border px-4 py-2">{transactionDetails.deviceType}</td>
                <td className="border px-4 py-2">{transactionDetails.date}</td>
                <td className="border px-4 py-2">{transactionDetails.cardStatus}</td>
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

export default MicroATMTransactions;
