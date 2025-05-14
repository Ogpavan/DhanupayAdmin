import { useState } from "react";
import {
  WifiHigh,
  Shield,
  Car,
  Flame,
  CreditCard,
  Phone,
  Newspaper,
  TestTube,
  Key,
  HeartPulse,
  Book,
  HandCoins,
  PiggyBank,
  Home,
  BadgeIndianRupee,
  BusFront,
  GaugeCircle,
  FlameIcon
} from "lucide-react";
import DTHRecharge from "../UserPages/ServicesOnDashboard/DTHRecharge";
import MobileRecharge from "../UserPages/ServicesOnDashboard/MobileRecharge";
import Electricity from "../UserPages/ServicesOnDashboard/Electricity";
import GasBook from "../UserPages/ServicesOnDashboard/GasBook";
import Insurance from "../UserPages/ServicesOnDashboard/Insurance";
import Water from "../UserPages/ServicesOnDashboard/Water";
import Broadband from "../UserPages/ServicesOnDashboard/Broadband";
import LoanPayment from "../UserPages/ServicesOnDashboard/LoanPayment";
import Fastag from "../UserPages/ServicesOnDashboard/Fastag";
import CableTV from "../UserPages/ServicesOnDashboard/CableTV";
import { Bank, DeviceMobileCamera, DeviceMobile, TelevisionSimple, DropHalf, GasPump, LightningSlash, Monitor } from "phosphor-react";

const services = [
  { id: "recharge", label: "Recharge", icon: <DeviceMobile size={24} /> },
  { id: "dth", label: "DTH", icon: <Monitor size={24} /> },
  { id: "broadband", label: "Broadband", icon: <WifiHigh size={24} /> },
  { id: "electricity", label: "Electricity", icon: <LightningSlash size={24} /> },
  { id: "piped_gas", label: "Piped Gas", icon: <GasPump size={24} /> },
  { id: "insurance", label: "Insurance", icon: <Shield size={24} /> },
  { id: "water", label: "Water", icon: <DropHalf size={24} /> },
  { id: "fastag", label: "FasTag", icon: <Car size={24} /> },
  { id: "book_cylinder", label: "Book Cylinder", icon: <FlameIcon size={24} /> },
  { id: "credit_card", label: "Credit Card", icon: <CreditCard size={24} /> },
];

const moreServices = [
  { id: "landline_postpaid", label: "Landline Postpaid", icon: <Phone size={24} /> },
  { id: "data_card", label: "Data Card", icon: <DeviceMobile size={24} /> },
  { id: "subscription", label: "Subscription", icon: <Newspaper size={24} /> },
  { id: "cable_tv", label: "Cable TV", icon: <TelevisionSimple size={24} /> },
  { id: "clubs", label: "Clubs ", icon: <HeartPulse size={24} /> },
  { id: "donation", label: "Donation", icon: <HandCoins size={24} /> },
  { id: "education", label: "Education Fees", icon: <Book size={24} /> },
  { id: "broadband_postpaid", label: "Broadband Postpaid", icon: <WifiHigh size={24} /> },
  { id: "health_insurance", label: "Health Insurance", icon: <Shield size={24} /> },
  { id: "hospital", label: " Pathology", icon: <TestTube size={24} /> },
  { id: "housing", label: "Housing Society", icon: <Home size={24} /> },
  { id: "life_insurance", label: "Life Insurance", icon: <Shield size={24} /> },
  { id: "loan_repayment", label: "Loan Repayment", icon: <Bank size={24} /> },
  { id: "lpg_gas", label: "LPG Gas", icon: <Flame size={24} /> },
  { id: "mobile_postpaid", label: "Mobile Postpaid", icon: <DeviceMobileCamera size={24} /> },
  { id: "mobile_prepaid", label: "Mobile Prepaid", icon: <DeviceMobileCamera size={24} /> },
  { id: "municipal", label: "Municipal Services", icon: <Shield size={24} /> },
  { id: "taxes", label: "Municipal Taxes", icon: <Key size={24} /> },
  { id: "recurring_deposit", label: "Recurring Deposit", icon: <PiggyBank size={24} /> },
  { id: "rental", label: "Rental", icon: <BadgeIndianRupee size={24} /> },
  { id: "ncmc", label: "NCMC", icon: <BusFront size={24} /> },
  { id: "prepaid_meter", label: "Prepaid Meter", icon: <GaugeCircle size={24} /> },
];

const allServices = [...services, ...moreServices];

function getLabel(serviceId) {
  const found = allServices.find((s) => s.id === serviceId);
  return found ? found.label : "Service";
}

function RenderForm({ activeService }) {
  const activeLabel = getLabel(activeService);

  switch (activeService) {
    case "recharge":
    case "mobile":
      return <MobileRecharge activeLabel={activeLabel} />;
    case "dth":
      return <DTHRecharge activeLabel={activeLabel} />;
    case "electricity":
      return <Electricity activeLabel={activeLabel} />;
    case "piped_gas":
    case "book_cylinder":
    case "gas":
      return <GasBook activeLabel={activeLabel} />;
    case "insurance":
      return <Insurance activeLabel={activeLabel} />;
    case "water":
      return <Water activeLabel={activeLabel} />;
    case "broadband":
      return <Broadband activeLabel={activeLabel} />;
    case "loan":
    case "loan_repayment":
      return <LoanPayment activeLabel={activeLabel} />;
    case "fastag":
      return <Fastag activeLabel={activeLabel} />;
    case "cable_tv":
      return <CableTV activeLabel={activeLabel} />;
    default:
      return (
        <div className="bg-white overflow-x-scroll rounded-lg ">
          <h2 className="text-xl font-semibold mb-4">{activeLabel} Payment</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Enter Customer ID or Details" className="w-full p-2 border rounded" />
            <input type="number" placeholder="Enter Amount" className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Continue</button>
          </form>
        </div>
      );
  }
}

export default function ServiceSelector({ activeService, setActiveService }) {
  return (
    <div className="  w-full h-full bg-white rounded-xl p-4">
      <div className="flex justify-end absolute right-10 ">
        <img src="/bharat-connect.png" alt="Bharat Connect" className="h-10" />
      </div>

      <div className="flex flex-wrap pr-20 gap-3 mb-6">
        {allServices.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={`flex flex-col items-center text-sm p-2 rounded-lg transition-all ${
              activeService === service.id
                ? "text-indigo-600 font-semibold border-b-2 border-orange-500"
                : "text-gray-700 hover:text-indigo-500"
            }`}
          >
            {service.icon}
            <span className="mt-1 text-center">{service.label}</span>
          </button>
        ))}
      </div>

      <div className="py-4">
        <RenderForm activeService={activeService} />
      </div>
    </div>
  );
}

export { services };
