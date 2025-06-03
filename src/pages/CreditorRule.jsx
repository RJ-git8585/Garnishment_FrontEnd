/**
 * CreditorRule Component
 * 
 * This component displays a paginated list of creditor debt rules.
 * 
 * @component
 * @returns {JSX.Element} The rendered CreditorRule component.
 */
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../configration/Config";
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Swal from "sweetalert2";
import { Typography } from "@mui/material";
import CreditorRulePopup from "../component/CreditorRulePopup";

const CreditorRule = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreditorRulePopupOpen, setIsCreditorRulePopupOpen] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URLS.GET_CREDITOR_RULES);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        const sortedData = jsonData.data.sort((a, b) =>
          a.state.localeCompare(b.state)
        );
        setData(sortedData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch creditor debt rules'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = async (rule) => {
    try {
      // Fetch fresh data for the rule before showing the popup
      const response = await fetch(API_URLS.GET_CREDITOR_RULES);
      if (!response.ok) {
        throw new Error('Failed to fetch updated rule data');
      }
      const result = await response.json();
      const updatedRule = result.data.find(r => r.state === rule.state);
      
      if (!updatedRule) {
        throw new Error('Rule not found');
      }

      // Extract the numeric value from the rule
      const numericValue = updatedRule.withholding_limit;

      Swal.fire({
        title: 'Edit Rule Details',
        html: `
          <div class="space-y-4 text-left">
            <div>
              <label class="block text-sm font-medium text-gray-700">State</label>
              <input id="state" class="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-50" value="${updatedRule.state}" readonly />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Rule</label>
              <input id="rule" class="mt-1 block w-full border rounded-md shadow-sm p-2" value="${updatedRule.rule || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Deduction Basis</label>
              <input id="deduction_basis" class="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-50" value="${updatedRule.deduction_basis}" readonly/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Withholding cap</label>
              <input 
                id="withholding_limit" 
                class="mt-1 block w-full border rounded-md shadow-sm p-2" 
                value="${numericValue}"
                type="number"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        didOpen: () => {
          // Ensure all input values are set correctly after modal opens
          const withholdingInput = document.getElementById('withholding_limit');
          const ruleInput = document.getElementById('rule');
          
          // Set initial values
          document.getElementById('state').value = updatedRule.state;
          document.getElementById('deduction_basis').value = updatedRule.deduction_basis;
          withholdingInput.value = numericValue;
          ruleInput.value = updatedRule.rule || '';
        },
        preConfirm: () => {
          const withholdingLimit = document.getElementById('withholding_limit').value;
          const ruleValue = document.getElementById('rule').value;
          
          if (!ruleValue.trim()) {
            Swal.showValidationMessage('Rule field cannot be empty');
            return false;
          }

          const updatedRuleData = {
            ...updatedRule,
            withholding_limit: withholdingLimit,
            rule: ruleValue
          };

          return fetch(API_URLS.UPDATE_CREDITOR_RULE.replace(':state', updatedRule.state), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRuleData)
          })
          .then(response => {
            if (!response.ok) throw new Error('Failed to update rule');
            return response.json();
          })
          .catch(error => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Updated Successfully',
            text: 'The rule details have been successfully updated.',
            allowOutsideClick: false,
          }).then(() => {
            // Refresh the data
            window.location.reload();
          });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load rule data',
        allowOutsideClick: false,
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleCreditorRuleSave = (creditorRuleData) => {
    console.log("Creditor Rule Data Submitted:", creditorRuleData);
    setIsCreditorRulePopupOpen(false);
    // Add logic to save creditor rule data to the backend
    Swal.fire({
      icon: 'success',
      title: 'Request Submitted',
      text: 'Your creditor rule edit request has been submitted successfully.',
    });
  };

  // Helper function to check if withholding_limit has multiple values
  const hasMultipleValues = (value) => {
    if (!value) return false;
    return /[,\/-]/.test(value.toString());
  };

  const formatWithholdingValue = (value) => {
    // Return empty string or original value if null/undefined/empty
    if (!value && value !== 0) return '';
    if (value === '') return '';
    
    // Check for multiple values
    if (hasMultipleValues(value)) {
      return value; // Return as is for multiple values
    }
    
    return `${value}%`; // Add % for single values
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">  
        <h1 className="text-2xl font-bold">Creditor Debt Rules</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setIsCreditorRulePopupOpen(true)}
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
              <th className="px-6 py-3 text-left text-sm">Rule</th>
              <th className="px-6 py-3 text-left text-sm">Deduction Basis</th>
              <th className="px-6 py-3 text-left text-sm">Withholding cap</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6">
                  <div className="flex justify-center h-40">
                    <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((rule, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm capitalize">
                    <button
                      onClick={() => handleEditClick(rule)}
                      className="text-sky-900 capitalize hover:underline"
                    >
                      {rule.state}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm capitalize">{rule.rule}</td>
                  <td className="px-6 py-3 text-sm">{rule.deduction_basis}</td>
                  <td className="px-6 py-3 text-sm">
                    {formatWithholdingValue(rule.withholding_limit)}
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
      {!loading && data.length > 0 && (
        <div className="flex justify-between  mt-4">
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

      {/* Creditor Rule Popup */}
      {isCreditorRulePopupOpen && (
        <CreditorRulePopup
          open={isCreditorRulePopupOpen}
          handleClose={() => setIsCreditorRulePopupOpen(false)}
          handleSave={handleCreditorRuleSave}
        />
      )}
    </div>
  );
};

export default CreditorRule;
