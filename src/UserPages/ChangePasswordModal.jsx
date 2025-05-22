import React, { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Eye, EyeSlash, Lock } from "phosphor-react";

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const userId = Cookies.get("UserId");
    const token = Cookies.get("token"); // Make sure your token is stored with this key

    if (!userId || !token) {
      Swal.fire("Error", "User not logged in or token missing.", "error");
      return;
    }

    try {
      const response = await fetch("https://gateway.dhanushop.com/api/users/Change_password", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          UserId: userId,
          Password: oldPassword,
          NewPassword: newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Success", data.message || "Password Changed successfully.", "success").then(() => {
          onClose();
        });
      } else {
        Swal.fire("Failed", data.message || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire("Error", "Network error or server issue.", "error");
    }
  };

  const handlePasswordInput = (setter) => (e) => {
    const sanitizedInput = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+={}[\]:;'"<>,.?/|\\-]/g, "");
    if (sanitizedInput !== e.target.value) {
      setError("Password contains invalid characters.");
    } else {
      setError("");
    }
    setter(sanitizedInput);
  };

  const preventPaste = (e) => {
    e.preventDefault();
    setError("Pasting is not allowed in the password field.");
  };

  const preventInvalidChars = (e) => {
    const invalidChars = ["'", "`", "~", "<", ">", "|", "\\"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
      setError(`The character ${e.key} is not allowed.`);
    }
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
              onChange={handlePasswordInput(setOldPassword)}
              onKeyDown={preventInvalidChars}
              onPaste={preventPaste}
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
              onChange={handlePasswordInput(setNewPassword)}
              onKeyDown={preventInvalidChars}
              onPaste={preventPaste}
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
              onChange={handlePasswordInput(setConfirmPassword)}
              onKeyDown={preventInvalidChars}
              onPaste={preventPaste}
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

          {/* Submit & Cancel Buttons */}
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
