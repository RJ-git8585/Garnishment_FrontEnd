import { useState, useEffect, useCallback } from "react";
import Headertop from "../component/Headertop";
import Sidebar from "../component/sidebar";
import DeleteItemComponent from "../component/DeleteItemComponent";
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
import { BASE_URL } from "../Config";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { API_URLS } from "../constants/apis";
import { useSpring, animated } from '@react-spring/web';
import CircularProgress from '@mui/material/CircularProgress';

function Employee({ onDeleteSuccess }) {
  const cid = sessionStorage.getItem("cid");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [employeeRules, setEmployeeRules] = useState({});
  const exportLink = (API_URLS.EXPORT_EMPLOYEES + `?cid=${cid}`);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/User/EmployeeRules/?page=${page + 1}&limit=${pageSize}`);
      const jsonData = await response.json();
      
      setData(jsonData.data || []);
      setTotalRows(jsonData.total || 0);

      // Map ee_id to case_id
      const caseIdMap = {};
      jsonData.data.forEach(rule => {
        caseIdMap[rule.ee_id] = rule.case_id; // Ensure API response has these fields
      });
      setEmployeeRules(caseIdMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    
    fetchData();
  }, [fetchData]);

  const columns = [
    // { field: "cid", headerName: "Company ID", width: 120 }, a
     { 
      field: "ee_id", 
      headerName: "Employee ID", 
      width: 150,
      renderCell: (params) => {
        const caseId = employeeRules[params.value] || "default_case_id"; 
        console.log(caseId)
        // alert(caseId)// Fallback if missing
        return (
          <Link to={`/employee/edit/${caseId}/${params.value}`} className="text-blue-500 hover:underline">
            {params.value}
          </Link>
        );
      }
    },
    { field: "social_security_number", headerName: "SSN", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "home_state", headerName: "Home State", width: 120 },
    { field: "work_state", headerName: "Work State", width: 120 },
    { field: "pay_period", headerName: "Pay Period", width: 150 },
    { 
      field: "is_blind", 
      headerName: "Blind", 
      width: 120, 
      renderCell: (params) => (params.value ? "Yes" : "No")
    },
    { field: "marital_status", headerName: "Marital Status", width: 150 },
    { field: "filing_status", headerName: "Filing Status", width: 150 },
    { field: "spouse_age", headerName: "Spouse Age", width: 120 },
    { 
      field: "is_spouse_blind", 
      headerName: "Spouse Blind", 
      width: 150, 
      renderCell: (params) => (params.value ? "Yes" : "No")
    },
    { field: "number_of_exemptions", headerName: "No. of Exemptions", width: 180 },
    { 
      field: "support_second_family", 
      headerName: "Support 2nd Family", 
      width: 180, 
      renderCell: (params) => (params.value ? "Yes" : "No")
    },
    { field: "number_of_student_default_loan", headerName: "No. of Default Loans", width: 200 },
    { 
      field: "garnishment_fees_status", 
      headerName: "Garnishment Status", 
      width: 180, 
      renderCell: (params) => (params.value ? "Active" : "Inactive")
    },
    { field: "garnishment_fees_suspended_till", headerName: "Garnishment Suspended Till", width: 250 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "rules", headerName: "Rule", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <DeleteItemComponent id={params.row.ee_id} cid={params.row.cid} type="emp" onDeleteSuccess={onDeleteSuccess} />
      ),
    },
  ];

  const contentAnimation = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? 'translateY(10px)' : 'translateY(0)',
    config: { duration: 500 },
  });

  return (
    <div className="min-h-full">
        <div className="container main ml-auto">
        <div className="sidebar hidden lg:block ">
          <Sidebar />
        </div>

        <div className="content ml-auto flex flex-col">
          <Headertop />
          <hr />

          {/* Action Buttons */}
          <div className="text-right mt-4 mb-4">
            <a href={exportLink} className="border inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              <TiExport className="mr-1" /> Export
            </a>
            <a href="/EmpImport" className="border inline-flex ml-2 items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              <CgImport className="mr-1" /> Import
            </a>
          </div>

          {/* Table Section */}
          <h4 className="text-lg font-semibold text-black mb-4">Employees</h4>
          <Box sx={{ flexGrow: 1, width: "100%", overflow: "auto" }}>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <CircularProgress />
              </div>
            ) : (
              <animated.div style={contentAnimation}>
                <DataGrid
                  getRowId={(row) => row.ee_id}
                  columns={columns}
                  rows={data}
                  rowCount={totalRows} // Ensure correct pagination count
                  pagination
                  pageSizeOptions={[10, 25, 50, 100]}
                  pageSize={pageSize}
                  paginationMode="server"
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newSize) => setPageSize(newSize)}
                  loading={loading}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "black", // Entire header row background
                      color: "white", // All headers text color
                    },
                    "& .MuiDataGrid-columnHeader[data-field='actions']": {
                      backgroundColor: "#313131", // "Actions" column header only
                      color: "white", // "Actions" text white
                    },
                  }}
                />
              </animated.div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Employee;
