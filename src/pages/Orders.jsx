import { useState, useRef, useEffect } from 'react';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
// import DeleteItemComponent from '../component/DeleteItemComponent';
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
// import { FaPlus } from "react-icons/fa";
import { BASE_URL } from '../Config';
// import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import '@mui/material/styles';

 // eslint-disable-next-line react/prop-types
// function Orders({ onDeleteSuccess }) {
  function Orders() {
  const cid = sessionStorage.getItem("cid");
  const [data, setData] = useState([]);
  const Link1 = `${BASE_URL}/User/ExportEmployees/${cid}/`;

  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/GetOrderDetails/${cid}/`);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [cid]);

  return (
<div>
      <div className="min-h-full">
        <div className="container main ml-auto">
          <div className="sidebar hidden lg:block"><Sidebar /></div>
          <div className="content ml-auto flex flex-col">
            <Headertop />
            <hr />
            <div className="items-right text-right mt-4 mb-4 customexport">
              <a href={Link1} className="border inline-flex items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><TiExport /> Export</a>
              <a href="/OrdImport" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><CgImport /> Import</a>
              {/* <a type="button" href="/addemployee" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><FaPlus /> Add</a> */}
            </div>
            <h4 className="text-l text-black-800 mb-4">Orders</h4>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                getRowId={(row) => row.id}
                columns={[
                  { field: 'cid', headerName: 'CID', width: 150 },
                  {
                    field: 'eeid', headerName: 'Employee Id', width: 200},
                  //   renderCell: (params) => (
                  //     <Link
                  //       to={`/employee/${cid}/${params.row.employee_id}`}
                  //       className="text-blue-500 hover:underline"
                  //     >
                  //       {params.value}
                  //     </Link>
                  //   )
                  // },
                  { field: 'case_id', headerName: 'CaseID', width: 150 },
                  { field: 'state', headerName: 'State', width: 150 },
                  { field: 'type', headerName: 'GarrnishmentType', width: 150 },
                  { field: 'sdu', headerName: 'SDU', width: 150 },
                  { field: 'start_date', headerName: 'Start Date', width: 150 },
                  { field: 'end_date', headerName: 'End Date', width: 150 },
                  { field: 'amount', headerName: 'Amount', width: 200 },
                  { field: 'arrear_greater_than_12_weeks', headerName: 'Arrears Graeter', width: 200 },
                  { field: 'arrear_amount', headerName: 'Arrear Amount', width: 200 },
                  // {
                  //   field: 'Actions', headerName: 'Actions', width: 200,
                  //   renderCell: (params) => (
                  //     <div className="flex space-x-2">
                  //       <DeleteItemComponent
                  //         id={params.row.employee_id}
                  //         onDeleteSuccess={onDeleteSuccess}
                  //       />
                  //     </div>
                  //   )
                  // },
                ]}
                rows={data}
                pageSize={25} // Limit to 25 records per page
                rowsPerPageOptions={[25]} // Allow only 25 records per page
                pagination // Enable pagination
                paginationMode="client" // Explicitly set pagination mode to 'client'
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  
  );
}

export default Orders;