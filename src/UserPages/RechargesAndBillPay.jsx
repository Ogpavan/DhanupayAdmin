// import React from 'react'

// function RechargesAndBillPay() {
//   return (
//     <div>RechargesAndBillPay</div>
//   )
// }

// export default RechargesAndBillPay



import { useState } from "react";
import ServiceSelector, { services } from "../components/ServiceSelector";

import "../App.css";

export default function RechargesAndBillPay() {
  const [activeService, setActiveService] = useState("recharge");

  const activeLabel = services.find((s) => s.id === activeService)?.label || "";

 return (
  <div className=" h-[79vh] overflow-scroll hide-scrollbar ">
    <ServiceSelector activeService={activeService} setActiveService={setActiveService} />
   
  </div>
);
}