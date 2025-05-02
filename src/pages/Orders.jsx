import { useState, useRef, useEffect } from 'react';
import { BASE_URL } from '../Config';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'; // Import TextField for search functionality
import { RiDeleteBin6Line } from "react-icons/ri";

function Orders({ onDeleteSuccess }) {
  const cid = sessionStorage.getItem("cid");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [pageSize, setPageSize] = useState(10); // State for page size
  const Link1 = `${BASE_URL}/User/ExportOrder/`;

  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/GetOrderDetails/`);
        const jsonData = await response.json();
        setData(jsonData.data);
        setFilteredData(jsonData.data); // Initialize filtered data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [cid]);

  // Handle search query change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      )
    );
  };

  return (
    <div>
      <div className="items-right text-right mt-4 mb-4 customexport">
        <a href={Link1} className="border inline-flex items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Export
        </a>
        <a href="/OrdImport" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Import
        </a>
      </div>

      <h4 className="text-l text-black-800 mb-4">Orders</h4>

      {/* Search bar for filtering */}
      {/* <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      /> */}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.id || row.case_id}
          columns={[
            { field: 'eeid', headerName: 'Employee Id', width: 120 },
            { field: 'fein', headerName: 'FEIN', width: 120 },
            { field: 'case_id', headerName: 'CaseID', width: 120 },
            { field: 'work_state', headerName: 'State', width: 140 },
            { field: 'type', headerName: 'Garnishment Type', width: 150 },
            { field: 'sdu', headerName: 'SDU', width: 150 },
            { field: 'start_date', headerName: 'Start Date', width: 150 },
            { field: 'end_date', headerName: 'End Date', width: 150 },
            { field: 'amount', headerName: 'Amount', width: 100 },
            { field: 'arrear_greater_than_12_weeks', headerName: 'Arrears Greater Than 12 Weeks', width: 200 },
            { field: 'arrear_amount', headerName: 'Arrear Amount', width: 100 },
            {
              field: 'Actions', headerName: 'Actions', width: 100,
              renderCell: (params) => (
                <div className="flex p-6 space-x-2">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => console.log(`Delete ${params.row.case_id}`)}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              )
            },
          ]}
          rows={filteredData} // Use filtered data for rows
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // Update page size dynamically
          rowsPerPageOptions={[10, 25, 50]} // Allow options for 10, 25, and 50 rows per page
          pagination // Enable pagination
          paginationMode="client" // Explicitly set pagination mode to 'client'
          autoHeight // Automatically adjust height for better display
          disableSelectionOnClick // Disable row selection on click
        />
      </Box>
    </div>
  );
}

export default Orders;