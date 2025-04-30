import { useState } from "react";

export default function DTHRecharge({ activeLabel }) {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "DishTV",
      reqId: "REQ123456",
      dthNumber: "1234567890",
      amount: "350",
      operatorId: "OP123",
      date: "28 Apr 2025 02:30 PM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "Tata Sky",
      reqId: "REQ654321",
      dthNumber: "9876543210",
      amount: "450",
      operatorId: "OP456",
      date: "27 Apr 2025 11:15 AM",
      status: "Pending",
    },
  ]);

  return (
    <div className="flex gap-4">
      {/* Recharge Form */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">{activeLabel} Recharge & Bill Payment</h2>

        <form className="space-y-4 mb-8">
          <select className="w-full p-2 border rounded">
            <option>Select DTH Operator</option>
            <option>DishTV</option>
            <option>Tata Sky</option>
            <option>Airtel DTH</option>
          </select>
          <input
            type="text"
            placeholder="Enter DTH Number"
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Enter Amount"
              className="w-full p-2 border rounded"
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

      {/* Recent DTH Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Recent DTH Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Operator</th>
                <th className="p-2 border">DTH No</th>
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
                  <td className="p-2 border">{tx.dthNumber}</td>
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
