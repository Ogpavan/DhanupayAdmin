 

import React, { useState } from "react";
import Stepper from "./Stepper.jsx";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";

const BankDetail = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    branchName: "",
    bankName: "",
  });

  const [errors, setErrors] = useState({});
  const [cancelCheque, setCancelCheque] = useState(null);
  const [cancelChequePreview, setCancelChequePreview] = useState(null);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showConfirmAccountNumber, setShowConfirmAccountNumber] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);

  const banks = [
    { BankId: 1, BankName: "State Bank of India" },
    { BankId: 2, BankName: "HDFC Bank" },
    { BankId: 3, BankName: "ICICI Bank" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSizeInMB = 5;

      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File Type",
          text: "Only JPG, PNG, or PDF files are allowed.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      if (file.size / 1024 / 1024 > maxSizeInMB) {
        Swal.fire({
          title: "File Too Large",
          text: `File size should be less than ${maxSizeInMB} MB.`,
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      setCancelCheque(file);
      setCancelChequePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "ifscCode" ? value.toUpperCase() : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    const { accountHolderName, accountNumber, confirmAccountNumber, ifscCode, bankName } = formData;

    if (!accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required.";
    if (!accountNumber) newErrors.accountNumber = "Account number is required.";
    if (!confirmAccountNumber) newErrors.confirmAccountNumber = "Confirm account number is required.";
    if (accountNumber && confirmAccountNumber && accountNumber !== confirmAccountNumber)
      newErrors.confirmAccountNumber = "Account numbers do not match.";
    if (!bankName) newErrors.bankName = "Please select a bank.";
    if (!ifscCode) newErrors.ifscCode = "IFSC code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    setbtnLoading(true);
    const {
      accountHolderName,
      accountNumber,
      confirmAccountNumber,
      ifscCode,
      bankName,
      branchName,
    } = formData;

    const payload = {
      UserID: localStorage.getItem("newUserId"),
      NewUserId: localStorage.getItem("newUserId"),
      Stage: "BankDetails",
      AccountHolderName: accountHolderName,
      AccountNumber: accountNumber,
      IFSCCode: ifscCode,
      BankName: bankName,
      BranchName: branchName,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/registerbystage`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        if (cancelCheque) {
          const formData = new FormData();
          formData.append("UserID", localStorage.getItem("newUserId"));
          formData.append("newUserId", localStorage.getItem("newUserId"));
          formData.append("DocumentType", "CancelCheque");
          formData.append("DocumentNumber", "");
          formData.append("FrontImage", cancelCheque);
          formData.append("BackImage", "");
          formData.append("VideoFile", "");

          try {
            await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/users/uploadDocuments`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          } catch (uploadErr) {
            Swal.fire({
              title: "Upload Failed",
              text: "Bank details were saved, but cancel cheque upload failed.",
              icon: "warning",
              confirmButtonText: "Continue",
            });
            // navigate("/aadhaar-details");
            return;
          }
        }

        Swal.fire({
          title: "Success",
          text: "Bank details submitted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        navigate("/video-kyc");
      } else {
        Swal.fire({
          title: "Submission Failed",
          text: "Something went wrong while submitting bank details.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Submission Failed",
        text: "Something went wrong while submitting bank details.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    } finally {
      setbtnLoading(false);
    }
  };

  return (
    <div className="font-poppins    max-w-xl mx-auto mt-10 w-full">
    

      <div  className="  bg-white rounded-t-3xl px-4 py-6     -mt-6">
        <Stepper currentStep={5} />

        <h1 className="poppins-semibold text-[#121649] text-center py-4">
          Bank Details
        </h1>

        <form className="space-y-4">
          <div>
            <label>
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountHolderName"
              className="input-field w-full"
              placeholder="Account Holder Name"
              value={formData.accountHolderName}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (!/^[a-zA-Z\s]$/.test(e.key) && e.key.length === 1) {
                  e.preventDefault();
                }
              }}
            />
            {errors.accountHolderName && <p className="text-red-500 text-sm">{errors.accountHolderName}</p>}
          </div>

          <div>
            <label>
              Account Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showAccountNumber ? "text" : "password"}
                name="accountNumber"
                className="input-field w-full"
                placeholder="Account Number"
                maxLength={15}
                value={formData.accountNumber}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    accountNumber: numericValue,
                  }));
                }}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl"
                onClick={() => setShowAccountNumber(!showAccountNumber)}
              >
                {showAccountNumber ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
          </div>

          <div>
            <label>
              Confirm Account Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmAccountNumber ? "text" : "password"}
                name="confirmAccountNumber"
                className="input-field w-full"
                placeholder="Confirm Account Number"
                value={formData.confirmAccountNumber}
                                maxLength={15}

                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    confirmAccountNumber: numericValue,
                  }));
                }}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl"
                onClick={() => setShowConfirmAccountNumber(!showConfirmAccountNumber)}
              >
                {showConfirmAccountNumber ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {errors.confirmAccountNumber && <p className="text-red-500 text-sm">{errors.confirmAccountNumber}</p>}
          </div>

          <div>
            <label>
              Select Bank <span className="text-red-500">*</span>
            </label>
            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none ${formData.bankName ? "text-gray-800" : "text-gray-400"
                }`}
            >
              <option value="" disabled>
                Select Bank
              </option>
              {banks.map((bank) => (
                <option key={bank.BankId} value={bank.BankName}>
                  {bank.BankName}
                </option>
              ))}
            </select>
            {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
          </div>

          <div>
            <label>Branch Name</label>
            <input
              type="text"
              name="branchName"
              className="input-field w-full"
              placeholder="Branch Name"
              maxLength={100}
              value={formData.branchName}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (!/^[a-zA-Z\s]$/.test(e.key) && e.key.length === 1) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div>
            <label>
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ifscCode"
              className="input-field w-full uppercase"
              placeholder="IFSC Code"
              maxLength={11}
              value={formData.ifscCode}
              onChange={handleChange}
            />
            {errors.ifscCode && <p className="text-red-500 text-sm">{errors.ifscCode}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-[#2C2DCB] text-sm font-semibold mb-2">
              Upload Cancelled Cheque
            </label>
            <div className="w-full h-48 border-2 border-dashed border-[#2C2DCB] rounded-xl flex items-center justify-center relative overflow-hidden bg-gray-50">
              {cancelChequePreview ? (
                cancelCheque?.type === "application/pdf" ? (
                  <div className="flex flex-col items-center">
                    <FiUploadCloud className="text-4xl text-[#2C2DCB] mb-2" />
                    <a
                      href={cancelChequePreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View Uploaded PDF
                    </a>
                  </div>
                ) : (
                  <img
                    src={cancelChequePreview}
                    alt="Cancel Cheque Preview"
                    className="w-full h-full object-contain rounded-xl"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-[#2C2DCB]">
                  <FiUploadCloud className="text-4xl mb-2" />
                  <p className="text-sm font-medium">Click to Upload Cancelled Cheque</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
  Accepted format: JPG, PNG | Max size: 2MB
</p>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/2 bg-gray-200 text-gray-800 text-lg py-2 rounded-xl font-semibold"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={btnLoading}
              className="w-1/2 py-2 bg-[#2C2DCB] text-white rounded-xl"
            >
              {btnLoading ? "Processing..." : "Save & Next →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetail;