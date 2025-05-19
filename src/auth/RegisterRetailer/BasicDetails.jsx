
import React, { useEffect, useState } from "react";
import Stepper from "./Stepper";
import { useNavigate } from "react-router-dom";
import OtpModal from "./OtpModal";
import Swal from "sweetalert2";
import axios from "axios";

const BasicDetails = () => {
  const navigate = useNavigate();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verifyingField, setVerifyingField] = useState(null);
  const [otp, setOtp] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);
  const [OtpId, setOtpId] = useState("");

  // Form validation errors
  const [errors, setErrors] = useState({
    firstName: "",
    mobile: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    ParentID: "",
  });

  const [verifiedFields, setVerifiedFields] = useState({
    mobile: false,
    alternateMobile: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedForm = localStorage.getItem("basicDetails");
    if (savedForm) {
      const parsedData = JSON.parse(savedForm);
      setFormData(parsedData);
    }

    const savedVerified = localStorage.getItem("verifiedFields");
    if (savedVerified) {
      setVerifiedFields(JSON.parse(savedVerified));
    }
  }, []);

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          errorMessage = "First name is required";
        }
        break;
      case "mobile":
        if (!value) {
          errorMessage = "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          errorMessage = "Mobile number must be 10 digits";
        }
        break;
      case "email":
        if (!value) {
          errorMessage = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleVerifyClick = async (field) => {
    console.log("Verifying field:", field);

    // Example: extract mobile number from your form state
    const mobileNumber = formData.mobile;

    const mobileError = validateField("mobile", mobileNumber);
    if (mobileError) {
      setErrors({ ...errors, mobile: mobileError });
      return;
    }

    try {
      const response = await axios.post(
        "https://gateway.dhanushop.com/api/users/VerifyMobileNumber",
        { MobileNumber: mobileNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("OTP Response:", response.data);

      if (response.data.success) {
        // Optional: Store OTP ID if needed for verification later
        setOtpId(response.data.otpid);
        setVerifyingField(field);
        setShowOTPModal(true);

        Swal.fire({
          title: "OTP Sent",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Failed",
          text: response.data.message || "Failed to send OTP.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      console.error("Verification API Error:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while sending the OTP.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleOTPSubmit = async () => {
    if (!otp) {
      Swal.fire({
        title: "Missing OTP",
        text: "Please enter the OTP.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://gateway.dhanushop.com/api/users/OTPValidator",
        {
          UserId: 0,
          LoginId: OtpId, // assuming this is set from the previous OTP generation step
          OTP: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("OTP Verify Response:", response.data);

      if (response.data.success) {
        if (verifyingField === "Mobile Number") {
          const updatedVerified = { ...verifiedFields, mobile: true };
          setVerifiedFields(updatedVerified);
          localStorage.setItem("verifiedFields", JSON.stringify(updatedVerified));
          // Clear the error for mobile when verified
          setErrors({ ...errors, mobile: "" });
        }

        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        setShowOTPModal(false);
        setOtp("");
      } else {
        Swal.fire({
          title: "Invalid OTP",
          text: response.data.message || "The OTP you entered is incorrect.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      Swal.fire({
        title: "Verification Failed",
        text: "An error occurred while verifying the OTP.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    localStorage.setItem("basicDetails", JSON.stringify(updatedForm));

    // Validate field on change
    const errorMessage = validateField(name, value);
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async () => {
    // Validate all required fields before submission
    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      mobile: validateField("mobile", formData.mobile),
      email: validateField("email", formData.email),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Check if mobile is verified
    if (!verifiedFields.mobile) {
      setErrors({
        ...newErrors,
        mobile: "Mobile number must be verified",
      });
      return;
    }

    setbtnLoading(true);
    console.log("Submitting form data:", formData);

    // API payload
    const payload = {
      UserID: "2",
      UserTypeID: 16,
      RoleID: "19",
      FirstName: formData.firstName,
      LastName: formData.lastName,
      MobileNumber: formData.mobile,
      Email: formData.email,
      ReferalID: formData.ParentID,
    };
    console.log("API Payload:", payload);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, payload);
      console.log("API response:", response.data);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Detail Saved Successfully!",
        });
        localStorage.setItem("newUserId", response.data.newUserId);
        setbtnLoading(false);
        navigate("/residential-details");
      } else if (response.data.message == "User Completed All steps") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User Already Registered Please wait we are verifying your details!",
        })
        localStorage.clear();
        setbtnLoading(false);
        navigate("/");
      } else if (response.data.message == "Referral Id not found") {
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Invalid Referral Id!",   
        })
        setbtnLoading(false);
      }
       else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: response.data.message,
        });
        localStorage.setItem("newUserId", response.data.userData.NewUserID);
        setbtnLoading(false);
        navigate("/residential-details");
      }
    } catch (error) {
      console.error("API error:", error);
      setbtnLoading(false);
      Swal.fire({
        icon: "error",
        title: "API Error",
        text: error?.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="font-poppins min-h-screen   ">
     
      <div style={{ height: "calc(100vh - 15vh)" }} className=" bg-white rounded-t-3xl px-4 py-6     -mt-6 relative">
        <Stepper currentStep={0} />
        <h1 className="poppins-semibold text-[#121649] text-center py-4">
          Basic Details
        </h1>
        <form className="space-y-3">
          {/* First & Last Name */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <div className="flex">
                <label className="text-sm text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
              </div>
              <input
                type="text"
                placeholder="First Name"
                className={`input-field w-full ${errors.firstName ? 'border-red-500' : ''}`}
                maxLength="10"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const key = e.key;
                  if (!/^[a-zA-Z]$/.test(key) && key !== "Backspace" && key !== "Tab") {
                    e.preventDefault();
                  }
                }}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="w-1/2">
              <div className="flex">
                <label className="text-sm text-gray-600 mb-1">Last Name</label>
              </div>
              <input
                type="text"
                placeholder="Last Name"
                className="input-field w-full"
                maxLength="10"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const key = e.key;
                  if (!/^[a-zA-Z]$/.test(key) && key !== "Backspace" && key !== "Tab") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <div className="flex">
              <label className="text-sm text-gray-600 mb-1">Mobile Number <span className="text-red-500">*</span></label>
            </div>
            <div className="relative">
              <input
                type="tel"
                placeholder="Mobile Number"
                className={`input-field w-full pr-24 ${errors.mobile ? 'border-red-500' : ''}`}
                maxLength="10"
                inputMode="numeric"
                name="mobile"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only digits
                  if (/^\d*$/.test(value)) {
                    // First digit must be 6-9
                    if (value.length === 1 && !/^[6-9]$/.test(value)) return;
                    setFormData({ ...formData, mobile: value });
                    // Validate on change
                    const errorMessage = validateField("mobile", value);
                    setErrors({ ...errors, mobile: errorMessage });
                  }
                }}
                disabled={verifiedFields.mobile}
              />
              <button
                type="button"
                onClick={() => handleVerifyClick("Mobile Number")}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold ${verifiedFields.mobile ? "text-green-400" : "text-[#2C2DCB]"}`}
                disabled={verifiedFields.mobile || !formData.mobile || !/^\d{10}$/.test(formData.mobile)}
              >
                {verifiedFields.mobile ? "Verified" : "Verify"}
              </button>
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Alternate Mobile Number */}
          <div>
            <div className="flex">
              <label className="text-sm text-gray-600 mb-1">Alternate Mobile Number</label>
            </div>
            <div className="relative">
              <input
                type="tel"
                placeholder="Alternate Mobile Number"
                className="input-field w-full pr-24"
                maxLength="10"
                inputMode="numeric"
                name="alternateMobile"
                value={formData.alternateMobile}
                disabled={!verifiedFields.mobile}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only digits
                  if (/^\d*$/.test(value)) {
                    // First digit must be 6-9
                    if (value.length === 1 && !/^[6-9]$/.test(value)) return;
                    setFormData({ ...formData, alternateMobile: value });
                  }
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="flex">
              <label className="text-sm text-gray-600 mb-1">Email ID <span className="text-red-500">*</span></label>
            </div>
            <input
              type="email"
              placeholder="Email ID"
              className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!verifiedFields.mobile}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Parent ID */}
          <div>
            <div className="flex">
              <label className="text-sm text-gray-600 mb-1">Enter Referral ID (optional)</label>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Referral ID"
                className="input-field w-full pr-24"
                maxLength="10"
                name="ParentID"
                value={formData.ParentID}
                disabled={!verifiedFields.mobile}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only alphanumeric characters
                  if (/^[a-zA-Z0-9]*$/.test(value)) {
                    setFormData({ ...formData, ParentID: value });
                  }
                }}
              />

            </div>
          </div>
        </form>

        <button
          onClick={handleSubmit}
          disabled={btnLoading}
          className="mt-6 w-full bg-[#2C2DCB] text-white text-lg py-2 rounded-xl font-semibold"
        >
          {btnLoading ? 'Processing...' : 'Save & Next →'}
        </button>

        <OtpModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onSubmit={handleOTPSubmit}
          otp={otp}
          setOtp={setOtp}
          verifyingField={verifyingField}
        />
      </div>
    </div>
  );
};

export default BasicDetails;