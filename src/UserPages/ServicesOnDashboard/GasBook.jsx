import { useState } from "react";
import Swal from "sweetalert2";

export default function GasBook({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "Indane Gas",
      reqId: "REQ123456",
      consumerNumber: "9988776655",
      amount: "950",
      operatorId: "GAS123",
      date: "28 Apr 2025 01:00 PM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "Bharat Gas",
      reqId: "REQ789012",
      consumerNumber: "8877665544",
      amount: "920",
      operatorId: "GAS456",
      date: "26 Apr 2025 09:30 AM",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    operator: "",
    consumerNumber: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gas Cylinder Refill Data:", formData);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your gas cylinder refill request has been submitted.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    // Optionally reset form
    setFormData({ operator: "", consumerNumber: "", amount: "" });
  };

  return (
    <div className="flex gap-4">
      {/* Gas Refill Form */}
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
            <option value="">Select Gas Provider</option>
            <option value="indane">Indane Gas</option>
            <option value="bharat">Bharat Gas</option>
            <option value="hp">HP Gas</option>
          </select>

          <input
            type="text"
            name="consumerNumber"
            placeholder="Enter Registered Mobile or LPG ID"
            className="w-full p-2 border rounded"
            value={formData.consumerNumber}
            onChange={handleChange}
          />

          <div className="flex gap-4">
            <input
              type="number"
              name="amount"
              placeholder="Enter Refill Amount"
              className="w-full p-2 border rounded"
              value={formData.amount}
              onChange={handleChange}
            />
            <button
              type="button"
              className="text-nowrap p-2 border rounded bg-gray-100"
            >
              Fetch Bill
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Continue
          </button>
        </form>
      </div>

      {/* Recent Gas Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Gas Refill Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Provider</th>
                <th className="p-2 border">Consumer No</th>
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
                  <td className="p-2 border">{tx.consumerNumber}</td>
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
