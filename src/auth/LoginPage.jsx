import { useEffect, useState } from "react";
import { Phone, Lock, Eye, EyeSlash } from "phosphor-react";
import loginpageimage from "/LoginPageImage.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Bowser from "bowser";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";
import axios from "axios";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [tempToken, settempToken] = useState("");
  const [tempUserId, settempUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");

  // Field-level error states
  const [userTypeError, setUserTypeError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axios.post(
          "https://gateway.dhanushop.com/api/TypeMaster/list"
        );
        setUserTypes(response.data);
      } catch (err) {
        setError("Failed to fetch user types.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserTypes();
  }, []);

  const isPhoneValid =
    /^\d{10}$/.test(phoneNumber) && /^[6-9]/.test(phoneNumber);
  const isFormValid =
    isPhoneValid && password.length > 0 && selectedUserType && !error;
  const checkESignStatusAndRedirect = async (userId, token) => {
    console.log(userId, token);
    try {
      const response = await fetch(
        "https://gateway.dhanushop.com/api/esign/request",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: userId,
            // redirecturl: "/login"
          }),
        }
      );

      const result = await response.json();

      if (result?.signedUrl) {
        window.location.href = result.signedUrl; // Redirect to eSign URL
      } else {
        setError("Failed to retrieve eSign URL.");
      }
    } catch (error) {
      setError("Error checking eSign status.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setUserTypeError(false);
    setPhoneError(false);
    setPasswordError(false);
    setError("");

    const sanitizedPhoneNumber = DOMPurify.sanitize(phoneNumber.trim());
    const sanitizedPassword = DOMPurify.sanitize(password.trim());

    let hasError = false;

    if (!selectedUserType) {
      setUserTypeError(true);
      hasError = true;
    }

    if (!isPhoneValid) {
      setPhoneError(true);
      hasError = true;
    }

    if (!sanitizedPassword) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const ip = await fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => data.ip)
        .catch(() => "Unknown");

      const browser = Bowser.getParser(window.navigator.userAgent);
      const browserName = browser.getBrowserName();
      const os = browser.getOSName();
      const device = browser.getPlatformType();

      console.log(
        browserName,
        os,
        device,
        selectedUserType,
        sanitizedPhoneNumber,
        sanitizedPassword
      );
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
            UserTypeId: selectedUserType,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
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
        Cookies.set("AgentId", data.AgentId, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });

        // Check for eSignStatus and redirect if pending
        if (data?.IsMPINSet === "0") {
          navigate("/setup-mpin", {
            state: {
              UserId: data.UserId,
              loginid: data.loginid,
              message: "Please set your MPIN to continue.",
            },
          });
        } else if (data?.eSignStatus === "Pending") {
          await checkESignStatusAndRedirect(data.UserId, data.Token);
        } else {
          navigate("/otp", {
            state: {
              message: data.Message,
              userId: data.UserId,
              role: data.role,
            },
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
                    body: JSON.stringify({ UserId: tempUserId }),
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
                        role: seconddata.role,
                      },
                    });
                  }
                } else {
                  setError(
                    seconddata?.message || "Failed to proceed with login."
                  );
                }
              } catch (err) {
                setError("An error occurred while confirming login.");
              }
            }
          });
        }
      }
    } catch (err) {
      setError("Unable to connect to the server.");
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Welcome to
          </h2>
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">Dhanupay</h1>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* User Type */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">Login As:</label>
              <select
                name="userType"
                value={selectedUserType}
                onChange={(e) => {
                  setSelectedUserType(e.target.value);
                  setUserTypeError(false);
                }}
                className={`w-full p-2 border rounded outline-none ${
                  userTypeError ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Select a User Type
                </option>
                {userTypes
                  .filter((ut) => ut.UserTypeName.toLowerCase() !== "employee")
                  .map((ut) => (
                    <option key={ut.UserTypeID} value={ut.UserTypeID}>
                      {ut.UserTypeName}
                    </option>
                  ))}
              </select>
              {userTypeError && (
                <p className="text-red-500 text-sm">User type is required.</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="relative">
              <Phone
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Enter your 10-digit phone number"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${
                  phoneError ? "border-red-500" : "border-gray-300"
                }`}
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input) && input.length <= 10) {
                    setPhoneNumber(input);
                    setPhoneError(false);
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  setError("Pasting is not allowed.");
                }}
                onKeyDown={(e) => {
                  const invalidChars = ["e", "E", "+", "-", ".", " "];
                  if (invalidChars.includes(e.key)) e.preventDefault();
                }}
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">
                  Valid phone number is required.
                </p>
              )}
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
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                maxLength={32}
                onChange={(e) => {
                  const sanitizedInput = e.target.value.replace(
                    /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\-]/g,
                    ""
                  );
                  setPassword(sanitizedInput);
                  setPasswordError(false);
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
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required.
                </p>
              )}
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
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={() => navigate("/registerretailer")}
            className="w-full mt-10 text-indigo-600 hover:text-indigo-700 underline"
          >
            Register as Retailer
          </button>
        </div>
      </div>
    </div>
  );
}
