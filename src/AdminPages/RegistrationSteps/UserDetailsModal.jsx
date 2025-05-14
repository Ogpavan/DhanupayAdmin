import React from "react";

const UserDetailsModal = ({ formData = {}, onClose }) => {
  const renderField = (label, value) => (
    <div key={label} className="grid grid-cols-2 gap-1 py-1 text-sm border-b">
      <div className="font-medium text-gray-600">{label}</div>
      <div className="text-gray-900">{value || "—"}</div>
    </div>
  );

  const renderSection = (title, fields) => (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2 border-b pb-1 text-blue-700">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            &times;
          </button>
        </div>

        {renderSection("Basic Details", [
          renderField("User Type", formData.userType),
          renderField("First Name", formData.firstName),
          renderField("Last Name", formData.lastName),
          renderField("Mobile", formData.mobile),
          renderField("Alternate Mobile", formData.altMobile),
          renderField("Email", formData.email),
        ])}

        {renderSection("Residential Details", [
          renderField("State", formData.resState),
          renderField("City", formData.resCity),
          renderField("Pincode", formData.resPincode),
          renderField("House No", formData.resHouseNo),
          renderField("Area", formData.resArea),
          renderField("Landmark", formData.resLandmark),
        ])}

        {renderSection("Business Details", [
          renderField("Shop Name", formData.shopName),
          renderField("Shop Address", formData.shopAddress),
          renderField("Business Landmark", formData.busLandmark),
          renderField("Business Pincode", formData.busPincode),
          renderField("Business City", formData.busCity),
          renderField("Business State", formData.busState),
          renderField("Business Name", formData.businessName),
          renderField("Firm Name", formData.firmName),
        ])}

        {renderSection("Document Details", [
          renderField("Aadhaar No", formData.aadhaar),
          renderField("PAN No", formData.pan),
          renderField("Aadhaar Front", formData.aadhaarFront?.name),
          renderField("Aadhaar Back", formData.aadhaarBack?.name),
          renderField("PAN File", formData.PAN?.name),
          renderField("Video File", formData.video?.name),
          renderField("Profile Photo", formData.profilePhoto?.name),
          renderField("Shop Photo", formData.shopPhoto?.name),
        ])}

        {renderSection("Verification", [
          renderField("KYC Verified", formData.kycVerified ? "Yes" : "No"),
          renderField("eSign Verified", formData.esignVerified ? "Yes" : "No"),
        ])}
      </div>
    </div>
  );
};

export default UserDetailsModal;
