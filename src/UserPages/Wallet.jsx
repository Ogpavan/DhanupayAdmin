import React, { useState } from "react";
import QRCode from "react-qr-code";

const Wallet = () => {
  const [payerName, setPayerName] = useState("");
  const [amount, setAmount] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState([]);

  const handleGenerateQR = () => {
    if (payerName.trim() === "" || amount.trim() === "") {
      alert("Please enter a valid name and amount.");
      return;
    }

    const currentDate = new Date().toLocaleString();
    const charge = (amount * 0.02).toFixed(2); // Example: 2% charge
    const netReceived = (amount - charge).toFixed(2);

    setTransactionDetails((prevDetails) => [
      ...prevDetails,
      {
        payerName,
        amount: `₹${amount}`,
        charge: `₹${charge}`,
        netReceived: `₹${netReceived}`,
        bank: "Bank Name",
        rrn: Math.floor(Math.random() * 1000000000), // Random RRN
        transactionTime: currentDate,
      },
    ]);
    setQrGenerated(true);
  };

  return (
    <div className="bg-gray-100  ">
      <div className="flex gap-4 w-full p-4">
        {/* Left Section for QR Code Generation */}
        <div className="min-w-[350px] bg-white min-h-[70vh] p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Wallet</h2>
          <div className="space-y-4">
            {/* Payer Name Input */}
            <div>
              <label htmlFor="payerName" className="block text-sm font-medium">
                Payer Name
              </label>
              <input
                id="payerName"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Enter Payer Name"
              />
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">
                Enter Amount (₹)
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

            {/* Generate QR Button */}
            <button
              className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleGenerateQR}
            >
              Generate QR Code
            </button>

            {/* Display QR Code */}
            {qrGenerated && (
              <div className="mt-4 flex justify-center flex-col items-center">
                <h3 className="text-lg font-bold mb-2">Scan to Pay</h3>
                <QRCode value={`Payer: ${payerName}, Amount: ₹${amount}`} />
              </div>
            )}
          </div>
        </div>

        {/* Right Section for Transaction Details */}
        <div className="w-full bg-white p-4 border rounded-lg shadow-md ">
          <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
          {transactionDetails.length > 0 ? (
            <div className="overflow-y-auto max-h-[70vh]  ">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Payer Name</th>
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">Charge</th>
                    <th className="border px-4 py-2">Net Received</th>
                    <th className="border px-4 py-2">Bank</th>
                    <th className="border px-4 py-2">RRN</th>
                    <th className="border px-4 py-2">Transaction Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionDetails.map((detail, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{detail.payerName}</td>
                      <td className="border px-4 py-2">{detail.amount}</td>
                      <td className="border px-4 py-2">{detail.charge}</td>
                      <td className="border px-4 py-2">{detail.netReceived}</td>
                      <td className="border px-4 py-2">{detail.bank}</td>
                      <td className="border px-4 py-2">{detail.rrn}</td>
                      <td className="border px-4 py-2">
                        {detail.transactionTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700 text-sm">
              No transaction details available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
