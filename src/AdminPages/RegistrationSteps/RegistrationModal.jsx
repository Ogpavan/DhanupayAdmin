import React, { useEffect, useState } from "react";
import { fetchStatesList } from "../../api/stateListApi";
import { fetchCitiesByState } from "../../api/CityListApi";
import PreviewPane from "../PreviewPane";
import Swal from "sweetalert2";
import { IoMdLocate } from "react-icons/io";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios for API calls
import { data, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // optional icon lib

///////////////////////////

const token = Cookies.get("token");
const userId = Cookies.get("UserId");
// Steps array

const bankList = [
  "SBI",
  "HDFC",
  "ICICI",
  "AXIS",
  "KOTAK",
  "YES BANK",
  "CITI BANK",
  "OTHERS",
].map((bank) => ({ label: bank, value: bank }));

const steps = [
  "Basic Details",
  "Residential Details",
  "Business Details",
  "Bank Details",
  // New Step
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
  const [closePreview, setClosePreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [showConfirmAccount, setShowConfirmAccount] = useState(false);
  const handlePreviewClose = () => setIsPreviewOpen(false);

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
    roleid: "",
    userType: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    latitude: "",
    longitude: "",
    websiteUrl: "",
  });

  const isStepValid = () => {
    if (currentStep === 0) {
      return (
        formData.firstName.trim() !== "" &&
        // formData.lastName.trim() !== "" &&
        formData.mobile.length === 10 &&
        /^[0-9]{10}$/.test(formData.mobile) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        formData.roleid !== "" &&
        formData.userType !== ""
      );
    }

    if (currentStep === 1) {
      return (
        formData.resArea.trim() !== "" &&
        formData.resPincode.length === 6 &&
        formData.resState !== "" &&
        formData.resCity !== ""
      );
    }

if (currentStep === 2) {
  const isWhiteLabel = formData.userType === "2";

  const isValid =
    formData.shopName.trim() !== "" &&
    formData.shopAddress.trim() !== "" &&
    formData.busPincode.length === 6 &&
    formData.busState !== "" &&
    formData.busCity !== "" &&
    formData.latitude !== "" &&
    formData.longitude !== "" &&
    (!isWhiteLabel || formData.websiteUrl.trim() !== "");

  return isValid;
}

    if (currentStep === 3) {
      return (
        formData.accountHolderName.trim() !== "" &&
        formData.accountNumber.length >= 8 &&
        formData.accountNumber.length <= 20 &&
        formData.confirmAccountNumber === formData.accountNumber &&
        formData.ifscCode.length === 11 &&
        formData.bankName.trim() !== "" &&
        formData.branchName.trim() !== "" // <- this will now work after the fix
      );
    }

    return false;
  };

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
        console.log();
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
              value: city.CityName,
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

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       const response = await axios.post(
  //         "https://gateway.dhanushop.com/api/role/list",
  //         { userId: userId },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       console.log(response.data);
  //       setRoles(response.data); // Assuming response.data is the array of roles
  //     } catch (error) {
  //       console.error("Error fetching roles:", error);
  //     }
  //   };

  //   fetchRoles();
  // }, [token]);

  const handleroleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, roleid: role }));
  };

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

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // Conditional rendering
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const submitStepData = async (step) => {
    try {
      if (step === 3) {
        const payload = {
          UserID: userId,
          UserTypeID: formData.userType,
          RoleID: formData.roleid,
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
          AccountHolderName: formData.accountHolderName,
          AccountNumber: formData.accountNumber,
          IFSCCode: formData.ifscCode,
          BankName: formData.bankName,
          BranchName: formData.branchName,
          websiteUrl: formData.websiteUrl
        };

        console.log("Payload:", payload);
        const response = await axios.post(
          "https://gateway.dhanushop.com/api/users/register",
          payload
        );
        console.log("Response:", response.data);
        // Check for duplicate email
        if (response.data?.message === "EmailExists") {
          Swal.fire({
            icon: "error",
            title: "Email already exists",
            text: "The email address you entered is already registered. Please use a different one.",
          });
          return false;
        }

        // Check for duplicate mobile
        if (response.data?.message === "MobileExists") {
          Swal.fire({
            icon: "error",
            title: "Mobile number already exists",
            text: "The mobile number you entered is already registered. Please use a different one.",
          });
          return false;
        }

        const newUserId =
          response.data?.newUserId || response.data?.data?.newUserId;

        if (response.data?.suc || newUserId) {
          if (newUserId) {
            Cookies.set("newUserId", newUserId);
            console.log("Stored newUserId in cookies:", newUserId);
          }

          // ✅ Show success alert
          Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "User registration has been completed successfully!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/admin/registration";
            }
          });
          return true;
        } else {
          console.warn("newUserId not found in response");
          const responsemessage = response.data?.message;
          Swal.fire({
            icon: "warning",
            title: "Unexpected Response",
            text: responsemessage,
          });
          return true; // depending on your app logic
        }
      }

      return true;
    } catch (error) {
      console.error(`Step ${step + 1} submission failed:`, error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: `Failed to save data for step ${step + 1}. Please try again.`,
      });
      return false;
    }
  };

  const nextStep = async () => {
    if (!isStepValid()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please complete all required fields correctly before continuing.",
      });
      return;
    }

    const isSuccess = await submitStepData(currentStep);
    if (isSuccess) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
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

  const handleUserTypeChange = async (e) => {
    const selectedUserType = e.target.value;
    console.log("Selected User Type:", selectedUserType);
    
    setFormData({ ...formData, userType: selectedUserType });
    setSelectedRole(""); // reset selected role

    if (selectedUserType) {
      try {
        const response = await axios.post(
          "https://gateway.dhanushop.com/api/role/listByUserTypeID",
          {
            userId: userId,
            UserTypeID: selectedUserType,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    } else {
      setRoles([]);
    }
  };

  // const isValidCoordinates = (lat, lon) => {
  //   const latitude = parseFloat(lat);
  //   const longitude = parseFloat(lon);
  //   return (
  //     !isNaN(latitude) &&
  //     !isNaN(longitude) &&
  //     latitude >= -90 &&
  //     latitude <= 90 &&
  //     longitude >= -180 &&
  //     longitude <= 180
  //   );
  // };
const selectedUserType = userTypes.find(
  (ut) => ut.UserTypeID.toString() === formData.userType?.toString()
);
 
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
                  User Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleUserTypeChange}
                  className="border border-gray-300 px-2 py-2 rounded-md"
                >
                  <option value="" disabled>
                    Select a User Type{" "}
                  </option>
                  {userTypes
                    .filter(
                      (userType) =>
                        userType.UserTypeName.toLowerCase() !== "employee"
                    )
                    .map((userType) => (
                      <option
                        key={userType.UserTypeID}
                        value={userType.UserTypeID}
                      >
                        {userType.UserTypeName}
                      </option>
                    ))}
                </select>
              </div>

             


              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={handleroleChange}
                  className="border border-gray-300 px-2 py-2 rounded-md min-w-40"
                  disabled={!roles.length}
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {roles.map((role) => (
                    <option key={role.RoleID} value={role.RoleID}>
                      {
                        role.RoleNAme /* Note: response has RoleNAme (typo), be consistent */
                      }
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="First Name "
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
                label="Last Name "
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
                
              />
            </div>
            <div className="flex gap-4 items-center">
              <Input
                label="Mobile Number "
                name="mobile"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow typing up to 10 digits and only if it starts with 6-9
                  if (/^$|^[6-9]\d{0,9}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-full"
                inputMode="numeric"
                pattern="^[6-9]\d{9}$"
                title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
                maxLength={10}
                required
              />

              <Input
                label="Alternate Mobile Number"
                name="altMobile"
                value={formData.altMobile}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^$|^[6-9]\d{0,9}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-full"
                inputMode="numeric"
                pattern="^[6-9]\d{9}$"
                title="Mobile number must be exactly 10 digits."
                maxLength={10}
                 
              />
            </div>
            <Input
              label="Email "
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
                 
              />
              <Input
                label="Residential Area "
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
                maxLength={100}
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
                if (value.length <= 100 && /^[a-zA-Z0-9\s.,'-]*$/.test(value)) {
                  handleChange(e);
                }
              }}
              maxLength={100}
              className="w-full"
              pattern="^[a-zA-Z0-9\s.,'-]*$"
              title="Please enter a valid Landmark (letters, numbers, spaces, and basic punctuation only)."
            />

            <Input
              label="Pincode "
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
                label=" State "
                name="resState"
                value={formData.resState}
                onChange={handleChange}
                options={states}
                required
              />

              <Selectlistbyapi
                label="City "
                name="resCity"
                value={formData.resCity}
                onChange={handleChange}
                options={cities}
                required
              />
            </div>
          </>
        )}

       {currentStep === 2 && (
  <>
 
    {/* Group 1: Shop Name + Address */}
    <div className="flex  gap-4">
      <Input
        label="Shop Name "
        name="shopName"
        value={formData.shopName}
        onChange={(e) => {
          const value = e.target.value;
          if (
            value.length <= 100 &&
            /^[a-zA-Z0-9\s.,'-]*$/.test(value)
          ) {
            handleChange(e);
          }
        }}
        maxLength={100}
        className="w-full md:w-1/2"
        pattern="^[a-zA-Z0-9\s.,'-]+$"
        title="Please enter a valid shop name"
        required
      />

      <Input
        label="Shop Address "
        name="shopAddress"
        value={formData.shopAddress}
        onChange={(e) => {
          const value = e.target.value;
          if (
            value.length <= 100 &&
            /^[a-zA-Z0-9\s.,'-]*$/.test(value)
          ) {
            handleChange(e);
          }
        }}
        maxLength={100}
        className="w-full md:w-1/2"
        pattern="^[a-zA-Z0-9\s.,'-]+$"
        title="Please enter a valid shop address"
        required
      />
       </div>
<div className="flex justify-end w-full ">         <span
        type="button"
        className="text-blue-500 rounded-md text-xs cursor-pointer "
        onClick={copyResidentialToBusiness}
      >
        Same as Residential Address
      </span>
      </div>

   

    {/* Group 2: Latitude + Longitude */}
    <div className="flex  gap-4 items-center">
      <Input
        label="Latitude "
        name="latitude"
        value={formData.latitude}
        onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d{0,2}(\.\d{0,10})?$/.test(value)) {
            handleChange(e);
          }
        }}
        className="w-full md:w-1/2"
        inputMode="decimal"
        title="Latitude must be between -90 and 90"
        required
      />

      <Input
        label="Longitude "
        name="longitude"
        value={formData.longitude}
        onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d{0,3}(\.\d{0,10})?$/.test(value)) {
            handleChange(e);
          }
        }}
        className="w-full md:w-1/2"
        inputMode="decimal"
        title="Longitude must be between -180 and 180"
        required
      />
    

    {/* Map Button */}
    <div className="mt-2">
      <button className="flex items-center hover:text-blue-500">
        <span className="mr-2 text-nowrap">Locate on Map</span>
        <IoMdLocate size={30} />
      </button>
    </div>
    </div>

    {/* Website URL for Whitelabel */}
    {formData.userType === "2" && (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL <span className="text-red-600">*</span>
        </label>
        <input
          type="url"
          name="websiteUrl"
          value={formData.websiteUrl }
          onChange={handleChange}
          className="border border-gray-300 px-2 py-2 rounded-md w-full"
          placeholder="https://yourdomain.com"
          pattern="https?://.*"
          title="Enter a valid URL"
          required
        />
      </div>
    )}

    {/* Group 3: Landmark + Pincode */}
    <div className="flex  gap-4">
      <Input
        label="Landmark (optional)"
        name="busLandmark"
        value={formData.busLandmark}
        onChange={(e) => {
          const value = e.target.value;
          if (
            value.length <= 100 &&
            /^[a-zA-Z0-9\s.,'-]*$/.test(value)
          ) {
            handleChange(e);
          }
        }}
        maxLength={100}
        className="w-full md:w-1/2"
        pattern="^[a-zA-Z0-9\s.,'-]+$"
        title="Enter a valid landmark"
      />

      <Input
        label="Pincode "
        name="busPincode"
        value={formData.busPincode}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,6}$/.test(value)) {
            handleChange(e);
          }
        }}
        className="w-full md:w-1/2"
        inputMode="numeric"
        pattern="^\d{6}$"
        title="Pincode"
        maxLength={6}
        required
      />
   

      <Selectlistbyapi
        label="State "
        name="busState"
        value={formData.busState}
        onChange={handleChange}
        options={states}
        className="w-full md:w-1/2"
        required
      />
      <Selectlistbyapi
        label="City "
        name="busCity"
        value={formData.busCity}
        onChange={handleChange}
        options={cities}
        className="w-full md:w-1/2"
        required
      />
    </div>
  </>
)}

        {currentStep === 3 && (
          <>
            <div className="flex gap-4">
              <Input
                label="Account Holder Name "
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 40 && /^[a-zA-Z\s.']*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                maxLength={40}
                className="w-full"
                pattern="^[a-zA-Z\s.']+$"
                title="Only letters, spaces, apostrophes, and periods are allowed."
                required
              />

              <Selectlistbyapi
                label="Bank Name "
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                options={bankList} // assume this is a list of banks from API or static
                className="w-full"
                required
              />
            </div>
            <div className=" flex space-x-4">
              <Input
                label="Bank Branch "
                name="branchName" // ✅ Match the field used in formData and validation
                value={formData.branchName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value.length <= 100 &&
                    /^[a-zA-Z0-9\s.,'-]*$/.test(value)
                  ) {
                    handleChange(e);
                  }
                }}
                maxLength={100}
                className="w-full"
                pattern="^[a-zA-Z0-9\s.,'-]+$"
                title="Please enter a valid branch name."
                required
              />
              <Input
                label="IFSC Code "
                name="ifscCode"
                value={formData.ifscCode}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase(); // Convert to uppercase
                  if (/^[A-Z0-9]{0,11}$/.test(value)) {
                    handleChange({ target: { name: "ifscCode", value } });
                  }
                }}
                className="w-full"
                pattern="^[A-Z]{4}0[A-Z0-9]{6}$" // Strict format validated on form submit
                title="Enter a valid 11-character IFSC code (e.g., HDFC0001234)."
                maxLength={11}
                required
              />
            </div>

            
  <div className="flex gap-4">
      {/* Account Number Field */}
      <div className="relative w-full">
        <Input
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,20}$/.test(value)) {
              handleChange(e);
            }
          }}
          inputMode="numeric"
          className="w-full pr-10" // Reserve space for icon
          type={showAccount ? "text" : "password"}
          pattern="^\d{8,20}$"
          title="Account number must be between 8 and 20 digits."
          maxLength={20}
          required
        />
        <div className="absolute inset-y-0 right-2 top-5 flex items-center">
          <button
            type="button"
            onClick={() => setShowAccount((prev) => !prev)}
            className="text-gray-500 focus:outline-none"
          >
            {showAccount ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Account Number Field */}
      <div className="relative w-full">
        <Input
          label="Confirm Account Number"
          name="confirmAccountNumber"
          value={formData.confirmAccountNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,20}$/.test(value)) {
              handleChange(e);
            }
          }}
          inputMode="numeric"
          className="w-full pr-10"
          type={showConfirmAccount ? "text" : "password"}
          pattern="^\d{8,20}$"
          title="Must match the account number above."
          maxLength={20}
          required
        />
        <div className="absolute inset-y-0 right-2 top-5 flex items-center">
          <button
            type="button"
            onClick={() => setShowConfirmAccount((prev) => !prev)}
            className="text-gray-500 focus:outline-none"
          >
            {showConfirmAccount ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-10 absolute w-[95%]">
        {currentStep !== 0 ? (
          <button onClick={prevStep} className="btn-outline">
            Previous
          </button>
        ) : (
          <div className="w-[120px]"></div> // Placeholder
        )}

        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="btn"
            style={{ backgroundColor: isStepValid() ? "#007bff" : "#cccccc" }}
            disabled={!isStepValid() || loading}
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="btn-success"
            style={{ backgroundColor: isStepValid() ? "#28a745" : "#cccccc" }}
            disabled={!isStepValid() || loading}
          >
            Preview & Submit
          </button>
        )}
      </div>

      {isPreviewOpen && (
        <PreviewPane
          formData={formData}
          onClose={handlePreviewClose}
          onSubmit={submitStepData}
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
  required = false,  // new prop to indicate if required
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        type={type}
        name={name}
        value={type !== "file" ? value : undefined}
        onChange={onChange}
        required={required} // set required attribute on input as well
        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
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
  required = false, // new prop
}) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
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
