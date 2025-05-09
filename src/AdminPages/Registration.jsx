import React, { useEffect, useState } from "react";
import { fetchStatesList } from "../api/stateListApi";
import { fetchCitiesByState } from "../api/CityListApi";
import PreviewPane from "./PreviewPane";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios for API calls

const token = Cookies.get("token");
const userId = Cookies.get("userId");
// Steps array
const steps = [
  "Basic Details",
  "Residential Details",
  "Business Details",
  "Aadhaar Details",
  "PAN Details",
  "Video KYC", // New Step
];

export default function Registration() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    altMobile: "",
    email: "",
    resHouseNo: "",
    resArea: "",
    resLandmark: "",
    resPincode: "",
    resCity: "",
    resState: "",
    shopName: "",
    shopAddress: "",
    busLandmark: "",
    busPincode: "",
    busCity: "",
    busState: "",
    businessName: "",
    firmName: "",
    aadhaar: "",
    aadhaarFront: null,
    aadhaarBack: null,
    pan: "",
    PAN: null,
    profilePhoto: null,
    shopPhoto: null,
    video: null,
    userType: "",
  });

  // Fetch user types
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const userId = Cookies.get("userId");
        const response = await axios.post(
          "https://gateway.dhanushop.com/api/TypeMaster/list",
          { userid: userId }
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

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetchStatesList();
        setStates(
          response.map((state) => ({
            label: state.StateName,
            value: state.StateId,
          }))
        );
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.resState) {
      const fetchCities = async () => {
        try {
          setLoading(true);
          const response = await fetchCitiesByState(formData.resState);
          setCities(
            response.map((city) => ({
              label: city.CityName,
              value: city.CityId,
            }))
          );
        } catch (err) {
          console.error("Error fetching cities:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCities();
    }
  }, [formData.resState]);

  // Check admin role
  useEffect(() => {
    const role = Cookies.get("role");
    setIsAdmin(role === "Admin");
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  // Conditional rendering
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleSubmit = async () => {
    if (agreeTerms) {
      const payload = {
        UserID: userId, // Example user ID
        UserTypeID: formData.userType,
        RoleID: null,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        MobileNumber: formData.mobile,
        Email: formData.email,
        PersonalAddressLine1: formData.resHouseNo || "",
        PersonalAddressLine2: formData.resArea || "",
        PersonalCityID: formData.resCity || null,
        PersonalStateID: formData.resState || null,
        PersonalPincode: formData.resPincode || "",
        ShopAddressLine1: formData.shopName || "",
        ShopAddressLine2: formData.shopAddress || "",
        ShopCityID: formData.busCity || null,
        ShopStateID: formData.busState || null,
        ShopPincode: formData.busPincode || "",
      };

      try {
        console.log("API Payload:", payload);
        const response = await axios.post(
          "https://gateway.dhanushop.com/api/users/register", // Replace with your actual API endpoint
          payload
        );
        console.log("API Response:", response.data);
        alert("Form Submitted Successfully!");
        closePreview();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit the form. Please try again.");
      }
    } else {
      alert("Please agree to the terms and conditions.");
    }
  };

  const copyResidentialToBusiness = () => {
    setFormData((prevData) => ({
      ...prevData,

      shopAddress: prevData.resArea,
      busLandmark: prevData.resLandmark,
      busPincode: prevData.resPincode,
      busState: prevData.resState,
      busCity: prevData.resCity,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-5 bg-white rounded-xl relative">
      <h1 className="text-2xl font-semibold mb-6 text-center pb-5">
        Registration
      </h1>

      <div className="flex items-center justify-between mb-10 relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative"
            >
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 h-0.5 w-full z-0 ${
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
              <div
                className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isCompleted ? "bg-green-500 text-white" : ""}
                  ${isActive ? "bg-indigo-600 text-white" : ""}
                  ${
                    !isCompleted && !isActive ? "bg-gray-300 text-gray-700" : ""
                  }
                `}
              >
                {index + 1}
              </div>
              <p
                className={`text-xs text-center mt-2 ${
                  isCompleted
                    ? "text-green-600"
                    : isActive
                    ? "text-indigo-700"
                    : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4   h-80">
        {currentStep === 0 && (
          <>
            <div className="flex gap-4 items-center">
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    User Type:
  </label>
  <select
    name="userType"
    value={formData.userType}
    onChange={handleChange}
    className="border border-gray-300 px-4 py-2.5 rounded-md"
  >
    <option value="">Select a User Type</option>
    {userTypes.map((userType) => (
      <option
        key={userType.UserTypeID}
        value={userType.UserTypeID}
      >
        {userType.UserTypeName}
      </option>
    ))}
  </select>
</div>


              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => {
                  const value = e.target.value;

                  // Only update if the value is valid and within the limit
                  if (/^[a-zA-Z\s'-]*$/.test(value) && value.length <= 17) {
                    handleChange(e); // Update formData when conditions are met
                  }
                }}
                className="w-1/2"
                pattern="^[a-zA-Z\s'-]{1,17}$"
                title="First name should only contain alphabets, spaces, hyphens, or apostrophes, and be up to 50 characters."
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  const value = e.target.value;

                  // Only update if the value is valid and within the limit
                  if (/^[a-zA-Z\s'-]*$/.test(value) && value.length <= 17) {
                    handleChange(e); // Update formData when conditions are met
                  }
                }}
                className="w-1/2"
                pattern="^[a-zA-Z\s'-]{1,17}$"
                title="Last name should only contain alphabets, spaces, hyphens, or apostrophes, and be up to 50 characters."
                required
              />
            </div>
            <Input
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }}
              className="w-full"
              inputMode="numeric"
              pattern="^\d{10}$"
              title="Mobile number must be exactly 10 digits."
              maxLength={10}
              required
            />

            <Input
              label="Alternate Mobile Number"
              name="altMobile"
              value={formData.altMobile}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }}
              className="w-full"
              inputMode="numeric"
              pattern="^\d{10}$"
              title="Mobile number must be exactly 10 digits."
              maxLength={10}
              required
            />
            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                let value = e.target.value;

                // Regex to allow only valid email characters
                const emailPattern = /^[a-zA-Z0-9@._-]*$/;

                // Limit input length to 50 characters, ensure valid characters, and convert to lowercase
                if (emailPattern.test(value) && value.length <= 50) {
                  value = value.toLowerCase(); // Convert to lowercase
                  handleChange({ target: { name: "email", value } }); // Pass updated value to handler
                }
              }}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address."
              maxLength={50}
              required
            />
          </>
        )}

        {currentStep === 1 && (
          <>
            <div className="flex gap-4">
              <Input
                label="House No."
                name="resHouseNo"
                value={formData.resHouseNo}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,5}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-1/4"
                inputMode="numeric"
                pattern="^\d{5}$"
                title="House No."
                maxLength={10}
                required
              />
              <Input
                label="Residential Area"
                name="resArea"
                value={formData.resArea}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    /^[a-zA-Z0-9\s.,'-]*$/.test(value) &&
                    value.length <= 100
                  ) {
                    handleChange(e);
                  }
                }}
                className="w-full"
                pattern="^[a-zA-Z\s'-]{1,17}$"
                title="Please enter a valid residential area (letters, numbers, spaces, and basic punctuation only)."
                required
              />
            </div>

            <Input
              label="Landmark (optional)"
              name="resLandmark"
              value={formData.resLandmark}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9\s.,'-]*$/.test(value)) {
                  handleChange(e);
                }
              }}
              className="w-full"
              pattern="^[a-zA-Z0-9\s.,'-]+$"
              title="Please enter a valid Landmark (letters, numbers, spaces, and basic punctuation only)."
              required
            />

            <Input
              label="Pincode"
              name="resPincode"
              value={formData.resPincode}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  handleChange(e);
                }
              }}
              className="w-full"
              inputMode="numeric"
              pattern="^\d{6}$"
              title="Pincode No."
              maxLength={6}
              required
            />

            <div className="flex gap-4">
              <Selectlistbyapi
                label="State"
                name="resState"
                value={formData.resState}
                onChange={handleChange}
                options={states}
              />

              <Selectlistbyapi
                label="City"
                name="resCity"
                value={formData.resCity}
                onChange={handleChange}
                options={cities}
              />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="flex gap-4">
              <Input
                label="Shop Name"
                name="shopName"
                value={formData.shopName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z0-9\s.,'-]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-full"
                pattern="^[a-zA-Z0-9\s.,'-]+$"
                title="Please enter a valid shop name (letters, numbers, spaces, and basic punctuation only)."
                required
              />
              <Input
                label="Shop Address"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z0-9\s.,'-]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-full"
                pattern="^[a-zA-Z0-9\s.,'-]+$"
                title="Please enter a valid shop address (letters, numbers, spaces, and basic punctuation only)."
                required
              />
            </div>
            <div className="w-full justify-end flex">
              <button
                type="button"
                className="text-blue-500  rounded-md"
                onClick={copyResidentialToBusiness}
              >
                Same as Residential Address
              </button>
            </div>
            <Input
              label="Landmark"
              name="busLandmark"
              value={formData.busLandmark}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9\s.,'-]*$/.test(value)) {
                  handleChange(e);
                }
              }}
              className="w-full"
              pattern="^[a-zA-Z0-9\s.,'-]+$"
              title="Please enter a valid Landmark (letters, numbers, spaces, and basic punctuation only)."
              required
            />
            <Input
              label="Pincode"
              name="busPincode"
              value={formData.busPincode}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  handleChange(e);
                }
              }}
              className="w-full"
              inputMode="numeric"
              pattern="^\d{6}$"
              title="Pincode No."
              maxLength={6}
              required
            />
            <div className="flex gap-4 w-full">
              <Selectlistbyapi
                label="State"
                name="busState"
                value={formData.busState}
                onChange={handleChange}
                options={states}
                className="w-1/2"
              />
              <Selectlistbyapi
                label="City"
                name="busCity"
                value={formData.busCity}
                onChange={handleChange}
                options={cities}
                className="w-1/2"
              />
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Input
              label="Aadhaar Number"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,12}$/.test(value)) {
                  handleChange(e);
                }
              }}
              className="w-full"
              inputMode="numeric"
              pattern="^\d{12}$"
              title=" No."
              maxLength={12}
              required
            />
            <Input
              type="file"
              label="Upload Aadhaar Front"
              name="aadhaarFront"
              onChange={handleChange}
            />
            <Input
              type="file"
              label="Upload Aadhaar Back"
              name="aadhaarBack"
              onChange={handleChange}
            />
          </>
        )}

        {currentStep === 4 && (
          <>
            <Input
              label="PAN Number"
              name="pan"
              value={formData.pan}
              onChange={(e) => {
                const value = e.target.value.toUpperCase(); // Ensure all characters are uppercase
                // Allow only alphanumeric characters (uppercase alphabets and digits) and enforce max length of 10
                if (/^[A-Z0-9]{0,10}$/.test(value)) {
                  handleChange({
                    target: { name: e.target.name, value }, // Update state only if the input is valid
                  });
                }
              }}
              className="w-full"
              inputMode="text" // Regular keyboard input mode (as PAN includes both letters and digits)
              pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" // Enforces the PAN format (5 letters, 4 digits, 1 letter)
              title="Pan No. (Format: ABCDE1234F)"
              maxLength={10} // Prevents more than 10 characters from being entered
              required
            />

            <Input
              type="file"
              label="Upload PAN"
              name="PAN"
              onChange={handleChange}
            />
          </>
        )}

        {currentStep === 5 && (
          <>
            <Input
              type="file"
              label="Upload Profile Photo"
              name="profilePhoto"
              onChange={handleChange}
            />
            <Input
              type="file"
              label="Upload Shop Photo"
              name="shopPhoto"
              onChange={handleChange}
            />
            <Input
              type="file"
              label="Upload 30-sec Video"
              name="video"
              onChange={handleChange}
            />
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-10 absolute w-[95%]">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="btn-outline"
        >
          Previous
        </button>
        {currentStep < steps.length - 1 ? (
          <button onClick={nextStep} className="btn-primary">
            Next
          </button>
        ) : (
          <button onClick={openPreview} className="btn-success">
            Preview & Submit
          </button>
        )}
      </div>
      {isPreviewOpen && (
        <PreviewPane
          formData={formData}
          onClose={closePreview}
          onSubmit={handleSubmit}
          agreeTerms={agreeTerms}
          setAgreeTerms={setAgreeTerms}
        />
      )}
    </div>
  );
}

// Reusable Input component
function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={type !== "file" ? value : undefined}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

// Reusable Select component
function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => {
          const optionLabel = typeof opt === "string" ? opt : opt.label;
          const optionValue = typeof opt === "string" ? opt : opt.value;

          return (
            <option key={optionValue || idx} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

// Reusable Select component
function Selectlistbyapi({
  label,
  name,
  value,
  onChange,
  options = [],
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
