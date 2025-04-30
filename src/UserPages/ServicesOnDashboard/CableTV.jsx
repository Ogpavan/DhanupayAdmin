import { useState } from "react";
import Swal from "sweetalert2";

export default function CableTV({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "Airtel Digital TV",
      reqId: "REQ20250428A",
      consumerNumber: "AIRT12345",
      amount: "300",
      operatorId: "CABLE123",
      date: "28 Apr 2025 02:00 PM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "Dish TV",
      reqId: "REQ20250426B",
      consumerNumber: "DISH98765",
      amount: "450",
      operatorId: "CABLE456",
      date: "26 Apr 2025 10:15 AM",
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
    console.log("Cable TV Bill Payment Data:", formData);

    Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: 'Your cable TV bill payment request has been submitted successfully.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    // Reset form
    setFormData({
      operator: "",
      consumerNumber: "",
      dob: "",
      amount: ""
    });
  };

  return (
    <div className="flex gap-4">
      {/* Cable TV Bill Payment Form */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {activeLabel} Cable TV Bill Payment
        </h2>

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          <select
            name="operator"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.operator}
          >
            <option value="">Select Cable TV Provider</option>
            <option value="airteldigital">Airtel Digital TV</option>
            <option value="dishtv">Dish TV</option>
            <option value="tatasky">Tata Sky</option>
            <option value="sun">Sun Direct</option>
            <option value="videocon">Videocon D2H</option>
          </select>

          <input
            type="text"
            name="consumerNumber"
            placeholder="Enter Consumer Number"
            className="w-full p-2 border rounded"
            value={formData.consumerNumber}
            onChange={handleChange}
          />

        

          <div className="flex gap-4">
            <input
              type="number"
              name="amount"
              placeholder="Enter Bill Amount"
              className="w-full p-2 border rounded"
              value={formData.amount}
              onChange={handleChange}
            />
            <button
              type="button"
              className="text-nowrap p-2 border rounded bg-gray-100"
            >
              View Plans
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

      {/* Recent Cable TV Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Cable TV Transactions</h3>
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
