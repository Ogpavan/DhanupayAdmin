// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Swal from "sweetalert2";
// import Stepper from "../components/Stepper";
// import { fetchStatesList } from "../Api/stateListApi.js";
// import { fetchCitiesByState } from "../Api/CityListApi.js";
// import axios from "axios";

// const ResidentialDetails = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//    const [btnLoading, setbtnLoading] = useState(false);

//   const [form, setForm] = useState({
//     houseNo: "",
//     address: "",
//     landmark: "",
//     pincode: "",
//     city: "",
//     state: "",
//   });

//   const [basicDetails, setBasicDetails] = useState(location.state?.basicDetails || {});
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   useEffect(() => {
//     const savedForm = localStorage.getItem("residentialForm");
//     if (savedForm) {
//       const parsedForm = JSON.parse(savedForm);
//       // Only overwrite if form is empty (all fields blank)
//       const isFormEmpty = Object.values(form).every((val) => val === "");
//       if (isFormEmpty) {
//         setForm(parsedForm);
//       }
//     }
//   }, []);


//   // Save form to localStorage on change
//   useEffect(() => {
//     const isFormEmpty = Object.values(form).every((val) => val === "");
//     if (!isFormEmpty) {
//       localStorage.setItem("residentialForm", JSON.stringify(form));
//     }
//   }, [form]);

//   useEffect(() => {
//     const getStates = async () => {
//       try {
//         const statesData = await fetchStatesList();
//         setStates(statesData);
//       } catch (error) {
//         console.error("Error fetching states:", error);
//       }
//     };
//     getStates();
//   }, []);

//   useEffect(() => {
//     const getCities = async () => {
//       if (form.state) {
//         try {
//           const citiesData = await fetchCitiesByState(form.state);
//           setCities(citiesData);
//         } catch (error) {
//           console.error("Error fetching cities:", error);
//         }
//       }
//     };
//     getCities();
//   }, [form.state]);

//   const validate = () => {
//     if (!form.houseNo.trim()) {
//       Swal.fire("Missing Field", "House No. is required", "error");
//       return false;
//     }
//     if (!form.address.trim()) {
//       Swal.fire("Missing Field", "Address is required", "error");
//       return false;
//     }
//     if (!form.landmark.trim()) {
//       Swal.fire("Missing Field", "Landmark is required", "error");
//       return false;
//     }
//     if (!/^\d{6}$/.test(form.pincode)) {
//       Swal.fire("Invalid Pincode", "Enter a valid 6-digit pincode", "error");
//       return false;
//     }
//     if (!form.state) {
//       Swal.fire("Missing Field", "Please select a state", "error");
//       return false;
//     }
//     if (!form.city) {
//       Swal.fire("Missing Field", "Please select a city", "error");
//       return false;
//     }
//     return true;
//   };

//   // const handleNext = () => {
//   //   if (!validate()) return;

//   //   const residentialData = { ...form };
//   //   console.log("data at resential pages")
//   //   console.log("Basic Details:", basicDetails);
//   // console.log("Residential Data:", residentialData);

//   //   navigate("/business-details");
//   // };


//   // Inside ResidentialDetails component
//   const handleNext = async () => {
//     setbtnLoading(true);

//     const newUserId = localStorage.getItem("newUserId")
//     if (!validate()) {setbtnLoading(false ); return} 

//     const residentialData = { ...form };


//     const payload = {
//       UserID: newUserId, // Assuming you're still sending this empty
//       NewUserId: newUserId,
//       RoleID: "19",
//       Stage: "ResidentialDetails",
//       PersonalAddressLine1: residentialData.address,
//       PersonalAddressLine2: residentialData.landmark,
//       PersonalCityID: residentialData.city,
//       PersonalStateID: residentialData.state,
//       PersonalPincode: residentialData.pincode,
//     };

//     console.log("Payload before API call:", payload);

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/registerbystage`, payload);
//       console.log("API Response:", response.data);

//       Swal.fire("Success", "Residential details submitted successfully!", "success");
//       setbtnLoading(false);
//       navigate("/business-details");
//     } catch (error) {
//       console.error("API Error:", error);
//       Swal.fire("Error", error?.response?.data?.message || "Something went wrong!", "error");
//     setbtnLoading(false);
//     }
//   };
//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   return (
//     <div className="font-poppins min-h-screen bg-[#2C2DCB] sm:hidden">
//       <div className="h-[20vh] px-4 flex items-center">
//         <span className="text-white text-xl poppins-medium">&lt; Register</span>
//       </div>

//       <div style={{ height: "calc(100vh - 15vh)" }} className="  bg-white rounded-t-3xl px-4 py-6    -mt-6 overflow-y-auto">
//         <Stepper currentStep={1} />
//         <h1 className="poppins-semibold text-[#121649] text-center py-4">Residential Details</h1>

//         <form className="space-y-3">
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               placeholder="House No."
//               className="input-field"
//               value={form.houseNo}
//               maxLength={10}
//               onChange={(e) => handleChange("houseNo", e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Residential Area"
//               className="input-field"
//               value={form.address}
//               maxLength={50}
//               onChange={(e) => handleChange("address", e.target.value)}
//             />
//           </div>

//           <input
//             type="text"
//             placeholder="Landmark"
//             className="input-field"
//             value={form.landmark}
//             maxLength={50}
//             onChange={(e) => handleChange("landmark", e.target.value)}
//           />

//           <input
//             type="tel"
//             placeholder="Pincode"
//             className="input-field"
//             inputMode="numeric"
//             maxLength={6}
//             value={form.pincode}
//             onChange={(e) => {
//               const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
//               setForm({ ...form, pincode: onlyDigits });
//             }}
//           />


//           <select
//             value={form.state}
//             onChange={(e) => handleChange("state", e.target.value)}
//             className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none ${form.state ? "text-gray-800" : "text-gray-400"}`}
//           >
//             <option value="" disabled hidden>Select State</option>
//             {states.map((stateItem) => (
//               <option key={stateItem.StateId} value={stateItem.StateId}>
//                 {stateItem.StateName}
//               </option>
//             ))}
//           </select>

//           <select
//             value={form.city}
//             onChange={(e) => handleChange("city", e.target.value)}
//             className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none ${form.city ? "text-gray-800" : "text-gray-400"}`}
//           >
//             <option value="" disabled hidden>Select City</option>
//             {cities.length > 0 ? (
//               cities.map((cityItem) => (
//                 <option key={cityItem.CityId} value={cityItem.CityId}>
//                   {cityItem.CityName}
//                 </option>
//               ))
//             ) : (
//               <option disabled>No cities available</option>
//             )}
//           </select>
//         </form>

//         <div className="mt-6 flex space-x-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="w-1/2 bg-gray-200 text-gray-800 text-lg py-2 rounded-xl font-semibold"
//           >
//             ← Back
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={btnLoading}
//             className="w-1/2 bg-[#2C2DCB] text-white text-lg py-2 rounded-xl font-semibold"
//           >
//           {btnLoading ? 'Processing...' : 'Save & Next →'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResidentialDetails;



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Stepper from "./Stepper.jsx";
import { fetchStatesList } from "./Api/stateListApi.jsx";
import { fetchCitiesByState } from "./Api/CityListApi.jsx";
import axios from "axios";

const ResidentialDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [btnLoading, setbtnLoading] = useState(false);

  const [form, setForm] = useState({
    houseNo: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({
    houseNo: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [basicDetails, setBasicDetails] = useState(location.state?.basicDetails || {});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const savedForm = localStorage.getItem("residentialForm");
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      // Only overwrite if form is empty (all fields blank)
      const isFormEmpty = Object.values(form).every((val) => val === "");
      if (isFormEmpty) {
        setForm(parsedForm);
      }
    }
  }, []);

  // Save form to localStorage on change
  useEffect(() => {
    const isFormEmpty = Object.values(form).every((val) => val === "");
    if (!isFormEmpty) {
      localStorage.setItem("residentialForm", JSON.stringify(form));
    }
  }, [form]);

  useEffect(() => {
    const getStates = async () => {
      try {
        const statesData = await fetchStatesList();
        setStates(statesData);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    getStates();
  }, []);

  useEffect(() => {
    const getCities = async () => {
      if (form.state) {
        try {
          const citiesData = await fetchCitiesByState(form.state);
          setCities(citiesData);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };
    getCities();
  }, [form.state]);

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "houseNo":
        if (!value.trim()) {
          error = "House No. is required";
        }
        break;
      case "address":
        if (!value.trim()) {
          error = "Address is required";
        }
        break;
      case "pincode":
        if (!value.trim()) {
          error = "Pincode is required";
        } else if (!/^\d{6}$/.test(value)) {
          error = "Enter a valid 6-digit pincode";
        }
        break;
      case "state":
        if (!value) {
          error = "State is required";
        }
        break;
      case "city":
        if (!value) {
          error = "City is required";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validate = () => {
    const newErrors = {
      houseNo: validateField("houseNo", form.houseNo),
      address: validateField("address", form.address),
      pincode: validateField("pincode", form.pincode),
      state: validateField("state", form.state),
      city: validateField("city", form.city),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleNext = async () => {
    setbtnLoading(true);

    if (!validate()) {
      setbtnLoading(false);
      return;
    }

     // New validation for residentialAddress
  if (form.address.trim().length < 4) {
    Swal.fire("Missing Field", "Residential address must be at least 4 characters long", "error");
     setbtnLoading(false);
    return;
  }

    const newUserId = localStorage.getItem("newUserId");
    const residentialData = { ...form };

    const payload = {
      UserID: newUserId,
      NewUserId: newUserId,
      RoleID: "19",
      Stage: "ResidentialDetails",
      PersonalAddressLine1: residentialData.address,
      PersonalAddressLine2: residentialData.landmark,
      PersonalCityID: residentialData.city,
      PersonalStateID: residentialData.state,
      PersonalPincode: residentialData.pincode,
    };

    console.log("Payload before API call:", payload);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/registerbystage`, payload);
      console.log("API Response:", response.data);

      Swal.fire("Success", "Residential details submitted successfully!", "success");
      setbtnLoading(false);
      navigate("/business-details");
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", error?.response?.data?.message || "Something went wrong!", "error");
      setbtnLoading(false);
    }
  };




 

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

 const handleBlur = (field, value) => {
  if (field === "address") {
    if (value.trim().length < 4) {
      setErrors(prev => ({
        ...prev,
        address: "Residential Address must be at least 4 characters",
      }));
    } else {
      setErrors(prev => ({ ...prev, address: "" }));
    }
  }
};

  return (
    <div className="font-poppins min-h-screen   ">
       

      <div style={{ height: "calc(100vh - 15vh)" }} className="bg-white rounded-t-3xl px-4 py-6    -mt-6 overflow-y-auto">
        <Stepper currentStep={1} />
        <h1 className="poppins-semibold text-[#121649] text-center py-4">Residential Details</h1>

        <form className="space-y-3">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <div className="flex">
                <label className="text-sm text-gray-600 mb-1">House No.<span className="text-red-500">*</span></label>
              </div>
              <input
                type="text"
                placeholder="House No."
                className={`input-field w-full ${errors.houseNo ? 'border-red-500' : 'border-gray-300'}`}
                value={form.houseNo}
                maxLength={10}
                onChange={(e) => handleChange("houseNo", e.target.value)}
                onBlur={(e) => handleBlur("houseNo", e.target.value)}
              />
              {errors.houseNo && <p className="text-red-500 text-xs mt-1">{errors.houseNo}</p>}
            </div>
            <div className="w-1/2">
              <div className="flex">
                <label className="text-sm text-gray-600 mb-1">Residential Address<span className="text-red-500">*</span></label>
              </div>
              <input
                type="text"
                placeholder="Residential Address"
                className={`input-field w-full ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                value={form.address}
                maxLength={50}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={(e) => handleBlur("address", e.target.value)}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1">Landmark</label>
            <input
              type="text"
              placeholder="Landmark"
              className="input-field"
              value={form.landmark}
              maxLength={50}
              onChange={(e) => handleChange("landmark", e.target.value)}
            />
          </div>


          <div>
            <div className="flex">
              <label className="text-sm text-gray-600 mb-1">State<span className="text-red-500">*</span></label>
            </div>
            <select
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              onBlur={(e) => handleBlur("state", e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${errors.state ? 'border-red-500' : 'border-gray-300'
                } ${form.state ? "text-gray-800" : "text-gray-400"}`}
            >
              <option value="" disabled hidden>Select State</option>
              {states.map((stateItem) => (
                <option key={stateItem.StateId} value={stateItem.StateId}>
                  {stateItem.StateName}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          <div>
            <div className="flex">
              <label className="text-sm text-gray-600 mb-1">City<span className="text-red-500">*</span></label>
            </div>
            <select
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={(e) => handleBlur("city", e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${errors.city ? 'border-red-500' : 'border-gray-300'
                } ${form.city ? "text-gray-800" : "text-gray-400"}`}
            >
              <option value="" disabled hidden>Select City</option>
              {cities.length > 0 ? (
                cities.map((cityItem) => (
                  <option key={cityItem.CityId} value={cityItem.CityId}>
                    {cityItem.CityName}
                  </option>
                ))
              ) : (
                <option disabled>No cities available</option>
              )}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <div className="flex">
              <label className="text-sm text-gray-600 mb-1">Pincode<span className="text-red-500">*</span></label>
            </div>
            <input
              type="tel"
              placeholder="Pincode"
              className={`input-field ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                handleChange("pincode", onlyDigits);
              }}
              onBlur={(e) => handleBlur("pincode", e.target.value)}
            />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
          </div>

        </form>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 bg-gray-200 text-gray-800 text-lg py-2 rounded-xl font-semibold"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={btnLoading}
            className="w-1/2 bg-[#2C2DCB] text-white text-lg py-2 rounded-xl font-semibold"
          >
            {btnLoading ? 'Processing...' : 'Save & Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentialDetails;