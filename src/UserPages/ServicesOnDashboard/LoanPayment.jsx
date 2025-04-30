import { useState } from "react";
import Swal from "sweetalert2";

export default function LoanPayment({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "HDFC Bank",
      reqId: "REQ20250428A",
      consumerNumber: "LN00123456",
      amount: "8500",
      operatorId: "LOAN123",
      date: "28 Apr 2025 03:00 PM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "Bajaj Finserv",
      reqId: "REQ20250426B",
      consumerNumber: "LN00998877",
      amount: "5600",
      operatorId: "LOAN456",
      date: "26 Apr 2025 11:00 AM",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    operator: "",
    consumerNumber: "",
    dob: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Loan Payment Data:", formData);

    Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: 'Your loan payment request has been submitted.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    setFormData({
      operator: "",
      consumerNumber: "",
      dob: "",
      amount: ""
    });
  };

  return (
    <div className="flex gap-4">
      {/* Loan Payment Form */}
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
            <option value="">Select Loan Provider</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="bajaj">Bajaj Finserv</option>
            <option value="sbi">SBI Loans</option>
            <option value="icici">ICICI Bank</option>
            <option value="axis">Axis Bank</option>
          </select>

          <input
            type="text"
            name="consumerNumber"
            placeholder="Enter Loan Account Number"
            className="w-full p-2 border rounded"
            value={formData.consumerNumber}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dob"
            placeholder="Enter Date of Birth"
            className="w-full p-2 border rounded"
            value={formData.dob}
            onChange={handleChange}
          />

          <div className="flex gap-4">
            <input
              type="number"
              name="amount"
              placeholder="Enter Payment Amount"
              className="w-full p-2 border rounded"
              value={formData.amount}
              onChange={handleChange}
            />
            <button
              type="button"
              className="text-nowrap p-2 border rounded bg-gray-100"
            >
              Fetch Details
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

      {/* Recent Loan Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Loan Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Provider</th>
                <th className="p-2 border">Account No</th>
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
