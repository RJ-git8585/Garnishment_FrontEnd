import React, { useState, useEffect } from "react";
import { BASE_URL } from "../Config";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Swal from "sweetalert2";
import EditRulePopup from "../components/EditRulePopup";

const Ruleslist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/User/state-tax-levy-config-data/`);
        const jsonData = await response.json();
        setData(jsonData.data || []);
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

  const handleEditClick = (rule) => {
    setEditData(rule);
    setIsEditing(true);
  };

  const handleEditSave = async (updatedData) => {
    try {
      const response = await fetch(`${BASE_URL}/User/state-tax-levy-config-data/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Rule Updated",
          text: "The rule has been successfully updated.",
        });

        setData((prevData) =>
          prevData.map((rule) =>
            rule.id === updatedData.id ? { ...rule, ...updatedData } : rule
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

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">State Tax Levy Rules</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left text-sm">Sr</th>
              <th className="px-6 py-3 text-left text-sm">Rule ID</th>
              <th className="px-6 py-3 text-left text-sm">State</th>
              <th className="px-6 py-3 text-left text-sm">Deduct From</th>
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
                  <td className="px-6 py-3 text-sm">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="px-6 py-3 text-sm">{rule.id}</td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => handleEditClick(rule)}
                      className="text-blue-500 hover:underline"
                    >
                      {rule.state}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm">{rule.deduct_from || "N/A"}</td>
                  <td className="px-6 py-3 text-sm">
                    {rule.withholding_limit_percent ? `${rule.withholding_limit_percent}%` : "N/A"}
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
        />
      )}
    </div>
  );
};

export default Ruleslist;
