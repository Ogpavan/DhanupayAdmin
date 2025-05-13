import React, { useEffect, useState } from "react";
import { fetchStatesList } from "../../api/stateListApi";
import { fetchCitiesByState } from "../../api/CityListApi";
import PreviewPane from "../PreviewPane";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios for API calls


///////////////////////////

const token = Cookies.get("token");
const userId = Cookies.get("UserId");
// Steps array
const steps = [
  "Basic Details",
  "Residential Details",
  "Business Details",
  "Aadhaar Details",
  "PAN Details",
  "Video KYC", // New Step
];

export default function RegistrationModal() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);
const [shopPhoto, setShopPhoto] = useState(null);
const [videoFile, setVideoFile] = useState(null);

const [profilePhotoUploaded, setProfilePhotoUploaded] = useState(false);
const [shopPhotoUploaded, setShopPhotoUploaded] = useState(false);
const [videoUploaded, setVideoUploaded] = useState(false);

const [formDatatwo, setFormDatatwo] = useState({ aadhaar: "", pan: "" });
const [aadhaarFront, setAadhaarFront] = useState(null);
const [aadhaarBack, setAadhaarBack] = useState(null);
const [panImage, setPanImage] = useState(null);
const [aadhaarUploaded, setAadhaarUploaded] = useState(false);
const [panUploaded, setPanUploaded] = useState(false);
const [video, setVideo] = useState(null);


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

  const nextStep = async () => {
    const isSuccess = await submitStepData(currentStep);
    if (isSuccess) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  
  // Conditional rendering
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // const handleSubmit = async () => {
  //   if (!agreeTerms) {
  //     alert("Please agree to the terms and conditions.");
  //     return;
  //   }
  
  //   const payload = {
  //     UserID: userId,
  //     UserTypeID: formData.userType,
  //     RoleID: null,
  //     FirstName: formData.firstName,
  //     LastName: formData.lastName,
  //     MobileNumber: formData.mobile,
  //     Email: formData.email,
  //     PersonalAddressLine1: formData.resHouseNo || "",
  //     PersonalAddressLine2: formData.resArea || "",
  //     PersonalCityID: formData.resCity || null,
  //     PersonalStateID: formData.resState || null,
  //     PersonalPincode: formData.resPincode || "",
  //     ShopAddressLine1: formData.shopName || "",
  //     ShopAddressLine2: formData.shopAddress || "",
  //     ShopCityID: formData.busCity || null,
  //     ShopStateID: formData.busState || null,
  //     ShopPincode: formData.busPincode || "",
  //   };
  
  //   try {
  //     // Step 1: Register the user
      
  //     const response = await axios.post(
  //       "https://gateway.dhanushop.com/api/users/register",
  //       payload
  //     );
  
  //     const { newUserId } = response.data;
  //     console.log("API Payload after request:", payload);
  //     console.log("New User ID:", response.data); // Adjust if response format is different
  //     if (!userId) {
  //       throw new Error("No newUserId received from registration API.");
  //     }
  
  //     // Step 2: Upload documents
  //     const formData = new FormData();
  //     formData.append("UserId", userId);
  //     formData.append("newUserId", newUserId);
  //     formData.append("DocumentType", "Aadhaar"); // or dynamically from form
  //     formData.append("DocumentNumber", formData.documentNumber);
  //     formData.append("FrontImage", formData.frontImage); // must be File object
  //     formData.append("BackImage", formData.backImage);
  //     formData.append("VideoFile", formData.videoFile);
  
  //     const uploadRes = await axios.post(
  //       "https://gateway.dhanushop.com/api/users/uploadDocuments",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  
  //     console.log("Document Upload Response:", uploadRes.data);
  //     alert("Form and documents submitted successfully!");
  //     closePreview();
  //   } catch (error) {
  //     console.error("Error submitting form or documents:", error);
  //     alert("Failed to complete registration. Please try again.");
  //   }
  // };


const submitStepData = async (step) => {
  try {
    if (step === 2) {
      const payload = {
        UserID: userId,
        UserTypeID: formData.userType,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        MobileNumber: formData.mobile,
        AltMobileNumber: formData.altMobile,
        Email: formData.email,
        PersonalAddressLine1: formData.resHouseNo,
        PersonalAddressLine2: formData.resArea,
        PersonalLandmark: formData.resLandmark,
        PersonalPincode: formData.resPincode,
        PersonalStateID: formData.resState,
        PersonalCityID: formData.resCity,
        ShopName: formData.shopName,
        ShopAddressLine1: formData.shopAddress,
        ShopLandmark: formData.busLandmark,
        ShopPincode: formData.busPincode,
        ShopStateID: formData.busState,
        ShopCityID: formData.busCity,
      };

      const response = await axios.post("https://gateway.dhanushop.com/api/users/register", payload);

      console.log("API Payload after request:", payload);
      console.log("Response from API:", response.data);

      const newUserId = response.data?.newUserId || response.data?.data?.newUserId;

      if (newUserId) {
        Cookies.set("newUserId", newUserId);
        console.log("Stored newUserId in cookies:", newUserId);
      } else {
        console.warn("newUserId not found in response");
      }
    }

    return true;
  } catch (error) {
    console.error(`Step ${step + 1} submission failed:`, error);
    alert(`Failed to save data for step ${step + 1}.`);
    return false;
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



const handleAadhaarUpload = async () => {
  const form = new FormData();
  form.append("UserId", userId);
  form.append("newUserId", Cookies.get("newUserId"));
  form.append("DocumentType", "Aadhaar");
  form.append("DocumentNumber", formData.aadhaar);
  form.append("FrontImage", aadhaarFront);
  form.append("BackImage", aadhaarBack);
  form.append("VideoFile", null);

  try {
    console.log("Aadhaar Upload Form Data:", form);
    const res = await fetch("https://gateway.dhanushop.com/api/users/uploadDocuments", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    
    if (data?.success) {
      setAadhaarUploaded(true);
      console.log("Aadhaar Upload Success:", data);
      alert("Aadhaar uploaded successfully!");
    }
  } catch (error) {
    console.error("Aadhaar Upload Error:", error);
        alert("Aadhaar upload unsuccessful",error)
  }
};


const handlePanUpload = async () => {
  const form = new FormData();
  form.append("UserId", userId);
  form.append("newUserId", Cookies.get("newUserId"));
  form.append("DocumentType", "PAN");
  form.append("DocumentNumber", formData.pan);
  form.append("FrontImage", panImage);
  form.append("BackImage", null); // Required by API schema, use empty blob if not needed
  form.append("VideoFile", null); // Optional

  try {
    const res = await fetch("https://gateway.dhanushop.com/api/users/uploadDocuments", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
     if (data?.success) {
      setPanUploaded(true);
      console.log("PAN Upload Success:", data);
      alert("PAN uploaded successfully!");
    }
  } catch (error) {
    
    console.error("PAN Upload Error:", error);
    alert("Pan upload error",error)
  }
};

const handleProfilePhotoUpload = async () => {
   const form = new FormData();
  form.append("UserId", userId);
  form.append("newUserId", Cookies.get("newUserId"));
  form.append("DocumentType", "ProfilePhoto");
  form.append("DocumentNumber", null);
  form.append("FrontImage", profilePhoto);
  form.append("BackImage", null); // Required by API schema, use empty blob if not needed
  form.append("VideoFile", null); // Optional

  try {
    const res = await fetch("https://gateway.dhanushop.com/api/users/uploadDocuments", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
     if (data?.success) {
      setProfilePhotoUploaded(true);
      console.log("Profile Upload Success:", data);
      alert("Profile uploaded successfully!");
    }
  } catch (error) {
    
    console.error("PAN Upload Error:", error);
    alert("Pan upload error",error)
  }
};


const handleShopPhotoUpload = async () => {
     const form = new FormData();
  form.append("UserId", userId);
  form.append("newUserId", Cookies.get("newUserId"));
  form.append("DocumentType", "Shop Photo");
  form.append("DocumentNumber", null);
  form.append("FrontImage", profilePhoto);
  form.append("BackImage", null); // Required by API schema, use empty blob if not needed
  form.append("VideoFile", null); // Optional

  try {
    const res = await fetch("https://gateway.dhanushop.com/api/users/uploadDocuments", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
     if (data?.success) {
      setShopPhotoUploaded(true);
      console.log("shop photo Upload Success:", data);
      alert("Shop photo uploaded successfully!");
    }
  } catch (error) {
    
    console.error("Shop Photp Upload Error:", error);
    alert("Shop Photo  upload error",error)
  }
};

const handleVideoUpload = async () => {
      const form = new FormData();
  form.append("UserId", userId);
  form.append("newUserId", Cookies.get("newUserId"));
  form.append("DocumentType", "Video");
  form.append("DocumentNumber", null);
  form.append("FrontImage", null);
  form.append("BackImage", null); // Required by API schema, use empty blob if not needed
  form.append("VideoFile", video); // Optional

  try {
    const res = await fetch("https://gateway.dhanushop.com/api/users/uploadDocuments", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
     if (data?.success) {
       setVideoUploaded(true);
      console.log("Video Upload Success:", data);
      alert("Video uploaded successfully!");
    }
  } catch (error) {
    
    console.error("Video Upload Error:", error);
    alert("Video  upload error",error)
  }
};

  return (
    <div className="max-w-3xl mx-auto px-6 py-5 bg-white rounded-xl relative">
 

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
    className="border border-gray-300 px-2 py-1 rounded-md"
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
  <div className=" max-w-3xl mx-auto mt-4">
    {/* Aadhaar Upload */}
    <div className="border rounded-xl p-6 shadow-sm bg-white   ">
      
      <div className="">
        {/* Aadhaar Number */}
        <div className="flex flex-col w-full  gap-4">
        <div>
          <label className="block mb-1 font-medium">Aadhaar Number</label>
          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,12}$/.test(value)) {
                handleChange(e);
                setAadhaarUploaded(false);
              }
            }}
            maxLength={12}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter Aadhaar"
          />
        </div>
        {/* Aadhaar Front Image */}
        <div className="flex mb-3 gap-x-4">
        <div>
          <label className="block mb-1 font-medium">Front Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setAadhaarFront(e.target.files[0]);
              setAadhaarUploaded(false);
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {/* Aadhaar Back Image */}
        <div>
          <label className="block mb-1 font-medium">Back Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setAadhaarBack(e.target.files[0]);
              setAadhaarUploaded(false);
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        </div>
        </div>
        {/* Upload Button */}
        <div className="col-span-2 flex items-end">
          <button
            onClick={handleAadhaarUpload}
            disabled={aadhaarUploaded}
            className={`w-full py-2 rounded text-white ${
              aadhaarUploaded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-800"
            }`}
          >
            {aadhaarUploaded ? "Uploaded" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}



        {currentStep === 4 && (
          <>
     {/* PAN Upload */}
    <div className="border rounded-xl p-6 shadow-sm bg-white">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* PAN Number */}
        <div>
          <label className="block mb-1 font-medium">PAN Number</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (/^[A-Z0-9]{0,10}$/.test(value)) {
                handleChange({
                  target: { name: e.target.name, value },
                });
                setPanUploaded(false);
              }
            }}
            maxLength={10}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter PAN"
          />
        </div>
        {/* PAN Image */}
        <div>
          <label className="block mb-1 font-medium">PAN Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setPanImage(e.target.files[0]);
              setPanUploaded(false);
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {/* Upload Button */}
        <div className=" flex justify-end w-full">
          <button
            onClick={handlePanUpload}
            disabled={panUploaded}
            className={`w-64 py-2 rounded text-white ${
              panUploaded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-800"
            }`}
          >
            {panUploaded ? "Uploaded" : "Upload"}
          </button>
        </div>
      </div>
    </div>
          </>
        )}

{currentStep === 5 && (
  <div className="space-y-6 mt-6">
    {/* Profile Photo Upload */}
    <div className="space-y-2">
      <label className="block font-medium">Upload Profile Photo</label>
      <input
        type="file"
        name="profilePhoto"
        accept="image/*"
        onChange={(e) => setProfilePhoto(e.target.files[0])}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handleProfilePhotoUpload}
        disabled={profilePhotoUploaded}
        className={`w-full py-2 rounded text-white ${
          profilePhotoUploaded
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {profilePhotoUploaded ? "Uploaded" : "Upload"}
      </button>
    </div>

    {/* Shop Photo Upload */}
    <div className="space-y-2">
      <label className="block font-medium">Upload Shop Photo</label>
      <input
        type="file"
        name="shopPhoto"
        accept="image/*"
        onChange={(e) => setShopPhoto(e.target.files[0])}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handleShopPhotoUpload}
        disabled={shopPhotoUploaded}
        className={`w-full py-2 rounded text-white ${
          shopPhotoUploaded
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {shopPhotoUploaded ? "Uploaded" : "Upload"}
      </button>
    </div>

    {/* 30-sec Video Upload */}
    <div className="space-y-2">
      <label className="block font-medium">Upload 30-sec Video</label>
      <input
        type="file"
        name="video"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handleVideoUpload}
        disabled={videoUploaded}
        className={`w-full py-2 rounded text-white ${
          videoUploaded
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {videoUploaded ? "Uploaded" : "Upload"}
      </button>
    </div>
  </div>
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
        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
