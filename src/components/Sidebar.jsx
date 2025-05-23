
// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   House,
//   Users,
//   Wallet,
//   Gear,
//   UserCircleGear,
//   Notepad,
//   CaretDown,
//   CaretUp,
// } from "phosphor-react";
// import Cookies from "js-cookie";
// import billpayments from "/billpayments.png";



// const iconMap = {
//   House: <House size={24} weight="fill" />,
//   UserCircleGear: <UserCircleGear size={24} weight="fill" />,
//   Users: <Users size={24} weight="fill" />,
//   Gear: <Gear size={24} weight="fill" />
// };


// const sidebarData = [
//   { to: "/admin", label: "Dashboard", icon: "House" },
//   { to: "/admin/profile", label: "My Profile", icon: "UserCircleGear" },
//   { to: "/admin/registration", label: "Manage Users", icon: "Users" },
//   {
//     label: "Basic Settings",
//     icon: "Gear",
//     nested: [
//       { to: "/admin/settings/city", label: "City" },
//       { to: "/admin/settings/state", label: "State" },
//       { to: "/admin/settings/department", label: "Department" },
//       { to: "/admin/settings/designation", label: "Designation" },
//       { to: "/admin/settings/usertype", label: "User Type" },
//       { to: "/admin/settings/role", label: "Role" }
//     ]
//   },
//   { to: "/admin/employeemaster", label: "Employee Master", icon: "Gear" },
//   { to: "/admin/fundtransfer", label: "Fund Transfer", icon: "Gear" },
//   { to: "/admin/ServiceMaster", label: "Service Master", icon: "Gear" },
//   { to: "/admin/pagemastermanager", label: "Page Master", icon: "Gear" }
// ];


// export default function Sidebar() {
//   const [isServicesOpen, setIsServicesOpen] = useState(false);
//   const [openMenu, setOpenMenu] = useState(null);
// const location = useLocation();


//   const toggleServicesMenu = () => {
//     setIsServicesOpen((prev) => !prev);
//   };

//   const AdminsidebarLinks = [
//     { to: "/admin", label: "Dashboard", icon: <House size={24} weight="fill" /> },
//     { to: "/admin/profile", label: "My Profile", icon: <UserCircleGear size={24} weight="fill" /> },
//     { to: "/admin/registration", label: "Manage Users", icon: <Users size={24} weight="fill" /> },
//     // { to: "/admin/settings", label: "Basic Settings", icon: <Gear size={24} weight="fill" /> },
//     {
//       label: "Basic Settings",
//       icon: <Gear size={24} weight="fill" />,
//       nested: [
//         { to: "/admin/settings/city", label: "City" },
//         { to: "/admin/settings/state", label: "State" },
//         { to: "/admin/settings/department", label: "Department" },
//         { to: "/admin/settings/designation", label: "Designation" },
//         { to: "/admin/settings/usertype", label: "User Type" },
//         { to: "/admin/settings/role", label: "Role" },
//       ],
//     },

//     // { to: "/admin/commission", label: "Commission", icon: <Gear size={24} weight="fill" /> },
//     { to: "/admin/employeemaster", label: "Employee Master", icon: <Gear size={24} weight="fill" /> },
//     { to: "/admin/fundtransfer", label: "Fund Transfer", icon: <Gear size={24} weight="fill" /> },
//     // { to: "/admin/ChangePassword", label: "Change Password", icon: <Gear size={24} weight="fill" /> },
//     { to: "/admin/ServiceMaster", label: "Service Master", icon: <Gear size={24} weight="fill" /> },
//     { to: "/admin/pagemastermanager", label: "Page Master", icon: <Gear size={24} weight="fill" /> },
//   ];

//   const usersidebarLinks = [
//     { to: "/user", label: "Dashboard", icon: <House size={24} weight="fill" /> },
//     {
//       label: "Services",
//       icon: <Gear size={24} weight="fill" />,
//       nested: [
//         {
//           to: "/user/services/recharges",
//           icon: <img src={billpayments} alt="Bill Payments" className="w-4 h-4" />,
//           label: "Bill Payments",
//         },
//         { to: "/user/services/aeps", label: "AEPS" },
//         { to: "/user/services/aadhaar-pay", label: "Aadhaar Pay" },
//         { to: "/user/services/dmt", label: "DMT" },
//       ],
//     },

//     { to: "/user/profile", label: "My Profile", icon: <UserCircleGear size={24} weight="fill" /> },
//     { to: "/user/registration", label: "Manage Users", icon: <Users size={24} weight="fill" /> },

//     { to: "/user/users", label: "Users & Account", icon: <Users size={24} weight="fill" /> },
//     { to: "/user/transactions", label: "Transactions", icon: <Wallet size={24} weight="fill" /> },
//     // { to: "/user/registration", label: "Registration", icon: <Users size={24} weight="fill" /> },
//     { to: "/user/reports", label: "Reports", icon: <Notepad size={24} weight="fill" /> },
//     { to: "/user/settings", label: "Basic Settings", icon: <Gear size={24} weight="fill" /> },
//     // { to: "/user/commission", label: "Commission", icon: <Gear size={24} weight="fill" /> },
//     { to: "/user/financials", label: "Financial", icon: <Gear size={24} weight="fill" /> },
//     { to: "/user/wallet", label: "Wallet", icon: <Gear size={24} weight="fill" /> },
//   ];

//   const role = Cookies.get("role") || "user";
//   const sidebarLinks = role === "Admin" ? AdminsidebarLinks : usersidebarLinks;

//   return (
//     <div className="w-60 bg-gray-200 text-gray-900 p-4 h-[calc(100vh-10vh)] hide-scrollbar overflow-y-scroll">
//       <nav className="flex flex-col space-y-2">
//        {sidebarLinks.map((link, index) => {
//   if (link.nested) {
//     const isNestedActive = link.nested.some((nested) =>
//       location.pathname.startsWith(nested.to)
//     );

//     const isOpen = openMenu === link.label || isNestedActive;

//     const handleToggle = () => {
//       // Toggle open state, but close others
//       if (openMenu === link.label) {
//         setOpenMenu(null);
//       } else {
//         setOpenMenu(link.label);
//       }
//     };

//     return (
//       <div key={index}>
//         <button
//           onClick={handleToggle}
//           className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-left transition-colors ${
//             isNestedActive ? "text-indigo-700" : "text-gray-900 hover:text-indigo-700"
//           }`}
//         >
//           <div className="flex items-center space-x-2">
//             <span>{link.icon}</span>
//             <span>{link.label}</span>
//           </div>
//           {isOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
//         </button>

//         {isOpen && (
//           <div className="pl-10 flex flex-col space-y-1 mt-1">
//             {link.nested.map((nestedLink, nestedIndex) => (
//               <NavLink
//                 key={nestedIndex}
//                 to={nestedLink.to}
//                 className={({ isActive }) =>
//                   `flex items-center space-x-2 text-sm py-1 hover:text-indigo-700 ${
//                     isActive ? "text-indigo-700 font-semibold" : "text-gray-800"
//                   }`
//                 }
//                 onClick={() => setOpenMenu(null)} // optional: auto close after click
//               >
//                 {nestedLink.icon && <span>{nestedLink.icon}</span>}
//                 <span>{nestedLink.label}</span>
//               </NavLink>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <NavLink
//       key={index}
//       to={link.to}
//       end={link.to === "/admin" || link.to === "/user"}
//       className={({ isActive }) =>
//         `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//           isActive ? "bg-indigo-700 text-white" : "text-gray-900 hover:text-indigo-700"
//         }`
//       }
//     >
//       {link.icon}
//       <span>{link.label}</span>
//     </NavLink>
//   );
// })}

//       </nav>
//     </div>
//   );
// }


// *******************************************************************************

// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   House,
//   Users,
//   Wallet,
//   Gear,
//   UserCircleGear,
//   Notepad,
//   CaretDown,
//   CaretUp,
// } from "phosphor-react";
// import Cookies from "js-cookie";
// import billpayments from "/billpayments.png";

// // Map of icon name strings to actual Phosphor components
// const iconMap = {
//   House: <House size={24} weight="fill" />,
//   UserCircleGear: <UserCircleGear size={24} weight="fill" />,
//   Users: <Users size={24} weight="fill" />,
//   Gear: <Gear size={24} weight="fill" />,
// };

// // Admin Sidebar Data (now dynamic)
// const sidebarDataforHR = [
//   { to: "/admin", label: "Dashboard", icon: "House" },
//   { to: "/admin/profile", label: "My Profile", icon: "UserCircleGear" },
//   { to: "/admin/registration", label: "Manage Users", icon: "Users" },
//   // {
//   //   label: "Basic Settings",
//   //   icon: "Gear",
//   //   nested: [
//   //     { to: "/admin/settings/city", label: "City" },
//   //     { to: "/admin/settings/state", label: "State" },
//   //     { to: "/admin/settings/department", label: "Department" },
//   //     { to: "/admin/settings/designation", label: "Designation" },
//   //     { to: "/admin/settings/usertype", label: "User Type" },
//   //     { to: "/admin/settings/role", label: "Role" },
//   //   ],
//   // },
//   { to: "/admin/employeemaster", label: "Employee Master", icon: "Gear" },
//   // { to: "/admin/fundtransfer", label: "Fund Transfer", icon: "Gear" },
//   // { to: "/admin/ServiceMaster", label: "Service Master", icon: "Gear" },
//   // { to: "/admin/pagemastermanager", label: "Page Master", icon: "Gear" },
// ];

// const sidebarDataforBuisnessExecutive = [
//   { to: "/admin", label: "Dashboard", icon: "House" },
//   { to: "/admin/profile", label: "My Profile", icon: "UserCircleGear" },
//   { to: "/admin/registration", label: "Manage Users", icon: "Users" },
//   // {
//   //   label: "Basic Settings",
//   //   icon: "Gear",
//   //   nested: [
//   //     { to: "/admin/settings/city", label: "City" },
//   //     { to: "/admin/settings/state", label: "State" },
//   //     { to: "/admin/settings/department", label: "Department" },
//   //     { to: "/admin/settings/designation", label: "Designation" },
//   //     { to: "/admin/settings/usertype", label: "User Type" },
//   //     { to: "/admin/settings/role", label: "Role" },
//   //   ],
//   // },
//   // { to: "/admin/employeemaster", label: "Employee Master", icon: "Gear" },
//   // { to: "/admin/fundtransfer", label: "Fund Transfer", icon: "Gear" },
//   { to: "/admin/ServiceMaster", label: "Service Master", icon: "Gear" },
//   { to: "/admin/pagemastermanager", label: "Page Master", icon: "Gear" },
// ];


// const sidebarDataforAdmin = [
//   { to: "/admin", label: "Dashboard", icon: "House" },
//   { to: "/admin/profile", label: "My Profile", icon: "UserCircleGear" },
//   { to: "/admin/registration", label: "Manage Users", icon: "Users" },
//   {
//     label: "Basic Settings",
//     icon: "Gear",
//     nested: [
//       { to: "/admin/settings/city", label: "City" },
//       { to: "/admin/settings/state", label: "State" },
//       { to: "/admin/settings/department", label: "Department" },
//       { to: "/admin/settings/designation", label: "Designation" },
//       { to: "/admin/settings/usertype", label: "User Type" },
//       { to: "/admin/settings/role", label: "Role" },
//     ],
//   },
//   { to: "/admin/employeemaster", label: "Employee Master", icon: "Gear" },
//   { to: "/admin/fundtransfer", label: "Fund Transfer", icon: "Gear" },
//   { to: "/admin/ServiceMaster", label: "Service Master", icon: "Gear" },
//   { to: "/admin/pagemastermanager", label: "Page Master", icon: "Gear" },
// ];

// // User Sidebar Data (unchanged)
// const usersidebarLinks = [
//   { to: "/user", label: "Dashboard", icon: <House size={24} weight="fill" /> },
//   {
//     label: "Services",
//     icon: <Gear size={24} weight="fill" />,
//     nested: [
//       {
//         to: "/user/services/recharges",
//         icon: <img src={billpayments} alt="Bill Payments" className="w-4 h-4" />,
//         label: "Bill Payments",
//       },
//       { to: "/user/services/aeps", label: "AEPS" },
//       { to: "/user/services/aadhaar-pay", label: "Aadhaar Pay" },
//       { to: "/user/services/dmt", label: "DMT" },
//     ],
//   },
//   { to: "/user/profile", label: "My Profile", icon: <UserCircleGear size={24} weight="fill" /> },
//   { to: "/user/registration", label: "Manage Users", icon: <Users size={24} weight="fill" /> },
//   { to: "/user/users", label: "Users & Account", icon: <Users size={24} weight="fill" /> },
//   { to: "/user/transactions", label: "Transactions", icon: <Wallet size={24} weight="fill" /> },
//   { to: "/user/reports", label: "Reports", icon: <Notepad size={24} weight="fill" /> },
//   { to: "/user/settings", label: "Basic Settings", icon: <Gear size={24} weight="fill" /> },
//   { to: "/user/financials", label: "Financial", icon: <Gear size={24} weight="fill" /> },
//   { to: "/user/wallet", label: "Wallet", icon: <Gear size={24} weight="fill" /> },
// ];

// export default function Sidebar() {
//   const [openMenu, setOpenMenu] = useState(null);
//   const location = useLocation();

//   const role = Cookies.get("role") || "user";
//   const RoleId = Cookies.get("RoleId");
//   let sidebarLinks = [];
//   console.log("role", role);
//   console.log("roleId", RoleId);

//   switch (role) {
//     case "Admin":
//       sidebarLinks = sidebarDataforAdmin.map((link) => ({
//         ...link,
//         icon: iconMap[link.icon] || <Gear size={24} weight="fill" />,
//         nested: link.nested?.map((n) => ({
//           ...n,
//           icon: iconMap[n.icon] || null,
//         })),
//       }));
//       break;

//     case "HR":
//       sidebarLinks = sidebarDataforHR.map((link) => ({
//         ...link,
//         icon: iconMap[link.icon] || <Gear size={24} weight="fill" />,
//         nested: link.nested?.map((n) => ({
//           ...n,
//           icon: iconMap[n.icon] || null,
//         })),
//       }));
//       break;

//     case "Business Executive":
//       sidebarLinks = sidebarDataforBuisnessExecutive.map((link) => ({
//         ...link,
//         icon: iconMap[link.icon] || <Gear size={24} weight="fill" />,
//         nested: link.nested?.map((n) => ({
//           ...n,
//           icon: iconMap[n.icon] || null,
//         })),
//       }));
//       break;

//     default:
//       sidebarLinks = usersidebarLinks;
//   }

//   return (
//     <div className="w-60 bg-gray-200 text-gray-900 p-4 h-[calc(100vh-10vh)] hide-scrollbar overflow-y-scroll">
//       <nav className="flex flex-col space-y-2">
//         {sidebarLinks.map((link, index) => {
//           if (link.nested) {
//             const isNestedActive = link.nested.some((nested) =>
//               location.pathname.startsWith(nested.to)
//             );

//             const isOpen = openMenu === link.label || isNestedActive;

//             const handleToggle = () => {
//               setOpenMenu(openMenu === link.label ? null : link.label);
//             };

//             return (
//               <div key={index}>
//                 <button
//                   onClick={handleToggle}
//                   className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-left transition-colors ${isNestedActive
//                     ? "text-indigo-700"
//                     : "text-gray-900 hover:text-indigo-700"
//                     }`}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <span>{link.icon}</span>
//                     <span>{link.label}</span>
//                   </div>
//                   {isOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
//                 </button>

//                 {isOpen && (
//                   <div className="pl-10 flex flex-col space-y-1 mt-1">
//                     {link.nested.map((nestedLink, nestedIndex) => (
//                       <NavLink
//                         key={nestedIndex}
//                         to={nestedLink.to}
//                         className={({ isActive }) =>
//                           `flex items-center space-x-2 text-sm py-1 hover:text-indigo-700 ${isActive
//                             ? "text-indigo-700 font-semibold"
//                             : "text-gray-800"
//                           }`
//                         }
//                         onClick={() => setOpenMenu(null)}
//                       >
//                         {nestedLink.icon && <span>{nestedLink.icon}</span>}
//                         <span>{nestedLink.label}</span>
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           return (
//             <NavLink
//               key={index}
//               to={link.to}
//               end={link.to === "/admin" || link.to === "/user"}
//               className={({ isActive }) =>
//                 `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive
//                   ? "bg-indigo-700 text-white"
//                   : "text-gray-900 hover:text-indigo-700"
//                 }`
//               }
//             >
//               {link.icon}
//               <span>{link.label}</span>
//             </NavLink>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }

// ************************************************************************************
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  House,
  Users,
  Wallet,
  Gear,
  UserCircleGear,
  Notepad,
  CaretDown,
  CaretUp,
} from "phosphor-react";
import Cookies from "js-cookie";
import billpayments from "/billpayments.png";
import axios from "axios";
import { usePermissions } from "../context/PermissionsContext";

// User Sidebar Data (unchanged)
const usersidebarLinks = [
  { to: "/user", label: "Dashboard", icon: <House size={24} weight="fill" /> },
  // {
  //   label: "Services",
  //   icon: <Gear size={24} weight="fill" />,
  //   nested: [
  //     {
  //       to: "/user/services/recharges",
  //       icon: <img src={billpayments} alt="Bill Payments" className="w-4 h-4" />,
  //       label: "Bill Payments",
  //     },
  //     { to: "/user/services/aeps", label: "AEPS" },
  //     { to: "/user/services/aadhaar-pay", label: "Aadhaar Pay" },
  //     { to: "/user/services/dmt", label: "DMT" },
  //   ],
  // },
  { to: "/user/profile", label: "My Profile", icon: <UserCircleGear size={24} weight="fill" /> },
  { to: "/user/registration", label: "Manage Users", icon: <Users size={24} weight="fill" /> },
  { to: "/user/users", label: "Users & Account", icon: <Users size={24} weight="fill" /> },
  { to: "/user/transactions", label: "Transactions", icon: <Wallet size={24} weight="fill" /> },
  { to: "/user/reports", label: "Reports", icon: <Notepad size={24} weight="fill" /> },
  { to: "/user/settings", label: "Basic Settings", icon: <Gear size={24} weight="fill" /> },
  { to: "/user/financials", label: "Financial", icon: <Gear size={24} weight="fill" /> },
  { to: "/user/wallet", label: "Wallet", icon: <Gear size={24} weight="fill" /> },
];



// Map of icon name strings to actual Phosphor components
const iconMap = {
  House: <House size={24} weight="fill" />,
  UserCircleGear: <UserCircleGear size={24} weight="fill" />,
  Users: <Users size={24} weight="fill" />,
  Gear: <Gear size={24} weight="fill" />,
};

export default function Sidebar() {

  const { setPermissions } = usePermissions();
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarLinks, setSidebarLinks] = useState([]);
  const location = useLocation();

  const role = Cookies.get("role") || "user";
  const RoleId = Cookies.get("RoleID");
  const token = Cookies.get("token");

  const iconMap = {
    House: <House size={24} weight="fill" />,
    UserCircleGear: <UserCircleGear size={24} weight="fill" />,
    Users: <Users size={24} weight="fill" />,
    Gear: <Gear size={24} weight="fill" />,
  };



useEffect(() => {
  if (role !== "user") {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/RolePermission/GetRolesPermission`,
        { RoleId: RoleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const menuItems = response.data;
        console.log("permission response data from api",menuItems);
        // Store full permissions globally
        setPermissions(menuItems);
        // Build filtered sidebar links
        const filteredItems = menuItems
          .map((item) => {
            if (item.nested) {
              const visibleNested = item.nested.filter(
                (n) => n.CanView === "1"
              );

              if (visibleNested.length > 0) {
                return {
                  ...item,
                  icon: iconMap[item.icon] || <Gear size={24} weight="fill" />,
                  nested: visibleNested.map((n) => ({
                    ...n,
                    icon: iconMap[n.icon] || null,
                  })),
                };
              }

              return null;
            }

            return item.CanView === "1"
              ? {
                  ...item,
                  icon: iconMap[item.icon] || <Gear size={24} weight="fill" />,
                }
              : null;
          })
          .filter(Boolean); // remove null entries

        setSidebarLinks(filteredItems);
      })
      .catch((error) => {
        console.error("Failed to fetch sidebar data", error);
      });
  } else {
    setSidebarLinks(usersidebarLinks);
    setPermissions([]); // optionally clear or set user-specific permissions
  }
}, []);


  return (
    <div className="w-60 bg-gray-200 text-gray-900 p-4 h-[calc(100vh-10vh)] hide-scrollbar overflow-y-scroll">
      <nav className="flex flex-col space-y-2">
        {sidebarLinks.map((link, index) => {
          if (link.nested) {
            const isNestedActive = link.nested.some((nested) =>
              location.pathname.startsWith(nested.to)
            );
            const isOpen = openMenu === link.label || isNestedActive;
            const handleToggle = () => {
              setOpenMenu(openMenu === link.label ? null : link.label);
            };

            return (
              <div key={index}>
                <button
                  onClick={handleToggle}
                  className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-left transition-colors ${isNestedActive ? "text-indigo-700" : "text-gray-900 hover:text-indigo-700"
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  {isOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
                </button>

                {isOpen && (
                  <div className="pl-10 flex flex-col space-y-1 mt-1">
                    {link.nested.map((nestedLink, nestedIndex) => (
                      <NavLink
                        key={nestedIndex}
                        to={nestedLink.to}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 text-sm py-1 hover:text-indigo-700 ${isActive ? "text-indigo-700 font-semibold" : "text-gray-800"
                          }`
                        }
                        onClick={() => setOpenMenu(null)}
                      >
                        {nestedLink.icon && <span>{nestedLink.icon}</span>}
                        <span>{nestedLink.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={index}
              to={link.to}
              end={link.to === "/admin" || link.to === "/user"}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-indigo-700 text-white" : "text-gray-900 hover:text-indigo-700"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
// ************************************************************************************