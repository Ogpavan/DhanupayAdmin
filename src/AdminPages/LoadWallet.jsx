import React from 'react'

function LoadWallet() {
  return (
    <div>
      
    </div>
  )
}

export default LoadWallet


// import React, { useState, useEffect } from "react";

// const AdminWallet = () => {
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [transactionHistory, setTransactionHistory] = useState([]);
//   const [amount, setAmount] = useState("");

//   useEffect(() => {
//     // Simulate fetching wallet data from an API
//     const fetchWalletData = async () => {
//       const walletData = {
//         balance: 10000,
//         transactions: [
//           { id: 1, type: "credit", amount: 5000, date: "2025-05-08" },
//           { id: 2, type: "debit", amount: 2000, date: "2025-05-07" },
//         ],
//       };

//       setWalletBalance(walletData.balance);
//       setTransactionHistory(walletData.transactions);
//     };

//     fetchWalletData();
//   }, []);

//   const handleAddFunds = () => {
//     if (!amount || isNaN(amount) || amount <= 0) {
//       alert("Please enter a valid amount.");
//       return;
//     }

//     setWalletBalance(walletBalance + parseFloat(amount));
//     setTransactionHistory([
//       ...transactionHistory,
//       { id: Date.now(), type: "credit", amount: parseFloat(amount), date: new Date().toISOString().split("T")[0] },
//     ]);
//     setAmount("");
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <div className="  p-4 rounded-2xl flex gap-4">
//         {/* Left Section */}
//         <div className="w-1/2">
//           <h1 className="text-2xl font-bold mb-4">Admin Wallet</h1>
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold">Wallet Balance</h2>
//             <p className="text-3xl text-green-500 font-bold">₹{walletBalance.toFixed(2)}</p>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-2">Add Funds</h2>
//             <div className="flex flex-col space-y-2">
//               <input
//                 type="number"
//                 placeholder="Enter amount"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="border rounded-lg p-2 w-1/2"
//               />
//               <button
//                 onClick={handleAddFunds}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg w-1/2"
//               >
//                 Add Funds
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="w-1/2">
//           <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
//           <div className="overflow-y-auto max-h-96">
//             {transactionHistory.length > 0 ? (
//               <table className="table-auto w-full text-left border-collapse border border-gray-300">
//                 <thead>
//                   <tr>
//                     <th className="border border-gray-300 px-4 py-2">Date</th>
//                     <th className="border border-gray-300 px-4 py-2">Type</th>
//                     <th className="border border-gray-300 px-4 py-2">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactionHistory.map((txn) => (
//                     <tr key={txn.id} className={`${txn.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
//                       <td className="border border-gray-300 px-4 py-2">{txn.date}</td>
//                       <td className="border border-gray-300 px-4 py-2 capitalize">{txn.type}</td>
//                       <td className="border border-gray-300 px-4 py-2">₹{txn.amount.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>No transactions found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminWallet;
