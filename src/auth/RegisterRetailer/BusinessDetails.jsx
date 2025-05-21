// import React, { useEffect, useState } from "react";
// import Stepper from "../components/Stepper";
// import { useNavigate, useLocation } from "react-router-dom";
// import Swal from "sweetalert2";
// import { fetchStatesList } from "../Api/stateListApi.js"; // Assuming you have the fetchStatesList function
// import { fetchCitiesByState } from "../Api/CityListApi.js"; // Assuming you have the fetchCitiesByState function
// import axios from "axios";

// const BusinessDetails = () => {
//   const navigate = useNavigate();
//   const location = useLocation();  // To access passed state data

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const ResidentialData = JSON.parse(localStorage.getItem("residentialForm")); 
//   // Get the data from the previous route (using useLocation)
 

//   // Initialize form state
//   const [form, setForm] = useState({
//     shopName: "",
//     address: "",
//     landmark: "",
//     pincode: "",
//     city: "",
//     state: "",
//   });

//   const [states, setStates] = useState([]); // States list
//   const [cities, setCities] = useState([]); // Cities list
//    const [btnLoading, setbtnLoading] = useState(false);

//   // Fetch states when the component mounts
//   useEffect(() => {
//     const getStates = async () => {
//       try {
//         const statesData = await fetchStatesList(); // Fetching states
//         setStates(statesData); // Setting the states list
//       } catch (error) {
//         console.error("Error fetching states:", error);
//       }
//     };

//     getStates();
//   }, []);

//   // Fetch cities when a state is selected
//   useEffect(() => {
//     const getCities = async () => {
//       if (form.state) {
//         try {
//           const citiesData = await fetchCitiesByState(form.state); // Fetching cities for the selected state
//           setCities(citiesData); // Setting the cities list
//         } catch (error) {
//           console.error("Error fetching cities:", error);
//         }
//       }
//     };

//     getCities();
//   }, [form.state]); // Re-fetch cities when the state changes

//   // Restore data from localStorage if the form is empty
//   useEffect(() => {
//     const savedForm = localStorage.getItem("businessForm");
//     const isFormEmpty = Object.values(form).every((val) => val === "");

//     if (isFormEmpty && savedForm) {
//       setForm(JSON.parse(savedForm));
//     }
//   }, []);

//   // Save data to localStorage if form is updated and not empty
//   useEffect(() => {
//     const isFormEmpty = Object.values(form).every((val) => val === "");
//     if (!isFormEmpty) {
//       localStorage.setItem("businessForm", JSON.stringify(form));
//     }
//   }, [form]);

//   // Handle "Same as Residential Address" click
//   const handleSameAsResidential = () => {
//     if (ResidentialData) {
//       setForm({
//         ...form,
//         address: ResidentialData.address || "",
//         landmark: ResidentialData.landmark || "",
//         pincode: ResidentialData.pincode || "",
//         city: ResidentialData.city || "",
//         state: ResidentialData.state || "",
//       });
//     } else {
//       Swal.fire({
//         title: "Alert",
//         text: "No residential address found.",
//         icon: "warning",
//       });
//     }
//   };

//   // Form validation
//   const validateForm = () => {
//     const { shopName, address, landmark, pincode, city, state } = form;
//     if (
//       !shopName.trim() ||
//       !address.trim() ||
//       !landmark.trim() ||
//       !/^\d{6}$/.test(pincode) ||
//       !city ||
//       !state
//     ) {
//       Swal.fire({
//         title: "Validation Error",
//         text: "Please complete all fields correctly.",
//         icon: "error",
//       });
//       return false;
//     }
//     return true;
//   };

//   // Handle the next button click
//   // const handleNext = () => {
//   //   if (validateForm()) {
//   //     // Combine the data from basic, residential, and business forms
//   //     const combinedData = {
//   //       heading: "Registration Form Data",
//   //       basicDetails: { ...basicDetails },
//   //       residentialData: { ...residentialData },
//   //       businessDetails: { ...form },
//   //     };

//   //     // Log the combined data to the console
//   //     console.log("Combined Data: ", combinedData);

//   //     // Store the combined data in localStorage (optional)
//   //     localStorage.setItem("registrationData", JSON.stringify(combinedData));

//   //     // Navigate to the next page, passing the combined data as state
//   //     navigate("/bank-detail");
//   //   }
//   // };


//   const handleNext = async () => {
//     setbtnLoading(true);
//     const newUserId = localStorage.getItem("newUserId")
//     const ShopAddressLine2 = [form.address, form.landmark].filter(Boolean).join(', ');
//     if (!validateForm()) {setbtnLoading(false); return;}

//     const payload = {
//       UserID: newUserId,
//       NewUserId: newUserId,
//       Stage: "BusinessDetails",
//       ShopAddressLine1: form.shopName,
//       ShopAddressLine2: ShopAddressLine2,
//       ShopPincode: form.pincode,
//       ShopCityID: form.city,
//       ShopStateID: form.state,
//       websiteUrl: "",
//       ShopLatitude: "",
//       ShopLongitude: ""
//     };

//     // 🧾 Log the payload
//     console.log("Business Details Payload:", payload);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/users/registerbystage`,
//         payload
//       );

//       console.log("API Response:", response.data);

//       Swal.fire("Success", "Business details submitted successfully!", "success");
//       setbtnLoading(false);
//       navigate("/bank-detail");
//     } catch (error) {
//       console.error("API Error:", error);
//       Swal.fire("Error", "Failed to submit business details.", "error");
//       setbtnLoading(false);
//     }
//   };

//   return (
//     <div className="font-poppins min-h-screen bg-[#2C2DCB] sm:hidden">
//       <div className="h-[20vh] px-4 flex items-center">
//         <span className="text-white text-xl poppins-medium">Register</span>
//       </div>

//       <div className=" bg-white rounded-t-3xl px-4 py-6     -mt-6">
//         <Stepper currentStep={2} />

//         <h1 className="poppins-semibold text-[#121649] text-center py-4">
//           Business Details
//         </h1>

//         <form className="space-y-3">
//           <input
//             type="text"
//             placeholder="Firm or Shop Name"
//             className="input-field w-full"
//             value={form.shopName}
//             maxLength={50}
//             onChange={(e) => setForm({ ...form, shopName: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Firm or Shop Address"
//             className="input-field w-full"
//             value={form.address}
//             maxLength={100}
//             onChange={(e) => setForm({ ...form, address: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Landmark"
//             className="input-field"
//             value={form.landmark}
//             maxLength={50}
//             onChange={(e) => setForm({ ...form, landmark: e.target.value })}
//           />
//           <input
//             type="tel"
//             placeholder="Pincode"
//             className="input-field"
//             inputMode="numeric"
//             maxLength={6}
//             value={form.pincode}
//             onKeyDown={(e) => {
//               if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
//                 e.preventDefault();
//               }
//             }}
//             onChange={(e) => setForm({ ...form, pincode: e.target.value })}
//           />

//           <select
//             value={form.state}
//             onChange={(e) => setForm({ ...form, state: e.target.value })}
//             className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none ${form.state ? "text-gray-800" : "text-gray-400"
//               }`}
//           >
//             <option value="" disabled>
//               Select State
//             </option>
//             {states.map((stateItem) => (
//               <option key={stateItem.StateId} value={stateItem.StateId}>
//                 {stateItem.StateName}
//               </option>
//             ))}
//           </select>

//           <select
//             value={form.city}
//             onChange={(e) => setForm({ ...form, city: e.target.value })}
//             className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none ${form.city ? "text-gray-800" : "text-gray-400"
//               }`}
//           >
//             <option value="" disabled>
//               Select City
//             </option>
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

//           <button
//             type="button"
//             onClick={handleSameAsResidential}
//             className="w-full bg-gray-100 border border-gray-300 text-sm text-[#2C2DCB] font-semibold py-2 rounded-xl mt-2"
//           >
//             Same as Residential Address
//           </button>
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
//             {btnLoading ? 'Processing...' : 'Save & Next →'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BusinessDetails;



import React, { useEffect, useState } from "react";
import Stepper from "./Stepper.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchStatesList } from "./Api/stateListApi.jsx";
import { fetchCitiesByState } from "./Api/CityListApi.jsx";
import axios from "axios";

const BusinessDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ResidentialData = JSON.parse(localStorage.getItem("residentialForm"));

  // Initialize form state with error tracking
  const [form, setForm] = useState({
    shopName: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({
    shopName: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [btnLoading, setbtnLoading] = useState(false);

  // Fetch states when the component mounts
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

  // Fetch cities when a state is selected
  useEffect(() => {
    const getCities = async () => {
      if (form.state) {
        try {
          const citiesData = await fetchCitiesByState(form.state);
          setCities(citiesData);
          // Clear city when state changes
          setForm(prev => ({...prev, city: ""}));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };

    getCities();
  }, [form.state]);

  // Restore data from localStorage if the form is empty
  useEffect(() => {
    const savedForm = localStorage.getItem("businessForm");
    const isFormEmpty = Object.values(form).every((val) => val === "");

    if (isFormEmpty && savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, []);

  // Save data to localStorage if form is updated and not empty
  useEffect(() => {
    const isFormEmpty = Object.values(form).every((val) => val === "");
    if (!isFormEmpty) {
      localStorage.setItem("businessForm", JSON.stringify(form));
    }
  }, [form]);

  // Handle "Same as Residential Address" click
  const handleSameAsResidential = () => {
    if (ResidentialData) {
      setForm({
        ...form,
        address: ResidentialData.address || "",
        landmark: ResidentialData.landmark || "",
        pincode: ResidentialData.pincode || "",
        city: ResidentialData.city || "",
        state: ResidentialData.state || "",
      });
      // Clear errors for copied fields
      setErrors({
        ...errors,
        address: "",
        pincode: "",
        city: "",
        state: "",
      });
    } else {
      Swal.fire({
        title: "Alert",
        text: "No residential address found.",
        icon: "warning",
      });
    }
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "shopName":
        if (!value.trim()) error = "Shop name is required";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "pincode":
        if (!value) error = "Pincode is required";
        else if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;
      case "city":
        if (!value) error = "City is required";
        break;
      case "state":
        if (!value) error = "State is required";
        break;
      default:
        break;
    }
    
    return error;
  };

  // Handle field changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      [name]: value,
    });
    
    // Validate the field if it's not landmark
    if (name !== "landmark") {
      setErrors({
        ...errors,
        [name]: validateField(name, value),
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {
      shopName: validateField("shopName", form.shopName),
      address: validateField("address", form.address),
      pincode: validateField("pincode", form.pincode),
      city: validateField("city", form.city),
      state: validateField("state", form.state),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleNext = async () => {
    setbtnLoading(true);
    const newUserId = localStorage.getItem("newUserId");
    const ShopAddressLine2 = [form.address, form.landmark].filter(Boolean).join(', ');
    
    if (!validateForm()) {
      setbtnLoading(false);
      return;
    }

    const payload = {
      UserID: newUserId,
      NewUserId: newUserId,
      Stage: "BusinessDetails",
      ShopAddressLine1: form.shopName,
      ShopAddressLine2: ShopAddressLine2,
      ShopPincode: form.pincode,
      ShopCityID: form.city,
      ShopStateID: form.state,
      websiteUrl: "",
      ShopLatitude: "",
      ShopLongitude: ""
    };

    console.log("Business Details Payload:", payload);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/registerbystage`,
        payload
      );

      console.log("API Response:", response.data);

      Swal.fire("Success", "Business details submitted successfully!", "success");
      setbtnLoading(false);
      navigate("/bank-detail");
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", "Failed to submit business details.", "error");
      setbtnLoading(false);
    }
  };

  return (
    <div className="font-poppins    max-w-xl mx-auto mt-10 w-full  ">
     

      <div className=" bg-white rounded-t-3xl px-4 py-6     -mt-6">
        <Stepper currentStep={2} />

        <h1 className="poppins-semibold text-[#121649] text-center py-4">
          Business Details
        </h1>

        <form className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Firm or Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="shopName"
              placeholder="Firm or Shop Name"
              className={`input-field w-full `}
              value={form.shopName}
              maxLength={50}
              onChange={handleChange}
            />
            {errors.shopName && (
              <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>
            )}
          </div>
           <button
            type="button"
            onClick={handleSameAsResidential}
            className="w-full bg-gray-100 border border-gray-300 text-sm text-[#2C2DCB] font-semibold py-2 rounded-xl mt-2"
          >
            Same as Residential Address
          </button>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Firm or Shop Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="Firm or Shop Address"
              className={`input-field w-full `}
              value={form.address}
              maxLength={100}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
         

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Landmark
            </label>
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              className="input-field"
              value={form.landmark}
              maxLength={50}
              onChange={handleChange}
            />
          </div>

          

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className={`w-full px-4 py-2 border first-letter:border-gray-300 rounded-xl focus:outline-none ${form.state ? "text-gray-800" : "text-gray-400"}`}
            >
              <option value="" disabled>
                Select State
              </option>
              {states.map((stateItem) => (
                <option key={stateItem.StateId} value={stateItem.StateId}>
                  {stateItem.StateName}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none ${form.city ? "text-gray-800" : "text-gray-400"}`}
            >
              <option value="" disabled>
                Select City
              </option>
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
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>


          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="pincode"
              placeholder="Pincode"
              className={`input-field `}
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
            )}
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

export default BusinessDetails;