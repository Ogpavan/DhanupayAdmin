import { useState } from "react";
import {  Television, Lightning, GasPump, Shield, Drop, WifiHigh, Bank, Car,  DeviceMobile, TelevisionSimple } from "phosphor-react";

const services = [
  { id: "mobile", label: "Mobile", icon: <DeviceMobile size={24} /> },
  { id: "dth", label: "DTH", icon: <Television size={24} /> },
  { id: "electricity", label: "Electricity", icon: <Lightning size={24} /> },
  { id: "gas", label: "Gas Book", icon: <GasPump size={24} /> },
  { id: "insurance", label: "Insurance", icon: <Shield size={24} /> },
  { id: "water", label: "Water", icon: <Drop size={24} /> },
  { id: "broadband", label: "Broadband", icon: <WifiHigh size={24} /> },
  { id: "loan", label: "Loan EMI", icon: <Bank size={24} /> },
  { id: "fastag", label: "FASTag", icon: <Car size={24} /> },
  { id: "cable", label: "Cable TV", icon: <TelevisionSimple size={24} /> },
];

export default function UserDashboard()  {
  const [activeService, setActiveService] = useState("mobile");

  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-2 mb-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={`flex flex-col items-center justify-center p-2 border rounded-lg transition ${activeService === service.id ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
          >
            {service.icon}
            <span className="text-xs mt-1">{service.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{services.find(s => s.id === activeService)?.label} Recharge & Bill Payment</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Enter Mobile Number"
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-4">
            <button type="button" className="flex-1 p-2 border rounded bg-gray-100">Prepaid</button>
            <button type="button" className="flex-1 p-2 border rounded bg-gray-100">Postpaid</button>
          </div>
          <select className="w-full p-2 border rounded">
            <option>Select Operator</option>
            <option>Airtel</option>
            <option>Vi</option>
            <option>Jio</option>
          </select>
          <select className="w-full p-2 border rounded">
            <option>Select Circle</option>
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
          </select>
          <input
            type="number"
            placeholder="Enter Amount"
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
