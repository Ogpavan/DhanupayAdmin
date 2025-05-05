import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginpageimage from "/LoginPageImage.png"; // Replace with the appropriate image path
import Cookies from "js-cookie"; // Import js-cookie

export default function ForgotMpin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(2); // Start from OTP verification step
  const [otp, setOtp] = useState(["", "", "", ""]); // Step 2
  const [newMpin, setNewMpin] = useState(["", "", "", ""]); // Step 3
  const [confirmMpin, setConfirmMpin] = useState(["", "", "", ""]); // Step 3
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState(""); // To track the OTP ID for validation
  const [showOtp, setShowOtp] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false); // Track the resend process
  // Timer for resend OTP

  const token = Cookies.get("token"); // Replace with your token logic
  const userId = Cookies.get("UserId"); // Get User ID from cookies

  useEffect(() => {
    const sendOtpOnLoad = async () => {
      await sendOtp();
    };

    sendOtpOnLoad();
  }, [token, userId]);


  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]); // This effect runs every time resendTimer changes
  
  
  const sendOtp = async () => {
    setError("");
    setLoading(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/ForgetMPIN`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserId: userId }),
      });
  
      const data = await response.json();
      if (response.ok && data.success) {
        setOtpId(data.OTPId);
        setResendTimer(30);  // Save OTP ID
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const resendOtp = async () => {
    setError("");
    setLoading(true);
  
    // Prevent resend if timer is active
    if (resendTimer > 0) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/OTP_Resend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserId: userId, LoginId: otpId }),
      });
  
      const data = await response.json();
      if (response.ok && data.success) {
        setResendTimer(30); // Reset timer to 30 seconds after successful OTP resend
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  

  const handleInputChange = (e, index, type) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (type === "otp") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) document.getElementById(`otp-${index + 1}`).focus();
    } else if (type === "newMpin") {
      const newPin = [...newMpin];
      newPin[index] = value;
      setNewMpin(newPin);
      if (value && index < 3) document.getElementById(`newMpin-${index + 1}`).focus();
    } else {
      const confirmPin = [...confirmMpin];
      confirmPin[index] = value;
      setConfirmMpin(confirmPin);
      if (value && index < 3) document.getElementById(`confirmMpin-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index, type) => {
    if (e.key === "Backspace") {
      if (type === "otp") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        if (index > 0) document.getElementById(`otp-${index - 1}`).focus();
      } else if (type === "newMpin") {
        const newPin = [...newMpin];
        newPin[index] = "";
        setNewMpin(newPin);
        if (index > 0) document.getElementById(`newMpin-${index - 1}`).focus();
      } else {
        const confirmPin = [...confirmMpin];
        confirmPin[index] = "";
        setConfirmMpin(confirmPin);
        if (index > 0) document.getElementById(`confirmMpin-${index - 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.includes("")) {
      setError("Please enter the complete OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/OTPValidator`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userId, LoginId: otpId, OTP: otp.join("") }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(3); // Move to Step 3
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetMpin = async (e) => {
    e.preventDefault();

    if (newMpin.includes("") || confirmMpin.includes("")) {
      setError("Please enter and confirm your new MPIN.");
      return;
    }

    if (newMpin.join("") !== confirmMpin.join("")) {
      setError("MPINs do not match. Please try again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/set-mpin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userId, LoginId: otpId, MPin: newMpin.join("") }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        navigate("/login"); // Redirect to login page
      } else {
        setError(data.message || "Failed to set MPIN. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img src={loginpageimage} alt="Forgot MPIN Illustration" className="max-w-md w-full" />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 ">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md ">


          <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1 ">
            {step === 2 ? "Verify OTP" : "Set New MPIN"}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {step === 2
              ? "Enter the OTP sent to your registered mobile number."
              : "Set a new MPIN to secure your account."}
          </p>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          </div>

          
          <form
            onSubmit={step === 3 ? handleSetMpin : (e) => e.preventDefault()}
            className=""
          >
          {step === 2 && (
  <>
    <div className="flex items-center">
      <label className="block text-gray-700 pr-2">Enter OTP :</label>
      <div className="flex space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type={showOtp ? "text" : "password"}
            maxLength="1"
            className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={digit}
            onChange={(e) => handleInputChange(e, index, "otp")}
            onKeyDown={(e) => handleBackspace(e, index, "otp")}
          />
        ))}
        <button
          type="button"
          className="ml-8 text-indigo-600 text-sm hover:underline"
          onClick={() => setShowOtp(!showOtp)}
        >
          {showOtp ? "Hide" : "Show"}
        </button>
      </div>
    </div>
    <div className="flex flex-col gap-y-4 items-center mt-6">
      <button
        type="submit"
        onClick={handleVerifyOtp}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
      >
        Verify OTP
      </button>
      
      <button
  onClick={resendOtp}
  disabled={resendTimer > 0} // Disable if resend timer > 0
  className={`${resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-indigo-600 hover:underline"}`}
>
  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
</button>



    </div>
  </>
)}

{step === 3 && (
  <>
    <div className="space-y-4">
      {/* New MPIN Input Fields */}
      <div className="">
        <label htmlFor="newMpin" className="block text-sm text-gray-600 mb-2">
          Enter New MPIN
        </label>
        <div className="flex justify-center space-x-2">
          {newMpin.map((digit, index) => (
            <input
              key={index}
              id={`newMpin-${index}`}
              type={showMpin ? "text" : "password"} // Toggle visibility
              maxLength="1"
              className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              value={digit}
              onChange={(e) => handleInputChange(e, index, "newMpin")}
              onKeyDown={(e) => handleBackspace(e, index, "newMpin")}
            />
          ))}
        </div>
      </div>

      {/* Confirm MPIN Input Fields */}
      <div>
        <label htmlFor="confirmMpin" className="block text-sm text-gray-600 mb-2">
          Confirm MPIN
        </label>
        <div className="flex justify-center space-x-2">
          {confirmMpin.map((digit, index) => (
            <input
              key={index}
              id={`confirmMpin-${index}`}
              type={showMpin ? "text" : "password"} // Toggle visibility
              maxLength="1"
              className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              value={digit}
              onChange={(e) => handleInputChange(e, index, "confirmMpin")}
              onKeyDown={(e) => handleBackspace(e, index, "confirmMpin")}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Show/Hide Button */}
    <div className="flex justify-end w-full">
    <button
      type="button"
      className="text-sm text-gray-600 underline mb-4"
      onClick={() => setShowMpin(!showMpin)} // Toggle visibility
    >
      {showMpin ? "Hide MPIN" : "Show MPIN"}
    </button>
    </div>
    {/* Submit Button */}
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
