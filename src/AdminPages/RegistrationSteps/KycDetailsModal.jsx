import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const BASE_URL = "https://gateway.dhanushop.com";
const API_UPLOAD_DOCS = `${BASE_URL}/api/users/uploadDocuments`;

const userId = Cookies.get("UserId");
const token = Cookies.get("token");


const KycDetailsModal = ({ formData = {}, onClose }) => {
  const fileRefs = useRef({});
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");

  const [documents, setDocuments] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panImage: null,
    profilePhoto: null,
    shopPhoto: null,
    video: null,
  });

  const [uploading, setUploading] = useState("");

    useEffect(() => {
    console.log("[DEBUG] formData received in KYC modal:", formData);
  }, [formData]);
  
  const handleUploadClick = (key) => {
    console.log(`[DEBUG] Triggering file input click for: ${key}`);
    fileRefs.current[key]?.click();
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`[DEBUG] Selected file for ${key}:`, file);
      setDocuments((prev) => ({ ...prev, [key]: file }));
    }
  };

const uploadDocuments = async (type) => {
  console.log(`[DEBUG] Starting upload for document type: ${type}`);
  setUploading(type);
  const data = new FormData();

  data.append("UserId", userId);
    data.append("newUserId", formData.NewUserID );
  data.append("DocumentType", type);

  if (type === "Aadhaar") {
    if (!aadhaarNumber || !documents.aadhaarFront || !documents.aadhaarBack) {
      Swal.fire("Missing Fields", "Please provide Aadhaar number, front and back images.", "warning");
      setUploading("");
      return;
    }
    data.append("DocumentNumber", aadhaarNumber);
    data.append("FrontImage", documents.aadhaarFront);
    data.append("BackImage", documents.aadhaarBack);
  } else if (type === "PAN") {
    if (!panNumber || !documents.panImage) {
      Swal.fire("Missing Fields", "Please provide PAN number and image.", "warning");
      setUploading("");
      return;
    }
    data.append("DocumentNumber", panNumber);
    data.append("FrontImage", documents.panImage);
  } else if (type === "KYC") {
    if (!documents.profilePhoto || !documents.shopPhoto || !documents.video) {
      Swal.fire("Missing Fields", "Please provide profile photo, shop photo, and video.", "warning");
      setUploading("");
      return;
    }
    data.append("FrontImage", documents.profilePhoto);
    data.append("BackImage", documents.shopPhoto);
    data.append("VideoFile", documents.video);
  }

  // Debug output to check FormData content:
  // for (const pair of data.entries()) {
  //   console.log(`${pair[0]}:`, pair[1]);
  // }

    try {
      console.log("[DEBUG] Starting upload for data:", data);
      const response = await axios.post(API_UPLOAD_DOCS, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type manually here
        },
      });

      console.log("[DEBUG] Upload response:", response.data);

      if (response.data.success === true) {
        Swal.fire("Success", "Documents uploaded successfully", "success");
        setDocuments({
          aadhaarFront: null,
          aadhaarBack: null,
          panImage: null,
          profilePhoto: null,
          shopPhoto: null,
          video: null,
        });
      } else {
        Swal.fire("Error", response.data.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("[ERROR] Upload failed:", error);
      Swal.fire("Error", "Failed to upload documents", "error");
    } finally {
      setUploading("");
    }
  };


  const renderRow = (label, key) => {
    const file = documents[key];
    return (
      <tr key={key}>
        <td className="p-2 font-semibold border">{label}</td>
        <td className="p-2 border text-center">
          {file ? (
            <span>{file.name}</span>
          ) : (
            <>
              <input
                type="file"
                hidden
                ref={(el) => (fileRefs.current[key] = el)}
                onChange={(e) => handleFileChange(e, key)}
              />
              <button
                onClick={() => handleUploadClick(key)}
                className="text-indigo-600 hover:underline"
                disabled={uploading !== ""}
              >
                Select File
              </button>
            </>
          )}
        </td>
      </tr>
    );
  };

  const renderUploadButton = (type, label) => (
    <tr>
      <td colSpan={2} className="text-right p-2">
        <button
          className={`px-4 py-1 rounded text-white ${
            uploading === type ? "bg-gray-400" : "bg-blue-500"
          }`}
          onClick={() => uploadDocuments(type)}
          disabled={uploading !== ""}
        >
          {uploading === type ? "Uploading..." : `Upload ${label}`}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-4xl rounded shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Upload KYC Documents</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-600 hover:text-black"
            disabled={uploading !== ""}
          >
            &times;
          </button>
        </div>
        <div className="p-4 overflow-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Document</th>
                <th className="p-2 border">Select / File Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 font-semibold border">Aadhaar Number</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    className="w-full border p-1"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="Enter Aadhaar number"
                    disabled={uploading !== ""}
                  />
                </td>
              </tr>
              {renderRow("Aadhaar Front", "aadhaarFront")}
              {renderRow("Aadhaar Back", "aadhaarBack")}
              {renderUploadButton("Aadhaar", "Aadhaar")}

              <tr>
                <td className="p-2 font-semibold border">PAN Number</td>
                <td className="p-2 border">
                  <input
                    type="text"
                    className="w-full border p-1"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="Enter PAN number"
                    disabled={uploading !== ""}
                  />
                </td>
              </tr>
              {renderRow("PAN Image", "panImage")}
              {renderUploadButton("PAN", "PAN")}

              {renderRow("Profile Photo", "profilePhoto")}
              {renderRow("Shop Photo", "shopPhoto")}
              {renderRow("Video", "video")}
              {renderUploadButton("KYC", "KYC")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KycDetailsModal;
