import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "./Stepper";
import { FaCamera } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";

const VideoKYC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [btnLoading, setbtnLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { combinedData } = location.state || {};

  // Store both file and preview URL
  const [profilePhoto, setProfilePhoto] = useState({ file: null, preview: null });
  const [shopPhoto, setShopPhoto] = useState({ file: null, preview: null });
  const [kycVideo, setKycVideo] = useState({ file: null, preview: null });

  // Validation error state
  const [errors, setErrors] = useState({
    profilePhoto: "",
    shopPhoto: "",
    kycVideo: "",
  });

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setProfilePhoto({ file, preview });
      setErrors(prev => ({ ...prev, profilePhoto: "" }));
    }
  };

  const handleShopPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setShopPhoto({ file, preview });
      setErrors(prev => ({ ...prev, shopPhoto: "" }));
    }
  };

  const handleKycVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setKycVideo({ file, preview });
      setErrors(prev => ({ ...prev, kycVideo: "" }));
    }
  };

  const handleSubmit = async () => {
    // Reset errors
    let valid = true;
    let newErrors = { profilePhoto: "", shopPhoto: "", kycVideo: "" };

    if (!profilePhoto.file) {
      newErrors.profilePhoto = "Profile Photo is required.";
      valid = false;
    }
    if (!shopPhoto.file) {
      newErrors.shopPhoto = "Shop Photo is required.";
      valid = false;
    }
    if (!kycVideo.file) {
      newErrors.kycVideo = "KYC Video is required.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      Swal.fire({
        title: "Incomplete Uploads",
        text: "Please upload all required files.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setbtnLoading(true);
    const newUserId = localStorage.getItem("newUserId");

    try {
      const formData = new FormData();

      formData.append("UserId", newUserId);
      formData.append("newUserId", newUserId);
      formData.append("DocumentType", "KYC");
      formData.append("FrontImage", profilePhoto.file);
      formData.append("BackImage", shopPhoto.file);
      formData.append("VideoFile", kycVideo.file);

      if (combinedData) {
        Object.entries(combinedData).forEach(([key, value]) => {
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/uploadDocuments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.fire("Success", "Video KYC submitted successfully!", "success");

      localStorage.removeItem("registrationData");
      localStorage.setItem("finalKycData", JSON.stringify({ ...combinedData }));
      setbtnLoading(false);
      localStorage.clear();
      Swal.fire("Success", "Registration Completed!", "success");
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", "Failed to submit Video KYC.", "error");
      setbtnLoading(false);
    }
  };

  return (
    <div className="font-poppins min-h-screen  ">
     

      <div style={{ height: "calc(100vh - 15vh)" }} className="bg-white rounded-t-3xl px-4 py-6     -mt-6">
        <Stepper currentStep={6} />

        <h1 className="poppins-semibold text-[#121649] text-center py-4">
          Video KYC
        </h1>

        <form className="space-y-6">
          <div className="flex justify-evenly space-x-4">
            <div className="flex flex-col items-center">
              <label className="block text-[#2C2DCB] text-sm font-semibold mb-2">
                Upload Profile Photo <span className="text-red-600">*</span>
              </label>
              <div className="relative w-32 aspect-square bg-gray-100 rounded-full overflow-hidden     cursor-pointer">
                {profilePhoto.preview ? (
                  <img
                    src={profilePhoto.preview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <>
                    <div className="absolute w-full h-full bg-black bg-opacity-40 rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-3xl">
                      <FaCamera />
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={handleProfilePhotoUpload}
                />
              </div>
              {errors.profilePhoto && (
                <p className="text-red-600 text-xs mt-1">{errors.profilePhoto}</p>
              )}
            </div>

            <div className="flex flex-col items-center">
              <label className="block text-[#2C2DCB] text-sm font-semibold mb-2">
                Upload Shop Photo <span className="text-red-600">*</span>
              </label>
              <div className="relative w-32 aspect-square bg-gray-100 rounded-full overflow-hidden     cursor-pointer">
                {shopPhoto.preview ? (
                  <img
                    src={shopPhoto.preview}
                    alt="Shop Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <>
                    <div className="absolute w-full h-full bg-black bg-opacity-40 rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-3xl">
                      <FaCamera />
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={handleShopPhotoUpload}
                />
              </div>
              {errors.shopPhoto && (
                <p className="text-red-600 text-xs mt-1">{errors.shopPhoto}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[#2C2DCB] text-sm font-semibold mb-2">
              Upload KYC Video (Max 30 seconds) <span className="text-red-600">*</span>
            </label>
            <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden cursor-pointer">
              {kycVideo.preview ? (
                <video
                  src={kycVideo.preview}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <div className="absolute w-full h-full bg-black bg-opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                    <IoVideocam />
                  </div>
                </>
              )}
              <input
                type="file"
                accept="video/*"
                className="absolute w-full h-full opacity-0 cursor-pointer"
                onChange={handleKycVideoUpload}
              />
            </div>
            {errors.kycVideo && (
              <p className="text-red-600 text-xs mt-1">{errors.kycVideo}</p>
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
            onClick={handleSubmit}
            disabled={btnLoading}
            className="w-1/2 bg-[#2C2DCB] text-white text-lg py-2 rounded-xl font-semibold disabled:opacity-50"
          >
            {btnLoading ? "Processing..." : "Submit →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoKYC;