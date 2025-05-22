import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import KycToggle from "./KycToggle";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const API_UPLOAD_DOCS = `${BASE_URL}/api/users/uploadDocuments`;

const userId = Cookies.get("UserId");
const token = Cookies.get("token");

const KycDetailsModal = ({ formData = {}, onClose }) => {
  const fileRefs = useRef({});
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [error, setError] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [existingDocs, setExistingDocs] = useState(null);
  const [panError, setPanError] = useState("");
  const [selectedDocForVerification, setSelectedDocForVerification] =
    useState(null);
  const [activeVerification, setActiveVerification] = useState(null);

  const [zoomImage, setZoomImage] = useState(null);
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
  const handleViewImage = (url) => {
    setZoomImage(url);
  };

  const handleVerifyClick = (doc) => {
    setSelectedDocForVerification(doc);
  };

  const closeZoom = () => {
    setZoomImage(null);
  };
  const fetchExistingDocs = async () => {
    console.log(token)
    try {
      const res = await axios.post(
        `${BASE_URL}/api/users/GetAllDocumentsbyUser`,
        { UserID:  userId,NewUserId: formData.NewUserID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data);
      if (res.data.success && Array.isArray(res.data.users)) {
        const groupedDocs = {
          Aadhaar: [],
          PAN: [],
          KYC: [],
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

          // OLD lines to remove:
          // profilePhoto: groupedDocs.Photo[0]?.FrontImageURL ? BASE_URL + groupedDocs.Photo[0].FrontImageURL : "",
          // shopPhoto: groupedDocs.ShopPhoto[0]?.BackImageURL ? BASE_URL + groupedDocs.ShopPhoto[0].BackImageURL : "",
          // video: groupedDocs.Video[0]?.VideoFileUrl ? BASE_URL + groupedDocs.Video[0].VideoFileUrl : "",

          // NEW lines:
          profilePhoto: groupedDocs.KYC[0]?.FrontImageURL
            ? BASE_URL + groupedDocs.KYC[0].FrontImageURL
            : "",
          shopPhoto: groupedDocs.KYC[0]?.BackImageURL
            ? BASE_URL + groupedDocs.KYC[0].BackImageURL
            : "",
          video: groupedDocs.KYC[0]?.VideoFileUrl
            ? BASE_URL + groupedDocs.KYC[0].VideoFileUrl
            : "",

          CancelCheque: groupedDocs.CancelCheque[0]?.FrontImageURL
            ? BASE_URL + groupedDocs.CancelCheque[0].FrontImageURL
            : "",

          status: {
            Aadhaar: groupedDocs.Aadhaar[0]?.Documentstatus || "Pending",
            PAN: groupedDocs.PAN[0]?.Documentstatus || "Pending",
            KYC: groupedDocs.KYC[0]?.Documentstatus || "Pending", // Also fix status key here
            CancelCheque:
              groupedDocs.CancelCheque[0]?.Documentstatus || "Pending",
          },
        }));

        setAadhaarNumber(groupedDocs.Aadhaar[0]?.DocumentNumber || "");
        setPanNumber(groupedDocs.PAN[0]?.DocumentNumber || "");
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch existing documents:", error);
    }
  };

  useEffect(() => {
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire("warning", "Only JPEG, JPG, and PNG image formats are allowed.");
      e.target.value = ""; // Clear the input
      return;
    }

    setDocuments((prev) => ({ ...prev, [key]: file }));
  }
};


  //verify
  const verifyDocument = async (type, status) => {
    let remark = "";

    if (status === "Rejected") {
      const { value } = await Swal.fire({
        title: "Reason for Rejection",
        input: "text",
        inputLabel: "Enter a remark",
        inputPlaceholder: "Type reason here...",
        inputValidator: (value) => {
          if (!value) {
            return "Remark is required for rejection.";
          }
        },
        showCancelButton: true,
      });

      if (!value) return; // Cancelled
      remark = value;
    }

    try {
      console.log(userId,formData.NewUserID,type,status)
      const response = await axios.post(
        `${BASE_URL}/api/users/VerifyDocument`,
        {
          UserID: userId,
          NewUserID: formData.NewUserID,
          DocumentType: type,
          Documentstatus: status,
          Remarks: remark,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", response.data.message, "success");

        // Optional: Refresh document status
        if (formData.NewUserID) {
          await fetchExistingDocs();
        }
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Verification failed",
          "error"
        );
      }
    } catch (error) {
      console.error("[ERROR] Document verification failed:", error);
      Swal.fire("Error", "Document verification failed", "error");
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
          "Please provide Cancel Cheque document.",
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
        await fetchExistingDocs();
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

  const isAadhaarValid = () => {
    return (
      aadhaarNumber.length === 12 &&
      !/^(\d)\1{11}$/.test(aadhaarNumber) &&
      !error
    );
  };

  const isPanValid = () => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase());
  };

  const handlePanChange = (e) => {
    let value = e.target.value.toUpperCase();
    setPanNumber(value);

    // PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!panRegex.test(value)) {
      setPanError("Invalid PAN format (e.g., ABCDE1234F)");
    } else {
      setPanError("");
    }
  };

 const renderRow = (label, key) => {
  const file = documents[key];
  const isUploaded = typeof file === "string";

  // Map keys to document types for status
  const keyToTypeMap = {
    aadhaarFront: "Aadhaar",
    aadhaarBack: "Aadhaar",
    panImage: "PAN",
    profilePhoto: "KYC",
    shopPhoto: "KYC",
    video: "KYC",
    CancelCheque: "CancelCheque",
  };

  const type = keyToTypeMap[key];
  const status = documents.status?.[type] || "Pending";
  const isApproved = status === "Approved";

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
              <>
                <button
                  onClick={() => handleViewImage(file)}
                  className="text-indigo-600 underline mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleUploadClick(key)}
                  className="text-blue-600 hover:underline"
                  disabled={uploading !== ""}
                >
                  Change
                </button>
              </>
            ) : (
              <>
                <span className="mr-2">{file.name}</span>
                <button
                  onClick={() => handleUploadClick(key)}
                  className="text-blue-600 hover:underline"
                  disabled={uploading !== ""}
                >
                  Change
                </button>
              </>
            )}
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


  const handleChange = (e) => {
    let value = e.target.value;

    // Remove non-digit chars immediately
    value = value.replace(/\D/g, "");

    // Limit length to max 12 digits
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    setAadhaarNumber(value);

    // Validate length
    if (value.length < 12) {
      setError("Aadhaar number must be 12 digits");
    } else if (/^(\d)\1{11}$/.test(value)) {
      // Cheque for 12 identical digits (invalid Aadhaar)
      setError("Invalid Aadhaar number");
    } else {
      setError("");
    }
  };

  const renderUploadButton = (type, label) => {
    const status = documents.status?.[type] || "Pending";
    const isActive = activeVerification === type;

    return (
      <tr key={`${type}-upload`}>
        <td colSpan={2} className="text-right p-2 space-x-2">
          <button
            className={`px-4 py-1 rounded text-white ${
              uploading === type ? "bg-gray-400" : "bg-blue-500"
            }`}
            onClick={() => uploadDocuments(type)}
            disabled={
              uploading !== "" ||
              (type === "Aadhaar" && !isAadhaarValid()) ||
              (type === "PAN" && !isPanValid())
            }
          >
            {uploading === type ? "Uploading..." : `Upload ${label}`}
          </button>

          <button
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => verifyDocument(type, "Approved")}
            disabled={uploading !== ""}
          >
            Approve
          </button>

          <button
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => verifyDocument(type, "Rejected")}
            disabled={uploading !== ""}
          >
            Reject
          </button>

          <button
            className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => setActiveVerification(isActive ? null : type)}
          >
            {isActive ? "Hide Details" : "Verify"}
          </button>

          <span
            className={`ml-4 font-semibold ${
              status === "Approved"
                ? "text-green-600"
                : status === "Rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {status}
          </span>
        </td>
      </tr>
    );
  };
  const formatAadhaar = (aadhaar) => {
  if (!aadhaar) return "N/A";
  // Remove any non-digit characters just in case
  const digits = aadhaar.replace(/\D/g, '');
  // Format in groups of 4 digits separated by space
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded shadow-lg overflow-y-scroll hide-scrollbar">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Upload KYC Documents for
            <span className="text-indigo-600">
              {" "}
              {formData.FirstName + " " + formData.LastName || "User"}
            </span>
          </h2>
          <KycToggle
            userId={userId}
            token={token}
            NewUserId={formData.NewUserID}
            initialKycStatus={formData.KycStatus}
          />

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
                  <div>
                    <input
                      type="text"
                      className={`w-full border p-1 ${
                        error ? "border-red-500" : ""
                      }`}
                      value={aadhaarNumber}
                      onChange={handleChange}
                      placeholder="Enter Aadhaar number"
                      maxLength={12}
                      disabled={uploading !== ""}
                    />
                    {error && (
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                  </div>
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
                    className={`w-full border p-1 ${
                      panError ? "border-red-500" : ""
                    }`}
                    value={panNumber}
                    onChange={handlePanChange}
                    placeholder="Enter PAN number"
                    maxLength={10}
                    disabled={uploading !== ""}
                  />
                  {panError && (
                    <p className="text-red-600 text-sm mt-1">{panError}</p>
                  )}
                </td>
              </tr>

              {renderRow("PAN Image", "panImage")}
              {renderUploadButton("PAN", "PAN")}

              {renderRow("Profile Photo", "profilePhoto")}
              {renderRow("Shop Photo", "shopPhoto")}
              {renderRow("Video", "video")}
              {renderUploadButton("KYC", "KYC")}
              {renderRow("Cancel Cheque", "CancelCheque")}
              {renderUploadButton("CancelCheque", "Cancel Cheque")}
            </tbody>
          </table>
          {activeVerification && (
            <div className="fixed inset-0 bg-black   bg-opacity-70 z-10 flex justify-center items-center p-6 overflow-y-auto">
              <div className="relative bg-white w-full max-w-6xl rounded-lg shadow-xl p-8">
                <button
                  onClick={() => setActiveVerification(null)}
                  className="absolute top-3 right-4 text-3xl text-gray-600 hover:text-black font-bold"
                >
                  &times;
                </button>

                {/* Render based on activeVerification */}
                {activeVerification === "Aadhaar" && (

                  <>
                  <div className="flex justify-evenly">
                    <div className="">
                  
                    <h3 className="text-xl font-bold mb-4">Aadhaar Details</h3>
                    <p className=" mb-4 text-3xl">
                      Aadhaar Number <br /> <strong>{formatAadhaar(aadhaarNumber)}</strong>

                    </p>
                    </div>
                    <div>
                    <div className="flex  gap-6">
                      {documents.aadhaarFront && (
                        <div>
                          <p className="text-sm mb-1">Front</p>
                          <img
                            src={documents.aadhaarFront}
                            alt="Aadhaar Front"
                            className="w-[50vh] h-auto rounded border cursor-pointer"
                            onClick={() =>
                              handleViewImage(documents.aadhaarFront)
                            }
                          />
                        </div>
                      )}
                      {documents.aadhaarBack && (
                        <div>
                          <p className="text-sm mb-1">Back</p>
                          <img
                            src={documents.aadhaarBack}
                            alt="Aadhaar Back"
                            className="w-[50vh] h-auto rounded border cursor-pointer"
                            onClick={() =>
                              handleViewImage(documents.aadhaarBack)
                            }
                          />
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                  </>
                )}




                {activeVerification === "PAN" && (
                  <>
                    <div className="flex justify-evenly">
                      <div>
                    <h3 className="text-xl font-bold mb-4">PAN Details</h3>

                    <p className="text-3xl mb-4">
                      PAN Number: <br/><strong>{panNumber || "N/A"}</strong>
                    </p>
                    </div>
                    {documents.panImage && (
                      <img
                        src={documents.panImage}
                        alt="PAN"
                        className="w-[40vh] h-auto rounded border cursor-pointer"
                        onClick={() => handleViewImage(documents.panImage)}
                      />
                    )}
                    </div>
                  </>
                )}

                {activeVerification === "KYC" && (
                  <>
                    <h3 className="text-xl font-bold mb-4">KYC Documents</h3>
                    <div className="flex   gap-6">
                      {documents.profilePhoto && (
                        <div>
                          <p className="text-sm mb-1">Profile Photo</p>
                          <img
                            src={documents.profilePhoto}
                            alt="Profile"
                            className="w-[30vh] h-auto rounded border cursor-pointer"
                            onClick={() =>
                              handleViewImage(documents.profilePhoto)
                            }
                          />
                        </div>
                      )}
                      {documents.shopPhoto && (
                        <div>
                          <p className="text-sm mb-1">Shop Photo</p>
                          <img
                            src={documents.shopPhoto}
                            alt="Shop"
                            className="w-[30vh] h-auto rounded border cursor-pointer"
                            onClick={() => handleViewImage(documents.shopPhoto)}
                          />
                        </div>
                      )}
                      {documents.video && (
                        <div className="w-full">
                          <p className="text-sm mb-1">Video</p>
                          <video
                            src={documents.video}
                            controls
                            className="w-full max-w-3xl rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeVerification === "CancelCheque" && (
                  <>
                    <h3 className="text-xl font-bold mb-4">Cancel Cheque</h3>
                    {documents.CancelCheque && (
                      <img
                        src={documents.CancelCheque}
                        alt="Cancel Cheque"
                        className="w-[40vh] h-auto rounded border cursor-pointer"
                        onClick={() => handleViewImage(documents.CancelCheque)}
                      />
                      
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {zoomImage && (
        <div
          onClick={closeZoom}
          className="fixed inset-0  bg-opacity-90 flex justify-center items-center cursor-zoom-out z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevent close on image drag
            className="max-w-full max-h-full p-4 bg-white rounded shadow-lg"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          >
            <TransformWrapper
              key={zoomImage}
              initialScale={1}
              minScale={1}
              maxScale={5}
              wheel={{ step: 0.2 }}
              doubleClick={{ disabled: true }}
            >
              {() => (
                <>
                  <TransformComponent>
                    <img
                      src={zoomImage}
                      alt="Zoomed document"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "80vh",
                        userSelect: "none",
                        pointerEvents: "auto",
                      }}
                      onLoad={(e) => {
                        // Sometimes forcing re-render on image load fixes internal calc issues
                        e.currentTarget.style.width = "auto";
                        e.currentTarget.style.height = "auto";
                      }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}
      {selectedDocForVerification &&
        selectedDocForVerification.documentType === "Aadhaar" && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50 z-50">
            <h3 className="text-lg font-semibold mb-2">Aadhaar Details</h3>
            <p>
              <strong>Aadhaar Number:</strong>{" "}
              {selectedDocForVerification.aadhaarNumber || "N/A"}
            </p>
            <div className="flex gap-4 mt-2">
              <div>
                <p className="font-medium">Front:</p>
                <img
                  src={selectedDocForVerification.frontImageUrl}
                  alt="Aadhaar Front"
                  className="w-40 h-auto rounded shadow"
                />
              </div>
              <div>
                <p className="font-medium">Back:</p>
                <img
                  src={selectedDocForVerification.backImageUrl}
                  alt="Aadhaar Back"
                  className="w-40 h-auto rounded shadow"
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default KycDetailsModal;
