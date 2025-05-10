import { useState, useRef } from "react";
import "../../App.css";
import React from "react";



export default function MobileRecharge({ activeLabel }) {
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
  });

  const [showModal, setShowModal] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([
    { id: 1, amount: 199, description: "1.5GB/day for 28 days" },
    { id: 2, amount: 299, description: "2GB/day + 100 SMS/day for 28 days" },
    { id: 3, amount: 399, description: "3GB/day + OTT subscription for 56 days" },
  ]);

  const [expandedTxId, setExpandedTxId] = useState(null);






  const handlePayment = () => {
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
          <h2 className="text-xl font-semibold mb-4">
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

            <select
              name="operator"
              className="w-full p-2 border rounded"
              value={formData.operator}
              onChange={handleChange}
            >
              <option value="">Select Operator</option>
              <option value="Airtel">Airtel</option>
              <option value="Vi">Vi</option>
              <option value="Jio">Jio</option>
            </select>

            <select
              name="circle"
              className="w-full p-2 border rounded"
              value={formData.circle}
              onChange={handleChange}
            >
              <option value="">Select Circle</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Continue
            </button>
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
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            {!paymentDone ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Confirm Details</h3>
                <p><strong>Mobile:</strong> {formData.mobile}</p>
                <p><strong>Type:</strong> {formData.type}</p>
                <p><strong>Operator:</strong> {formData.operator}</p>
                <p><strong>Circle:</strong> {formData.circle}</p>
                <p><strong>Amount:</strong> ₹{formData.amount}</p>
                <button
                  className="mt-4 w-full bg-green-500 text-white p-2 rounded"
                  onClick={handlePayment}
                >
                  Make Payment
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-center ">
                  <img src="/bbpsassured.png" alt="Bharat Connect" className="h-full" />
                </div>
                <div className="flex items-center justify-center">
                  <img src="/check.png" alt="Payment Successful" className="h-8 w-8 mr-2 " />
                  <span className="text-2xl font-bold text-green-600">Payment Successful!</span>
                </div>

                <p><strong> Date & Time:</strong>28 Apr 2025 02:30 PM</p>
                <p><strong>Mobile:</strong> {formData.mobile}</p>
                {/* <p><strong>Type:</strong> {formData.type}</p> */}
                <p><strong>Operator:</strong> {formData.operator}</p>
                {/* <p><strong>Circle:</strong> {formData.circle}</p> */}
                <p><strong>Amount:</strong> ₹{formData.amount}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={closeModal}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
