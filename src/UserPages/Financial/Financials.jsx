import React, { useState } from "react";
import {
  Bank,
  Fingerprint,
  DeviceTabletCamera,
  
} from "phosphor-react";
import DMTTransactions from "./DMTTransactions";
import AadhaarPayTransactions from "./AadhaarPayTransactions";
import MicroATMTransactions from "./MicroATMTransactions";
import "../../App.css";
 

// Placeholder components for each service
const DomesticMoneyTransfer = () => <DMTTransactions />;
const AadhaarPayAEPS = () => <AadhaarPayTransactions />;
const MicroATM = () => <MicroATMTransactions />;
 
const services = [
  { id: "dmt", label: "DOMESTIC MONEY TRANSFER", icon: <Bank size={32} weight="bold" />, component: <DomesticMoneyTransfer /> },
  { id: "aadhaar", label: "AADHAAR PAY AEPS", icon: <Fingerprint size={32} weight="bold" />, component: <AadhaarPayAEPS /> },
  { id: "micro", label: "MICRO ATM VM30", icon: <DeviceTabletCamera size={32} weight="bold" />, component: <MicroATM /> },
 
];

const Financials = () => {
  const [selectedService, setSelectedService] = useState("dmt");

  const selectedComponent = services.find(service => service.id === selectedService)?.component;

  return (
    <div className="flex flex-col h-[79vh]  overflow-scroll hide-scrollbar ">
      {/* Top Service Bar */}
      <div className="bg-indigo-700 p-4 rounded-md">
        <div className="flex gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-lg border transition duration-200 ${
                selectedService === service.id
                  ? "bg-white text-indigo-700 border-white font-semibold"
                  : "bg-indigo-500 text-white border-indigo-400 hover:bg-indigo-400"
              }`}
            >
              <div className="mb-2">{service.icon}</div>
              <span className="text-xs text-center leading-tight">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render selected service component */}
      <div className="flex-1 flex  bg-gray-100    text-lg">
        {selectedComponent || "Select a service to view transactions"}
      </div>
    </div>
  );
};

export default Financials;
