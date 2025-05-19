// components/OtpModal.jsx
import React from "react";

const OtpModal = ({ isOpen, onClose, onSubmit, otp, setOtp, verifyingField }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl px-6 py-8 w-80 text-center shadow-lg">
        <h2 className="text-lg font-semibold text-[#121649] mb-2">
          Verify {verifyingField}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the 4-digit OTP sent to your number
        </p>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={4}
          value={otp}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d{0,4}$/.test(val)) {
              setOtp(val);
            }
          }}
          className="input-field text-center text-lg tracking-widest"
          placeholder="____"
        />

        <button
          onClick={onSubmit}
          className="mt-4 w-full bg-[#2C2DCB] text-white py-2 rounded-xl font-semibold"
        >
          Submit OTP
        </button>
        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OtpModal;