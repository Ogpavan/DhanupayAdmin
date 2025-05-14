import React, { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeSlash, Lock, LockKey } from "phosphor-react"; // Import the icons

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // Perform password change logic here
    Swal.fire({
      title: "Success!",
      text: "Your password has been changed.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      onClose(); // Close the modal after successful change
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-96">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password Input */}
          <div className="relative">
             <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                value={oldPassword}
                maxLength={32}
                onChange={(e) => {
                  const sanitizedInput = e.target.value.replace(
                    /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\-]/g,
                    ""
                  );
                  if (sanitizedInput !== e.target.value) {
                    setError("Password contains invalid characters.");
                  } else {
                    setError("");
                  }
                  setOldPassword(sanitizedInput);
                }}
                onKeyDown={(e) => {
                  const invalidChars = ["'", "`", "~", "<", ">", "|", "\\"];
                  if (invalidChars.includes(e.key)) {
                    e.preventDefault();
                    setError(`The character ${e.key} is not allowed.`);
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  setError("Pasting is not allowed in the password field.");
                }}
              />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <EyeSlash /> : <Eye />}
            </button>
          </div>

          {/* New Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" />
                          <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newPassword}
                maxLength={32}
                onChange={(e) => {
                  const sanitizedInput = e.target.value.replace(
                    /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\-]/g,
                    ""
                  );
                  if (sanitizedInput !== e.target.value) {
                    setError("Password contains invalid characters.");
                  } else {
                    setError("");
                  }
                  setNewPassword(sanitizedInput);
                }}
                onKeyDown={(e) => {
                  const invalidChars = ["'", "`", "~", "<", ">", "|", "\\"];
                  if (invalidChars.includes(e.key)) {
                    e.preventDefault();
                    setError(`The character ${e.key} is not allowed.`);
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  setError("Pasting is not allowed in the password field.");
                }}
              />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeSlash /> : <Eye />}
            </button>
          </div>

          {/* Confirm New Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" />
                         <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                value={confirmPassword}
                maxLength={32}
                onChange={(e) => {
                  const sanitizedInput = e.target.value.replace(
                    /[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\-]/g,
                    ""
                  );
                  if (sanitizedInput !== e.target.value) {
                    setError("Password contains invalid characters.");
                  } else {
                    setError("");
                  }
                  setConfirmPassword(sanitizedInput);
                }}
                onKeyDown={(e) => {
                  const invalidChars = ["'", "`", "~", "<", ">", "|", "\\"];
                  if (invalidChars.includes(e.key)) {
                    e.preventDefault();
                    setError(`The character ${e.key} is not allowed.`);
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  setError("Pasting is not allowed in the password field.");
                }}
              />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlash /> : <Eye />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="button"
              className="text-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
