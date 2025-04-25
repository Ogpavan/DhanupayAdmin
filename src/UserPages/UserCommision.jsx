// import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// ModuleRegistry.registerModules([AllCommunityModule]);

// import React, { useState, useMemo } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { themeQuartz } from 'ag-grid-community'; // Import themeQuartz
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

// const UserCommission = () => {
//   const columnDefs = [
//     { headerName: 'Operator Name', field: 'operator', editable: true, width: 180 },
//     {
//       headerName: 'Master Distributor (M/D) %',
//       children: [
//         { headerName: '1-100', field: 'md1_100', editable: true, width: 120 },
//         { headerName: '101-200', field: 'md101_200', editable: true, width: 120 },
//         { headerName: '201-ABOVE', field: 'md201_above', editable: true, width: 120 },
//       ],
//     },
//     {
//       headerName: 'Distributor %',
//       children: [
//         { headerName: '1-100', field: 'dist1_100', editable: true, width: 120 },
//         { headerName: '101-200', field: 'dist101_200', editable: true, width: 120 },
//         { headerName: '201-ABOVE', field: 'dist201_above', editable: true, width: 120 },
//       ],
//     },
//     {
//       headerName: 'Retailer %',
//       children: [
//         { headerName: '1-100', field: 'ret1_100', editable: true, width: 120 },
//         { headerName: '101-200', field: 'ret101_200', editable: true, width: 120 },
//         { headerName: '201-ABOVE', field: 'ret201_above', editable: true, width: 120 },
//       ],
//     },
//     {
//       headerName: 'API %',
//       children: [
//         { headerName: '1-100', field: 'api1_100', editable: true, width: 120 },
//         { headerName: '101-200', field: 'api101_200', editable: true, width: 120 },
//         { headerName: '201-ABOVE', field: 'api201_above', editable: true, width: 120 },
//       ],
//     },
//     {
//       headerName: 'WhiteLabel %',
//       children: [
//         { headerName: '1-100', field: 'wl1_100', editable: true, width: 120 },
//         { headerName: '101-200', field: 'wl101_200', editable: true, width: 120 },
//         { headerName: '201-ABOVE', field: 'wl201_above', editable: true, width: 120 },
//       ],
//     },
//   ];

//   const [rowData, setRowData] = useState([
//     { operator: 'Airtel', md1_100: 0.25, md101_200: 0.25, md201_above: 0.25, dist1_100: 0.50, dist101_200: 0.50, dist201_above: 0.50, ret1_100: 2.00, ret101_200: 2.00, ret201_above: 2.00, api1_100: 0.00, api101_200: 0.00, api201_above: 0.00, wl1_100: 0.00, wl101_200: 0.00, wl201_above: 0.00 },
//     { operator: 'Airtel Digital TV', md1_100: 0.25, md101_200: 0.25, md201_above: 0.25, dist1_100: 0.50, dist101_200: 0.50, dist201_above: 0.50, ret1_100: 2.00, ret101_200: 2.00, ret201_above: 2.00, api1_100: 0.00, api101_200: 0.00, api201_above: 0.00, wl1_100: 0.00, wl101_200: 0.00, wl201_above: 0.00 },
//     { operator: 'Big TV', md1_100: 0.25, md101_200: 0.25, md201_above: 0.25, dist1_100: 0.50, dist101_200: 0.50, dist201_above: 0.50, ret1_100: 2.00, ret101_200: 2.00, ret201_above: 2.00, api1_100: 0.00, api101_200: 0.00, api201_above: 0.00, wl1_100: 0.00, wl101_200: 0.00, wl201_above: 0.00 },
//     // Add more rows as needed
//   ]);

//   // Customizing theme with borders using themeQuartz
//   const myTheme = themeQuartz.withParams({
//     borderColor: "#9696C8", 
//     wrapperBorder: false, // Disable wrapper border
//     headerRowBorder: false, // Disable header row border
//     rowBorder: { style: "dotted", width: 3, color: "#9696C8" }, // Dotted row borders
//     columnBorder: { style: "dashed",width: 3,  color: "#9696C8" }, // Dashed column borders
//   });

//   // Inline style for grid container
//   const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);

//   return (
//     <div className="ag-theme-alpine w-full h-full p-4" style={{ border: "1px solid #ccc" }}>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-semibold">Operator Commission Table</h1>
//         <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
//       </div>
//       <div style={gridStyle} className="ag-theme-quartz">
//         <AgGridReact
//           columnDefs={columnDefs}
//           rowData={rowData}
//           domLayout="autoHeight"
//           pagination={true}
//           editType="fullRow"
//           gridOptions={{
//             getRowStyle: () => ({
//               ...myTheme.rowBorder, // Apply row border inline
//             }),
//             getColStyle: () => ({
//               ...myTheme.columnBorder, // Apply column border inline
//             }),
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default UserCommission;
import React from 'react'

function UserCommision() {
  return (
    <div>
      
    </div>
  )
}

export default UserCommision
