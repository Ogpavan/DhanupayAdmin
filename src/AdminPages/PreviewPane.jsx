import { useEffect, useState } from "react";
import { fetchStatesList } from "../api/stateListApi";
import { fetchCitiesByState } from "../api/CityListApi";

function PreviewPane({
  formData,
  onClose,
  onSubmit,
  agreeTerms,
  setAgreeTerms,
}) {
  const [stateList, setStateList] = useState([]);
  const [resCityList, setResCityList] = useState([]);
const [busCityList, setBusCityList] = useState([]);

useEffect(() => {
  const loadStates = async () => {
    try {
      const stateRes = await fetchStatesList();
      const states = Array.isArray(stateRes) ? stateRes : stateRes?.data || [];
      setStateList(states);
    } catch (err) {
      console.error("Error loading states:", err);
    }
  };

  loadStates();
}, []); // only once on mount

useEffect(() => {
  const loadResCities = async () => {
    try {
      if (formData.resState) {
        const resCities = await fetchCitiesByState(formData.resState);
        setResCityList(Array.isArray(resCities) ? resCities : resCities?.data || []);
      }
    } catch (err) {
      console.error("Error loading residential cities:", err);
    }
  };

  loadResCities();
}, [formData.resState]);

useEffect(() => {
  const loadBusCities = async () => {
    try {
      if (formData.busState) {
        const busCities = await fetchCitiesByState(formData.busState);
        setBusCityList(Array.isArray(busCities) ? busCities : busCities?.data || []);
      }
    } catch (err) {
      console.error("Error loading business cities:", err);
    }
  };

  loadBusCities();
}, [formData.busState]);

  const getStateName = (id) => {
    const state = stateList.find((s) => Number(s.StateId) === Number(id));
    return state ? state.StateName : id;
  };

const getCityName = (id, cityList) => {
  if (!id || !cityList.length) return "Loading...";
  const city = cityList.find((c) => Number(c.CityId) === Number(id));
  console.log(city);
  return city ? city.CityName : `City ID: ${id}`;
};



  const isWhiteLabel = formData.userType === "2";

  const sections = {
    "Basic Details": [
      ["First Name", formData.firstName],
      ["Last Name", formData.lastName],
      ["Mobile", formData.mobile],
      ["Alternate Mobile", formData.altMobile],
      ["Email", formData.email],
    ],
    "Residential Details": [
      ["House No", formData.resHouseNo],
      ["Area", formData.resArea],
      ["Landmark", formData.resLandmark],
      ["City", getCityName(formData.resCity, resCityList)],


      ["State", getStateName(formData.resState)],
      ["Pincode", formData.resPincode],
    ],
    "Business Details": [
      ["Shop Name", formData.shopName],
      ["Shop Address", formData.shopAddress],
      ["Landmark", formData.busLandmark],
    ["City", getCityName(formData.busCity, busCityList)],
      ["State", getStateName(formData.busState)],
      ["Pincode", formData.busPincode],
      ...(isWhiteLabel ? [["Website URL", formData.websiteUrl]] : []),
    ],
    "Account Details": [
      ["Bank Name", formData.bankName],
      ["Branch Name", formData.branchName],
      ["Account Holder Name", formData.accountHolderName],
      ["Account Number", formData.accountNumber],
      ["IFSC Code", formData.ifscCode],
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <div className="max-h-96 overflow-y-auto border-t border-b border-gray-200 px-5 py-2 space-y-6">
          {Object.entries(sections)
            .filter(
              ([sectionTitle]) =>
                !(sectionTitle === "Business Details" &&
                  formData.userType === "1")
            )
            .map(([sectionTitle, fields]) => (
              <div key={sectionTitle}>
                <h3 className="text-lg font-semibold mb-2">{sectionTitle}</h3>
                <ul className="space-y-2">
                  {fields.map(([label, value]) => {
                    let content;
                    if (value instanceof File) {
                      const fileType = value.type.split("/")[0];
                      if (fileType === "image") {
                        content = (
                          <img
                            src={URL.createObjectURL(value)}
                            alt={value.name}
                            className="w-32 h-32 object-cover rounded"
                          />
                        );
                      } else if (fileType === "video") {
                        content = (
                          <video
                            src={URL.createObjectURL(value)}
                            controls
                            className="w-48 h-32 object-cover rounded"
                          />
                        );
                      } else {
                        content = <span>{value.name}</span>;
                      }
                    } else {
                      content = <span>{value || "N/A"}</span>;
                    }
                    return (
                      <li key={label} className="flex justify-between">
                        <span className="font-medium">{label}:</span>
                        <div className="ml-4">{content}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={() => setAgreeTerms((prev) => !prev)}
            className="mr-2"
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-700">
            I agree to the Terms and Conditions
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={async () => {
              if (!agreeTerms) {
                alert("Please agree to the terms and conditions.");
                return;
              }

              const success = await onSubmit(3);
              if (success) {
                onClose();
              }
            }}
            className={`px-4 py-2 rounded-lg shadow ${
              agreeTerms
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!agreeTerms}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewPane;
