import { NavLink } from "react-router-dom";
import { House, Users, Wallet, Gear, UserCircleGear, Notepad } from "phosphor-react";

// Sidebar component
export default function Sidebar() {
  // Define the sidebar links for admin and user
  const AdminsidebarLinks = [
    { to: "/admin", label: "Dashboard", icon: <House size={24} weight="fill" /> },
    { to: "/admin/profile", label: "My Profile", icon: <UserCircleGear size={24} weight="fill" /> },
    { to: "/admin/users", label: "Users & Account", icon: <Users size={24} weight="fill" /> },
    { to: "/admin/transactions", label: "Transactions", icon: <Wallet size={24} weight="fill" /> },
    { to: "/admin/registration", label: "Registration", icon: <Users size={24} weight="fill" /> },
    
    { to: "/admin/settings", label: "Basic Settings", icon: <Gear size={24} weight="fill" /> },
    { to: "/admin/commission", label: "Commission", icon: <Gear size={24} weight="fill" /> },
    {to: "/admin/financial",label: "Financial", icon: <Gear size={24} weight="fill" />},
    {to: "/admin/employeemaster",label: "Employee Master", icon: <Gear size={24} weight="fill" />}
  ];

  const usersidebarLinks = [
    { to: "/user", label: "Dashboard", icon: <House size={24} weight="fill" /> },
    { to: "/user/profile", label: "My Profile", icon: <UserCircleGear size={24} weight="fill" /> },
    { to: "/user/users", label: "Users & Account", icon: <Users size={24} weight="fill" /> },
    { to: "/user/transactions", label: "Transactions", icon: <Wallet size={24} weight="fill" /> },
    { to: "/user/registration", label: "Registration", icon: <Users size={24} weight="fill" /> },
    { to: "/user/reports", label: "Reports", icon: <Notepad size={24} weight="fill" /> },
    { to: "/user/settings", label: "Basic Settings", icon: <Gear size={24} weight="fill" /> },
    { to: "/user/commission", label: "Commission", icon: <Gear size={24} weight="fill" /> },
    {to: "/user/financials",label: "Financial", icon: <Gear size={24} weight="fill" />},
    {to:"/user/wallet",label: "Wallet", icon: <Gear size={24} weight="fill" />}
  ];

  // Fetch user type from localStorage (either 'admin' or 'user')
  const userType = localStorage.getItem("userType");

  // Conditional rendering of sidebar links based on user type
  const sidebarLinks = userType === "admin" ? AdminsidebarLinks : usersidebarLinks;

  return (
    <div className="w-60 h-full bg-gray-200 text-gray-900 p-4">
      <nav className="flex flex-col space-y-4">
        {sidebarLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            end={link.to === "/admin" || link.to === "/user"}
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
