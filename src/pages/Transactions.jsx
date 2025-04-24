import React from 'react';
import { AgGridReact } from 'ag-grid-react'; // Import AG Grid
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid styles

import transactions from '../API_data/transactions'; // Import your transaction data
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Transactions() {
  const columnDefs = [
    { headerName: 'Role', field: 'role', sortable: true, filter: true },
    { headerName: 'Firm Name', field: 'firmName', sortable: true, filter: true },
    { headerName: 'Transaction Description', field: 'transactionDescription', sortable: true, filter: true },
    { headerName: 'Transaction Date', field: 'transactionDate', sortable: true, filter: true, valueFormatter: (params) => `${params.value}` }, // Added transactionDate field
    { headerName: 'CR/DR Amount', field: 'crDrAmount', sortable: true, filter: true, valueFormatter: (params) => `${params.value.toFixed(2)}` },
    { headerName: 'Updated Balance', field: 'updatedBalance', sortable: true, filter: true, valueFormatter: (params) => `${params.value.toFixed(2)}` },
];

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Transactions</h2>
      <div className="" style={{ height: '72vh', width: '100%' }}>
        <AgGridReact
          rowData={transactions} // Pass your transaction data here
          columnDefs={columnDefs} // Pass column definitions
          defaultColDef={defaultColDef} // Default column options like resizing, sorting
          pagination={true} // Enable pagination
           // Number of rows per page
        />
      </div>
    </div>
  );
}
