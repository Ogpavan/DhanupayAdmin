import { useState, useRef, useEffect } from "react";
import "../../App.css";
import React from "react";
import { useNavigate } from "react-router-dom";



export default function MobileRecharge({ activeLabel }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      operatorName: "Airtel",
      reqId: "REQ123456",
      mobileNumber: "9876543210",
      amount: "199",
      operatorId: "OP123",
      date: "28 Apr 2025 02:30 PM",
      status: "Success",
    },
    {
      id: 2,
      operatorName: "Vi",
      reqId: "REQ654321",
      mobileNumber: "9876501234",
      amount: "299",
      operatorId: "OP456",
      date: "27 Apr 2025 11:15 AM",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    mobile: "",
    type: "Prepaid",
    operator: "",
    circle: "",
    amount: "",
    convenienceFee: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [operators, setOperators] = useState([]);
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  const [circles, setCircles] = useState([]);
  const [plans, setPlans] = useState([
    { id: 1, amount: 199, description: "1.5GB/day for 28 days" },
    { id: 2, amount: 299, description: "2GB/day + 100 SMS/day for 28 days" },
    { id: 3, amount: 399, description: "3GB/day + OTT subscription for 56 days" },
  ]);

  const [expandedTxId, setExpandedTxId] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      setOperators([
        { id: "airtel", name: "Airtel", image: "data:image/png;base64,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" },
        { id: "vi", name: "Vi", image: "data:image/png;base64,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" },
        { id: "jio", name: "Jio", image: "https://static.vecteezy.com/system/resources/previews/048/332/148/non_2x/jio-transparent-blue-icon-free-png.png" },
      ]);

      setCircles([
        { id: "andhra_pradesh", name: "Andhra Pradesh" },
        { id: "assam", name: "Assam" },
        { id: "bihar", name: "Bihar & Jharkhand" },
        { id: "chennai", name: "Chennai" },
        { id: "delhi", name: "Delhi NCR" },
        { id: "gujarat", name: "Gujarat" },
        { id: "haryana", name: "Haryana" },
        { id: "himachal_pradesh", name: "Himachal Pradesh" },
        { id: "jammu_kashmir", name: "Jammu & Kashmir" },
        { id: "karnataka", name: "Karnataka" },
        { id: "kerala", name: "Kerala" },
        { id: "kolkata", name: "Kolkata" },
        { id: "madhya_pradesh", name: "Madhya Pradesh & Chhattisgarh" },
        { id: "maharashtra", name: "Maharashtra & Goa" },
        { id: "mumbai", name: "Mumbai" },
        { id: "ne", name: "North East" },
        { id: "odisha", name: "Odisha" },
        { id: "punjab", name: "Punjab" },
        { id: "rajasthan", name: "Rajasthan" },
        { id: "tamil_nadu", name: "Tamil Nadu" },
        { id: "up_east", name: "Uttar Pradesh (East)" },
        { id: "up_west", name: "Uttar Pradesh (West) & Uttarakhand" },
        { id: "west_bengal", name: "West Bengal" },
      ]);

    }, 100); // Simulate API delay
  }, []);






  const handlePayment = () => {
    console.log(formData);
    setPaymentDone(true);
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
  };


  const closeModal = () => {
    setShowModal(false);
    setPaymentDone(false);

    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // reset to start
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow digits for mobile input
    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, ""); // remove all non-digit characters
      const mobileRegex = /^[6-9]\d{0,9}$/;

      if (!mobileRegex.test(numericValue) && numericValue !== "") {
        setErrors((prev) => ({
          ...prev,
          mobile: "Enter valid 10-digit Indian mobile number",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mobile: "" }));
      }

      setFormData({ ...formData, mobile: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleTypeSelect = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };





  return (
    <div className="flex gap-4">
      <audio ref={audioRef} src="/BharatConnect.wav" preload="auto" />
      {/* Form Section */}
      <div className="bg-white  rounded-lg px-6 pt-6  w-full ">
        <div className="shadow-md  max-w-md ">
          <h2 className="text-xl font-semibold ml-6 mb-4">
            {activeLabel} Recharge & Bill Payment
          </h2>

          <form className="space-y-4 px-6 mb-8" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="mobile"
                placeholder="Enter Mobile Number"
                className={`w-full p-2 border rounded ${errors.mobile ? "border-red-500" : ""}`}
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>


            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${formData.type === "Prepaid" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                onClick={() => handleTypeSelect("Prepaid")}
              >
                Prepaid
              </button>
              <button
                type="button"
                className={`flex-1 p-2 border rounded ${formData.type === "Postpaid" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                onClick={() => handleTypeSelect("Postpaid")}
              >
                Postpaid
              </button>
            </div>

            {/* <select
              name="operator"
              className="w-full p-2 border rounded"
              value={formData.operator}
              onChange={handleChange}
            >
              <option value="">Select Operator</option>
              {operators.map((op) => (
                <option key={op.id} value={op.name}>
                  {op.name}
                </option>
              ))}
            </select>

            {formData.operator && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={operators.find((o) => o.name === formData.operator)?.image}
                  alt={formData.operator}
                  className="h-6 w-6"
                />
                <span>{formData.operator}</span>
              </div>
            )} */}


            {/* Operator Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOperatorDropdown((prev) => !prev)}
                className="w-full flex items-center justify-between p-2 border rounded bg-white"
              >
                {formData.operator ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={operators.find((o) => o.name === formData.operator)?.image}
                      alt={formData.operator}
                      className="h-6 w-6"
                    />
                    <span>{formData.operator}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Select Operator</span>
                )}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showOperatorDropdown && (
                <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow-md max-h-48 overflow-y-auto">
                  {operators.map((op) => (
                    <li
                      key={op.id}
                      onClick={() => {
                        setFormData({ ...formData, operator: op.name });
                        setShowOperatorDropdown(false);
                      }}
                      className="p-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img src={op.image} alt={op.name} className="h-6 w-6" />
                      <span>{op.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>


            <select
              name="circle"
              className="w-full p-2 border rounded"
              value={formData.circle}
              onChange={handleChange}
            >
              <option value="">Select Circle</option>
              {circles.map((circle) => (
                <option key={circle.id} value={circle.name}>
                  {circle.name}
                </option>
              ))}
            </select>

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
                onClick={() => setShowPlans(true)}
              >
                View Plans
              </button>

            </div>
            {selectedPlan && (
              <p className="text-sm text-gray-600 mt-1">
                Selected Plan: {selectedPlan.description}
              </p>
            )}
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



            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Continue
            </button>
            <h1 onClick={() => navigate("/user/rechargecomplaint")}
              className="text-xs text-center cursor-pointer  font-bold text-blue-500 underline mb-4">Raise Complaint </h1>


          </form>
          <div className="bg-gray-200 rounded-t-3xl h-8 w-full flex justify-center items-center">
            <img src="/bharat-connect.png" alt="Bharat Connect" className="h-6" />
          </div>
        </div>
      </div>


      {/* Transactions Table and show plans */}
      {showPlans ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h3 className="text-lg font-semibold mb-2">Available Plans</h3>
          <ul className="space-y-3">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="border p-4 rounded hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  setFormData({ ...formData, amount: plan.amount.toString() });
                  setSelectedPlan(plan);
                  setShowPlans(false);
                }}

              >
                <p className="font-medium">₹{plan.amount}</p>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h3 className="text-lg font-semibold mb-2">Recent Mobile Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Operator</th>
                  <th className="p-2 border">Mobile No</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isExpanded = expandedTxId === tx.id;
                  return (
                    <React.Fragment key={tx.id}>
                      <tr>
                        <td className="p-2 border">{tx.operatorName}</td>
                        <td className="p-2 border">{tx.mobileNumber}</td>
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
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="p-6 rounded shadow-lg max-w-sm w-full text-center">
            {!paymentDone ? (
              <>
                <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
                  {/* Logo */}
                  <div className="flex justify-center mb-5">
                    <img src="/bharat-connect.png" alt="Bharat Connect" className="h-7" />
                  </div>
                  <h3 className="text-2xl font-semibold text-center mb-6">Confirm Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Mobile:</span>
                      <span>{formData.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Type:</span>
                      <span>{formData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Operator:</span>
                      <span>{formData.operator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Circle:</span>
                      <span>{formData.circle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Recharge Amt:</span>
                      <span>₹{formData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Convenience Fee:</span>
                      <span>₹{formData.convenienceFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-xl">
                      <span>Total Amount:</span>
                      <span>₹{Number(formData.amount) + Number(formData.convenienceFee)}</span>
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
                <div className="max-w-md mx-auto w-[30vw] bg-white rounded-lg shadow-lg p-6 pt-1 space-y-2 leading-snug text-sm text-gray-700 printable">
                  {/* Logo */}
                  <div className="flex justify-center mb-2">
                    <img src="/bbpsassured.png" alt="Bharat Connect" className="h-22" />
                  </div>

                  {/* Success Message */}
                  <div className="flex items-center justify-center text-green-600">
                    <img src="/check.png" alt="Success" className="h-8 w-8 mr-2" />
                    <span className="text-2xl font-bold">Payment Successful!</span>
                  </div>

                  {/* Transaction Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between pt-2">
                      <span className="font-semibold">Order ID:</span>
                      <span>{formData.orderId || 'ORD12345678'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">B-Connect Txn ID:</span>
                      <span>{formData.transactionId || 'BHRTX98765432'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Mobile:</span>
                      <span>{formData.mobile || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Type:</span>
                      <span>{formData.type || 'Prepaid'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Operator:</span>
                      <span>{formData.operator || 'Jio'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Circle:</span>
                      <span>{formData.circle || 'Delhi NCR'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Recharge Amount:</span>
                      <span>₹{formData.amount || '0.00'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Convenience Fee:</span>
                      <span>₹{formData.convenienceFee || '0.00'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Transaction Date & Time:</span>
                      <span>{formData.transactionDateTime || new Date().toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Payment Mode:</span>
                      <span>Cash</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-semibold">Payment Status:</span>
                      <span>Success</span>
                    </div>

                    <div className="flex justify-between border-t pt-2 font-semibold text-base text-black">
                      <span>Total Amount:</span>
                      <span>₹{(Number(formData.amount || 0) + Number(formData.convenienceFee || 0)).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="text-center space-x-4 mt-4 no-print">
                    <button
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition"
                      onClick={() => window.print()}
                    >
                      Print
                    </button>
                    <button
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
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
