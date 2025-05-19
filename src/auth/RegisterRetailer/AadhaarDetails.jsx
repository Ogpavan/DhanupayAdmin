import React, { useEffect, useState } from "react";
import Stepper from "./Stepper.jsx"; // Import the Stepper component from "./Stepper";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";

const AadhaarDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { combinedData } = location.state || {};
  const [btnLoading, setbtnLoading] = useState(false);

  const [aadhaarNo, setAadhaarNo] = useState("");
  const [aadhaarFront, setAadhaarFront] = useState({ file: null, preview: null });
  const [aadhaarBack, setAadhaarBack] = useState({ file: null, preview: null });

  const [aadhaarError, setAadhaarError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedData = JSON.parse(localStorage.getItem("registrationData"));
    if (storedData && storedData.aadhaarDetails) {
      setAadhaarNo(storedData.aadhaarDetails.aadhaarNo);
      setAadhaarFront({ file: null, preview: storedData.aadhaarDetails.aadhaarFront || null });
      setAadhaarBack({ file: null, preview: storedData.aadhaarDetails.aadhaarBack || null });
    }
  }, []);

  const handleAadhaarChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAadhaarNo(value);
      if (value.length === 12) {
        setAadhaarError("");
      } else {
        setAadhaarError("Aadhaar number must be 12 digits.");
      }
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { // 2MB
      Swal.fire({
        title: "File Too Large",
        text: "Please upload an image smaller than 2MB.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }


    const previewURL = URL.createObjectURL(file);
    if (type === "front") {
      setAadhaarFront({ file, preview: previewURL });
    } else {
      setAadhaarBack({ file, preview: previewURL });
    }
  };

  const handleNext = async () => {
    if (aadhaarNo.length !== 12) {
      setAadhaarError("Aadhaar number must be 12 digits.");
      return;
    }

    if (!aadhaarFront.preview || !aadhaarBack.preview) {
      Swal.fire({
        title: "Incomplete Details",
        text: "Please fill all the required details, including Aadhaar number and both front and back images.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setbtnLoading(true);
    const newUserId = localStorage.getItem("newUserId");

    const formData = new FormData();
    formData.append("UserId", newUserId);
    formData.append("newUserId", newUserId);
    formData.append("DocumentType", "Aadhaar");
    formData.append("DocumentNumber", aadhaarNo);
    formData.append("FrontImage", aadhaarFront.file);
    formData.append("BackImage", aadhaarBack.file);
    formData.append("VideoFile", "");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/uploadDocuments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("API Response:", response.data);
      Swal.fire("Success", "Aadhaar details submitted successfully!", "success");

      const updatedData = {
        ...combinedData,
        aadhaarDetails: {
          aadhaarNo,
          aadhaarFront: aadhaarFront.preview,
          aadhaarBack: aadhaarBack.preview,
        },
      };

      localStorage.setItem("registrationData", JSON.stringify(updatedData));
      setbtnLoading(false);
      navigate("/pan-details");
    } catch (error) {
      console.error("API Error:", error);
      setbtnLoading(false);
      Swal.fire("Error", "Failed to submit Aadhaar details.", "error");
    }
  };

  // Disable next button if errors or missing files
  const isNextDisabled =
    btnLoading ||
    aadhaarError !== "" ||
    aadhaarNo.length !== 12 ||
    !aadhaarFront.preview ||
    !aadhaarBack.preview;

  return (
    <div className="font-poppins  min-h-screen  max-w-md mx-auto flex items-center">
 

      <div className="bg-white rounded-t-3xl px-4 py-6     -mt-6">
        <Stepper currentStep={3} />
        <h1 className="poppins-semibold text-[#121649] text-center py-4">
          Aadhaar Details
        </h1>

        <form className="space-y-3">
          <label className="block text-[#121649] font-semibold mb-1">
            Aadhaar No. (12 Digits) <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Aadhaar Number"
            className={`input-field w-full ${aadhaarError ? "border-red-500" : ""}`}
            maxLength={12}
            inputMode="numeric"
            value={aadhaarNo}
            onChange={handleAadhaarChange}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                e.preventDefault();
              }
            }}
            required
          />
          {aadhaarError && (
            <p className="text-red-500 text-sm mt-1">{aadhaarError}</p>
          )}

          <div className="mb-4">
            <label className="block text-[#2C2DCB] text-sm font-semibold mb-2">
              Upload Aadhaar Front Side <span className="text-red-600">*</span>
            </label>
            <div className="w-full h-48 border-2 border-dashed border-[#2C2DCB] rounded-xl flex items-center justify-center relative overflow-hidden bg-gray-50">
              {aadhaarFront.preview ? (
                <img
                  src={aadhaarFront.preview}
                  alt="Aadhaar Front"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#2C2DCB]">
                  <FiUploadCloud className="text-4xl mb-2" />
                  <p className="text-sm font-medium">Click to Upload Aadhaar Front</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                id="aadhaarFrontFile"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, "front")}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Accepted format: JPG, PNG | Max size: 2MB
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-[#2C2DCB] text-sm font-semibold mb-2">
              Upload Aadhaar Back Side <span className="text-red-600">*</span>
            </label>
            <div className="w-full h-48 border-2 border-dashed border-[#2C2DCB] rounded-xl flex items-center justify-center relative overflow-hidden bg-gray-50">
              {aadhaarBack.preview ? (
                <img
                  src={aadhaarBack.preview}
                  alt="Aadhaar Back"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#2C2DCB]">
                  <FiUploadCloud className="text-4xl mb-2" />
                  <p className="text-sm font-medium">Click to Upload Aadhaar Back</p>
                </div>

              )}

              <input
                type="file"
                accept="image/*"
                id="aadhaarBackFile"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, "back")}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Accepted format: JPG, PNG | Max size: 2MB
            </p>
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
            disabled={isNextDisabled}
            className={`w-1/2 text-white text-lg py-2 rounded-xl font-semibold ${isNextDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#2C2DCB]"
              }`}
          >
            {btnLoading ? "Processing..." : "Save & Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AadhaarDetails;