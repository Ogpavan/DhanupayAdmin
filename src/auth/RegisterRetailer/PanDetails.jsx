import React, { useEffect, useState } from "react";
import Stepper from "./Stepper.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";

const PanDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [panNumber, setPanNumber] = useState("");
  const [panFront, setPanFront] = useState(null);
  const [btnLoading, setbtnLoading] = useState(false);

  // New state for PAN validation error
  const [panError, setPanError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const storedData = JSON.parse(localStorage.getItem("registrationData"));
    if (storedData && storedData.panDetails) {
      setPanNumber(storedData.panDetails.panNumber);
      setPanFront(storedData.panDetails.panFront);
    }
  }, []);

  const validatePan = (value) => {
    // PAN regex: 5 letters, 4 digits, 1 letter
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!value) return "PAN number is required.";
    if (!regex.test(value)) return "Invalid PAN format. Expected: AAAAA9999A";
    return "";
  };

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (!/^[A-Z0-9]*$/.test(value)) return; // allow only alphanumeric uppercase
    setPanNumber(value);

    // Clear error while typing
    if (panError) setPanError("");
  };

  // Validate on blur
  const handlePanBlur = () => {
    const errorMsg = validatePan(panNumber);
    setPanError(errorMsg);
  };

  const handlePanFrontUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setPanFront(objectURL);
      if (file.size > 2 * 1024 * 1024) { // 2MB
        Swal.fire({
          title: "File Too Large",
          text: "Please upload an image smaller than 2MB.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }


      const updatedData = JSON.parse(localStorage.getItem("registrationData")) || {};
      updatedData.panDetails = {
        ...updatedData.panDetails,
        panFront: objectURL,
      };
      localStorage.setItem("registrationData", JSON.stringify(updatedData));
    }
  };

  const handleNext = async () => {
    // Validate before submit
    const errorMsg = validatePan(panNumber);
    if (errorMsg) {
      setPanError(errorMsg);
      return;
    }

    if (!panFront) {
      Swal.fire({
        title: "Incomplete Details",
        text: "Please fill in the PAN number and upload the PAN front image.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setbtnLoading(true);
    const newUserId = localStorage.getItem("newUserId");

    const panInput = document.getElementById("panFrontFile");
    const panFile = panInput?.files[0];

    if (!panFile) {
      Swal.fire("Error", "Please upload your PAN front image.", "error");
      setbtnLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("UserId", newUserId);
    formData.append("newUserId", newUserId);
    formData.append("DocumentType", "PAN");
    formData.append("DocumentNumber", panNumber);
    formData.append("FrontImage", panFile);
    formData.append("VideoFile", ""); // optional

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/uploadDocuments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Success", "PAN details submitted successfully!", "success");

      const updatedData = {
        ...location.state?.combinedData,
        panDetails: {
          panNumber,
          panFront,
        },
      };
      localStorage.setItem("registrationData", JSON.stringify(updatedData));

      setbtnLoading(false);
      navigate("/bank-detail");
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", "Failed to submit PAN details.", "error");
      setbtnLoading(false);
    }
  };

  return (
    <div className="font-poppins    max-w-xl mx-auto mt-10 w-full ">
     

      <div style={{ height: "calc(100vh - 15vh)" }} className=" bg-white rounded-t-3xl px-4 py-6     -mt-6">
        <Stepper currentStep={4} />

        <h1 className="poppins-semibold text-[#121649] text-center py-4">
          PAN Details
        </h1>

        <form className="space-y-1">
          <label className="block text-[#121649] font-semibold mb-1">
            PAN No. <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="PAN No. (AAAAA9999A)"
            className={`input-field w-full ${panError ? "border-red-500" : ""}`}
            maxLength={10}
            inputMode="text"
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            value={panNumber}
            onChange={handlePanChange}
            onBlur={handlePanBlur}
            required
          />
          {panError && (
            <p className="text-red-600 text-sm mt-1">{panError}</p>
          )}

          {/* PAN Front Upload */}
          <div className="mb-4 mt-4">
            <label className="block text-[#2C2DCB] text-sm font-semibold mb-2">
              Upload PAN Front Side <span className="text-red-600">*</span>
            </label>
            <div className="w-full h-48 border-2 border-dashed border-[#2C2DCB] rounded-xl flex items-center justify-center relative overflow-hidden bg-gray-50">
              {panFront ? (
                <img
                  src={panFront}
                  alt="PAN Front Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#2C2DCB]">
                  <FiUploadCloud className="text-4xl mb-2" />
                  <p className="text-sm font-medium">Click to Upload PAN Front</p>
                </div>
              )}
              <input
                type="file"
                id="panFrontFile"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handlePanFrontUpload}
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
            disabled={btnLoading}
            className="w-1/2 bg-[#2C2DCB] text-white text-lg py-2 rounded-xl font-semibold"
          >
            {btnLoading ? "Processing..." : "Save & Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanDetails;