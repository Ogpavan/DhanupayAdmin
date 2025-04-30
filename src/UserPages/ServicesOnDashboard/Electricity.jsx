import { useState } from "react";
import Swal from "sweetalert2";

export default function Electricity({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "Bihar State Electricity Board (BSEB)",
      reqId: "REQ987654",
      consumerNumber: "1100223344",
      amount: "600",
      operatorId: "ELEC123",
      date: "28 Apr 2025 02:30 PM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "Tamil Nadu Electricity Board (TNEB)",
      reqId: "REQ112233",
      consumerNumber: "7788990011",
      amount: "750",
      operatorId: "ELEC456",
      date: "27 Apr 2025 11:15 AM",
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
    console.log("Electricity Bill Data:", formData);
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your electricity bill has been successfully paid.',                            
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'                             
    });
  };

  return (
    <div className="flex gap-4">
      {/* Electricity Recharge Form */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {activeLabel} Recharge & Bill Payment
        </h2>

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          <select
            name="operator"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={formData.operator}
          >
            <option value="">Select Electricity Operator</option>
            <option value="bseb">Bihar State Electricity Board (BSEB)</option>
            <option value="tneb">Tamil Nadu Electricity Board (TNEB)</option>
            <option value="dvvnl">Dakshin Vidyut Vitran Nigam Limited (DVVNL)</option>
            <option value="bspdcl">Bihar State Power Distribution Company Limited (BSPDCL)</option>
            <option value="mseb">Maharashtra State Electricity Board (MSEB)</option>
            <option value="bescom">Bangalore Electricity Supply Company (BESCOM)</option>
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
              placeholder="Enter Amount"
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

      {/* Recent Electricity Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Electricity Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Operator</th>
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
