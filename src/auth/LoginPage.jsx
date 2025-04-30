import { useState, useEffect, useRef } from "react";
import { EnvelopeSimple, Lock } from "phosphor-react";
import loginpageimage from "/LoginPageImage.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "phosphor-react";

export default function LoginPage() {
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mpin, setMpin] = useState("");
  const [showMpin, setShowMpin] = useState(false);

  const [showNewMpin, setShowNewMpin] = useState(false);
  const [showConfirmMpin, setShowConfirmMpin] = useState(false);

  const [smsOtp, setSmsOtp] = useState(Array(3).fill(""));
  const [emailOtp, setEmailOtp] = useState(Array(3).fill(""));
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const smsOtpRefs = useRef([]);
  const emailOtpRefs = useRef([]);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "otp") {
      setResendTimer(30);
      setCanResend(false);
    }
  }, [step]);

  useEffect(() => {
    if (!canResend && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    const rememberedUser = localStorage.getItem("rememberedUsername");
    if (remembered && rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   if (!username) {
  //     setError("Please enter your username.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await fetch("http://gateway.dhanushop.com/api/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ username }),
  //     });

  //     const data = await response.json();

  //     if (response.ok && data?.Token) {
  //       localStorage.setItem("token", data.Token);
  //       localStorage.setItem("userId", data.UserId);
  //       localStorage.setItem("username", username);

  //       if (username === "admin@DhanuPay.com") {
  //         localStorage.setItem("userType", "admin");
  //       }

  //       if (rememberMe) {
  //         localStorage.setItem("rememberMe", "true");
  //         localStorage.setItem("rememberedUsername", username);
  //       } else {
  //         localStorage.removeItem("rememberMe");
  //         localStorage.removeItem("rememberedUsername");
  //       }

  //       setStep("otp");
  //     } else {
  //       setError("Invalid username.");
  //     }
  //   } catch (error) {
  //     setError("Something went wrong. Please try again.");
  //     console.error("Login error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles the login form submission.
   * @param {Event} e The form submission event.
   * @returns {Promise<void>}
   * @throws {Error} If there is an error with the login request.
   */
  /*******  53f58be3-d17b-48f9-a0c4-7f6383ddb29c  *******/
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !mpin) {
      setError("Please enter both username and MPIN.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Validation
      if (!username || mpin.length !== 6) {
        setError("Please enter a valid 6-digit MPIN.");
        return;
      }
    
      // Temporary hardcoded login
      if (username === "admin@DhanuPay.com" && mpin === "123456") {
        localStorage.setItem("token", "fake-token-123");
        localStorage.setItem("userId", "1");
        localStorage.setItem("username", username);
        localStorage.setItem("userType", "admin");
      } else if (username === "user@DhanuPay.com" && mpin === "123456") {
        localStorage.setItem("token", "fake-token-123");
        localStorage.setItem("userId", "2");
        localStorage.setItem("username", username);
        localStorage.setItem("userType", "user");
      } else {
        setError("Invalid username or MPIN.");
        return;
      }
    
      // Remember me
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedUsername");
      }
    
      setStep("otp");
    } 
     catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles change in one of the OTP input boxes.
   * Ensures input is a number, updates the OTP state, and focuses the next input box if the current one has a value.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the OTP input box.
   */
  /*******  3bbe5676-6348-47c9-ae27-64b058c210a9  *******/
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
    setResendTimer(30);
    setCanResend(false);
    // Add resend OTP API call here if needed
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();

    if (otp.join("").length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      if (otp.join("") === "123456") {
        const userType = localStorage.getItem("userType");

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedUsername");
        }

        if (userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setError("Invalid OTP.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img
          src={loginpageimage}
          alt="Login Illustration"
          className="max-w-md w-full"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Welcome to
          </h2>
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">Dhanupay</h1>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div className="relative">
                <EnvelopeSimple
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${
                    error && error.includes("username")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* MPIN */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showMpin ? "text" : "password"}
                  placeholder="Enter 6-digit MPIN"
                  className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${
                    error && error.includes("MPIN")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={mpin}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="\d{6}"
                  onPaste={(e) => e.preventDefault()}
                  onChange={(e) => setMpin(e.target.value.replace(/\D/g, ""))}
                />
                <button
                  type="button"
                  onClick={() => setShowMpin(!showMpin)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showMpin ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </label>
                <div
                  className="text-right text-sm text-indigo-600 cursor-pointer hover:underline"
                  onClick={() => setStep("forgot-otp")}
                >
                  Forgot MPIN?
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div className="text-center text-gray-600 text-sm mb-4">
                Please enter the 6-digit OTP sent to your registered mobile.
              </div>

              <div className="flex justify-between gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    className="w-12 h-12 text-center border rounded-md text-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  Didn’t receive OTP?{" "}
                  <button
                    type="button"
                    className={`text-indigo-600 font-medium hover:underline disabled:opacity-50`}
                    onClick={handleResendOtp}
                    disabled={!canResend}
                  >
                    {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
                  </button>
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === "forgot-otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  smsOtp.join("").length !== 3 ||
                  emailOtp.join("").length !== 3
                ) {
                  setError(
                    "Please enter all 6 digits (3 from SMS & 3 from Email)."
                  );
                  return;
                }

                if (smsOtp.join("") === "111" && emailOtp.join("") === "222") {
                  setStep("set-mpin");
                  setError("");
                } else {
                  setError("Invalid OTPs. Please check and try again.");
                }
              }}
              className="space-y-5"
            >
              <div className="text-center text-gray-600 text-sm mb-2">
                Enter the OTP sent to your mobile and email
              </div>

              <div className="flex justify-evenly gap-2">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div>Enter SMS OTP </div>
                  <div className="flex gap-2">
                    {" "}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <input
                        key={`sms-${i}`}
                        type="text"
                        maxLength="1"
                        inputMode="numeric"
                        className="w-12 h-12 text-center border rounded-md text-lg"
                        value={smsOtp[i]}
                        onChange={(e) => {
                          const newOtp = [...smsOtp];
                          newOtp[i] = e.target.value.replace(/\D/, "");
                          setSmsOtp(newOtp);
                          if (e.target.value && i < 2)
                            smsOtpRefs.current[i + 1]?.focus();
                        }}
                        ref={(el) => (smsOtpRefs.current[i] = el)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div>Enter email OTP </div>
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <input
                        key={`email-${i}`}
                        type="text"
                        maxLength="1"
                        inputMode="numeric"
                        className="w-12 h-12 text-center border rounded-md text-lg"
                        value={emailOtp[i]}
                        onChange={(e) => {
                          const newOtp = [...emailOtp];
                          newOtp[i] = e.target.value.replace(/\D/, "");
                          setEmailOtp(newOtp);
                          if (e.target.value && i < 2)
                            emailOtpRefs.current[i + 1]?.focus();
                        }}
                        ref={(el) => (emailOtpRefs.current[i] = el)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md"
              >
                Verify OTPs
              </button>
            </form>
          )}

          {step === "set-mpin" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newMpin.length !== 6 || confirmMpin.length !== 6) {
                  setError("MPIN must be 6 digits.");
                  return;
                }
                if (newMpin !== confirmMpin) {
                  setError("MPINs do not match.");
                  return;
                }

                // Simulate MPIN save
                setError("");
                alert("MPIN changed successfully!");
                setStep("login");
              }}
              className="space-y-5"
            >
              <div className="text-center text-gray-600 text-sm mb-2">
                Set your new 6-digit MPIN
              </div>

              {/* New MPIN Field */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showNewMpin ? "text" : "password"}
                  placeholder="Setup New MPIN"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newMpin}
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(e) =>
                    setNewMpin(e.target.value.replace(/\D/g, ""))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNewMpin(!showNewMpin)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showNewMpin ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>
              </div>

              {/* Confirm MPIN Field */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmMpin ? "text" : "password"}
                  placeholder="Confirm MPIN"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={confirmMpin}
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(e) =>
                    setConfirmMpin(e.target.value.replace(/\D/g, ""))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmMpin(!showConfirmMpin)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmMpin ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md"
              >
                Save MPIN
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
