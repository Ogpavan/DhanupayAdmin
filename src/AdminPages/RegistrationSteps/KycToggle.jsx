import React, { useState, useEffect } from "react";
import axios from "axios";

function KycToggle({ userId, token, NewUserId, initialKycStatus }) {
  // Treat "True" or "Approved" as verified
  const isInitiallyVerified =
    initialKycStatus === "True" || initialKycStatus === "Approved";

  const [isVerified, setIsVerified] = useState(isInitiallyVerified);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Sync with prop if it changes externally
    const verified =
      initialKycStatus === "True" || initialKycStatus === "Approved";
    setIsVerified(verified);
    console.log("initialKycStatus changed:", initialKycStatus);
  }, [initialKycStatus]);

  const handleToggle = async (e) => {
    const checked = e.target.checked;

    // Prevent unchecking once approved
    if (!checked) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://gateway.dhanushop.com/api/users/KYCStatusChange",
        {
          UserID: userId,
          NewUserId: NewUserId,
          KYCStatus: "Approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsVerified(true);
        setMessage("KYC Verified successfully.");
      } else {
        setMessage(response.data.message || "Failed to verify KYC.");
      }
    } catch (error) {
      setMessage("Error verifying KYC.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ fontWeight: "bold" }}>KYC Verified</label>
      <label className="switch">
        <input
          type="checkbox"
          checked={isVerified}
          onChange={handleToggle}
          disabled={isVerified || loading}
        />
        <span className="slider"></span>
      </label>
      <span style={{ minWidth: 0, fontWeight: "bold" }}>
        {loading ? "Processing..." : isVerified ? "Yes" : "No"}
      </span>
      {message && <span style={{ marginLeft: 10, color: "red" }}>{message}</span>}

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: ${isVerified ? "not-allowed" : "pointer"};
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 28px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #4caf50;
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        input:disabled + .slider {
          background-color: #999;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default KycToggle;
