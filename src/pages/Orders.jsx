import { useState, useEffect, useCallback } from "react";
import DeleteItemComponent from "../component/DeleteItemComponent";
import { TiExport } from "react-icons/ti";
import { CgImport } from "react-icons/cg";
import { BASE_URL } from "../Config";

function Orders({ onDeleteSuccess }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10); // Fixed page size to 10
  const [totalRows, setTotalRows] = useState(0);
  const exportLink = `${BASE_URL}/User/ExportOrder/`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/User/GetOrderDetails/`);
      const jsonData = await response.json();

      if (jsonData.data) {
        setTotalRows(jsonData.data.length); // Set total rows based on all data
        const startIndex = page * pageSize;
        const paginatedData = jsonData.data.slice(startIndex, startIndex + pageSize); // Slice data for the current page
        setData(paginatedData);
      } else {
        setData([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(totalRows / pageSize)) {
      setPage(newPage);
    }
  };

  const columns = [
    { field: "eeid", headerName: "Employee ID" },
    { field: "fein", headerName: "FEIN" },
    { field: "case_id", headerName: "Case ID" },
    { field: "work_state", headerName: "State" },
    { field: "type", headerName: "Garnishment Type" },
    { field: "sdu", headerName: "SDU" },
    { field: "start_date", headerName: "Start Date" },
    { field: "end_date", headerName: "End Date" },
    { field: "amount", headerName: "Amount" },
    {
      field: "arrear_greater_than_12_weeks",
      headerName: "Arrears > 12 Weeks",
      renderCell: (row) => (row.arrear_greater_than_12_weeks ? "True" : "False"),
    },
    { field: "arrear_amount", headerName: "Arrear Amount" },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (row) => (
        <DeleteItemComponent
          id={row.eeid} // Pass eeid
          cid={row.case_id} // Pass case_id
          type="order" // Specify type as "order"
          onDeleteSuccess={onDeleteSuccess}
        />
      ),
    },
  ];

  const renderTableHeader = () => (
    <tr>
      {columns.map((col) => (
        <th key={col.field} className="px-4 py-2 bg-gray-800 text-white">
          {col.headerName}
        </th>
      ))}
    </tr>
  );

  const renderTableRows = () =>
    data.map((row, index) => (
      <tr key={index} className="border-b">
        {columns.map((col) => (
          <td key={col.field} className="px-4 py-2">
            {col.renderCell ? col.renderCell(row) : row[col.field] || "N/A"}
          </td>
        ))}
      </tr>
    ));

  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <>
      {/* Action Buttons */}
      <div className="text-right mt-4 mb-4">
        <a
          href={exportLink}
          className="border inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
        >
          <TiExport className="mr-1" /> Export
        </a>
        <a
          href="/OrdImport"
          className="border inline-flex ml-2 items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
        >
          <CgImport className="mr-1" /> Import
        </a>
      </div>

      {/* Table Section */}
      <h4 className="text-lg font-semibold text-black mb-4">Orders</h4>
      <div className="overflow-x-auto text-sm">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader">Loading...</div>
          </div>
        ) : data.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No records found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className={`px-4 py-2 border text-sm rounded-md ${
            page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className={`px-4 py-2 border text-sm rounded-md ${
            page + 1 >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Orders;