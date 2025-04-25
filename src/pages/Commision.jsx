// import { AllCommunityModule, iconSetQuartzLight, ModuleRegistry } from 'ag-grid-community';
// import React, { useState, useMemo } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { themeQuartz } from 'ag-grid-community';
// // import 'ag-grid-community/styles/ag-grid.css';
// // import 'ag-grid-community/styles/ag-theme-alpine.css';

// ModuleRegistry.registerModules([AllCommunityModule]);


// const myTheme = themeQuartz
// 	.withPart(iconSetQuartzLight)
// 	.withParams({
//         backgroundColor: "#B8BABA",
//         browserColorScheme: "light",
//         cellHorizontalPaddingScale: 0.2,
//         columnBorder: true,
//         fontFamily: "Arial",
//         fontSize: 12,
//         foregroundColor: "rgb(46, 55, 66)",
//         headerBackgroundColor: "#237DD7",
//         headerFontSize: 14,
//         headerFontWeight: 600,
//         headerTextColor: "#000000",
//         oddRowBackgroundColor: "#F9FAFB",
//         rowBorder: false,
//         rowVerticalPaddingScale: 0.8,
//         sidePanelBorder: false,
//         spacing: 8,
//         wrapperBorder: false,
//         wrapperBorderRadius: 0
//     });

// // Custom cell renderer for the status toggle button
// const ToggleButtonRenderer = (props) => {
//   const [isOn, setIsOn] = useState(props.value);

//   const toggleStatus = () => {
//     const newStatus = !isOn;
//     setIsOn(newStatus);
//     props.node.setDataValue('status', newStatus);
//   };

//   return (
//     <button
//       onClick={toggleStatus}
//       style={{
//         backgroundColor: isOn ? 'green' : 'red',
//         color: 'white',
//         border: 'none',
//         width: '40px',
//         cursor: 'pointer',
//       }}
//     >
//       {isOn ? 'ON' : 'OFF'}
//     </button>
//   );
// };

// const Commission = () => {
//   const [rowData, setRowData] = useState([
//     { operator: 'Airtel', md1_100: 0.25, md101_200: 0.25, md201_above: 0.25, dist1_100: 0.50, dist101_200: 0.50, dist201_above: 0.50, ret1_100: 2.00, ret101_200: 2.00, ret201_above: 2.00, api1_100: 0.00, api101_200: 0.00, api201_above: 0.00, wl1_100: 0.00, wl101_200: 0.00, wl201_above: 0.00, status: true },
//     { operator: 'Airtel Digital TV', md1_100: 0.25, md101_200: 0.25, md201_above: 0.25, dist1_100: 0.50, dist101_200: 0.50, dist201_above: 0.50, ret1_100: 2.00, ret101_200: 2.00, ret201_above: 2.00, api1_100: 0.00, api101_200: 0.00, api201_above: 0.00, wl1_100: 0.00, wl101_200: 0.00, wl201_above: 0.00, status: true },
//     { operator: 'Airtel', md1_100: 0.25, md101_200: 0.25, md201_above: 0.25, dist1_100: 0.50, dist101_200: 0.50, dist201_above: 0.50, ret1_100: 2.00, ret101_200: 2.00, ret201_above: 2.00, api1_100: 0.00, api101_200: 0.00, api201_above: 0.00, wl1_100: 0.00, wl101_200: 0.00, wl201_above: 0.00, status: true },
//     { operator: 'Airtel Digital TV', md1_100: 0.25, md101_200: 0.25, md201_above: 0.25, dist1_100: 0.50, dist101_200: 0.50, dist201_above: 0.50, ret1_100: 2.00, ret101_200: 2.00, ret201_above: 2.00, api1_100: 0.00, api101_200: 0.00, api201_above: 0.00, wl1_100: 0.00, wl101_200: 0.00, wl201_above: 0.00, status: true },
   
   
   
//     // Add more rows as needed
//   ]);

//   const [editedRows, setEditedRows] = useState({});

//   const columnDefs = [
//     { headerName: 'Operator Name', field: 'operator', editable: true, width: 180 },
//     {
//       headerName: 'Master Distributor (M/D) %',
//       children: [
//         { headerName: '1-100', field: 'md1_100', editable: true, width: 80 },
//         { headerName: '101-200', field: 'md101_200', editable: true, width: 80 },
//         { headerName: '201-ABOVE', field: 'md201_above', editable: true, width: 80 },
//       ],
//     },
//     {
//       headerName: 'Distributor %',
//       children: [
//         { headerName: '1-100', field: 'dist1_100', editable: true, width: 80 },
//         { headerName: '101-200', field: 'dist101_200', editable: true, width: 80 },
//         { headerName: '201-ABOVE', field: 'dist201_above', editable: true, width: 80 },
//       ],
//     },
//     {
//       headerName: 'Retailer %',
//       children: [
//         { headerName: '1-100', field: 'ret1_100', editable: true, width: 80 },
//         { headerName: '101-200', field: 'ret101_200', editable: true, width: 80 },
//         { headerName: '201-ABOVE', field: 'ret201_above', editable: true, width: 80 },
//       ],
//     },
//     {
//       headerName: 'API %',
//       children: [
//         { headerName: '1-100', field: 'api1_100', editable: true, width: 80 },
//         { headerName: '101-200', field: 'api101_200', editable: true, width: 80 },
//         { headerName: '201-ABOVE', field: 'api201_above', editable: true, width: 80 },
//       ],
//     },
//     {
//       headerName: 'WhiteLabel %',
//       children: [
//         { headerName: '1-100', field: 'wl1_100', editable: true, width: 80 },
//         { headerName: '101-200', field: 'wl101_200', editable: true, width: 80 },
//         { headerName: '201-ABOVE', field: 'wl201_above', editable: true, width: 80 },
//       ],
//     },
//     {
//       headerName: 'Status',
//       field: 'status',
//       cellRenderer: ToggleButtonRenderer, // Use custom cell renderer for toggle button
//       editable: true,
//       sortable: false,
//       filter: false,
//     },
//   ];

//   const defaultColDef = {
//     flex: 1,
//     minWidth: 150,
//     resizable: true,
//   };

//   const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);

//   const onCellValueChanged = (event) => {
//     const updatedData = event.data;
//     const { operator } = updatedData;

//     // Add or update the edited row in the state
//     setEditedRows((prevEditedRows) => ({
//       ...prevEditedRows,
//       [operator]: updatedData,
//     }));
//   };

//   const showEditedRows = () => {
//     if (Object.keys(editedRows).length > 0) {
//       alert('Edited Rows Data: ' + JSON.stringify(editedRows, null, 2));
//     } else {
//       alert('No rows have been edited.');
//     }
//   };

//   return (
//     <div className="ag-theme-alpine w-full h-full p-4" style={{ border: "1px solid #ccc" }}>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-semibold">Operator Commission Table</h1>
//         <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={showEditedRows}>
//           Save
//         </button>
//       </div>
//       <div style={gridStyle} className="ag-theme-quartz">
//         <AgGridReact
//           columnDefs={columnDefs}
//           rowData={rowData}
//           domLayout="autoHeight"
//           pagination={true}
         
//           onCellValueChanged={onCellValueChanged}
//           defaultColDef={defaultColDef}
//           gridOptions={{
//             ...myTheme, // Apply the custom theme here
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Commission;





import React, { useState } from 'react';

// Custom toggle button component
const ToggleButton = ({ isOn, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`text-white border-none px-2 py-1 rounded cursor-pointer ${isOn ? 'bg-green-600' : 'bg-red-600'}`}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};

export default function CustomThemedGrid() {
  // Sample data
  const [data, setData] = useState([
    { id: 1, operator: 'Airtel', md1_100: 0.25, md101_200: 0.25, dist1_100: 0.50, ret1_100: 2.00, status: true },
    { id: 2, operator: 'Airtel Digital TV', md1_100: 0.25, md101_200: 0.25, dist1_100: 0.50, ret1_100: 2.00, status: false },
    { id: 3, operator: 'Jio', md1_100: 0.30, md101_200: 0.30, dist1_100: 0.60, ret1_100: 2.50, status: true },
    { id: 4, operator: 'Vodafone', md1_100: 0.20, md101_200: 0.20, dist1_100: 0.40, ret1_100: 1.80, status: true }
  ]);

  // Toggle status handler
  const handleToggleStatus = (id) => {
    setData(data.map(row => 
      row.id === id ? { ...row, status: !row.status } : row
    ));
  };

  // Grouped header structure
  const groupedHeaders = [
    { name: 'Operator Name', field: 'operator', width: 'w-40' },
    { 
      name: 'Master Distributor %', 
      children: [
        { name: '1-100', field: 'md1_100', width: 'w-24' },
        { name: '101-200', field: 'md101_200', width: 'w-24' }
      ]
    },
    { 
      name: 'Distributor %', 
      children: [
        { name: '1-100', field: 'dist1_100', width: 'w-24' }
      ]
    },
    { 
      name: 'Retailer %', 
      children: [
        { name: '1-100', field: 'ret1_100', width: 'w-24' }
      ]
    },
    { name: 'Status', field: 'status', width: 'w-24' }
  ];

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-xl font-bold mb-4">Operator Commission Table</h1>
      
      {/* Custom styled grid */}
      <div className="border border-gray-300 rounded overflow-auto" style={{ maxHeight: '400px' }}>
        <table className="w-full border-collapse">
          {/* Header groups */}
          <thead>
            <tr>
              {groupedHeaders.map((header, idx) => (
                <th 
                  key={idx}
                  colSpan={header.children ? header.children.length : 1}
                  className="bg-blue-500 text-black font-semibold text-sm p-2 border border-gray-300 text-center"
                  style={{ backgroundColor: '#237DD7' }}
                >
                  {header.name}
                </th>
              ))}
            </tr>
            <tr>
              {groupedHeaders.map((header, idx) => 
                header.children ? (
                  header.children.map((subHeader, subIdx) => (
                    <th 
                      key={`${idx}-${subIdx}`}
                      className="bg-blue-400 text-black font-semibold text-xs p-1 border border-gray-300 text-center"
                      style={{ backgroundColor: '#237DD7' }}
                    >
                      {subHeader.name}
                    </th>
                  ))
                ) : (
                  <th key={`${idx}-placeholder`} className="bg-blue-400" style={{ backgroundColor: '#237DD7' }}></th>
                )
              )}
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={row.id} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{ backgroundColor: rowIdx % 2 === 1 ? '#F9FAFB' : '#ffffff' }}>
                <td className="p-2 border-r border-gray-300 text-sm">{row.operator}</td>
                <td className="p-2 border-r border-gray-300 text-center text-sm">{row.md1_100}</td>
                <td className="p-2 border-r border-gray-300 text-center text-sm">{row.md101_200}</td>
                <td className="p-2 border-r border-gray-300 text-center text-sm">{row.dist1_100}</td>
                <td className="p-2 border-r border-gray-300 text-center text-sm">{row.ret1_100}</td>
                <td className="p-2 border-r border-gray-300 text-center">
                  <ToggleButton 
                    isOn={row.status} 
                    onToggle={() => handleToggleStatus(row.id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      
     
    </div>
  );
}
