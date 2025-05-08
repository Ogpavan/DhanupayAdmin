import { useState, useRef, useEffect } from "react";
import { Lock, Eye, EyeSlash, Phone } from "phosphor-react";
import swal from "sweetalert2";
import Cookies from "js-cookie";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userType, setUserType] = useState(""); // New state for user type

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(30); // Timer for resend OTP
  const [resending, setResending] = useState(false);

  const [otpId, setOtpId] = useState("");
  const [token, setToken] = useState("");
  const [userid, setUserid] = useState("");

  const otpRefs = useRef([]);

  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/ForgetPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Username: phone, UserType: userType }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOtpId(data.otpid); // Save otpid
        setToken(data.token); // Save token
        setUserid(data.userid); // Save userid
        swal.fire({
          title: "Success",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setStep(2); // Proceed to OTP input step
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (!enteredOtp || enteredOtp.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/OTPValidator`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Use the token received from the ForgetPassword API
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: userid, // Use the userid received from the ForgetPassword API
            LoginId: otpId, // Use the otpid received from the ForgetPassword API
            OTP: enteredOtp, // Use the entered OTP
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        swal
          .fire({
            title: "Success",
            text: data.message,
            icon: "success",
            confirmButtonText: "OK",
          })
          .then(() => setStep(3)); // Proceed to the next step
      } else {
        setError(data.message || "OTP verification failed.");
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
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

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/set-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: userid,
            LoginId: otpId,
            Password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        swal
          .fire({
            title: "Success",
            text: "Password reset successfully.",
            icon: "success",
            confirmButtonText: "OK",
          })
          .then(() => {
            window.location.href = "/login";
          });
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending || resendTimer > 0) return;

    setResending(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/OTP_Resend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userid, LoginId: otpId }),
        }
      );

      const data = await response.json();

      if (response.ok && data?.success) {
        setResendTimer(30);
        alert(data.message || "OTP resent successfully!");
      } else {
        setError(data?.message || "Failed to resend OTP. Please try again.");
      }
    } catch {
      setError(
        "Failed to resend OTP. Please check your connection and try again."
      );
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    } else if (e.target.value === "" && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const validatePasswordStrength = (password) => {
    return {
      length: password.length >= 8, // At least 8 characters
      uppercase: /[A-Z]/.test(password), // At least 1 uppercase letter
      lowercase: /[a-z]/.test(password), // At least 1 lowercase letter
      number: /[0-9]/.test(password), // At least 1 number
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password), // At least 1 special character
    };
  };

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

          {error ? (
            <div className="text-red-500 text-sm mb-4 text-center error-message">
              {error}
            </div>
          ) : (
            <div className="h-5 mb-4"></div>
          )}

          {step === 1 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div>
                <p className="text-gray-600 mb-2">Select your user type:</p>
                <div className="space-y-2">
                  {["Distributor", "Retailer", "Super Distributor"].map(
                    (type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={type}
                          checked={userType === type}
                          onChange={() => setUserType(type)}
                          className="text-indigo-600 focus:ring-0"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Enter your 10-digit phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={phone}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d*$/.test(input)) {
                      setPhone(input);

                      if (input.length === 10) {
                        setError(""); // Clear error
                      } else if (input.length < 10 && input.length > 0) {
                        setError("Phone number must be at least 10 digits.");
                      } else {
                        setError(""); // Clear error for empty input
                      }
                    } else {
                      setError("Only numeric characters are allowed.");
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    setError("Pasting is not allowed.");
                  }}
                  onKeyDown={(e) => {
                    const invalidChars = ["e", "E", "+", "-", ".", " "];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
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
                <p>Please enter the OTP sent to registered number.</p>
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
                      onKeyDown={(e) => {
                        if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
                          e.preventDefault(); // Prevent non-numeric input
                        }
                      }}
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
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Create New Password
                </h3>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3  top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder=" New Password"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPassword}
                  maxLength={50}
                  onChange={(e) => {
                    const sanitizedInput = e.target.value.replace(
                      /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|]/g,
                      ""
                    );
                    if (sanitizedInput !== e.target.value) {
                      setError("Password contains invalid characters.");
                    } else {
                      setError("");
                    }
                    setNewPassword(sanitizedInput);
                  }}
                  onKeyDown={(e) => {
                    const invalidChars = [
                      "'",
                      "`",
                      "~",
                      "\\",
                      "<",
                      ">",
                      "|",
                      "&",
                      ".",
                      "/",
                    ];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault(); // Block invalid character
                      setError(`The character ${e.key} is not allowed.`);
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    setError("Pasting is not allowed in the password field.");
                  }}
                />

                {/* <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                /> */}
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-indigo-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3  top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=" Confirm Password"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={confirmPassword}
                  maxLength={50}

                  onChange={(e) => {
                    const sanitizedInput = e.target.value.replace(
                      /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|]/g,
                      ""
                    );
                    if (sanitizedInput !== e.target.value) {
                      setError("Password contains invalid characters.");
                    } else {
                      setError("");
                    }
                    setConfirmPassword(sanitizedInput);
                  }}
                  onKeyDown={(e) => {
                    const invalidChars = [
                      "'",
                      "`",
                      "~",
                      "\\",
                      "<",
                      ">",
                      "|",
                      "&",
                      ".",
                      "/",
                    ];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault(); // Block invalid character
                      setError(`The character ${e.key} is not allowed.`);
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    setError("Pasting is not allowed in the password field.");
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-indigo-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlash size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <div className="text-sm mt-2 ml-4 text-gray-600 space-y-1">
                {Object.entries(validatePasswordStrength(newPassword)).map(
                  ([key, valid]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 ${
                        valid ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <span>•</span>
                      {key === "length" && "At least 8 characters"}
                      {key === "uppercase" && "At least 1 uppercase letter"}
                      {key === "lowercase" && "At least 1 lowercase letter"}
                      {key === "number" && "At least 1 number"}
                      {key === "specialChar" && "At least 1 special character"}
                    </div>
                  )
                )}
              </div>

              <button
                type="submit"
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
