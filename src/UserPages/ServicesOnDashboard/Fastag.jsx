import { useState } from "react";
import Swal from "sweetalert2";

export default function Fastag({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "Paytm FASTag",
      reqId: "REQ20250428A",
      vehicleNumber: "MH12AB1234",
      amount: "500",
      operatorId: "FASTAG123",
      date: "28 Apr 2025 03:30 PM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "NHAI FASTag",
      reqId: "REQ20250426B",
      vehicleNumber: "KA03CD5678",
      amount: "600",
      operatorId: "FASTAG456",
      date: "26 Apr 2025 10:00 AM",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    operator: "",
    vehicleNumber: "",
    dob: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Fastag Recharge Data:", formData);

    Swal.fire({
      icon: 'success',
      title: 'Recharge Successful',
      text: 'Your FASTag recharge request has been submitted successfully.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    // Reset form
    setFormData({
      operator: "",
      vehicleNumber: "",
      amount: ""
    });
  };

  return (
    <div className="flex gap-4">
      {/* Fastag Recharge Form */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {activeLabel} 
        </h2>

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          <select
            name="operator"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.operator}
          >
            <option value="">Select FASTag Provider</option>
            <option value="paytm">Paytm FASTag</option>
            <option value="nhai">NHAI FASTag</option>
            <option value="bharat">Bharat FASTag</option>
            <option value="icici">ICICI FASTag</option>
            <option value="axis">Axis FASTag</option>
          </select>

          <input
            type="text"
            name="vehicleNumber"
            placeholder="Enter Vehicle Registration Number"
            className="w-full p-2 border rounded"
            value={formData.vehicleNumber}
            onChange={handleChange}
          />


          <div className="flex gap-4">
            <input
              type="number"
              name="amount"
              placeholder="Enter Recharge Amount"
              className="w-full p-2 border rounded"
              value={formData.amount}
              onChange={handleChange}
            />
            {/* <button
              type="button"
              className="text-nowrap p-2 border rounded bg-gray-100"
            >
              Fetch Details
            </button> */}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Continue
          </button>
        </form>
      </div>

      {/* Recent Fastag Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent FASTag Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Provider</th>
                <th className="p-2 border">Vehicle Number</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">ReqID</th>
                <th className="p-2 border">Operator ID</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="p-2 border">{tx.operatorName}</td>
                  <td className="p-2 border">{tx.vehicleNumber}</td>
                  <td className="p-2 border">₹{tx.amount}</td>
                  <td className="p-2 border">{tx.reqId}</td>
                  <td className="p-2 border">{tx.operatorId}</td>
                  <td className="p-2 border">{tx.date}</td>
                  <td className="p-2 border">{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
