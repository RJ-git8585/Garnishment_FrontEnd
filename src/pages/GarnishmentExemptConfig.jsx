/**
 * GarnishmentExemptConfig Component
 * 
 * This component displays a paginated list of garnishment exempt amount configurations.
 * 
 * @component
 * @returns {JSX.Element} The rendered GarnishmentExemptConfig component.
 */
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../configration/Config";
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Swal from "sweetalert2";

const GarnishmentExemptConfig = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URLS.GET_GARNISHMENT_EXEMPT_CONFIG);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        
        // Validate and transform the data
        const validData = (jsonData.data || []).map(item => ({
          id: item.id || 'N/A',
          state: item.state || 'N/A',
          pay_period: item.pay_period || 'N/A',
          minimum_hourly_wage_basis: item.minimum_hourly_wage_basis || 'N/A',
          minimum_wage_amount: parseFloat(item.minimum_wage_amount) || 0,
          multiplier_lt: parseFloat(item.multiplier_lt) || 0,
          condition_expression_lt: item.condition_expression_lt || 'N/A',
          lower_threshold_amount: parseFloat(item.lower_threshold_amount) || 0,
          multiplier_ut: parseFloat(item.multiplier_ut) || 0,
          condition_expression_ut: item.condition_expression_ut || 'N/A',
          upper_threshold_amount: parseFloat(item.upper_threshold_amount) || 0
        }));

        const sortedData = validData.sort((a, b) =>
          a.state.localeCompare(b.state)
        );
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch garnishment exempt amount configurations'
        });
        setData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (amount) => {
    try {
      return typeof amount === 'number' 
        ? `$${amount.toFixed(2)}` 
        : '$0.00';
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '$0.00';
    }
  };

  const formatNumber = (number) => {
    try {
      return typeof number === 'number' 
        ? number.toFixed(2)
        : '0.00';
    } catch (error) {
      console.error('Error formatting number:', error);
      return '0.00';
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="p-4">
      <div className="mb-4">  
        <h1 className="text-2xl font-bold">Garnishment Exempt Amount Configurations</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-3 text-left text-sm">Sr</th>
              <th className="px-4 py-3 text-left text-sm">State</th>
              <th className="px-4 py-3 text-left text-sm">Pay Period</th>
              <th className="px-4 py-3 text-left text-sm">Min. Wage Basis</th>
              <th className="px-4 py-3 text-left text-sm">Min. Wage Amount</th>
              <th className="px-4 py-3 text-left text-sm">Multiplier (LT)</th>
              <th className="px-4 py-3 text-left text-sm">Expression (LT)</th>
              <th className="px-4 py-3 text-left text-sm">Lower Threshold</th>
              <th className="px-4 py-3 text-left text-sm">Multiplier (UT)</th>
              <th className="px-4 py-3 text-left text-sm">Expression (UT)</th>
              <th className="px-4 py-3 text-left text-sm">Upper Threshold</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="py-6">
                  <div className="flex justify-center h-40">
                    <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((config, index) => (
                <tr key={config.id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-3 text-sm">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">
                    {config.state}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {config.pay_period}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {config.minimum_hourly_wage_basis}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(config.minimum_wage_amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatNumber(config.multiplier_lt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {config.condition_expression_lt}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(config.lower_threshold_amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatNumber(config.multiplier_ut)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {config.condition_expression_ut}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(config.upper_threshold_amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="py-6 text-center text-gray-500">
                  No configurations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!loading && data.length > 0 && (
        <div className="flex justify-between mt-4">
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

export default GarnishmentExemptConfig; 