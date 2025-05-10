import { useState } from "react";
import ServiceSelector, { services } from "../components/ServiceSelector";

import "../App.css";

export default function UserDashboard() {
  const [activeService, setActiveService] = useState("recharge");

  const activeLabel = services.find((s) => s.id === activeService)?.label || "";

  

 return (
  <div className=" h-[79vh] overflow-y-scroll ">
    <ServiceSelector activeService={activeService} setActiveService={setActiveService} />
   
  </div>
);
}