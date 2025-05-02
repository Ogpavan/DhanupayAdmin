import React, { useState } from "react";
import MDSection from "./MDSection";
import DistributorSection from "./DistributorSection";
import RetailerSection from "./RetailerSection";
import WhiteLabelSection from "./WhiteLabelSection";

function FundTransfer() {
  const [activeSection, setActiveSection] = useState("md");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "md":
        return <MDSection />;
      case "distributor":
        return <DistributorSection />;
      case "retailer":
        return <RetailerSection />;
      case "whitelabel":
        return <WhiteLabelSection />;
       
      default:
        return <div>Select an option to see the content</div>;
    }
  };

  return (
    <div className="bg-gray-100  ">
      {/* Navigation Buttons */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeSection === "md" ? "bg-indigo-700 text-white" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-500"
            }`}
            onClick={() => setActiveSection("md")}
          >
            M/D
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeSection === "distributor" ? "bg-indigo-700 text-white" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-500"
            }`}
            onClick={() => setActiveSection("distributor")}
          >
            Distributor
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeSection === "retailer" ? "bg-indigo-700 text-white" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-500"
            }`}
            onClick={() => setActiveSection("retailer")}
          >
            Retailer
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeSection === "whitelabel" ? "bg-indigo-700 text-white" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-500"
            }`}
            onClick={() => setActiveSection("whitelabel")}
          >
            W/L
          </button>
           
        </div>
      </div>

      {/* Render Active Section */}
      {renderActiveSection()}
    </div>
  );
}

export default FundTransfer;
