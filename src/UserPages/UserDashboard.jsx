import { useState } from "react";
import ServiceSelector, { services } from "../components/ServiceSelector";
import DTHRecharge from "./ServicesOnDashboard/DTHRecharge";
import MobileRecharge from "../UserPages/ServicesOnDashboard/MobileRecharge";

export default function UserDashboard() {
  const [activeService, setActiveService] = useState("mobile");

  const activeLabel = services.find((s) => s.id === activeService)?.label || "";

  const renderForm = () => {
    if (activeService === "mobile") {
      return <MobileRecharge activeLabel={activeLabel} />;
    }
    if (activeService === "dth") {
      return <DTHRecharge activeLabel={activeLabel} />;
    }
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{activeLabel} Payment</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Enter Customer ID or Details" className="w-full p-2 border rounded" />
          <input type="number" placeholder="Enter Amount" className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Continue</button>
        </form>
      </div>
    );
  };

  return (
    <div className="p-4">
      <ServiceSelector activeService={activeService} setActiveService={setActiveService} />

      <div className="">
        {renderForm()}
        
      </div>
    </div>
  );
}