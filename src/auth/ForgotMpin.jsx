import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginpageimage from "/LoginPageImage.png"; // Replace with the appropriate image path
import Cookies from "js-cookie"; // Import js-cookie
export default function ForgotMpin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(""); // Step 1
  const [otp, setOtp] = useState(""); // Step 2
  const [newMpin, setNewMpin] = useState(""); // Step 3
  const [confirmMpin, setConfirmMpin] = useState(""); // Step 3
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState(""); // To track the OTP ID for validation
  const token = Cookies.get("token"); // Replace with your token logic

  const handleSendOtp = async () => {
    if (!userId) {
      setError("Please enter your User ID.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://gateway.dhanushop.com/api/users/ForgetMPIN",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userId }),
        }
      );

      const data = await response.json();
console.log(data);
      if (response.ok && data.success) {
        setOtpId(data.OTPId); // Save OTP ID for validation
        alert("OTP sent successfully to your registered phone number!");
        setStep(2); // Move to Step 2
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://gateway.dhanushop.com/api/users/OTPValidator",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userId, LoginId: otpId, OTP: otp }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert("OTP verified successfully!");
        setStep(3); // Move to Step 3
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetMpin = async (e) => {
    e.preventDefault();

    if (!newMpin || !confirmMpin) {
      setError("Please enter and confirm your new MPIN.");
      return;
    }

    if (newMpin !== confirmMpin) {
      setError("MPINs do not match. Please try again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://gateway.dhanushop.com/api/users/set-mpin",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userId, MPin: newMpin }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert("MPIN reset successfully!");
        navigate("/login"); // Redirect to login page
      } else {
        setError(data.message || "Failed to set MPIN. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Illustration Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img
          src={loginpageimage}
          alt="Forgot MPIN Illustration"
          className="max-w-md w-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {step === 1
              ? "Enter User ID"
              : step === 2
              ? "Verify OTP"
              : "Set New MPIN"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {step === 1
              ? "Enter your User ID to send an OTP to your registered phone number."
              : step === 2
              ? "Verify the OTP sent to your phone."
              : "Set a new MPIN to secure your account."}
          </p>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form
            onSubmit={step === 3 ? handleSetMpin : (e) => e.preventDefault()}
            className="space-y-5"
          >
            {step === 1 && (
              <>
                {/* User ID Input */}
                <input
                  type="text"
                  placeholder="Enter User ID"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* OTP Input */}
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                >
                  {loading ? "Verifying OTP..." : "Verify OTP"}
                </button>
              </>
            )}

            {step === 3 && (
              <>
                {/* New MPIN Input */}
                <input
                  type="password"
                  placeholder="Enter New MPIN"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newMpin}
                  onChange={(e) => setNewMpin(e.target.value)}
                />

                {/* Confirm MPIN Input */}
                <input
                  type="password"
                  placeholder="Confirm New MPIN"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={confirmMpin}
                  onChange={(e) => setConfirmMpin(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                  disabled={loading}
                >
                  {loading ? "Setting MPIN..." : "Set MPIN"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
