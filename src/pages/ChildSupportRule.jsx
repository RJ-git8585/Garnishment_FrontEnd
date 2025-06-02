import React, { useState, useEffect } from 'react';
import { BASE_URL } from "../configration/Config";
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ChildSupportRule = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_URLS.GET_CHILD_SUPPORT_RULES);
                const jsonData = await response.json();
                const sortedData = jsonData.data.sort((a, b) =>
                    a.state.localeCompare(b.state)
                );
                setData(sortedData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                <h1 className="text-2xl font-bold">Child Support Rules</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-6 py-3 text-left text-sm">Sr</th>
                            <th className="px-6 py-3 text-left text-sm">State</th>
                            <th className="px-6 py-3 text-left text-sm">Maximum Withholding</th>
                            <th className="px-6 py-3 text-left text-sm">Priority Level</th>
                            <th className="px-6 py-3 text-left text-sm">Additional Rules</th>
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
                                    <td className="px-6 py-3 text-sm">{rule.state}</td>
                                    <td className="px-6 py-3 text-sm">
                                        {rule.maximum_withholding ? `${rule.maximum_withholding}%` : "N/A"}
                                    </td>
                                    <td className="px-6 py-3 text-sm">{rule.priority_level || "N/A"}</td>
                                    <td className="px-6 py-3 text-sm">{rule.additional_rules || "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-6 text-center text-gray-500">
                                    No child support rules found.
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
                                currentPage === index + 1
                                    ? "bg-gray-500 text-white"
                                    : "bg-white text-gray-700"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChildSupportRule;
