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
import Swal from "sweetalert2";
import EditRulePopup from "../component/EditRulePopup";
import StateTaxRequestPopup from "../component/StateTaxRequestPopup";

const Ruleslist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isStateTaxPopupOpen, setIsStateTaxPopupOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">State Tax Levy Rules</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setIsStateTaxPopupOpen(true)} // Open the state tax popup
        >
          Rules Change Request
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left text-sm">Sr</th>
              <th className="px-6 py-3 text-left text-sm">Rule ID</th>
              <th className="px-6 py-3 text-left text-sm">State</th>
              <th className="px-6 py-3 text-left text-sm">Deduction Basis</th>
              <th className="px-6 py-3 text-left text-sm">Withholding cap</th>
              <th className="px-6 py-3 text-left text-sm">Rule</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6">
                  <div className="flex justify-center items-center h-40">
                    <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((rule, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="px-6 py-3 text-sm">{rule.id}</td>
                  <td className="px-6 py-3 text-sm rulebtn_cls">
                    <button
                      onClick={() => handleEditClick(rule)}
                      className="text-500 hover:underline capitalize"
                    >
                      {rule.state}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm capitalize inline-cls">{rule.deduction_basis || "N/A"}</td>
                  <td className="px-6 py-3 text-sm">
                    {rule.withholding_limit ? `${rule.withholding_limit}%` : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm capitalize">{rule.withholding_limit_rule || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No rules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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

      {/* Edit Popup */}
      {isEditing && (
        <EditRulePopup
          open={isEditing}
          handleClose={() => setIsEditing(false)}
          ruleData={editData}
          handleSave={handleEditSave}
          loading={editLoading} // Pass loading state to the popup
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
    </div>
  );
};

export default Ruleslist;
