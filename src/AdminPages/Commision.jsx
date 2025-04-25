import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const myTheme = themeQuartz.withParams({
  browserColorScheme: "light",
  columnBorder: true,
  headerFontSize: 14,
});

const CommissionComponent = () => {
  const columnDefs = useMemo(() => [
    { headerName: "Service", field: "serviceType" },
    { headerName: "Type", field: "commissionType" },
    { headerName: "Slab From", field: "slabFrom" },
    { headerName: "Slab To", field: "slabTo" },
    { headerName: "Commission", field: "commission" },
  ], []);

  const rowData = useMemo(() => [
    { serviceType: "Prepaid", commissionType: "Flat", slabFrom: 0, slabTo: 100, commission: "2%" },
    { serviceType: "Prepaid", commissionType: "Flat", slabFrom: 101, slabTo: 500, commission: "1.5%" },
    { serviceType: "Utility", commissionType: "Slab", slabFrom: 0, slabTo: 1000, commission: "1%" },
  ], []);

  return (
    <div className="ag-theme-quartz" style={{ height: "500px", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        gridOptions={myTheme.config}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          
          editable: true,
          cellStyle: { borderRight: "1px solid #e0e0e0" },
        }}
      />
    </div>
  );
};

export default CommissionComponent;
