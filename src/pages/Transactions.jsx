import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import transactions from '../API_data/transactions'; // Your original data import
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
        // padding: '5px 18px',
        width: '40px',
        cursor: 'pointer',
      }}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};

export default function Transactions() {
  const [editedRows, setEditedRows] = useState({}); // Store edited rows dynamically

  const columnDefs = [
    { headerName: 'Role', field: 'role', editable: true, sortable: true, filter: true },
    { headerName: 'Firm Name', field: 'firmName', editable: true, sortable: true, filter: true },
    { headerName: 'Transaction Description', field: 'transactionDescription', editable: true, sortable: true, filter: true },
    { headerName: 'CR/DR Amount', field: 'crDrAmount', editable: true, sortable: true, filter: true, valueFormatter: (params) => `${params.value.toFixed(2)}` },
    { headerName: 'Updated Balance', field: 'updatedBalance', editable: true, sortable: true, filter: true, valueFormatter: (params) => `${params.value.toFixed(2)}` },
    { headerName: 'Transaction Date', field: 'transactionDate', editable: true, sortable: true, filter: true },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ToggleButtonRenderer, // Use `cellRenderer` for custom renderer
      editable: true, // Editable column for the status
      sortable: false,
      filter: false,
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
  };

  // Event handler to capture cell value changes
  const onCellValueChanged = (event) => {
    const updatedData = event.data;
    const { transactionId } = updatedData;

    // Add or update the edited row in the state
    setEditedRows((prevEditedRows) => ({
      ...prevEditedRows,
      [transactionId]: updatedData,
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
      <div className='flex justify-between items-center  pb-5'>
      <h2 className="text-2xl font-semibold">Transactions</h2>
      <button
        onClick={showEditedRows}
        style={{ marginTop: '0px', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none' }}
      >
        Show Edited Rows
      </button>
      </div>
      <div className='w-[100%] h-[69vh]'>
        <AgGridReact
          rowData={transactions} // Ensure this contains all rows
          columnDefs={columnDefs} // Pass column definitions
          defaultColDef={defaultColDef} // Default column options like resizing, sorting
          pagination={true} // Enable pagination
          onCellValueChanged={onCellValueChanged} // Attach event handler for value changes
        />
      </div>
      
    </div>
  );
}



