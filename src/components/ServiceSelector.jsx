import {
  DeviceMobile, Television, Lightning, GasPump, Shield, Drop,
  WifiHigh, Bank, Car, TelevisionSimple
} from "phosphor-react";

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

export default function ServiceSelector({ activeService, setActiveService }) {
  return (
    <div className="grid grid-cols-10 gap-2 mb-4 bg-indigo-700  p-5 rounded-xl">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => setActiveService(service.id)}
          className={`flex flex-col items-center  justify-center p-2 border-4 rounded-lg transition ${activeService === service.id ? "bg-white text-indigo-700 border-white font-semibold"
              : "bg-indigo-500 text-white border-indigo-400 hover:bg-indigo-400"
            }`}
        >
          {service.icon}
          <span className="text-xs mt-1">{service.label}</span>
        </button>
      ))}
    </div>
  );
}

export { services };
