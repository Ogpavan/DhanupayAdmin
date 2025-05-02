import React, { useEffect, useState } from "react";
import { fetchStatesList } from "../api/stateListApi"
import { fetchCitiesByState } from "../api/CityListApi"

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
  const [states, setStates] = useState([]); // To store the fetched states
  const [cities, setCities] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    altMobile: "",
    email: "",
    houseNo: "",
    area: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    businessName: "",
    firmName: "",
    aadhaar: "",
    aadhaarFront: null,
    aadhaarBack: null,
    pan: "",
    PAN: null,
    profilePhoto: null,  // New
    shopPhoto: null,     // New
    video: null,         // New
    userType: "",        // Added userType here
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);



  useEffect(() => {
    // Check if state is not empty before calling the API
    if (formData.state) {
      const fetchCitiesForState = async () => {
        setLoading(true); // Set loading state to true while fetching
        try {
          const response = await fetchCitiesByState(formData.state); // Call API with the selected state
          const cityOptions = response.map((city) => ({
            label: city.CityName,  // Assuming each city object has CityName and CityId
            value: city.CityId,    // Assuming each city object has CityId
          }));
          
          console.log(cityOptions);
          setCities(cityOptions); // Assuming the API returns an array of cities
        } catch (error) {
          console.error("Error fetching cities:", error);
        } finally {
          setLoading(false); // Set loading state to false once the API call is done
        }
      };

      fetchCitiesForState();
    }
  }, [formData.state]); // This effect runs whenever `formData.state` changes


  // Fetch the list of states from API
  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await fetchStatesList(); // Assuming API response is an array
        // Mapping the response to create the expected options format
        const stateOptions = response.map((state) => ({
          label: state.StateName,  // Assuming the state object has StateName and StateId
          value: state.StateId,
        }));
        setStates(stateOptions);  // Set the formatted state options
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching states:", error);
        setLoading(false);
      }
    };
  
    getStates();
  }, []);
   


  useEffect(() => {
    // Check the user type in localStorage
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const userTypeOptions = isAdmin
    ? ["Master Distributor", "Distributor", "Retailer", "White Label"]
    : ["Master Distributor", "Retailer"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);
        
  const handleSubmit = () => {
    if (agreeTerms) {
      console.log("Form Data Submitted:", formData);
      closePreview();
      alert("Form Submitted Successfully!");
    } else {
      alert("Please agree to the terms and conditions.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-5 bg-white rounded-xl border border-gray-200">
      <h1 className="text-2xl font-semibold mb-6 text-center pb-5">Registration</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 h-0.5 w-full z-0 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                />
              )}
              <div
                className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isCompleted ? "bg-green-500 text-white" : ""}
                  ${isActive ? "bg-indigo-600 text-white" : ""}
                  ${!isCompleted && !isActive ? "bg-gray-300 text-gray-700" : ""}
                `}
              >
                {index + 1}
              </div>
              <p
                className={`text-xs text-center mt-2 ${isCompleted ? "text-green-600" : isActive ? "text-indigo-700" : "text-gray-500"}`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>

      {/* Forms */}
      <div className="space-y-4">
        {currentStep === 0 && (
          <>
            <div className="flex gap-4">
              {/* New Select for User Type */}
              <Select
                label="User Type"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                options={userTypeOptions}
              />
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} className="w-1/2" />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} className="w-1/2" />
            </div>
            <Input label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} />
            <Input label="Alternate Mobile Number" name="altMobile" value={formData.altMobile} onChange={handleChange} />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
          </>
        )}

        {currentStep === 1 && (
          <>
            <div className="flex gap-4">
              <Input
                label="House No."
                name="houseNo"
                value={formData.houseNo}
                onChange={handleChange}
                className="w-1/4"
              />
              <Input
                label="Residential Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <Input
              label="Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />

            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />

            <div className="flex gap-4">
              <Selectlistbyapi
                label="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                options={states}
              />

              <Selectlistbyapi
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                options={cities}
              />
            </div>

          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="flex gap-4">
              <Input label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} className="w-1/2" />
              <Input label="Firm or Shop Name" name="firmName" value={formData.firmName} onChange={handleChange} className="w-1/2" />
            </div>
            <div className="w-full">
              <button
                type="button"
                className=" bg-blue-500 text-white px-4 py-2 rounded-md "
              >
                Same as Residential Address
              </button>
            </div>
            <Input label="Landmark" name="landmark" value={formData.landmark} onChange={handleChange} />
            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
            <div className="flex gap-4 w-full">
              <Selectlistbyapi
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                options={states}
                className="w-1/2"
              />
              <Selectlistbyapi
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                options={cities}
                className="w-1/2"
              />
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Input label="Aadhaar Number" name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
            <Input type="file" label="Upload Aadhaar Front" name="aadhaarFront" onChange={handleChange} />
            <Input type="file" label="Upload Aadhaar Back" name="aadhaarBack" onChange={handleChange} />
          </>
        )}

        {currentStep === 4 && (
          <>
            <Input label="PAN Number" name="pan" value={formData.pan} onChange={handleChange} />
            <Input type="file" label="Upload PAN" name="PAN" onChange={handleChange} />
          </>
        )}

        {currentStep === 5 && (
          <>
            <Input type="file" label="Upload Profile Photo" name="profilePhoto" onChange={handleChange} />
            <Input type="file" label="Upload Shop Photo" name="shopPhoto" onChange={handleChange} />
            <Input type="file" label="Upload 30-sec Video" name="video" onChange={handleChange} />
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-10">
        <button onClick={prevStep} disabled={currentStep === 0} className="btn-outline">
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

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Preview Form Data</h2>
            <div className="space-y-2">
              {Object.keys(formData).map((key) => (
                <div key={key} className="flex justify-between">
                  <span className="font-semibold">{key}:</span>
                  <span>{typeof formData[key] === "object" ? formData[key]?.name : formData[key]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="agree" className="text-sm">
                I agree to the terms and conditions
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={closePreview} className="btn-outline mr-4">
                Close
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Input component
function Input({ label, type = "text", name, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
function Select({ label, name, value, onChange, options = [], className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
function Selectlistbyapi({ label, name, value, onChange, options = [], className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
