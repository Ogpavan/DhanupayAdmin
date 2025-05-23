// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Swal from "sweetalert2";
// import Cookies from "js-cookie";
// import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path

// export default function SetupMpinPage() {
//   const [step, setStep] = useState(1); // Step 1: OTP, Step 2: MPIN
//   const [otp, setOtp] = useState("");
//   const [mpin, setMpin] = useState("");
//   const [confirmMpin, setConfirmMpin] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [resending, setResending] = useState(false);
//   const [resendTimer, setResendTimer] = useState(30);


//   const UserId = location.state?.UserId || Cookies.get("UserId");
//   const loginid = Cookies.get("loginid");
//   const userType = Cookies.get("UserTypeName");


//   useEffect(() => {
//     let timer = null;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);


//   // Handle OTP submission
//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();

//     if (otp.length !== 4 || isNaN(otp)) {
//       setError("OTP must be a 4-digit number.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Get token and other required details from cookies
//       const token = Cookies.get("token");
//       // const loginid = Cookies.get("loginid");

//       const response = await fetch("https://gateway.dhanushop.com/api/users/OTPValidator", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           UserId: UserId,
//           LoginId: loginid,
//           OTP: otp,
//         }),
//       });

//       const data = await response.json();
//       console.log(data);

//       if (response.ok && data.success) {
//         Swal.fire({
//           title: "OTP Verified",
//           text: "OTP verified successfully. You can now set up your MPIN.",
//           icon: "success",
//         });
//         setStep(2); // Proceed to MPIN setup
//       } else {
//         setError(data?.message || "Invalid OTP. Please try again.");
//       }
//     } catch (error) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };



//   const handleResendOtp = async () => {
//     if (resending || resendTimer > 0) return;

//     setResending(true);
//     setError("");

//     try {
//       const response = await fetch(`${BASE_URL}/api/users/OTP_Resend`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ UserId: UserId, LoginId: loginid }),
//       });

//       const data = await response.json();

//       if (response.ok && data?.success) {
//         setResendTimer(30);
//         Swal.fire({
//           icon: "success",
//           title: "OTP Sent",
//           text: "A new OTP has been sent to your registered contact.",
//           timer: 3000,
//           showConfirmButton: false,
//         });
//       } else {
//         setError(data?.message || "Failed to resend OTP. Please try again.");
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: data?.message || "Failed to resend OTP. Please try again.",
//         });
//       }
//     } catch {
//       const errorMsg =
//         "Failed to resend OTP. Please check your connection and try again.";
//       setError(errorMsg);
//       Swal.fire({
//         icon: "error",
//         title: "Network Error",
//         text: errorMsg,
//       });
//     } finally {
//       setResending(false);
//     }
//   };



//   // Handle MPIN submission
//   const handleMpinSubmit = async (e) => {
//     e.preventDefault();

//     if (mpin.length !== 4 || isNaN(mpin)) {
//       setError("MPIN must be a 4-digit number.");
//       return;
//     }

//     if (mpin !== confirmMpin) {
//       setError("MPIN and confirmation MPIN do not match.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Get token from cookies
//       const token = Cookies.get("token");

//       if (!token) {
//         setError("Authentication token is missing. Please log in again.");
//         Swal.fire({
//           title: "Error",
//           text: "Authentication token is missing. Please log in again.",
//           icon: "error",
//         });
//         navigate("/login");
//         return;
//       }

//       const response = await fetch("https://gateway.dhanushop.com/api/users/set-mpin", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ UserId: UserId, LoginId: loginid, MPin: mpin }),
//       });

//       const data = await response.json();
//       console.log(data);

//       if (response.ok && data.success) {
//         Swal.fire({
//           title: "Success!",
//           text: "Your MPIN has been set up successfully.",
//           icon: "success",
//           confirmButtonText: "OK",
//         }).then(() => {
//           if (userType === "Employee") {
//             navigate("/administrator");
//           } else {
//             navigate("/login");
//           }
//           // Redirect to home or login
//         });
//       } else {
//         setError(data?.message || "Failed to set up MPIN. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Illustration Section */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
//         <img
//           src={loginpageimage}
//           alt="Setup MPIN Illustration"
//           className="max-w-md w-full"
//         />
//       </div>

//       {/* Form Section */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-8">
//         <div className="bg-white rounded-2xl p-8 w-full max-w-md">
//           <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">
//             {step === 1 ? "Verify OTP" : "Setup MPIN"}
//           </h1>

//           {error && (
//             <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
//           )}

//           {step === 1 && (
//             <form onSubmit={handleOtpSubmit} className="space-y-5">
//               <input
//                 type="text"
//                 placeholder="Enter 4-digit OTP"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />


//               <button
//                 type="submit"
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
//                 disabled={loading}
//               >
//                 {loading ? "Verifying OTP..." : "Verify OTP"}
//               </button>

//               <div className="flex justify-center mt-4">
//                 <button
//                   onClick={handleResendOtp}
//                   disabled={resending || resendTimer > 0}
//                   className={`${resending || resendTimer > 0
//                     ? "text-gray-400 cursor-not-allowed test-center"
//                     : "text-indigo-600 hover:underline text-center"
//                     }`}
//                 >
//                   {resending
//                     ? "Resending..."
//                     : resendTimer > 0
//                       ? `Resend OTP in ${resendTimer}s`
//                       : "Resend OTP"}
//                 </button>
//               </div>
//             </form>
//           )}

//           {step === 2 && (
//             <form onSubmit={handleMpinSubmit} className="space-y-5">
//               <div>
//                 <input
//                   type="password"
//                   placeholder="Enter 4-digit MPIN"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none mb-2"
//                   value={mpin}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (/^\d{0,4}$/.test(value)) { // Allow only 4-digit numbers
//                       setMpin(value);
//                     }
//                   }}
//                 />

//                 <input
//                   type="password"
//                   placeholder="Confirm MPIN"
//                   className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
//                   value={confirmMpin}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     if (/^\d{0,4}$/.test(value)) { // Allow only 4-digit numbers
//                       setConfirmMpin(value);
//                     }
//                   }}
//                 />

//               </div>




//               <button
//                 type="submit"
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
//                 disabled={loading}
//               >
//                 {loading ? "Setting MPIN..." : "Setup MPIN"}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path

export default function SetupMpinPage() {
  const [step, setStep] = useState(1); // Step 1: OTP, Step 2: MPIN
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [confirmMpin, setConfirmMpin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpVisible, setOtpVisible] = useState(false);
  const [mpinVisible, setMpinVisible] = useState(false);
  const [confirmMpinVisible, setConfirmMpinVisible] = useState(false);

  const BASE_URL = "https://gateway.dhanushop.com";
  const UserId = location.state?.UserId || Cookies.get("UserId");
  const loginid = Cookies.get("loginid");
  const userType = Cookies.get("UserTypeName");
  const token = Cookies.get("token");

  useEffect(() => {
    let timer = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle input change for OTP, MPIN, and Confirm MPIN
  const handleInputChange = (e, index, type) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Accept only digits
    if (!value) return;

    let targetArray;
    if (type === "otp") {
      targetArray = [...otp];
      targetArray[index] = value;
      setOtp(targetArray);
    } else if (type === "mpin") {
      targetArray = [...mpin];
      targetArray[index] = value;
      setMpin(targetArray);
    } else if (type === "confirmMpin") {
      targetArray = [...confirmMpin];
      targetArray[index] = value;
      setConfirmMpin(targetArray);
    }

    // Move to next input if not last
    const nextInput = document.getElementById(`${type}-${index + 1}`);
    if (value && nextInput) {
      nextInput.focus();
    }
  };

  const handleBackspace = (e, index, type) => {
    if (e.key === "Backspace") {
      let newArray;
      if (type === "otp") {
        newArray = [...otp];
        newArray[index] = "";
        setOtp(newArray);
      } else if (type === "mpin") {
        newArray = [...mpin];
        newArray[index] = "";
        setMpin(newArray);
      } else if (type === "confirmMpin") {
        newArray = [...confirmMpin];
        newArray[index] = "";
        setConfirmMpin(newArray);
      }

      if (index > 0) {
        document.getElementById(`${type}-${index - 1}`).focus();
      }
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.includes("")) {
      setError("Please enter complete 4-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/OTPValidator`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: UserId,
          LoginId: loginid,
          OTP: otp.join(""),
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

  const handleResendOtp = async () => {
    if (resending || resendTimer > 0) return;

    setResending(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/OTP_Resend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserId: UserId, LoginId: loginid }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        setResendTimer(30);
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "A new OTP has been sent to your registered contact.",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        setError(data?.message || "Failed to resend OTP. Please try again.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data?.message || "Failed to resend OTP. Please try again.",
        });
      }
    } catch {
      const errorMsg =
        "Failed to resend OTP. Please check your connection and try again.";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: errorMsg,
      });
    } finally {
      setResending(false);
    }
  };

  // Handle MPIN submission
  const handleMpinSubmit = async (e) => {
    e.preventDefault();

    if (mpin.includes("") || confirmMpin.includes("")) {
      setError("Please enter complete 4-digit MPIN and confirmation.");
      return;
    }

    if (mpin.join("") !== confirmMpin.join("")) {
      setError("MPIN and confirmation MPIN do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
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

      const response = await fetch(`${BASE_URL}/api/users/set-mpin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          UserId: UserId, 
          LoginId: loginid, 
          MPin: mpin.join("") 
        }),
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
          if (userType === "Employee") {
            navigate("/administrator");
          } else {
            navigate("/login");
          }
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
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 4-digit OTP
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type={otpVisible ? "text" : "password"}
                        maxLength="1"
                        className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={digit}
                        onChange={(e) => handleInputChange(e, index, "otp")}
                        onKeyDown={(e) => handleBackspace(e, index, "otp")}
                        onClick={(e) => e.target.setSelectionRange(0, 1)}
                        onFocus={(e) => e.target.setSelectionRange(0, 1)}
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpVisible((prev) => !prev)}
                    className="ml-3 text-indigo-600 text-sm hover:underline"
                  >
                    {otpVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending || resendTimer > 0}
                  className={`${
                    resending || resendTimer > 0
                      ? "text-gray-400 cursor-not-allowed text-center"
                      : "text-indigo-600 hover:underline text-center"
                  }`}
                >
                  {resending
                    ? "Resending..."
                    : resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleMpinSubmit} className="space-y-6">
              {/* MPIN Input */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 4-digit MPIN
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    {mpin.map((digit, index) => (
                      <input
                        key={index}
                        id={`mpin-${index}`}
                        type={mpinVisible ? "text" : "password"}
                        maxLength="1"
                        className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={digit}
                        onChange={(e) => handleInputChange(e, index, "mpin")}
                        onKeyDown={(e) => handleBackspace(e, index, "mpin")}
                        onClick={(e) => e.target.setSelectionRange(0, 1)}
                        onFocus={(e) => e.target.setSelectionRange(0, 1)}
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setMpinVisible((prev) => !prev)}
                    className="ml-3 text-indigo-600 text-sm hover:underline"
                  >
                    {mpinVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm MPIN Input */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Confirm MPIN
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    {confirmMpin.map((digit, index) => (
                      <input
                        key={index}
                        id={`confirmMpin-${index}`}
                        type={confirmMpinVisible ? "text" : "password"}
                        maxLength="1"
                        className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={digit}
                        onChange={(e) => handleInputChange(e, index, "confirmMpin")}
                        onKeyDown={(e) => handleBackspace(e, index, "confirmMpin")}
                        onClick={(e) => e.target.setSelectionRange(0, 1)}
                        onFocus={(e) => e.target.setSelectionRange(0, 1)}
                        inputMode="numeric"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmMpinVisible((prev) => !prev)}
                    className="ml-3 text-indigo-600 text-sm hover:underline"
                  >
                    {confirmMpinVisible ? "Hide" : "Show"}
                  </button>
                </div>
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