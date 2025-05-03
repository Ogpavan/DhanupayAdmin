import { useState } from "react";
import ServiceSelector, { services } from "../components/ServiceSelector";
import DTHRecharge from "./ServicesOnDashboard/DTHRecharge";
import MobileRecharge from "../UserPages/ServicesOnDashboard/MobileRecharge";
import Electricity from "./ServicesOnDashboard/Electricity";
import GasBook from "./ServicesOnDashboard/GasBook";
import Insurance from "./ServicesOnDashboard/Insurance";
import Water from "./ServicesOnDashboard/Water";
import Broadband from "./ServicesOnDashboard/Broadband";
import LoanPayment from "./ServicesOnDashboard/LoanPayment";
import Fastag from "./ServicesOnDashboard/Fastag";
import CableTV from "./ServicesOnDashboard/CableTV";
import "../App.css";

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
    if (activeService === "electricity") {
      return <Electricity activeLabel={activeLabel} />;
    }
    if (activeService === "gas") {
      return <GasBook activeLabel={activeLabel} />;
    }
    if (activeService === "insurance") {
      return <Insurance activeLabel={activeLabel} />;
    }
    if (activeService === "water") {
      return <Water activeLabel={activeLabel} />;
     
    }
    if (activeService === "broadband") {
      return <Broadband activeLabel={activeLabel} />;
    }
    if (activeService === "loan") {
      return <LoanPayment activeLabel={activeLabel} />;
    }
    if (activeService === "fastag") {
      return <Fastag activeLabel={activeLabel} />;
    }
    if (activeService === "cable") {
      return <CableTV activeLabel={activeLabel} />;
    }
    
    return (
      <div className="bg-white  shadow-md rounded-lg p-6  ">
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
    <div className="p-2 h-[79vh] overflow-scroll hide-scrollbar ">
      <ServiceSelector activeService={activeService} setActiveService={setActiveService} />

      <div className=" ">
        {renderForm()}
        
      </div>
    </div>
  );
}