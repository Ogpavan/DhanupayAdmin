import { useState } from "react";
import Swal from "sweetalert2";

export default function Water({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "Delhi Jal Board",
      reqId: "REQ998877",
      consumerNumber: "WTR1234567",
      amount: "480",
      operatorId: "WTR123",
      date: "28 Apr 2025 11:00 AM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "Bangalore Water Supply and Sewerage Board",
      reqId: "REQ665544",
      consumerNumber: "WTR7654321",
      amount: "520",
      operatorId: "WTR456",
      date: "26 Apr 2025 02:15 PM",
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
    console.log("Water Bill Payment Data:", formData);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your water bill payment has been submitted.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    setFormData({ operator: "", consumerNumber: "", amount: "" });
  };

  return (
    <div className="flex gap-4">
      {/* Water Bill Payment Form */}
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
            <option value="">Select Water Board</option>
            <option value="djb">Delhi Jal Board</option>
            <option value="bwssb">Bangalore Water Supply and Sewerage Board</option>
            <option value="mwssb">Mumbai Water Supply and Sewerage Board</option>
            <option value="chennai">Chennai MetroWater</option>
            <option value="hmwssb">Hyderabad Metro Water Supply & Sewerage Board</option>
          </select>

          <input
            type="text"
            name="consumerNumber"
            placeholder="Enter Consumer/Connection Number"
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

      {/* Recent Water Bill Transactions */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Water Bill Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Water Board</th>
                <th className="p-2 border">Connection No</th>
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
