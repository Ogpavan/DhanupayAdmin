const dummyTransactions = [
    {
      id: 1,
      service: "Mobile Recharge",
      operatorName: "Airtel",
      reqId: "REQ123456",
      mobileNumber: "9876543210",
      amount: "₹199",
      operatorId: "OP123",
      date: "28 Apr 2025 02:30 PM",
    },
    {
      id: 2,
      service: "DTH Recharge",
      customerId: "DishTV 12345",
      amount: "₹350",
      date: "27 Apr 2025 01:00 PM",
    },
    {
      id: 3,
      service: "Electricity Bill",
      consumerNumber: "UPPCL 98765",
      amount: "₹1200",
      date: "26 Apr 2025 11:15 AM",
    },
  ];
  
  export default function RecentTransactions() {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <ul className="space-y-4">
          {dummyTransactions.map((tx) => (
            <li key={tx.id} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">{tx.service}</p>
                <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
  
              {/* Conditionally show fields based on service */}
              {tx.service === "Mobile Recharge" ? (
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p><strong>Operator:</strong> {tx.operatorName}</p>
                  <p><strong>ReqID:</strong> {tx.reqId}</p>
                  <p><strong>Mobile:</strong> {tx.mobileNumber}</p>
                  <p><strong>Operator ID:</strong> {tx.operatorId}</p>
                  <p><strong>Amount:</strong> {tx.amount}</p>
                </div>
              ) : tx.service === "DTH Recharge" ? (
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p><strong>Customer ID:</strong> {tx.customerId}</p>
                  <p><strong>Amount:</strong> {tx.amount}</p>
                </div>
              ) : (
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p><strong>Consumer No:</strong> {tx.consumerNumber}</p>
                  <p><strong>Amount:</strong> {tx.amount}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  