
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
import PaginationControls from '../component/PaginationControls'; // Import PaginationControls component

function GarnishFee() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true); // State to track loading
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    // Try to get saved rows per page from localStorage, default to 10
    try {
      const saved = localStorage.getItem('garnishFeeRowsPerPage');
      return saved ? parseInt(saved, 10) : 10;
    } catch (error) {
      console.error('Error reading rows per page from localStorage:', error);
      return 10;
    }
  });

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    // Save to localStorage for persistence
    try {
      localStorage.setItem('garnishFeeRowsPerPage', newRowsPerPage);
    } catch (error) {
      console.error('Error saving rows per page to localStorage:', error);
    }
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
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

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
              {/* <th className="px-6 py-3 text-left text-sm">Pay Period</th> */}
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
                  {/* <td className="px-6 py-1 text-sm truncate">{row.pay_period}</td>s */}
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