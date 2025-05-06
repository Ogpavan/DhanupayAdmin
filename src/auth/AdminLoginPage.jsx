import { useState } from "react";
import { Phone, Lock, Eye, EyeSlash } from "phosphor-react";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Bowser from "bowser";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";

export default function AdminLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedPhoneNumber = DOMPurify.sanitize(phoneNumber.trim());
    const sanitizedPassword = DOMPurify.sanitize(password.trim());

    // Validate phone number
    if (!/^\d{10}$/.test(sanitizedPhoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!sanitizedPassword) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const ip = await fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => data.ip)
        .catch(() => "Unknown");

      const browser = Bowser.getParser(window.navigator.userAgent);
      const browserName = browser.getBrowserName();
      const os = browser.getOSName();
      const device = browser.getPlatformType();

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UserName: sanitizedPhoneNumber,
            Password: sanitizedPassword,
            IP: ip,
            OS: os,
            Browser: browserName,
            Device: device,
            UserType: "Admin", // Hardcoded as Admin
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok && data?.Token) {
          Cookies.set("token", data.Token, { secure: true, sameSite: "Strict", expires: 1 });
             Cookies.set("loginid", data.loginid, { secure: true, sameSite: "Strict", expires: 1 });
             Cookies.set("UserTypeName", data.UserTypeName, { secure: true, sameSite: "Strict", expires: 1 });
             Cookies.set("UserName", data.UserName, { secure: true, sameSite: "Strict", expires: 1 });
             Cookies.set("role", data.role, { secure: true, sameSite: "Strict", expires: 1 });
             Cookies.set("UserId", data.UserId, { secure: true, sameSite: "Strict", expires: 1 });

        if (data?.IsMPINSet === "0") {
          navigate("/setup-mpin", {
            state: { UserId: data.UserId, message: "Please set your MPIN to continue." },
          });
        } else {
          navigate("/otp", { state: { message: data.Message, userId: data.UserId } });
        }
      } else {
        setError(data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Unable to connect to the server. Please check your internet connection."
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Admin Login</h2>
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">Dhanupay</h1>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter your 10-digit phone number"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input) && input.length <= 10) {
                    setPhoneNumber(input);
                    setError("");
                  } else {
                    setError("Phone number must be a maximum of 10 digits.");
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  setError("Pasting is not allowed.");
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
  <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
    value={password}
    onChange={(e) => {
      const sanitizedInput = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\-]/g, "");
      if (sanitizedInput !== e.target.value) {
        setError("Password contains invalid characters.");
      } else {
        setError("");
      }
      setPassword(sanitizedInput);
    }}
    onKeyDown={(e) => {
      const invalidChars = ["'", "`", "~", "<", ">", "|", "\\"];
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
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
    tabIndex={-1}
  >
    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
  </button>
</div>
<div className="w-full flex justify-end">
<button
                type="button"
                onClick={() => navigate("/admin-forgot-password")}
                className="text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>
              </div>

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
