/**
 * Ruleslist Component
 * 
 * This component displays a paginated list of state tax levy rules and allows users to edit rules or submit state tax rule edit requests.
 * 
 * @component
 * @returns {JSX.Element} The rendered Ruleslist component.
 * 
 * @example
 * <Ruleslist />
 * 
 * @description
 * - Fetches state tax levy rules data from the backend and displays it in a table.
 * - Supports pagination for navigating through the rules.
 * - Allows editing of individual rules via a popup.
 * - Provides a button to open a popup for submitting state tax rule edit requests.
 * 
 * @state {Array} data - The list of state tax levy rules fetched from the backend.
 * @state {boolean} loading - Indicates whether the data is being loaded.
 * @state {number} currentPage - The current page number for pagination.
 * @state {number} rowsPerPage - The number of rows displayed per page.
 * @state {Object|null} editData - The data of the rule being edited.
 * @state {boolean} isEditing - Indicates whether the edit popup is open.
 * @state {boolean} isStateTaxPopupOpen - Indicates whether the state tax popup is open.
 * 
 * @function handlePageChange
 * @param {number} pageNumber - The page number to navigate to.
 * @description Updates the current page for pagination.
 * 
 * @function handleEditClick
 * @param {Object} rule - The rule data to be edited.
 * @description Opens the edit popup with the selected rule's data.
 * 
 * @function handleEditSave
 * @param {Object} updatedData - The updated rule data to be saved.
 * @description Sends a PUT request to update the rule in the backend and updates the UI.
 * 
 * @function handleStateTaxSave
 * @param {Object} stateTaxData - The state tax data submitted via the popup.
 * @description Handles the submission of state tax data and closes the popup.
 * 
 * @function fetchData
 * @async
 * @description Fetches state tax levy rules data from the backend and sorts it alphabetically by state.
 * 
 * @constant {number} totalPages - The total number of pages for pagination.
 * @constant {Array} paginatedData - The subset of data to be displayed on the current page.
 */
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../configration/Config";
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import EditRulePopup from "../component/EditRulePopup";
import StateTaxRequestPopup from "../component/StateTaxRequestPopup";
import StateTaxExemptAmountPopup from "../component/StateTaxExemptAmountPopup";
import PaginationControls from "../component/PaginationControls";

const Ruleslist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    // Try to get saved rows per page from localStorage, default to 10
    try {
      const saved = localStorage.getItem('stateTaxRulesRowsPerPage');
      return saved ? parseInt(saved, 10) : 10;
    } catch (error) {
      console.error('Error reading rows per page from localStorage:', error);
      return 10;
    }
  });
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isStateTaxPopupOpen, setIsStateTaxPopupOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [isExemptPopupOpen, setIsExemptPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URLS.GET_STATE_TAX_RULES);
        const jsonData = await response.json();
        const sortedData = jsonData.data.sort((a, b) =>
          a.state.localeCompare(b.state)
        );
        setData(sortedData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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
      localStorage.setItem('stateTaxRulesRowsPerPage', newRowsPerPage);
    } catch (error) {
      console.error('Error saving rows per page to localStorage:', error);
    }
  };

  const handleEditClick = async (rule) => {
    setEditLoading(true);
    try {
      const response = await fetch(API_URLS.GET_STATE_TAX_RULE_BY_STATE.replace(':state', rule.state));
      if (response.ok) {
        const jsonData = await response.json(); 
        
        // Format the data to match the required structure
        const formattedData = {
          ...jsonData.data,
          state: jsonData.data.state,
          rule: jsonData.data.withholding_limit_rule || `${jsonData.data.withholding_limit}%`, // Use existing rule or create from withholding_limit
          deduction_basis: jsonData.data.deduction_basis,
          withholding_limit: jsonData.data.withholding_limit?.toString().replace('%', ''), // Remove % if present
        };

        setEditData(formattedData);
        setIsEditing(true);
      } else {
        throw new Error("Failed to fetch rule details.");
      }
    } catch (error) {
      console.error("Error fetching rule details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch rule details. Please try again later.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditSave = async (updatedData) => {
    try {
      const state = updatedData.state || editData.state;
      
      // Format the data for the API
      const apiData = {
        ...updatedData,
        withholding_limit_rule: updatedData.rule, // Save the rule text
        withholding_limit: updatedData.withholding_limit // Save the numeric value
      };

      const response = await fetch(API_URLS.UPDATE_STATE_TAX_RULE.replace(':state', state), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Rule Updated",
          text: "The rule has been successfully updated.",
        }).then(() => {
          window.location.reload();
        });

        setData((prevData) =>
          prevData.map((rule) =>
            rule.id === updatedData.id ? { ...rule, ...apiData } : rule
          )
        );
        setIsEditing(false);
      } else {
        throw new Error("Failed to update the rule.");
      }
    } catch (error) {
      console.error("Error updating rule:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the rule. Please try again later.",
      });
    }
  };

  const handleStateTaxSave = (stateTaxData) => {
    console.log("State Tax Data Submitted:", stateTaxData);
    setIsStateTaxPopupOpen(false);
    // Add logic to save state tax data to the backend
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">State Tax Levy Rules</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setIsStateTaxPopupOpen(true)}
        >
          Rule Change Request
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left text-sm">Sr</th>
              <th className="px-6 py-3 text-left text-sm">State</th>
              <th className="px-6 py-3 text-left text-sm">Deduction Basis</th>
              <th className="px-6 py-3 text-left text-sm">Withholding cap</th>
              <th className="px-6 py-3 text-left text-sm">Rule</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6">
                  <div className="flex justify-center items-center h-40">
                    <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((rule, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-right">
                    {page * rowsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm rulebtn_cls">
                    <button
                      onClick={() => handleEditClick(rule)}
                      className="text-500 hover:underline capitalize"
                    >
                      {rule.state}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm capitalize inline-cls">
                    {rule.deduction_basis || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-right">
                    {rule.withholding_limit ? `${rule.withholding_limit}%` : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm flex items-center justify-between border-0">
                    <span className="capitalize">{rule.withholding_limit_rule || "N/A"}</span>
                    <button
                      onClick={() => {
                        setSelectedState(rule.state);
                        setIsExemptPopupOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 ml-2"
                      title="View State Tax Levy Exempt Amount"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No rules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination section */}
      <PaginationControls
        count={data.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      {/* Edit Popup */}
      {isEditing && (
        <EditRulePopup
          open={isEditing}
          handleClose={() => setIsEditing(false)}
          ruleData={editData}
          handleSave={handleEditSave}
          loading={editLoading}
        />
      )}

      {/* State Tax Popup */}
      {isStateTaxPopupOpen && (
        <StateTaxRequestPopup
          open={isStateTaxPopupOpen}
          handleClose={() => setIsStateTaxPopupOpen(false)}
          handleSave={handleStateTaxSave}
        />
      )}

      {/* State Tax Levy Exempt Amount Popup */}
      {isExemptPopupOpen && (
        <StateTaxExemptAmountPopup
          open={isExemptPopupOpen}
          handleClose={() => setIsExemptPopupOpen(false)}
          state={selectedState}
        />
      )}
    </div>
  );
};

export default Ruleslist;
