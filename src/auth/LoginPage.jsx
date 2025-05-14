import { useState } from "react";
import { Phone, Lock, Eye, EyeSlash } from "phosphor-react";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Bowser from "bowser";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [tempToken, settempToken] = useState("");
  const [tempUserId, settempUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("Admin");

  const navigate = useNavigate();

  const isPhoneValid = /^\d{10}$/.test(phoneNumber) && /^[6-9]/.test(phoneNumber);
  const isFormValid = isPhoneValid && password.length > 0 && !error;

  const handleLogin = async (e) => {
    e.preventDefault();

    const sanitizedPhoneNumber = DOMPurify.sanitize(phoneNumber.trim());
    const sanitizedPassword = DOMPurify.sanitize(password.trim());

    if (!/^\d{10}$/.test(sanitizedPhoneNumber) || !/^[6-9]/.test(sanitizedPhoneNumber)) {
      setError("Please enter a valid 10-digit Indian phone number.");
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
            UserType: userType,
          }),
        }
      );

      const data = await response.json();
      settempToken(data.Token);
      settempUserId(data.UserId);

      if (response.ok && data?.Token) {
        Cookies.set("token", data.Token, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });
        Cookies.set("loginid", data.loginid, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });
        Cookies.set("UserTypeName", data.UserTypeName, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });
        Cookies.set("UserName", data.UserName, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });
        Cookies.set("role", data.role, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });
        Cookies.set("UserId", data.UserId, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });

        if (data?.IsMPINSet === "0") {
          navigate("/setup-mpin", {
            state: {
              UserId: data.UserId,
              loginid: data.loginid,
              message: "Please set your MPIN to continue.",
            },
          });
        } else {
          navigate("/otp", {
            state: { message: data.Message, userId: data.UserId },
          });
        }
      } else {
        setError(data?.message || "Invalid credentials. Please try again.");
        if (data?.message === "User already logged in on another device.") {
          Swal.fire({
            icon: "warning",
            title: "User Already Logged In",
            text: "This user is already logged in on another device. Do you want to proceed and log in anyway?",
            showCancelButton: true,
            confirmButtonText: "Yes, Proceed",
            cancelButtonText: "No, Cancel",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const res = await fetch(
                  `${import.meta.env.VITE_BACKEND_URL}/api/users/ConfirmLogin`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${data.Token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      UserId: tempUserId,
                    }),
                  }
                );

                const seconddata = await res.json();
                if (res.ok && seconddata?.Token) {
                  Cookies.set("token", seconddata.Token, {
                    secure: true,
                    sameSite: "Strict",
                    expires: 1,
                  });
                  Cookies.set("loginid", seconddata.loginid, {
                    secure: true,
                    sameSite: "Strict",
                    expires: 1,
                  });
                  Cookies.set("UserTypeName", seconddata.UserTypeName, {
                    secure: true,
                    sameSite: "Strict",
                    expires: 1,
                  });
                  Cookies.set("UserName", seconddata.UserName, {
                    secure: true,
                    sameSite: "Strict",
                    expires: 1,
                  });
                  Cookies.set("role", seconddata.role, {
                    secure: true,
                    sameSite: "Strict",
                    expires: 1,
                  });
                  Cookies.set("UserId", seconddata.UserId, {
                    secure: true,
                    sameSite: "Strict",
                    expires: 1,
                  });

                  if (seconddata?.IsMPINSet === "0") {
                    navigate("/setup-mpin", {
                      state: {
                        UserId: seconddata.UserId,
                        loginid: seconddata.loginid,
                        message: "Please set your MPIN to continue.",
                      },
                    });
                  } else {
                    navigate("/otp", {
                      state: {
                        message: seconddata.Message,
                        userId: seconddata.UserId,
                      },
                    });
                  }
                } else {
                  setError(seconddata?.message || "Failed to proceed with login.");
                }
              } catch (err) {
                setError("An error occurred while confirming login.");
              }
            }
          });
        }
      }
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Unable to connect to the server."
          : "An unexpected error occurred."
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome to</h2>
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">Dhanupay</h1>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">Login As:</label>
              <div className="flex justify-between text-sm">
                {["Super Distributor", "Distributor", "Retailer"].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={userType === type}
                      onChange={() => setUserType(type)}
                      className="accent-indigo-600"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter your 10-digit phone number"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value;

                  if (/^\d*$/.test(input) && input.length <= 10) {
                    setPhoneNumber(input);

                    if (input.length === 10 && !/^[6-9]/.test(input)) {
                      setError("Please enter  valid Indian phone number.");
                    } else {
                      setError("");
                    }
                  } else if (!/^\d*$/.test(input)) {
                    setError("Only numeric characters are allowed.");
                  } else {
                    setError("Phone number must be a maximum of 10 digits.");
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

            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                value={password}
                maxLength={32}
                onChange={(e) => {
                  const sanitizedInput = e.target.value.replace(
                    /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\-]/g,
                    ""
                  );
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
                    e.preventDefault();
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
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
              disabled={loading || !isFormValid}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          
          </form>
            <button
            onClick={() => navigate("/registerretailer")}
               className="w-full  mt-10  text-indigo-600 hover:text-indigo-700  underline"
               
            >
              Register as Retailer
            </button> 
        </div>
      </div>
    </div>
  );
}
