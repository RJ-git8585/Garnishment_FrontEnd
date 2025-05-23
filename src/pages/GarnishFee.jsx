
/**
 * GarnishFee Component
 * 
 * This component displays a paginated table of garnishment fees rules fetched from an API.
 * It allows users to view, paginate, and edit garnishment rules.
 * 
 * @component
 * 
 * @returns {JSX.Element} The GarnishFee component.
 * 
 * @example
 * <GarnishFee />
 * 
 * @description
 * - Fetches garnishment fees rules from the API on mount.
 * - Displays a loading spinner while data is being fetched.
 * - Supports pagination for the table data.
 * - Allows editing of a specific garnishment rule via a modal dialog.
 * 
 * @state {Array} data - The list of garnishment rules fetched from the API.
 * @state {number} currentPage - The current page number for pagination.
 * @state {boolean} loading - Indicates whether data is being loaded.
 * @state {string|null} selectedRuleId - The ID of the currently selected rule for editing.
 * @state {boolean} editOpen - Indicates whether the edit modal is open.
 * 
 * @constant {number} rowsPerPage - The number of rows displayed per page in the table.
 * 
 * @function handlePageChange
 * @param {number} pageNumber - The page number to navigate to.
 * @description Updates the current page for pagination.
 * 
 * @function handleEditOpen
 * @param {string} rule - The ID of the rule to edit.
 * @description Opens the edit modal for the selected rule.
 * 
 * @function handleEditClose
 * @description Closes the edit modal and resets the selected rule ID.
 * 
 * @function fetchData
 * @description Fetches garnishment rules data from the API and updates the state.
 * 
 * @dependencies
 * - `useState` and `useEffect` from React for state management and side effects.
 * - `BASE_URL` from configuration for API endpoint.
 * - `AiOutlineLoading3Quarters` from `react-icons` for the loading spinner.
 * - `Button` from Material-UI for action buttons.
 * - `EditGarnishmentRule` component for editing rules.
 */
import { useState, useEffect } from "react";
import { BASE_URL } from "../configration/Config";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import loader icon
import Button from "@mui/material/Button"; // Import Button for rule actions
import EditGarnishmentRule from "./EditGarnishmentRule"; // Import EditGarnishmentRule component

function GarnishFee() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // State to track loading
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`${BASE_URL}/User/GarnishmentFeesStatesRules/`);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditOpen = (rule) => {
    setSelectedRuleId(rule);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedRuleId(null);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">Garnishment Fees</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left text-sm">ID</th>
              <th className="px-6 py-3 text-left text-sm">State</th>
              <th className="px-6 py-3 text-left text-sm">Pay Period</th>
              <th className="px-6 py-3 text-left text-sm">Rule</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-6">
                  <div className="flex justify-center items-center h-40">
                    <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" />
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-1 text-sm truncate capitalize">{row.id}</td>
                  <td className="px-6 py-1 text-sm truncate capitalize">{row.state}</td>
                  <td className="px-6 py-1 text-sm truncate">{row.pay_period}</td>
                  <td className="px-6 py-1 text-sm truncate">
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleEditOpen(row.rule)}
                      className="text-blue-500 hover:underline"
                    >
                      {row.rule}
                    </Button>
                  </td>
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

      {selectedRuleId && (
        <EditGarnishmentRule
          rule={selectedRuleId}
          open={editOpen}
          handleClose={handleEditClose}
        />
      )}
    </div>
  );
}

export default GarnishFee;