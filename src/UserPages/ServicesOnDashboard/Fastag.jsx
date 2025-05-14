// import { useState } from "react";
// import Swal from "sweetalert2";

// export default function Fastag({ activeLabel }) {
//   const [transactions, setTransactions] = useState([
//     {
//       id: 1,
//       operatorName: "Paytm FASTag",
//       reqId: "REQ20250428A",
//       vehicleNumber: "MH12AB1234",
//       amount: "500",
//       operatorId: "FASTAG123",
//       date: "28 Apr 2025 03:30 PM",
//       status: "Success",
//     },
//     {
//       id: 2,
//       operatorName: "NHAI FASTag",
//       reqId: "REQ20250426B",
//       vehicleNumber: "KA03CD5678",
//       amount: "600",
//       operatorId: "FASTAG456",
//       date: "26 Apr 2025 10:00 AM",
//       status: "Pending",
//     },
//   ]);

//   const [formData, setFormData] = useState({
//     operator: "",
//     vehicleNumber: "",
//     dob: "",
//     amount: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Fastag Recharge Data:", formData);

//     Swal.fire({
//       icon: 'success',
//       title: 'Recharge Successful',
//       text: 'Your FASTag recharge request has been submitted successfully.',
//       confirmButtonColor: '#3085d6',
//       confirmButtonText: 'OK'
//     });

//     // Reset form
//     setFormData({
//       operator: "",
//       vehicleNumber: "",
//       amount: ""
//     });
//   };

//   return (
//     <div className="flex gap-4">
//       {/* Fastag Recharge Form */}
//       <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
//         <h2 className="text-xl font-semibold mb-4">
//           {activeLabel} 
//         </h2>

//         <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
//           <select
//             name="operator"
//             className="w-full p-2 border rounded"
//             onChange={handleChange}
//             value={formData.operator}
//           >
//             <option value="">Select FASTag Provider</option>
//             <option value="paytm">Paytm FASTag</option>
//             <option value="nhai">NHAI FASTag</option>
//             <option value="bharat">Bharat FASTag</option>
//             <option value="icici">ICICI FASTag</option>
//             <option value="axis">Axis FASTag</option>
//           </select>

//           <input
//             type="text"
//             name="vehicleNumber"
//             placeholder="Enter Vehicle Registration Number"
//             className="w-full p-2 border rounded"
//             value={formData.vehicleNumber}
//             onChange={handleChange}
//           />


//           <div className="flex gap-4">
//             <input
//               type="number"
//               name="amount"
//               placeholder="Enter Recharge Amount"
//               className="w-full p-2 border rounded"
//               value={formData.amount}
//               onChange={handleChange}
//             />
//             {/* <button
//               type="button"
//               className="text-nowrap p-2 border rounded bg-gray-100"
//             >
//               Fetch Details
//             </button> */}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded"
//           >
//             Continue
//           </button>
//         </form>
//       </div>

//       {/* Recent Fastag Transactions Table */}
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h3 className="text-lg font-semibold mb-2">Recent FASTag Transactions</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Provider</th>
//                 <th className="p-2 border">Vehicle Number</th>
//                 <th className="p-2 border">Amount</th>
//                 <th className="p-2 border">ReqID</th>
//                 <th className="p-2 border">Operator ID</th>
//                 <th className="p-2 border">Date</th>
//                 <th className="p-2 border">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((tx) => (
//                 <tr key={tx.id}>
//                   <td className="p-2 border">{tx.operatorName}</td>
//                   <td className="p-2 border">{tx.vehicleNumber}</td>
//                   <td className="p-2 border">₹{tx.amount}</td>
//                   <td className="p-2 border">{tx.reqId}</td>
//                   <td className="p-2 border">{tx.operatorId}</td>
//                   <td className="p-2 border">{tx.date}</td>
//                   <td className="p-2 border">{tx.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import bharatconnects from "/bharat-connect.png";

// FASTag provider logos
const fastagLogos = {
  paytm: "/fastagoperatorl.png",
  nhai: "data:image/jpeg;base64,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",
  bharat: "data:image/jpeg;base64,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",
  icici: "data:image/jpeg;base64,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",
  axis: "data:image/png;base64,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",
};

// FASTag providers
const fastagProviders = [
  { id: "paytm", name: "Paytm FASTag" },
  { id: "nhai", name: "NHAI FASTag" },
  { id: "bharat", name: "Bharat FASTag" },
  { id: "icici", name: "ICICI FASTag" },
  { id: "axis", name: "Axis FASTag" },
];

// Custom dropdown component
function FastagDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = fastagProviders.find((p) => p.id === value);

  return (
    <div className="relative w-full" ref={ref}>
      <div
        className="flex items-center justify-between border p-2 rounded cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <img src={fastagLogos[selected.id]} alt="" className="w-6 h-6" />
            <span>{selected.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select FASTag Provider</span>
        )}
        <span className="text-gray-500">&#9662;</span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 min-w-md bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
          {fastagProviders.map((provider) => (
            <li
              key={provider.id}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange({ target: { name: "operator", value: provider.id } });
                setIsOpen(false);
              }}
            >
              <img src={fastagLogos[provider.id]} alt="" className="w-5 h-5" />
              {provider.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
    amount: "",
    convenienceFee: "10",
    transactionId: "",
    orderId: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [billInfo, setBillInfo] = useState(null);
  const [expandedTxId, setExpandedTxId] = useState(null);
  const audioRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.operator || !formData.vehicleNumber || !formData.amount) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
      return;
    }

    // Set mock transaction ID and order ID
    setFormData(prev => ({
      ...prev,
      transactionId: "TXN" + Math.floor(Math.random() * 1000000),
      orderId: "ORDER" + Math.floor(Math.random() * 1000000)
    }));

    // Show confirmation modal
    setShowModal(true);
    setPaymentDone(false);

    // Set mock bill info
    setBillInfo({
      name: "Amit Kumar",
      dueDate: "30 May 2025",
    });
  };

  const handlePayment = () => {
    // Simulate payment processing
    setPaymentDone(true);

    console.log(formData);

    console.log("Payment done, attempting to play sound...");

    if (audioRef.current) {
      console.log("Audio element found, trying to play...");
      audioRef.current.play().then(() => {
        console.log("Audio played successfully");
      }).catch((error) => {
        console.error("Failed to play audio:", error);
      });
    } else {
      console.error("Audio element not found");
    }


    // Add transaction to list
    const newTransaction = {
      id: transactions.length + 1,
      operatorName: fastagProviders.find(p => p.id === formData.operator)?.name,
      reqId: formData.orderId,
      vehicleNumber: formData.vehicleNumber,
      amount: formData.amount,
      operatorId: "FASTAG" + Math.floor(Math.random() * 1000),
      date: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      status: "Success",
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const closeModal = () => {
    setShowModal(false);

    if (paymentDone) {
      // Reset form after successful payment
      setFormData({
        operator: "",
        vehicleNumber: "",
        amount: "",
        convenienceFee: "10",
        transactionId: "",
        orderId: ""
      });
    }
  };
  return (
    <div className="flex gap-4 flex-wrap">
      {/* FASTag Recharge Form */}
      <audio ref={audioRef} src="/BharatConnect.wav" preload="auto" />
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
               <div className="flex justify-between ">
                        <h2 className="text-xl    mb-4">
                          {activeLabel}   Bill Payment
                        </h2>
                        <span><img src={bharatconnects} alt="Bharat Connect" className="h-6" /></span>
                        </div>
       

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          <FastagDropdown value={formData.operator} onChange={handleChange} />

          <input
            type="text"
            name="vehicleNumber"
            placeholder="Enter Vehicle Registration Number"
            className="w-full p-2 border rounded"
            value={formData.vehicleNumber}
            onChange={handleChange}
          />

          <input
            type="number"
            name="amount"
            placeholder="Enter Recharge Amount"
            className="w-full p-2 border rounded"
            value={formData.amount}
            onChange={handleChange}
          />


          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="convenienceFee">
              Convenience Fee
            </label>
            <input
              type="number"
              id="convenienceFee"
              name="convenienceFee"
              value={formData.convenienceFee}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                // Check if the value is a valid number and within the range 0 - 10
                if (!isNaN(value) && value >= 0 && value <= 10) {
                  setFormData({ ...formData, convenienceFee: value });
                }
              }}
              min="0"
              max="10"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter convenience fee (0 - 10)"
            />
          </div>

          <h1 onClick={() => navigate("/user/rechargecomplaint")}
            className="text-xs text-center cursor-pointer  font-bold text-blue-500 underline mb-4">Raise Complaint </h1>


          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Continue
          </button>
        </form>
      </div>

      {/* Recent FASTag Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1 w-full">
        <h3 className="text-lg font-semibold mb-2">Recent FASTag Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Provider</th>
                <th className="p-2 border">Vehicle Number</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isExpanded = expandedTxId === tx.id;
                return (
                  <>
                    <tr key={tx.id}>
                      <td className="p-2 border">{tx.operatorName}</td>
                      <td className="p-2 border">{tx.vehicleNumber}</td>
                      <td className="p-2 border">₹{tx.amount}</td>
                      <td className="p-2 border">{tx.status}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                          className="text-blue-500 hover:underline"
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="p-4 border border-t-0">
                          <div className="text-sm space-y-1">
                            <p><strong>Request ID:</strong> {tx.reqId}</p>
                            <p><strong>Operator ID:</strong> {tx.operatorId}</p>
                            <p><strong>Date & Time:</strong> {tx.date}</p>
                            <p><strong>Status:</strong> {tx.status}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto ">
          <div className=" p-6 rounded shadow-lg max-w-sm  text-center ">
            {!paymentDone ? (
              <>
                <div className="p-6 bg-white shadow-lg rounded-lg w-96 mx-auto ">
                  {/* Logo */}
                  <div className="flex justify-center mb-5">
                    <img src="/bharat-connect.png" alt="Bharat Connect" className="h-7" />
                  </div>
                  <h3 className="text-2xl font-semibold text-center mb-6">Confirm Details</h3>
                  <div className="space-y-4 ">
                    <div className="flex justify-between">
                      <span className="font-semibold">Operator:</span>
                      <span>{fastagProviders.find(op => op.id === formData.operator)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Vehicle Number:</span>
                      <span>{formData.vehicleNumber}</span>
                    </div>
                    {billInfo && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Owner:</span>
                        <span>{billInfo.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold">Recharge Amount:</span>
                      <span>₹{formData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Convenience Fee:</span>
                      <span>₹{formData.convenienceFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-xl">
                      <span>Total Amount:</span>
                      <span>₹{(Number(formData.amount) + Number(formData.convenienceFee)).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    className="mt-6 w-full bg-green-500 text-white p-3 rounded-lg text-lg hover:bg-green-600 transition"
                    onClick={handlePayment}
                  >
                    Make Payment
                  </button>
                  <button
                    className="mt-2 w-full bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="max-w-md w-[30vw] mx-auto bg-white rounded-lg shadow-lg p-6 pt-1 space-y-1 ">
                  {/* Logo */}
                  <div className="flex justify-center">
                    <img src="/bbpsassured.png" alt="Bharat Connect" className="h-22" />
                  </div>

                  {/* Success Message */}
                  <div className="flex items-center justify-center text-green-600">
                    <img src="/check.png" alt="Success" className="h-8 w-8 mr-2" />
                    <span className="text-2xl font-bold">Payment Successful!</span>
                  </div>

                  {/* Transaction Info */}
                  <div className="space-y-1 text-sm text-gray-700 leading-tight">
                    <div className="flex justify-between pt-2">
                      <span className="font-semibold">Order ID:</span>
                      <span>{formData.orderId ?? 'ORD123456'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">B-Connect Txn ID:</span>
                      <span>{formData.transactionId ?? 'TXN987654'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Operator:</span>
                      <span>{fastagProviders.find(op => op.id === formData.operator)?.name || 'FastagOperator'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Vehicle Number:</span>
                      <span>{formData.vehicleNumber ?? 'MH12AB1234'}</span>
                    </div>

                    {/* Additional Bill Details with Dummy Fallback */}
                    <div className="flex justify-between">
                      <span className="font-semibold">Biller ID:</span>
                      <span>{billInfo?.billerId ?? 'BIL12345'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Biller Name:</span>
                      <span>{billInfo?.billerName ?? 'Electricity Board'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Consumer Name:</span>
                      <span>{billInfo?.consumerName ?? 'John Doe'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Consumer No:</span>
                      <span>{billInfo?.consumerNo ?? 'CON56789'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Bill Date:</span>
                      <span>{billInfo?.billDate ?? '2025-05-01'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Bill Period:</span>
                      <span>{billInfo?.billPeriod ?? 'Apr 2025'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Bill No:</span>
                      <span>{billInfo?.billNo ?? 'BN098765'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Bill Due Date:</span>
                      <span>{billInfo?.billDueDate ?? '2025-05-15'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Bill Amount:</span>
                      <span>₹{billInfo?.billAmount ?? '500.00'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Transaction Date & Time:</span>
                      <span>{formData.transactionDateTime ?? '2025-05-13 12:00 PM'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Payment Mode:</span>
                      <span>Cash</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Payment Status:</span>
                      <span>Success</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Recharge Amount:</span>
                      <span>₹{formData.amount ?? '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Convenience Fee:</span>
                      <span>₹{formData.convenienceFee ?? '0.00'}</span>
                    </div>

                    <div className="flex justify-between border-t pt-3 font-semibold text-base text-black">
                      <span>Total Amount:</span>
                      <span>₹{(
                        Number(formData.amount ?? 0) + Number(formData.convenienceFee ?? 0)
                      ).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="text-center ">
                    <button
                      className="px-6 py-2 mr-5 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition"
                      onClick={() => window.print()}
                    >
                      Print
                    </button>
                    <button
                      className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}