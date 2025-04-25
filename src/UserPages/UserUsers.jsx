import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import users from '../API_data/users.js'; // Replace with your user data
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

// Custom cell renderer for the status toggle button
const ToggleButtonRenderer = (props) => {
  const [isOn, setIsOn] = useState(props.value);

  const toggleStatus = () => {
    const newStatus = !isOn;
    setIsOn(newStatus);
    props.node.setDataValue('status', newStatus);
  };

  return (
    <button
      onClick={toggleStatus}
      style={{
        backgroundColor: isOn ? 'green' : 'red',
        color: 'white',
        border: 'none',
        width: '40px',
        cursor: 'pointer',
      }}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};

export default function UserUsers() {
  const [editedRows, setEditedRows] = useState({}); // Store edited rows dynamically
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin

  useEffect(() => {
    // Check if the user is an admin from localStorage
    const userType = localStorage.getItem('userType'); // Assuming userType is stored in localStorage
    setIsAdmin(userType === 'admin');
  }, []);

  const columnDefs = [
    { headerName: 'SR_No', field: 'srNo', editable: false, sortable: true, filter: true, width: 50 },
    { headerName: 'User Type', field: 'userType', editable: true, sortable: true, filter: true, width: 80 },
    { headerName: 'Distributor ID', field: 'distributorId', editable: true, sortable: true, filter: true, width: 100 },
    { headerName: 'User Info', field: 'userInfo', editable: true, sortable: true, filter: true, width: 100 },
    { 
      headerName: 'Login Status', 
      field: 'loginStatus', 
      editable: false, 
      sortable: true, 
      filter: true, 
      cellRenderer: ToggleButtonRenderer, 
      width: 50 
    },
    { headerName: 'User Mobile No', field: 'userMobile', editable: true, sortable: true, filter: true, width: 200 },
    { headerName: 'Shop Name', field: 'shopName', editable: true, sortable: true, filter: true, width: 100 },
    
    // Nested Verification Status Column
    {
      headerName: 'Verification Status',
      children: [
        {
              headerName: 'Status', 
              field: 'aadharStatus', 
              editable: false, 
              sortable: true, 
              filter: true, 
              cellRenderer: ToggleButtonRenderer, 
              width: 50 
            },
           
        {
              headerName: 'Status', 
              field: 'panStatus', 
              editable: false, 
              sortable: true, 
              filter: true, 
              cellRenderer: ToggleButtonRenderer, 
              width: 20 
            },
            
        {
              headerName: 'Status', 
              field: 'emailStatus', 
              editable: false, 
              sortable: true, 
              filter: true, 
              cellRenderer: ToggleButtonRenderer, 
              width: 50 
            },
      ]
    },
    { 
      headerName: 'Wallet', 
      field: 'walletBalance', 
      editable: true, 
      sortable: true, 
      filter: true, 
      valueFormatter: (params) => `${params.value.toFixed(2)}`,
      width: 30
    },
    
    // Nested Permissions Columns
    {
      headerName: 'Permission Settings',
      children: [
        { 
          headerName: 'Finance', 
          field: 'permissions.finance', 
          editable: isAdmin, // Only editable if admin
          cellRenderer: ToggleButtonRenderer, 
          sortable: true, 
          filter: true,
          width: 20
        },
        { 
          headerName: 'Travel', 
          field: 'permissions.travel', 
          editable: isAdmin, // Only editable if admin
          cellRenderer: ToggleButtonRenderer, 
          sortable: true, 
          filter: true,
          width: 20 
        },
        { 
          headerName: 'Other', 
          field: 'permissions.other', 
          editable: isAdmin, // Only editable if admin
          cellRenderer: ToggleButtonRenderer, 
          sortable: true, 
          filter: true,
          width: 20 
        },
      ]
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth:5,
    resizable: true,
    border: '2px solid black',  // Add column border
  };

  // Event handler to capture cell value changes
  const onCellValueChanged = (event) => {
    const updatedData = event.data;
    const { srNo } = updatedData;

    // Add or update the edited row in the state
    setEditedRows((prevEditedRows) => ({
      ...prevEditedRows,
      [srNo]: updatedData,
    }));
  };

  // Event handler to display all edited rows in the console when the button is clicked
  const showEditedRows = () => {
    if (Object.keys(editedRows).length > 0) {
      alert('Edited Rows Data: ' + JSON.stringify(editedRows, null, 2));
    } else {
      console.log('No rows have been edited.');
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center pb-5'>
        <h2 className="text-2xl font-semibold">Users Information</h2>
        <button
          onClick={showEditedRows}
          style={{ marginTop: '0px', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none' }}
        >
          Show Edited Rows
        </button>
      </div>
      <div className='w-[100%] h-[69vh]'>
        <AgGridReact
          rowData={users} // Ensure this contains the user data
          columnDefs={columnDefs} // Pass column definitions
          defaultColDef={defaultColDef} // Default column options like resizing, sorting
          pagination={true} // Enable pagination
          onCellValueChanged={onCellValueChanged} // Attach event handler for value changes
          domLayout='autoHeight' // Adjust grid height dynamically based on content
        />
      </div>
    </div>
  );
}
