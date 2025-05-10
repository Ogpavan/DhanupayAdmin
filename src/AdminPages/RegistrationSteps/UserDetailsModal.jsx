import React from "react";

const UserDetailsModal = ({ formData = {}, onClose }) => {
  const renderRow = (label, value) => (
    <tr key={label}>
      <td className="p-2 font-semibold border border-gray-200">{label}</td>
      <td className="p-2 border border-gray-200">{value || "—"}</td>
    </tr>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg transform transition-transform duration-300 translate-x-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          <table className="w-full text-sm border border-gray-200">
            <tbody>
              {renderRow("User Type", formData.userType)}
              {renderRow("First Name", formData.firstName)}
              {renderRow("Last Name", formData.lastName)}
              {renderRow("Mobile", formData.mobile)}
              {renderRow("Alternate Mobile", formData.altMobile)}
              {renderRow("Email", formData.email)}
              {renderRow("State", formData.resState)}
              {renderRow("City", formData.resCity)}
              {renderRow("Pincode", formData.resPincode)}
              {renderRow("Shop Name", formData.shopName)}
              {renderRow("Shop Address", formData.shopAddress)}
              {renderRow("Aadhaar No", formData.aadhaar)}
              {renderRow("PAN No", formData.pan)}
              {renderRow("KYC Verified", formData.kycVerified ? "Yes" : "No")}
              {renderRow("eSign Verified", formData.esignVerified ? "Yes" : "No")}
              {renderRow("Video File", formData.video?.name)}
              {renderRow("Profile Photo", formData.profilePhoto?.name)}
              {renderRow("Shop Photo", formData.shopPhoto?.name)}
              {/* New fields added below */}
              {renderRow("House No", formData.resHouseNo)}
              {renderRow("Area", formData.resArea)}
              {renderRow("Landmark", formData.resLandmark)}
              {renderRow("Business Landmark", formData.busLandmark)}
              {renderRow("Business Pincode", formData.busPincode)}
              {renderRow("Business City", formData.busCity)}
              {renderRow("Business State", formData.busState)}
              {renderRow("Business Name", formData.businessName)}
              {renderRow("Firm Name", formData.firmName)}
              {renderRow("Aadhaar Front", formData.aadhaarFront?.name)}
              {renderRow("Aadhaar Back", formData.aadhaarBack?.name)}
              {renderRow("PAN File", formData.PAN?.name)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
