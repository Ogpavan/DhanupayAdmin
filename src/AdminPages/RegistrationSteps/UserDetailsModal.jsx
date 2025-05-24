import React, { useEffect } from "react";

const UserDetailsModal = ({ formData = {}, onClose }) => {
  console.log("Form Data user detail", formData);
  const renderField = (label, value) => (
    <div key={label} className="grid grid-cols-2 gap-1 py-1 text-sm border-b">
      <div className="font-medium text-gray-600">{label}</div>
      <div className="text-gray-900">{value || "—"}</div>
    </div>
  );

  const renderImageField = (label, url) => (
    <div key={label} className="grid grid-cols-2 gap-1 py-1 text-sm border-b items-center">
      <div className="font-medium text-gray-600">{label}</div>
      <div>
        {url ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${url}`}
            // src={`https://gateway.dhanushop.com${url}`}
            alt={label}
            className="max-h-20 rounded shadow"
          />
        ) : (
          "—"
        )}
      </div>
    </div>
  );

  const renderVideoField = (label, url) => (
    <div key={label} className="grid grid-cols-2 gap-1 py-1 text-sm border-b items-center">
      <div className="font-medium text-gray-600">{label}</div>
      <div>
        {url ? (
          <video
            controls
            className="max-h-32 rounded shadow"
            src={`${import.meta.env.VITE_BACKEND_URL}${url}`}
          />
        ) : (
          "—"
        )}
      </div>
    </div>
  );

  const renderSection = (title, fields) => (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2 border-b pb-1 text-blue-700">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fields}</div>
    </div>
  );

  // useEffect(() => {
  //   console.log("Form Data", formData.UserType);
  // }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-scroll hide-scrollbar rounded shadow-lg p-6">
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
          renderField("User Role", formData.rolename),
          renderField("User Type", formData.usertypename),
          renderField("First Name", formData.FirstName),
          renderField("Last Name", formData.LastName),
          renderField("Mobile Number", formData.MobileNumber),
          renderField("Email", formData.Email),
        ])}

        {renderSection("Personal Address", [
          renderField("Address Line 1", formData.PersonalAddressLine1),
          renderField("Address Line 2", formData.PersonalAddressLine2),
          renderField("City", formData.personalcityname),
          renderField("State", formData.personalsatename),
          renderField("Pincode", formData.PersonalPincode),
        ])}

        {formData.UserType !== "1" &&
          renderSection("Shop Details", [
            renderField("Shop Address Line 1", formData.ShopAddressLine1),
            renderField("Shop Address Line 2", formData.ShopAddressLine2),
            renderField("Shop City", formData.shopcityname),
            renderField("Shop State", formData.shopsatename),
            renderField("Shop Pincode", formData.ShopPincode),
            renderImageField("Shop Image", formData.ShopImage),
          ])}

        {renderSection("Document Details", [
          renderField("Aadhaar Number", formData.AadhaarNumber),
          renderImageField("Aadhaar Front", formData.AadhaarFront),
          renderImageField("Aadhaar Back", formData.AadhaarBack),
          renderField("PAN Number", formData.PanNumber),
          renderImageField("PAN Front", formData.PanFront),
          renderVideoField("Video", formData.Video), // ✅ Replaced image logic with video
          renderImageField("Profile Image", formData.ProfileImage),
        ])}

        {renderSection("Verification Status", [
          renderField("KYC Status", formData.KycStatus),
          renderField("eSign Status", formData.EsignStatus),
          renderField("User Status", formData.UserStatus),
        ])}
      </div>
    </div>
  );
};

export default UserDetailsModal;
