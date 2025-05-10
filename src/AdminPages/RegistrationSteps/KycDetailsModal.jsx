import React, { useRef } from "react";

const KycDetailsModal = ({ formData = {}, onClose }) => {
  const fileRefs = useRef({});

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const handleUpload = (key) => {
    const fileInput = fileRefs.current[key];
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`Uploading ${key}:`, file);
      // Implement upload logic here (e.g., API call or local state update)
    }
  };

  const viewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const renderRow = (label, fileKey, statusKey) => {
  const file = formData[fileKey];
  const status = formData[statusKey] || "Pending";


  const viewFile = (file) => {
  let url = "";
  if (typeof file === "string") {
    url = file; // Assume it's a URL (e.g., from database)
  } else {
    url = URL.createObjectURL(file); // Local file object
  }
  window.open(url, "_blank");
};

  return (
    <tr key={fileKey}>
      <td className="p-2 font-semibold border">{label}</td>
      <td className="p-2 border text-center">
        {file ? (
          <button
            onClick={() => viewFile(file)}
            className="text-blue-600 hover:underline"
          >
            View
          </button>
        ) : (
          <>
            <input
              type="file"
              hidden
              ref={(el) => (fileRefs.current[fileKey] = el)}
              onChange={(e) => handleFileChange(e, fileKey)}
            />
            <button
              onClick={() => handleUpload(fileKey)}
              className="text-indigo-600 hover:underline"
            >
              Upload
            </button>
          </>
        )}
      </td>
      <td className={`p-2 border text-center ${getStatusColor(status)}`}>
        {status}
      </td>
      <td className="p-2 border text-center">
        {status === "Pending" ? (
          <div className="flex gap-2 justify-center">
            <button className="text-green-600 hover:underline">Approve</button>
            <button className="text-red-600 hover:underline">Reject</button>
          </div>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
};


  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-4xl rounded shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">KYC Document Details</h2>
          <button onClick={onClose} className="text-xl text-gray-600 hover:text-black">
            &times;
          </button>
        </div>
        <div className="p-4 overflow-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Document</th>
                <th className="p-2 border">Uploaded</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
 
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 font-semibold border">Aadhaar Number</td>
                <td className="p-2 border" colSpan={4}>
                  {formData.aadhaar || "—"}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold border">PAN Number</td>
                <td className="p-2 border" colSpan={4}>
                  {formData.pan || "—"}
                </td>
              </tr>
              {renderRow("Aadhaar Front", "aadhaarFront", "aadhaarFrontStatus")}
              {renderRow("Aadhaar Back", "aadhaarBack", "aadhaarBackStatus")}
              {renderRow("PAN File", "PAN", "panStatus")}
              {renderRow("Profile Photo", "profilePhoto", "profilePhotoStatus")}
              {renderRow("Shop Photo", "shopPhoto", "shopPhotoStatus")}
              {renderRow("Video", "video", "videoStatus")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KycDetailsModal;
