/**
 * Employee Component
 *
 * This component displays a paginated table of employee data fetched from an API.
 * It includes features for exporting and importing employee data, as well as navigation
 * to edit employee details. The table supports pagination and displays a loading spinner
 * while data is being fetched.
 *
 * @component
 * @returns {JSX.Element} The rendered Employee component.
 *
 * @example
 * // Usage
 * import Employee from './Employee';
 * 
 * function App() {
 *   return <Employee />;
 * }
 *
 * @state {Array} data - The array of employee data fetched from the API.
 * @state {number} currentPage - The current page number for pagination.
 * @state {boolean} loading - Indicates whether the data is being loaded.
 *
 * @constant {number} rowsPerPage - The number of rows displayed per page.
 *
 * @function handlePageChange - Updates the current page number for pagination.
 * @param {number} pageNumber - The page number to navigate to.
 *
 * @function fetchData - Fetches employee data from the API and updates the state.
 *
 * @function paginatedData - Slices the employee data array to display only the rows
 *                            {page * rowsPerPage + index + 1} totalPages - The total number of pages based on the data length
 *                                 and rows per page.
 *
 * @returns {JSX.Element} A table displaying employee data with pagination controls,
 *                        export/import buttons, and a loading spinner.
 */
import React from 'react';
import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";
import { API_URLS } from '../configration/apis';
import axios from 'axios';
import PaginationControls from '../component/PaginationControls';

function Employee() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    // Try to get saved rows per page from localStorage, default to 10
    try {
      const saved = localStorage.getItem('employeeRowsPerPage');
      return saved ? parseInt(saved, 10) : 10;
    } catch (error) {
      console.error('Error reading rows per page from localStorage:', error);
      return 10;
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URLS.GET_EMPLOYEES);
        console.log('Fetched Data:', response.data);
        setData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(API_URLS.DELETE_EMPLOYEE(employeeId));
      // Refresh the data after deletion
      const response = await axios.get(API_URLS.GET_EMPLOYEES);
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    // Save to localStorage for persistence
    try {
      localStorage.setItem('employeeRowsPerPage', newRowsPerPage);
    } catch (error) {
      console.error('Error saving rows per page to localStorage:', error);
    }
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">Employees</h4>
        <div className="flex space-x-2">
          <a
            href={API_URLS.EXPORT_EMPLOYEE}
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
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left text-sm">Employee ID</th>
              <th className="px-6 py-3 text-left text-sm text-right">SSN</th>
              <th className="px-6 py-3 text-left text-sm text-right">Age</th>
              <th className="px-6 py-3 text-left text-sm">Gender</th>
              <th className="px-6 py-3 text-left text-sm">Home State</th>
              <th className="px-6 py-3 text-left text-sm">Work State</th>
              <th className="px-6 py-3 text-left text-sm">Pay Period</th>
              <th className="px-6 py-3 text-left text-sm text-right">Case ID</th>
              <th className="px-6 py-3 text-left text-sm">Blind</th>
              <th className="px-6 py-3 text-left text-sm">Marital Status</th>
              <th className="px-6 py-3 text-left text-sm">Filing Status</th>
              <th className="px-6 py-3 text-left text-sm text-right">Spouse Age</th>
              <th className="px-6 py-3 text-left text-sm">Spouse Blind</th>
              <th className="px-6 py-3 text-left text-sm text-right">No. of Exemptions</th>
              <th className="px-6 py-3 text-left text-sm">Support 2nd Family</th>
              <th className="px-6 py-3 text-left text-sm text-right">No. of Default Loans</th>
              <th className="px-6 py-3 text-left text-sm">Garnishment Status</th>
              <th className="px-6 py-3 text-left text-sm">Garnishment Suspended Till</th>
              {/* <th className="px-6 py-3 text-left text-sm">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="19" className="py-6">
                  <div className="flex justify-left items-left h-40">
                    <AiOutlineLoading3Quarters
                      className="animate-spin text-gray-500 text-4xl"
                      data-testid="loading-spinner"
                    />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="19" className="py-6 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm truncate rulebtn_cls">
                    <Link
                      to={`/employee/edit/${row.case_id}/${row.ee_id}`}
                      className="text-sky-800 hover:underline"
                    >
                      {row.ee_id}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm truncate text-right">{row.social_security_number}</td>
                  <td className="px-6 py-3 text-sm truncate text-right">{row.age}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.gender}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.home_state}</td>
                  <td className="px-6 py-3 text-sm truncate capitalize">{row.work_state}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.pay_period}</td>
                  <td className="px-6 py-3 text-sm truncate text-right">{row.case_id}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.is_blind ? "True" : "False"}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.marital_status}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.filing_status}</td>
                  <td className="px-6 py-3 text-sm truncate text-right">{row.spouse_age}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.is_spouse_blind ? "Yes" : "No"}</td>
                  <td className="px-6 py-3 text-sm truncate text-right">{row.number_of_exemptions}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.support_second_family ? "Yes" : "No"}</td>
                  <td className="px-6 py-3 text-sm truncate text-right">{row.number_of_student_default_loan}</td>
                  <td className="px-6 py-3 text-sm truncate">
                    {row.garnishment_fees_status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-3 text-sm truncate">{row.garnishment_fees_suspended_till}</td>
                  {/* <td className="px-6 py-3 text-sm">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(row.ee_id)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && data.length > 0 && (
        <PaginationControls
          count={data.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      )}
    </div>
  );
}

export default Employee;
