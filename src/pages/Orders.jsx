/**
 * Orders Component
 * 
 * This component displays a paginated table of order details fetched from an API.
 * It includes features for exporting and importing orders, as well as a loading spinner
 * while data is being fetched.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Orders component.
 * 
 * @example
 * // Usage
 * <Orders />
 * 
 * @state {Array} data - The array of order details fetched from the API.
 * @state {number} currentPage - The current page number for pagination.
 * @state {boolean} loading - Indicates whether the data is being loaded.
 * 
 * @constant {number} rowsPerPage - The number of rows displayed per page.
 * 
 * @function handlePageChange
 * @description Updates the current page number for pagination.
 * @param {number} pageNumber - The page number to navigate to.
 * 
 * @function fetchData
 * @description Fetches order details from the API and updates the `data` state.
 * 
 * @constant {number} totalPages - The total number of pages based on the data length and rows per page.
 * 
 * @returns {JSX.Element} A table displaying paginated order details, along with export/import buttons and pagination controls.
 */
import { useState, useEffect } from 'react';
import { BASE_URL } from '../configration/Config';
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import a new loader icon
import { API_URLS } from '../configration/apis';
import axios from 'axios';

function Orders() {
  const cid = sessionStorage.getItem("cid");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // State to track loading
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URLS.GET_ORDER_DETAILS);
        setData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cid]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">Orders</h4>
        <div className="flex space-x-2">
          <a
            href={API_URLS.EXPORT_ORDER}
            className="border inline-flex ml-2 items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
          >
            <TiExport className="mr-1" />Export
          </a>
          <a
            href="/OrdImport"
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
              <th className="px-6 py-3 text-left text-sm">FEIN</th>
              <th className="px-6 py-3 text-left text-sm">Case ID</th>
              <th className="px-6 py-3 text-left text-sm">State</th>
              <th className="px-6 py-3 text-left text-sm">Garnishment Type</th>
              <th className="px-6 py-3 text-left text-sm">SDU</th>
              <th className="px-6 py-3 text-left text-sm">Start Date</th>
              <th className="px-6 py-3 text-left text-sm">End Date</th>
              <th className="px-6 py-3 text-left text-sm">Amount</th>
              <th className="px-6 py-3 text-left text-sm">Arrears 12 Weeks</th>
              <th className="px-6 py-3 text-left text-sm">Arrear Amount</th>
              {/* <th className="px-6 py-3 text-left text-sm">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="py-6">
                  <div className="flex justify-center items-center h-40">
                    <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" />
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm truncate">{row.eeid}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.fein}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.case_id}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.work_state}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.type}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.sdu}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.start_date}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.end_date}</td>
                  <td className="px-6 py-3 text-sm truncate">{row.amount}</td>
                  <td className="px-6 py-3 text-sm truncate">
                    {row.arrear_greater_than_12_weeks ? "True" : "False"}
                  </td>
                  <td className="px-6 py-3 text-sm truncate">{row.arrear_amount}</td>
                  {/* <td className="px-6 py-3 text-sm">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => console.log(`Delete ${row.case_id}`)}
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

      {!loading && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, data.length)} to{" "}
            {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
          </p>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-2 py-1 border rounded text-sm ${
                  currentPage === index + 1 ? "bg-gray-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;