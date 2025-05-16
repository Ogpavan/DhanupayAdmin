// import { useState } from "react";
// import ServiceSelector, { services } from "../components/ServiceSelector";

// import "../App.css";

// export default function UserDashboard() {
//   const [activeService, setActiveService] = useState("recharge");

//   const activeLabel = services.find((s) => s.id === activeService)?.label || "";

//  return (
//   <div className=" h-[79vh] overflow-scroll hide-scrollbar ">

//     <ServiceSelector activeService={activeService} setActiveService={setActiveService} />

//   </div>
// );
// }

import { useState } from "react";
import ServiceSelector, { services } from "../components/ServiceSelector";

import "../App.css";

const serviceOptions = [
  {
    id: "payBill", label: "Pay Bill", icon: (
      <img
        src="/billpayments.png"
        alt="Pay Bill"
        className="w-6 h-6 object-contain "
        draggable={false}
      />
    ),
  },
  { id: "money", label: "Money Transfer", icon: "₹" },
  { id: "mobile", label: "Mobile", icon: "📱" },
  { id: "dth", label: "DTH", icon: "🖥️" },
  { id: "credit", label: "Credit Card", icon: "💳" },
  { id: "cardPayment", label: "Card Payment", icon: "💳" },
  { id: "aeps", label: "AEPS", icon: "📶" },
  { id: "cms", label: "CMS", icon: "💰" },
  // { id: "newLaunch", label: "NEW Launch", icon: "🚀" },
  // { id: "giftCards", label: "Gift Cards", icon: "🎁" },
  { id: "emi", label: "EMI PAYMENT", icon: "🧾" },
];

export default function UserDashboard() {
  const [activeServices, setActiveServices] = useState("payBill");
  const [activeService, setActiveService] = useState("recharge");

  return (
    <div className="h-[79vh] overflow-scroll hide-scrollbar">
      {/* Top icon bar */}
      <div className="flex overflow-x-auto justify-evenly bg-indigo-700 rounded-lg text-white px-4 py-3">
        {serviceOptions.map((service) => (
          <div
            key={service.id}
            onClick={() => setActiveServices(service.id)}
            className={`flex flex-col items-center justify-center px-4 cursor-pointer ${activeServices === service.id ? "text-white font-semibold border-b-2 border-white" : "text-gray-300"
              }`}
          >
            <div className="text-2xl">{service.icon}</div>
            <div className="text-xs mt-1 text-center">{service.label}</div>
          </div>
        ))}
        <div className=" flex justify-center items-center">
          <img src="Bharat-connect-white.png" alt="Bharat Connect" className="h-10" />
        </div>
      </div>

      {/* Conditional rendering */}
      <div className="p-4">
        {activeServices === "payBill" ? (
          <ServiceSelector activeService={activeService} setActiveService={setActiveService} />
        ) : (
          <div className="text-center text-gray-600 mt-10">
            <p>Service for <strong>{activeServices}</strong> is under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
