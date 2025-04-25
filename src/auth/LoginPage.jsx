import { useState, useEffect, useRef } from "react";
import { EnvelopeSimple, Lock, Eye, EyeSlash } from "phosphor-react";
import loginpageimage from "/LoginPageImage.png";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    const rememberedUser = localStorage.getItem("rememberedUsername");
    if (remembered && rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === "admin" && password === "password123") {
        // After successful login, set step to OTP
        setStep("otp");
      } else if (username === "user" && password === "user123") {
        setStep("otp");
      } else {
        setError("Incorrect username or password.");
      }
      setLoading(false);
    }, 1800);
  };

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
        // Set user token and remember settings in local storage
        localStorage.setItem("token", "fake-token-123");
        localStorage.setItem("user", JSON.stringify({ username }));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedUsername");
        }

        // Redirect user to the appropriate route after OTP verification
        if (username === "admin") {
          navigate("/admin"); // Redirect to /admin for admin users
        } else {
          navigate("/user"); // Redirect to /user for regular users
        }
      } else {
        setError("Invalid OTP.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Illustration */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img src={loginpageimage} alt="Login Illustration" className="max-w-md w-full" />
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome to</h2>
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">Dhanupay</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${
                    error && error.includes("username") ? "border-red-500" : "border-gray-300"
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${
                    error && error.includes("password") ? "border-red-500" : "border-gray-300"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-indigo-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
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
                <a href="/forgot-password" className="text-indigo-600 hover:underline">
                  Forgot Password?
                </a>
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

          {/* OTP Step */}
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

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
