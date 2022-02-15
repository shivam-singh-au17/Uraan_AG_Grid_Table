import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const AgGridTable = () => {
  const [tableData, setTableData] = useState(null);
  console.log("tableData:", tableData);

  const colData = [
    { headerName: "Athlete", field: "athlete", filter: "agTextColumnFilter" },
    { headerName: "Age", field: "age", filter: "agTextColumnFilter" },
    { headerName: "Country", field: "country", filter: "agTextColumnFilter" },
    { headerName: "Year", field: "year", filter: "agTextColumnFilter" },
    { headerName: "Date", field: "date", filter: "agTextColumnFilter" },
    { headerName: "Sport", field: "sport", filter: "agTextColumnFilter" },
    { headerName: "Gold", field: "gold", filter: "agTextColumnFilter" },
    { headerName: "Silver", field: "silver", filter: "agTextColumnFilter" },
    { headerName: "Bronze", field: "bronze", filter: "agTextColumnFilter" },
    { headerName: "Total", field: "total", filter: "agTextColumnFilter" },
  ];

  const datasource = {
    getRows(params) {
      console.log(JSON.stringify(params.request, null, 1));
      const { startRow, endRow, filterModel, sortModel } = params.request;
      let url = `http://localhost:5000/olympic?`;

      //  Sorting
      if (sortModel.length) {
        const { colId, sort } = sortModel[0];
        url += `_sort=${colId}&_order=${sort}&`;
      }

      // Filtering
      const filterKeys = Object.keys(filterModel);
      filterKeys.forEach((filter) => {
        url += `${filter}=${filterModel[filter].filter}&`;
      });

      // Pagination
      url += `_start=${startRow}&_end=${endRow}`;
      fetch(url)
        .then((httpResponse) => httpResponse.json())
        .then((response) => {
          params.successCallback(response, 499);
        })
        .catch((error) => {
          console.error(error);
          params.failCallback();
        });
    },
  };

  const onGridReady = (params) => {
    setTableData(params);
    // register datasource with the grid
    params.api.setServerSideDatasource(datasource);
  };

  return (
    <>
      <div className="ag-theme-alpine mt-4">
        <AgGridReact
          columnDefs={colData}
          pagination={true}
          paginationPageSize={8}
          domLayout="autoHeight"
          rowModelType="serverSide"
          onGridReady={onGridReady}
          defaultColDef={{
            filter: true,
            floatingFilter: true,
            sortable: true,
          }}
        />
      </div>
    </>
  );
};

export default AgGridTable;
