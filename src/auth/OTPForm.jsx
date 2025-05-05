import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path
import Cookies from "js-cookie"; // Import js-cookie

export default function OTPForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { message = "Please enter the OTP and MPIN sent to your registered number.", userId = "" } = location.state || {};
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://gateway.dhanushop.com"; // API base URL

  // State variables
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Timer for resend OTP
  const [resending, setResending] = useState(false);

  // Retrieve token and login details from cookies
  const token = Cookies.get("token");
  const loginid = Cookies.get("loginid");
  const UserId = Cookies.get("UserId");
  const role = Cookies.get("role");

  // Resend OTP countdown timer
  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle OTP and MPIN verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim() || !mpin.trim()) {
      setError("Both OTP and MPIN are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/OTP_MPIN_Validator`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserId: UserId, LoginId: loginid, OTP: otp, MPin: mpin }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data?.success) {
        // Navigate to user-specific dashboard
        role === "Admin"
          ? navigate("/admin")
          : role === "user"
          ? navigate("/user")
          : setError("Unknown user type. Please contact support.");
      } else {
        setError(data?.message || "Verification failed. Please check your details and try again.");
      }
    } catch (error) {
      setError("An error occurred while verifying your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (resending || resendTimer > 0) return;

    setResending(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/OTP_Resend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserId: UserId, LoginId: loginid }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        setResendTimer(30);
        alert(data.message || "OTP resent successfully!");
      } else {
        setError(data?.message || "Failed to resend OTP. Please try again.");
      }
    } catch {
      setError("Failed to resend OTP. Please check your connection and try again.");
    } finally {
      setResending(false);
    }
  };

  // Handle Forgot MPIN
  const handleForgotMpin = () => {
    navigate("/forgot-mpin");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Illustration Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img
          src={loginpageimage}
          alt="OTP Verification Illustration"
          className="max-w-md w-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">OTP Verification</h2>
          <p className="text-sm text-gray-600 mb-6">{message}</p>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Input */}
            <input
              type="text"
              aria-label="Enter OTP"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onPaste={(e) => e.preventDefault()} // Prevent pasting in OTP field
            />

            {/* MPIN Input */}
            <input
              type="password"
              aria-label="Enter MPIN"
              placeholder="Enter MPIN"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              value={mpin}
              onChange={(e) => setMpin(e.target.value)}
              onPaste={(e) => e.preventDefault()} // Prevent pasting in MPIN field
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          {/* Resend OTP and Forgot MPIN Options */}
          <div className="mt-6 flex justify-between text-sm text-gray-600">
            <button
              onClick={handleResendOtp}
              disabled={resending || resendTimer > 0}
              className={`${
                resending || resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-indigo-600 hover:underline"
              }`}
            >
              {resending ? "Resending..." : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </button>

            <button onClick={handleForgotMpin} className="text-indigo-600 hover:underline">
              Forgot MPIN?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
