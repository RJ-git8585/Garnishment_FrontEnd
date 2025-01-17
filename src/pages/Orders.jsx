import { useState, useRef, useEffect } from 'react';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import DeleteItemComponent from '../component/DeleteItemComponent';
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
import { FaPlus } from "react-icons/fa";
import { BASE_URL } from '../Config';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import '@mui/material/styles';

 // eslint-disable-next-line react/prop-types
function Orders({ onDeleteSuccess }) {
  const id = sessionStorage.getItem("id");
  const [data, setData] = useState([]);
  const Link1 = `${BASE_URL}/User/ExportEmployees/${id}/`;

  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/getemployeedetails/${id}/`);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

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
              <a href="/EmpImport" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><CgImport /> Import</a>
              <a type="button" href="/addemployee" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><FaPlus /> Add</a>
            </div>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                getRowId={(data) => data.employee_id}
                columns={[
                  { field: 'employee_id', headerName: 'Employee ID', width: 150 },
                  {
                    field: 'employee_name', headerName: 'Employee Name', width: 200,
                    renderCell: (params) => (
                      <Link
                        to={`/employee/${id}/${params.row.employee_id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {params.value}
                      </Link>
                    )
                  },
                  { field: 'department', headerName: 'Department', width: 150 },
                  { field: 'pay_cycle', headerName: 'Pay Cycle', width: 150 },
                  { field: 'location', headerName: 'Location', width: 150 },
                  { field: 'number_of_child_support_order', headerName: 'Child Support Orders', width: 200 },
                  {
                    field: 'Actions', headerName: 'Actions', width: 200,
                    renderCell: (params) => (
                      <div className="flex space-x-2">
                        <DeleteItemComponent
                          id={params.row.employee_id}
                          onDeleteSuccess={onDeleteSuccess}
                        />
                      </div>
                    )
                  },
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