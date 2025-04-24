import { NavLink } from "react-router-dom";
import { House, Users, Wallet, Gear, UserCircleGear } from "phosphor-react";

// Sidebar component
export default function Sidebar() {
  const sidebarLinks = [
    { to: "/", label: "Dashboard", icon: <House size={24} weight="fill" /> },
    { to: "/profile", label: "My Profile", icon: <UserCircleGear size={24} weight="fill" /> },
    { to: "/users", label: "Users & Account", icon: <Users size={24} weight="fill" /> },
    { to: "/transactions", label: "Transactions", icon: <Wallet size={24} weight="fill" /> },
    { to: "/retailer", label: "Retailer Registration", icon: <Users size={24} weight="fill" /> },
    { to: "/distributor", label: "Distributor Registration", icon: <Users size={24} weight="fill" /> },
    { to: "/settings", label: "Basic Settings", icon: <Gear size={24} weight="fill" /> },
  ];

  return (
    <div className="w-60 h-full bg-gray-200 text-gray-900 p-4">
      <nav className="flex flex-col space-y-4">
        {sidebarLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-indigo-700 text-white" : "text-gray-900 hover:text-indigo-700"
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
