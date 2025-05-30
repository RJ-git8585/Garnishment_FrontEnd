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
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Swal from "sweetalert2";
import { Typography } from "@mui/material";

const CreditorRule = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/garnishment/creditor-debt-rule/`);
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

  const handleEditClick = (rule) => {
    Swal.fire({
      title: 'Edit Creditor Rule',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">State</label>
            <input id="state" class="mt-1 block w-full border rounded-md shadow-sm p-2" value="${rule.state}" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Rule</label>
            <input id="rule" class="mt-1 block w-full border rounded-md shadow-sm p-2" value="${rule.rule}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Deduction Basis</label>
            <input id="deduction_basis" class="mt-1 block w-full border rounded-md shadow-sm p-2" value="${rule.deduction_basis}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Withholding Limit</label>
            <input id="withholding_limit" class="mt-1 block w-full border rounded-md shadow-sm p-2" value="${rule.withholding_limit}" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const updatedRule = {
          ...rule,
          rule: document.getElementById('rule').value,
          deduction_basis: document.getElementById('deduction_basis').value,
          withholding_limit: document.getElementById('withholding_limit').value
        };
        return fetch(`${BASE_URL}/garnishment/creditor-debt-rule/${rule.state}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRule)
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
          title: 'Rule Updated',
          text: 'The creditor rule has been successfully updated.'
        }).then(() => {
          // Refresh the data
          window.location.reload();
        });
      }
    });
  };

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
        <h1 className="text-2xl font-bold">Creditor Debt Rules</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left text-sm">Sr</th>
              <th className="px-6 py-3 text-left text-sm">State</th>
              <th className="px-6 py-3 text-left text-sm">Rule</th>
              <th className="px-6 py-3 text-left text-sm">Deduction Basis</th>
              <th className="px-6 py-3 text-left text-sm">Withholding Limit</th>
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
                  <td className="px-6 py-3 text-sm">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm rulebtn_cls">
                    <button
                      onClick={() => handleEditClick(rule)}
                      className="text-sky-900 hover:underline"
                    >
                      {rule.state}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm capitalize">{rule.rule}</td>
                  <td className="px-6 py-3 text-sm">{rule.deduction_basis}</td>
                  <td className="px-6 py-3 text-sm">{rule.withholding_limit}</td>
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
};

export default CreditorRule;
