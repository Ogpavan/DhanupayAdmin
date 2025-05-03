import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginpageimage from "/LoginPageImage.png"; // Replace with the appropriate image path

export default function ForgotMpin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Track the current step
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);

  const hardcodedPhoneNumber = "1234567890";
  const hardcodedOtp = "1234";

  // Handle resend OTP logic
  useState(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // const handleNextStep = async (e) => {
  //   e.preventDefault();
  //   if (step === 1) {
  //     // Validate Phone Number and OTP
  //     if (!phoneNumber || !otp) {
  //       setError("Please enter both phone number and OTP.");
  //       return;
  //     }

  //     setLoading(true);
  //     setError("");
  //     try {
  //       const response = await fetch("http://gateway.dhanushop.com/api/users/validate-otp", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ PhoneNumber: phoneNumber, OTP: otp }),
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         setStep(2); // Move to the next step
  //       } else {
  //         setError(data?.message || "Invalid OTP. Please try again.");
  //       }
  //     } catch (error) {
  //       setError("Something went wrong. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else if (step === 2) {
  //     // Validate and set new MPIN
  //     if (!newMpin || !confirmMpin) {
  //       setError("Please enter and confirm your new MPIN.");
  //       return;
  //     }

  //     if (newMpin !== confirmMpin) {
  //       setError("MPINs do not match. Please try again.");
  //       return;
  //     }

  //     setLoading(true);
  //     setError("");
  //     try {
  //       const response = await fetch("http://gateway.dhanushop.com/api/users/set-mpin", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ PhoneNumber: phoneNumber, NewMPIN: newMpin }),
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         alert("MPIN reset successfully!"); // Replace with navigation to login
  //         navigate("/login");
  //       } else {
  //         setError(data?.message || "Failed to reset MPIN. Please try again.");
  //       }
  //     } catch (error) {
  //       setError("Something went wrong. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

//////////////////////////////////////////////////////////////////

const handleNextStep = (e) => {
  e.preventDefault();
  if (step === 1) {
    // Validate Phone Number and OTP
    if (!phoneNumber || !otp) {
      setError("Please enter both phone number and OTP.");
      return;
    }

    if (phoneNumber !== hardcodedPhoneNumber || otp !== hardcodedOtp) {
      setError("Invalid phone number or OTP. Please try again.");
      return;
    }

    setError("");
    setStep(2); // Move to the next step
  } else if (step === 2) {
    // Validate and set new MPIN
    if (!newMpin || !confirmMpin) {
      setError("Please enter and confirm your new MPIN.");
      return;
    }

    if (newMpin !== confirmMpin) {
      setError("MPINs do not match. Please try again.");
      return;
    }

    alert("MPIN reset successfully!"); // Replace with navigation to login
    navigate("/login");
  }
};
  

///////////////////////////////////////////////////////////////////////////////
  const handleResendOtp = async () => {
    setResending(true);
    setError("");
    try {
      // Simulate an API call for resending OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setResendTimer(30);
      alert("OTP resent successfully!");
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
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
            {step === 1 ? "Validate OTP" : "Set New MPIN"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {step === 1
              ? "Enter your phone number and OTP to continue."
              : "Set your new MPIN to secure your account."}
          </p>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleNextStep} className="space-y-5">
            {step === 1 && (
              <>
                {/* Phone Number Input */}
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />

                {/* OTP Input */}
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                {/* Resend OTP */}
                <div className="flex justify-center text-sm text-gray-600">
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || resending}
                    className={`${
                      resendTimer > 0 || resending
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
                </div>
              </>
            )}

            {step === 2 && (
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
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
              disabled={loading}
            >
              {loading ? (step === 1 ? "Validating..." : "Setting MPIN...") : step === 1 ? "Next" : "Set MPIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
