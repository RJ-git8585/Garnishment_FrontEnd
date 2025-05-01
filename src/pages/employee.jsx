import { useState, useEffect, useCallback } from "react";
import DeleteItemComponent from "../component/DeleteItemComponent";
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
import { BASE_URL } from "../Config";
import { Link } from "react-router-dom";

function Employee({ onDeleteSuccess }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10); // Fixed page size to 10
  const [totalRows, setTotalRows] = useState(0);
  const exportLink = `${BASE_URL}/User/ExportEmployees`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/User/EmployeeRules`);
      const jsonData = await response.json();

      if (jsonData.data) {
        setTotalRows(jsonData.data.length); // Set total rows based on all data
        const startIndex = page * pageSize;
        const paginatedData = jsonData.data.slice(startIndex, startIndex + pageSize); // Slice data for the current page
        setData(paginatedData);
      } else {
        setData([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(totalRows / pageSize)) {
      setPage(newPage);
    }
  };

  const columns = [
    {
      field: "ee_id",
      headerName: "Employee ID",
      renderCell: (row) => (
        <Link
          to={`/employee/edit/${row.case_id}/${row.ee_id}`}
          className="text-blue-500 hover:underline"
        >
          {row.ee_id}
        </Link>
      ),
    },
    { field: "social_security_number", headerName: "SSN" },
    { field: "age", headerName: "Age" },
    { field: "gender", headerName: "Gender" },
    { field: "home_state", headerName: "Home State" },
    { field: "work_state", headerName: "Work State" },
    { field: "pay_period", headerName: "Pay Period" },
    { field: "case_id", headerName: "Case Id" },
    { field: "is_blind", headerName: "Blind", renderCell: (row) => (row.is_blind ? "Yes" : "No") },
    { field: "marital_status", headerName: "Marital Status" },
    { field: "filing_status", headerName: "Filing Status" },
    { field: "spouse_age", headerName: "Spouse Age" },
    { field: "is_spouse_blind", headerName: "Spouse Blind", renderCell: (row) => (row.is_spouse_blind ? "Yes" : "No") },
    { field: "number_of_exemptions", headerName: "No. of Exemptions" },
    { field: "support_second_family", headerName: "Support 2nd Family", renderCell: (row) => (row.support_second_family ? "Yes" : "No") },
    { field: "number_of_student_default_loan", headerName: "No. of Default Loans" },
    { field: "garnishment_fees_status", headerName: "Garnishment Status", renderCell: (row) => (row.garnishment_fees_status ? "Active" : "Inactive") },
    { field: "garnishment_fees_suspended_till", headerName: "Garnishment Suspended Till" },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (row) => (
        <DeleteItemComponent
          id={row.ee_id} // Pass ee_id
          cid={row.case_id} // Pass case_id
          type="emp"
          onDeleteSuccess={onDeleteSuccess}
        />
      ),
    },
  ];

  const renderTableHeader = () => (
    <tr>
      {columns.map((col) => (
        <th key={col.field} className="px-4 py-2 bg-gray-800 text-white">
          {col.headerName}
        </th>
      ))}
    </tr>
  );

  const renderTableRows = () =>
    data.map((row, index) => (
      <tr key={index} className="border-b">
        {columns.map((col) => (
          <td key={col.field} className="px-4 py-2">
            {col.renderCell ? col.renderCell(row) : row[col.field] || "N/A"}
          </td>
        ))}
      </tr>
    ));

  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <>
      {/* Action Buttons */}
      <div className="text-right mt-4 mb-4">
        <a
          href={exportLink}
          className="border inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
        >
          <TiExport className="mr-1" /> Export
        </a>
        <a
          href="/EmpImport"
          className="border inline-flex ml-2 items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
        >
          <CgImport className="mr-1" /> Import
        </a>
      </div>

      {/* Table Section */}
      <h4 className="text-lg font-semibold text-black mb-4">Employees</h4>
      <div className="overflow-x-auto text-sm">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader">Loading...</div>
          </div>
        ) : data.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No records found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className={`px-4 py-2 border text-sm rounded-md ${
            page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className={`px-4 py-2 border text-sm rounded-md ${
            page + 1 >= totalPages ? "bg-gray-300 text-sm cursor-not-allowed" : "bg-white hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Employee;
