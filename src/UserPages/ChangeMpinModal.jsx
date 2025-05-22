import React, { useRef, useState } from "react";
import { Eye, EyeSlash, Lock } from "phosphor-react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function ChangeMpinModal({ onClose }) {
  const [oldMpin, setOldMpin] = useState(["", "", "", ""]);
  const [newMpin, setNewMpin] = useState(["", "", "", ""]);
  const [confirmMpin, setConfirmMpin] = useState(["", "", "", ""]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const oldRefs = useRef([]);
  const newRefs = useRef([]);
  const confirmRefs = useRef([]);

  const userId = Cookies.get("UserId");
  const token = Cookies.get("token");
// Check if all MPIN fields are filled
const isFormComplete = [...oldMpin, ...newMpin, ...confirmMpin].every((val) => val !== "");

  const handleInput = (index, value, setter, state, refs) => {
    if (/^\d?$/.test(value)) {
      const updated = [...state];
      updated[index] = value;
      setter(updated);
      setError("");
      if (value && index < 3) refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index, setter, state, refs) => {
    if (e.key === "Backspace" && !state[index] && index > 0) {
      const updated = [...state];
      updated[index - 1] = "";
      setter(updated);
      refs.current[index - 1]?.focus();
    }
  };

  const getValue = (arr) => arr.join("");

  const renderInputGroup = (state, setter, refs) => (
    <div className="flex gap-3 justify-center">
      {state.map((val, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type={show ? "text" : "password"}
          value={val}
          maxLength={1}
          onChange={(e) => handleInput(i, e.target.value, setter, state, refs)}
          onKeyDown={(e) => handleKeyDown(e, i, setter, state, refs)}
          className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ))}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (getValue(newMpin) !== getValue(confirmMpin)) {
      setError("New MPIN and Confirm MPIN do not match.");
      return;
    }

    if (!userId || !token) {
      Swal.fire("Error", "User not logged in or token missing.", "error");
      return;
    }

    try {
      const response = await fetch("https://gateway.dhanushop.com/api/users/Change_mpin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          UserId: userId,
          MPin: getValue(oldMpin),
          NewMPin: getValue(newMpin),
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Success", data.message || "MPIN changed successfully.", "success").then(onClose);
      } else {
        Swal.fire("Failed", data.message || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Change MPIN error:", error);
      Swal.fire("Error", "Network error or server issue.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-96">
        <h2 className="text-xl font-semibold mb-4">Change MPIN</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old MPIN */}
          <div>
            <label className="block text-sm mb-1 font-medium">Old MPIN</label>
            {renderInputGroup(oldMpin, setOldMpin, oldRefs)}
          </div>

          {/* New MPIN */}
          <div>
            <label className="block text-sm mb-1 font-medium">New MPIN</label>
            {renderInputGroup(newMpin, setNewMpin, newRefs)}
          </div>

          {/* Confirm MPIN */}
          <div>
            <label className="block text-sm mb-1 font-medium">Confirm MPIN</label>
            {renderInputGroup(confirmMpin, setConfirmMpin, confirmRefs)}
          </div>

          {/* Toggle visibility */}
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <button type="button" onClick={() => setShow(!show)} className="flex items-center gap-1">
              {show ? <EyeSlash size={18} /> : <Eye size={18} />}
              {show ? "Hide MPIN" : "Show MPIN"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="text-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
          <button
  type="submit"
  disabled={!isFormComplete}
  className={`px-4 py-2 rounded-md text-white 
    ${isFormComplete ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
>
  Change MPIN
</button>

          </div>
        </form>
      </div>
    </div>
  );
}
