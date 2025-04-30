import { useState } from "react";
import Swal from "sweetalert2";

export default function Insurance({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "LIC",
      reqId: "REQ445566",
      policyNumber: "LIC12345678",
      amount: "1200",
      operatorId: "INS123",
      date: "28 Apr 2025 10:00 AM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "HDFC Life",
      reqId: "REQ778899",
      policyNumber: "HDFC98765432",
      amount: "1500",
      operatorId: "INS456",
      date: "25 Apr 2025 03:45 PM",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    operator: "",
    policyNumber: "",
    amount: "",
    dob: "", // <- Added DOB state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Insurance Premium Payment Data:", formData);

    Swal.fire({
      icon: 'success',
      title: 'Payment Successful!',
      text: 'Your insurance premium has been paid successfully.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    setFormData({
      operator: "",
      policyNumber: "",
      amount: "",
      dob: "",
    });
  };

  return (
    <div className="flex gap-4">
      {/* Insurance Payment Form */}
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
            <option value="">Select Insurance Provider</option>
            <option value="lic">LIC</option>
            <option value="hdfc">HDFC Life</option>
            <option value="sbi">SBI Life</option>
            <option value="icici">ICICI Prudential</option>
            <option value="bajaj">Bajaj Allianz</option>
          </select>

          <input
            type="text"
            name="policyNumber"
            placeholder="Enter Policy Number"
            className="w-full p-2 border rounded"
            value={formData.policyNumber}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dob"
            className="w-full p-2 border rounded"
            value={formData.dob}
            onChange={handleChange}
          />

          <div className="flex gap-4">
            <input
              type="number"
              name="amount"
              placeholder="Enter Premium Amount"
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
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Continue
          </button>
        </form>
      </div>

      {/* Recent Insurance Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Insurance Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Provider</th>
                <th className="p-2 border">Policy No</th>
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
                  <td className="p-2 border">{tx.policyNumber}</td>
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
