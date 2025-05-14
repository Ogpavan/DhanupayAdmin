import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path
import Cookies from "js-cookie"; // Import js-cookie
import Swal from "sweetalert2";

export default function OTPForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    message = "Please enter the OTP and MPIN sent to your registered number.",
    userId = "",
  } = location.state || {};
  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "https://gateway.dhanushop.com"; // API base URL

  // State variables
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Timer for resend OTP
  const [resending, setResending] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false); // Toggle for OTP visibility
  const [mpinVisible, setMpinVisible] = useState(false); // Toggle for MPIN visibility

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

  // Handle input change for OTP and MPIN
  const handleInputChange = (e, index, type) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Accept only digits
    if (!value) return;

    const targetArray = type === "otp" ? [...otp] : [...mpin];
    targetArray[index] = value;

    if (type === "otp") {
      setOtp(targetArray);
    } else {
      setMpin(targetArray);
    }

    // Move to next input if not last
    const nextInput = document.getElementById(`${type}-${index + 1}`);
    if (value && nextInput) {
      nextInput.focus();
    }
  };

  const handleBackspace = (e, index, type) => {
    if (e.key === "Backspace") {
      if (type === "otp") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);

        if (index > 0) {
          document.getElementById(`otp-${index - 1}`).focus();
        }
      } else {
        const newMpin = [...mpin];
        newMpin[index] = "";
        setMpin(newMpin);

        if (index > 0) {
          document.getElementById(`mpin-${index - 1}`).focus();
        }
      }
    }
  };

  // Handle OTP and MPIN verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.includes("") || mpin.includes("")) {
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
        body: JSON.stringify({
          UserId: UserId,
          LoginId: loginid,
          OTP: otp.join(""),
          MPin: mpin.join(""),
        }),
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
        setError(
          data?.message ||
            "Verification failed. Please check your details and try again."
        );
      }
    } catch (error) {
      setError(
        "An error occurred while verifying your details. Please try again."
      );
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
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "A new OTP has been sent to your registered contact.",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        setError(data?.message || "Failed to resend OTP. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data?.message || "Failed to resend OTP. Please try again.",
        });
      }
    } catch {
      const errorMsg =
        "Failed to resend OTP. Please check your connection and try again.";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: errorMsg,
      });
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
          alt="Secure Login Illustration"
          className="max-w-md w-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Secure Login with OTP and MPIN
          </h2>
          <p className="text-sm text-center text-gray-600 mb-10">{message}</p>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2 pr-3">
                Enter OTP:{" "}
              </label>
              <div className="flex space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type={otpVisible ? "text" : "password"}
                    maxLength="1"
                    className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={digit}
                    onChange={(e) => handleInputChange(e, index, "otp")}
                    onKeyDown={(e) => handleBackspace(e, index, "otp")}
                    onClick={(e) => e.target.setSelectionRange(0, 1)} // Prevent caret movement
                    onFocus={(e) => e.target.setSelectionRange(0, 1)} // Always position caret at start
                    inputMode="numeric"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setOtpVisible((prev) => !prev)}
                className="ml-4 text-indigo-600 text-sm hover:underline"
              >
                {otpVisible ? "Hide" : "Show"}
              </button>
            </div>

            {/* MPIN Input */}
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2 pr-2">
                Enter MPIN:{" "}
              </label>
              <div className="flex space-x-2">
                {mpin.map((digit, index) => (
                  <input
                    key={index}
                    id={`mpin-${index}`}
                    type={mpinVisible ? "text" : "password"}
                    maxLength="1"
                    className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={digit}
                    onChange={(e) => handleInputChange(e, index, "mpin")}
                    onKeyDown={(e) => handleBackspace(e, index, "mpin")}
                    onClick={(e) => e.target.setSelectionRange(0, 1)} // Prevent caret movement
                    onFocus={(e) => e.target.setSelectionRange(0, 1)} // Always position caret at start
                    inputMode="numeric"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setMpinVisible((prev) => !prev)}
                className="ml-4 text-indigo-600 text-sm hover:underline"
              >
                {mpinVisible ? "Hide" : "Show"}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition mt-5"
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
                resending || resendTimer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:underline"
              }`}
            >
              {resending
                ? "Resending..."
                : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>

            <button
              onClick={handleForgotMpin}
              className="text-indigo-600 hover:underline"
            >
              Forgot MPIN?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
