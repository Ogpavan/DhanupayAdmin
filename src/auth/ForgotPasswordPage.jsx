import { useState, useRef } from "react";
import { EnvelopeSimple, Lock, Eye, EyeSlash } from "phosphor-react";
import swal from 'sweetalert2';

// Dummy OTP value
const dummyOTP = "123456";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // OTP as an array of 6 input values
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for New Password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for Confirm Password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = Enter Email, Step 2 = OTP, Step 3 = Reset Password
  const [resendCount, setResendCount] = useState(0); // To track OTP resend attempts



  //password 

  // At the top, below useState imports
const passwordRules = {
    length: (pwd) => pwd.length >= 8,
    uppercase: (pwd) => /[A-Z]/.test(pwd),
    lowercase: (pwd) => /[a-z]/.test(pwd),
    number: (pwd) => /[0-9]/.test(pwd),
    specialChar: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  };
  
  const validatePasswordStrength = (pwd) => {
    return {
      length: passwordRules.length(pwd),
      uppercase: passwordRules.uppercase(pwd),
      lowercase: passwordRules.lowercase(pwd),
      number: passwordRules.number(pwd),
      specialChar: passwordRules.specialChar(pwd),
    };
  };
  
  // Create refs for OTP inputs
  const otpRefs = useRef([]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      // Simulate OTP sending
      console.log(`OTP sent to ${email}`);
      setStep(2); // Move to OTP step
      setLoading(false);
    }, 800);
  };

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    // Move focus to next input if filled, or previous if backspace is pressed
    if (e.target.value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    } else if (e.target.value === "" && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (otp.join("") !== dummyOTP) {
      setError("Incorrect OTP.");
      return;
    }

    setStep(3); // Move to Reset Password step
    setError("");
  };
  const handlePasswordReset = (e) => {
    e.preventDefault();
  
    const strength = validatePasswordStrength(newPassword);
  
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
  
    if (Object.values(strength).includes(false)) {
      setError("Password does not meet all requirements.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    console.log("Password reset successfully for:", email);
    swal.fire({
      title: "Success",
      text: "Password reset successfully",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "/login";
    });
  };
  

  const handleResendOtp = () => {
    setResendCount(resendCount + 1);
    setError("");
    // Simulate OTP resend
    console.log(`OTP resent to ${email}`);
  };
  //popup on password success reset
   

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Illustration */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img
          src="/LoginPageImage.png" // Replace with actual path
          alt="Forgot Password Illustration"
          className="max-w-md w-full"
        />
      </div>

      {/* Right: Forgot Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Forgot your password?
          </h2>
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">Dhanupay</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter your email or phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div>
              <div className="text-center text-gray-600 mb-4">
                <p>An OTP has been sent to both your email and phone number.</p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="flex space-x-3 justify-center">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={value}
                      onChange={(e) => handleOtpChange(e, index)}
                      autoFocus={index === 0}
                      ref={(el) => (otpRefs.current[index] = el)} // Assign ref dynamically
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                >
                  Verify OTP
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={handleResendOtp}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  disabled={resendCount >= 3}
                >
                  {resendCount < 3 ? "Resend OTP" : "OTP Resend Limit Reached"}
                </button>
                {resendCount > 0 && resendCount < 3 && (
                  <p className="text-sm text-gray-500">Attempt {resendCount} of 3</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Create New Password</h3>
              </div>

              <div className="relative">
                <Lock className="absolute left-3  top-2.5 text-gray-400" size={20} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-indigo-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password strength info */}



              <div className="relative">
                <Lock className="absolute left-3  top-2.5 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-indigo-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-sm mt-2 ml-4 text-gray-600 space-y-1">
  {Object.entries(validatePasswordStrength(newPassword)).map(([key, valid]) => (
    <div key={key} className={`flex items-center gap-2 ${valid ? 'text-green-600' : 'text-red-500'}`}>
      <span>•</span>
      {key === "length" && "At least 8 characters"}
      {key === "uppercase" && "At least 1 uppercase letter"}
      {key === "lowercase" && "At least 1 lowercase letter"}
      {key === "number" && "At least 1 number"}
      {key === "specialChar" && "At least 1 special character (!@#$...)"}
    </div>
  ))}
</div>

              <button
                // type="submit"
                onClick={handlePasswordReset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
