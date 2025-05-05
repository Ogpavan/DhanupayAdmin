import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path

export default function SetupMpinPage() {
  const [step, setStep] = useState(1); // Step 1: OTP, Step 2: MPIN
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const UserId = location.state?.UserId || Cookies.get("UserId");
  const loginid = Cookies.get("loginid");

  // Handle OTP submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
  
    if (otp.length !== 4 || isNaN(otp)) {
      setError("OTP must be a 4-digit number.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      // Get token and other required details from cookies
      const token = Cookies.get("token");
      // const loginid = Cookies.get("loginid");
  
      const response = await fetch("https://gateway.dhanushop.com/api/users/OTPValidator", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: UserId,
          LoginId: loginid,
          OTP: otp,
        }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok && data.success) {
        Swal.fire({
          title: "OTP Verified",
          text: "OTP verified successfully. You can now set up your MPIN.",
          icon: "success",
        });
        setStep(2); // Proceed to MPIN setup
      } else {
        setError(data?.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // Handle MPIN submission
  const handleMpinSubmit = async (e) => {
    e.preventDefault();
  
    if (mpin.length !== 4 || isNaN(mpin)) {
      setError("MPIN must be a 4-digit number.");
      return;
    }
  
    if (mpin !== confirmMpin) {
      setError("MPIN and confirmation MPIN do not match.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      // Get token from cookies
      const token = Cookies.get("token");
  
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        Swal.fire({
          title: "Error",
          text: "Authentication token is missing. Please log in again.",
          icon: "error",
        });
        navigate("/login");
        return;
      }
  
      const response = await fetch("https://gateway.dhanushop.com/api/users/set-mpin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserId: UserId,LoginId: loginid, MPin: mpin }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok && data.success) {
        Swal.fire({
          title: "Success!",
          text: "Your MPIN has been set up successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/"); // Redirect to home or login
        });
      } else {
        setError(data?.message || "Failed to set up MPIN. Please try again.");
      }
    } catch (error) {
      console.error(error);
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
          alt="Setup MPIN Illustration"
          className="max-w-md w-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
            {step === 1 ? "Verify OTP" : "Setup MPIN"}
          </h1>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleMpinSubmit} className="space-y-5">
              <div>
                <input
                  type="password"
                  placeholder="Enter 4-digit MPIN"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm MPIN"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={confirmMpin}
                  onChange={(e) => setConfirmMpin(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                disabled={loading}
              >
                {loading ? "Setting MPIN..." : "Setup MPIN"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
