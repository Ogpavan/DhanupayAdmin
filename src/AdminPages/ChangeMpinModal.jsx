// ChangeMpinModal.js
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

const ChangeMpinModal = ({ onClose }) => {
  const [oldMpin, setOldMpin] = useState(["", "", "", ""]);
  const [newMpin, setNewMpin] = useState(["", "", "", ""]);
  const [confirmMpin, setConfirmMpin] = useState(["", "", "", ""]);
  const [mpinError, setMpinError] = useState("");
  const [loading, setLoading] = useState(false);

  const oldMpinRefs = useRef([]);
  const newMpinRefs = useRef([]);
  const confirmMpinRefs = useRef([]);

  const handleOtpChange = (e, index, type) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    const stateMap = {
      old: [oldMpin, setOldMpin, oldMpinRefs],
      new: [newMpin, setNewMpin, newMpinRefs],
      confirm: [confirmMpin, setConfirmMpin, confirmMpinRefs],
    };

    const [state, setState, refs] = stateMap[type];
    const updated = [...state];
    updated[index] = value;
    setState(updated);

    if (index < 3 && refs.current[index + 1]) {
      refs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index, type) => {
    const refs =
      type === "old" ? oldMpinRefs.current :
      type === "new" ? newMpinRefs.current :
      confirmMpinRefs.current;

    if (e.key === "Backspace" && !e.target.value && index > 0) {
      refs[index - 1].focus();
    }

    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  const handleMpinChange = () => {
    const oldPin = oldMpin.join("");
    const newPin = newMpin.join("");
    const confirmPin = confirmMpin.join("");

    // Validation
    if (oldPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4) {
      setMpinError("All MPIN fields must be 4 digits.");
      return;
    }

    if (!/^\d{4}$/.test(newPin) || !/^\d{4}$/.test(confirmPin)) {
      setMpinError("MPIN must contain only digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setMpinError("New MPIN and Confirm MPIN do not match.");
      return;
    }

    // Clear error and show loading
    setMpinError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOldMpin(["", "", "", ""]);
      setNewMpin(["", "", "", ""]);
      setConfirmMpin(["", "", "", ""]);
      onClose();
      Swal.fire("Success", "MPIN updated successfully", "success");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full sm:w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Change MPIN</h2>

        <div className="space-y-4">
          {/* Old MPIN */}
          <div>
            <label className="block mb-1 font-medium">Old MPIN</label>
            <div className="flex gap-2 justify-center">
              {oldMpin.map((value, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none caret-transparent"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index, "old")}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => handleOtpKeyDown(e, index, "old")}
                  ref={(el) => (oldMpinRefs.current[index] = el)}
                />
              ))}
            </div>
          </div>

          {/* New MPIN */}
          <div>
            <label className="block mb-1 font-medium">New MPIN</label>
            <div className="flex gap-2 justify-center">
              {newMpin.map((value, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none caret-transparent"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index, "new")}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => handleOtpKeyDown(e, index, "new")}
                  ref={(el) => (newMpinRefs.current[index] = el)}
                />
              ))}
            </div>
          </div>

          {/* Confirm MPIN */}
          <div>
            <label className="block mb-1 font-medium">Confirm MPIN</label>
            <div className="flex gap-2 justify-center">
              {confirmMpin.map((value, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none caret-transparent"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index, "confirm")}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => handleOtpKeyDown(e, index, "confirm")}
                  ref={(el) => (confirmMpinRefs.current[index] = el)}
                />
              ))}
            </div>
            {mpinError && (
              <p className="text-red-500 text-sm mt-2">{mpinError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleMpinChange}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded-md transition`}
          >
            {loading ? "Updating..." : "Update MPIN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeMpinModal;
