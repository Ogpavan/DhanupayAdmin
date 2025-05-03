import { useState, useEffect } from "react";
import { EnvelopeSimple, Lock, Eye, EyeSlash } from "phosphor-react";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Bowser from "bowser";
import Cookies from "js-cookie"; // Import js-cookie library
import DOMPurify from "dompurify"; // Import DOMPurify for input sanitization

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Effect to remember username when "Remember Me" is checked
  useEffect(() => {
    const rememberedUser = Cookies.get("rememberedUsername");
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Sanitize inputs to prevent malicious code
    const sanitizedUsername = DOMPurify.sanitize(username.trim());
    const sanitizedPassword = DOMPurify.sanitize(password.trim());

    if (!sanitizedUsername || !sanitizedPassword) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Fetch IP and browser details
      const ip = await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => data.ip);

      const browser = Bowser.getParser(window.navigator.userAgent);
      const browserName = browser.getBrowserName();
      const device = navigator.platform;
      const os = navigator.platform;

      // Send login request to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: sanitizedUsername,
          Password: sanitizedPassword,
          IP: ip,
          OS: os,
          Browser: browserName,
          Device: device,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data?.Token) {
        // Store token and user information in cookies
        Cookies.set("token", data.Token, { 
          secure: true, 
          sameSite: "Strict", 
          expires: 1, // 1 day
        });
        Cookies.set("userId", data.UserId, { secure: true, sameSite: "Strict", expires: 1 });
        Cookies.set("userTypeName", data.UserTypeName, { secure: true, sameSite: "Strict", expires: 1 });
        Cookies.set("loginid", data.loginid , { secure: true, sameSite: "Strict", expires: 1 });

        // Store the username for "Remember Me" functionality
        if (rememberMe) {
          Cookies.set("rememberedUsername", sanitizedUsername, { expires: 7 }); // Expires in 7 days
        } else {
          Cookies.remove("rememberedUsername");
        }

        // Navigate to OTP page with message and userId
        navigate("/otp", { state: { message: data.Message, userId: data.UserId } });
      } else {
        setError(data?.message || "Invalid username or password.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Display the "Forgot Password" popup
  const showForgotPasswordPopup = () => {
    Swal.fire({
      title: "Forgot Password?",
      text: "Please contact our support team at +1 800-123-4567 for assistance.",
      icon: "info",
      confirmButtonText: "Close",
      confirmButtonColor: "#3085d6",
    });
  };

  // Prevent paste in password input field
  const handlePasswordPaste = (e) => {
    e.preventDefault(); // Prevent paste action
    setError("Pasting is not allowed in the password field.");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Illustration Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img
          src={loginpageimage}
          alt="Login Illustration"
          className="max-w-md w-full"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Welcome to
          </h2>
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">Dhanupay</h1>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

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
                  error && error.includes("username") ? "border-red-500" : "border-gray-300"
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${
                  error && error.includes("password") ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPaste={handlePasswordPaste} // Disables pasting
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
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
              <button
                type="button"
                onClick={showForgotPasswordPopup}
                className="text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>
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
        </div>
      </div>
    </div>
  );
}
