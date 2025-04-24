import { NavLink } from "react-router-dom";
import { House, Users, Wallet } from "phosphor-react";

export default function Sidebar() {
  return (
    <div className="w-60 h-full bg-indigo-700 text-white p-4">
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg   transition-colors ${
              isActive ? "bg-white text-indigo-700" : ""
            }`
          }
        >
          <House size={24} className="transition-colors" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg   transition-colors ${
              isActive ? "bg-white text-indigo-700" : ""
            }`
          }
        >
          <Users size={24} className="transition-colors" />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg   transition-colors ${
              isActive ? "bg-white text-indigo-700" : ""
            }`
          }
        >
          <Wallet size={24} className="transition-colors" />
          <span>Transactions</span>
        </NavLink>
      </nav>
    </div>
  );
}
