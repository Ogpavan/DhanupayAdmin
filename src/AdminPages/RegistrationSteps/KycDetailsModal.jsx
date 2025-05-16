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
  const [existingDocs, setExistingDocs] = useState(null);

  const [documents, setDocuments] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panImage: null,
    profilePhoto: null,
    shopPhoto: null,
    video: null,
    CancelCheque: null, 
  });

  const [uploading, setUploading] = useState("");

  useEffect(() => {
    const fetchExistingDocs = async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/api/users/GetAllDocumentsbyUser`,
          { UserID: formData.NewUserID },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success && Array.isArray(res.data.users)) {
          const groupedDocs = {
            Aadhaar: [],
            PAN: [],
            Photo: [],
            ShopPhoto: [],
            Video: [],
            CancelCheque: [],
          };

          res.data.users.forEach((doc) => {
            if (groupedDocs[doc.DocumentType]) {
              groupedDocs[doc.DocumentType].push(doc);
            }
          });

          setExistingDocs(groupedDocs);
          setDocuments((prev) => ({
            ...prev,
            aadhaarFront: groupedDocs.Aadhaar[0]?.FrontImageURL
              ? BASE_URL + groupedDocs.Aadhaar[0].FrontImageURL
              : "",
            aadhaarBack: groupedDocs.Aadhaar[0]?.BackImageURL
              ? BASE_URL + groupedDocs.Aadhaar[0].BackImageURL
              : "",
            panImage: groupedDocs.PAN[0]?.FrontImageURL
              ? BASE_URL + groupedDocs.PAN[0].FrontImageURL
              : "",
            profilePhoto: groupedDocs.Photo[0]?.FrontImageURL
              ? BASE_URL + groupedDocs.Photo[0].FrontImageURL
              : "",
            shopPhoto: groupedDocs.ShopPhoto[0]?.BackImageURL
              ? BASE_URL + groupedDocs.ShopPhoto[0].BackImageURL
              : "",
            video: groupedDocs.Video[0]?.VideoFileUrl
              ? BASE_URL + groupedDocs.Video[0].VideoFileUrl
              : "",
              CancelCheque: groupedDocs.CancelCheque?.[0]?.FrontImageURL
    ? BASE_URL + groupedDocs.CancelCheque[0].FrontImageURL
    : "",
          }));

          setAadhaarNumber(groupedDocs.Aadhaar[0]?.DocumentNumber || "");
          setPanNumber(groupedDocs.PAN[0]?.DocumentNumber || "");
        }
      } catch (error) {
        console.error("[ERROR] Failed to fetch existing documents:", error);
      }
    };

    if (formData.NewUserID) {
      fetchExistingDocs();
    }
  }, [formData.NewUserID]);

  const handleUploadClick = (key) => {
    fileRefs.current[key]?.click();
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prev) => ({ ...prev, [key]: file }));
    }
  };

const uploadDocuments = async (type) => {
  setUploading(type);
  const data = new FormData();

  data.append("UserId", userId);
  data.append("newUserId", formData.NewUserID);
  data.append("DocumentType", type);

  if (type === "Aadhaar") {
    if (!aadhaarNumber || !documents.aadhaarFront || !documents.aadhaarBack) {
      Swal.fire(
        "Missing Fields",
        "Please provide Aadhaar number, front and back images.",
        "warning"
      );
      setUploading("");
      return;
    }
    data.append("DocumentNumber", aadhaarNumber);
    data.append("FrontImage", documents.aadhaarFront);
    data.append("BackImage", documents.aadhaarBack);
  } else if (type === "PAN") {
    if (!panNumber || !documents.panImage) {
      Swal.fire(
        "Missing Fields",
        "Please provide PAN number and image.",
        "warning"
      );
      setUploading("");
      return;
    }
    data.append("DocumentNumber", panNumber);
    data.append("FrontImage", documents.panImage);
  } else if (type === "KYC") {
    if (!documents.profilePhoto || !documents.shopPhoto || !documents.video) {
      Swal.fire(
        "Missing Fields",
        "Please provide profile photo, shop photo, and video.",
        "warning"
      );
      setUploading("");
      return;
    }
    data.append("FrontImage", documents.profilePhoto);
    data.append("BackImage", documents.shopPhoto);
    data.append("VideoFile", documents.video);
  } else if (type === "CancelCheque") {
    if (!documents.CancelCheque) {
      Swal.fire(
        "Missing Fields",
        "Please provide Cancel Check document.",
        "warning"
      );
      setUploading("");
      return;
    }
    data.append("FrontImage", documents.CancelCheque);
  }

  try {
    const response = await axios.post(API_UPLOAD_DOCS, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success === true) {
      Swal.fire("Success", "Documents uploaded successfully", "success");

      const docs = response.data.documents || {};

      setDocuments((prev) => ({
        ...prev,
        ...(type === "Aadhaar" && {
          aadhaarFront: docs.aadhaarFrontUrl || prev.aadhaarFront,
          aadhaarBack: docs.aadhaarBackUrl || prev.aadhaarBack,
        }),
        ...(type === "PAN" && {
          panImage: docs.panImageUrl || prev.panImage,
        }),
        ...(type === "KYC" && {
          profilePhoto: docs.profilePhotoUrl || prev.profilePhoto,
          shopPhoto: docs.shopPhotoUrl || prev.shopPhoto,
          video: docs.videoUrl || prev.video,
        }),
        ...(type === "CancelCheque" && {
          CancelCheque: docs.CancelChequeUrl || prev.CancelCheque,
        }),
      }));
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
    const isUploaded = typeof file === "string";

    return (
      <tr key={key}>
        <td className="p-2 font-semibold border">{label}</td>
        <td className="p-2 border text-center">
          <input
            type="file"
            hidden
            ref={(el) => (fileRefs.current[key] = el)}
            onChange={(e) => handleFileChange(e, key)}
            disabled={uploading !== ""}
          />
          {file ? (
            <>
              {isUploaded ? (
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline mr-2"
                >
                  View
                </a>
              ) : (
                <span className="mr-2">{file.name}</span>
              )}
              <button
                onClick={() => handleUploadClick(key)}
                className="text-blue-600 hover:underline"
                disabled={uploading !== ""}
              >
                Change
              </button>
            </>
          ) : (
            <button
              onClick={() => handleUploadClick(key)}
              className="text-indigo-600 hover:underline"
              disabled={uploading !== ""}
            >
              Select File
            </button>
          )}
        </td>
      </tr>
    );
  };

  const renderUploadButton = (type, label) => (
    <tr key={`${type}-upload`}>
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
              {renderRow("Cancel Check", "CancelCheque")}
{renderUploadButton("CancelCheque", "Cancel Check")}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KycDetailsModal;
