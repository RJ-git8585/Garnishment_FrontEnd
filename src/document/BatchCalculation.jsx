

/**
 * BatchCalculation Component
 *
 * This component provides functionality to process garnishment calculations by uploading a JSON file
 * or pasting JSON input. It sends the data to an API endpoint and displays the response in either
 * JSON format or a table format. Users can also copy the response to the clipboard or toggle fullscreen mode.
 *
 * State Variables:
 * - reloadKey: A key to trigger component re-render for resetting the state.
 * - jsonInput: Stores the JSON input provided by the user.
 * - response: Stores the API response data.
 * - error: Stores error messages, if any.
 * - loading: Indicates whether the API request is in progress.
 * - showTable: Toggles between JSON view and table view of the response.
 * - isFullscreen: Tracks whether the component is in fullscreen mode.
 *
 * Refs:
 * - containerRef: Reference to the container element for fullscreen functionality.
 *
 * Functions:
 * - reloadComponent: Resets the component state to its initial values.
 * - handleFileUpload: Handles the upload of a JSON file, parses its content, and updates the state.
 * - handleConvert: Sends the JSON input to the API for processing and updates the response state.
 * - handleCopy: Copies the API response to the clipboard.
 * - toggleFullscreen: Toggles the fullscreen mode for the component.
 * - renderTable: Renders the API response data in a table format.
 *
 * API Endpoint:
 * - `${BASE_URL}/User/garnishment_calculate/`: Endpoint to process garnishment calculations.
 *
 * Props: None
 *
 * Dependencies:
 * - React hooks: useState, useRef
 * - Material-UI components: Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer
 * - React icons: FaCopy, FaExpand, FaCompress, FaTableCells, BsFiletypeJson
 *
 * CSS:
 * - Imports styles from "../utils/css/batch.css".
 *
 * Usage:
 * - Upload a JSON file or paste JSON input to process garnishment calculations.
 * - View the response in JSON or table format.
 * - Copy the response or toggle fullscreen mode for better visibility.
 */
import { useState, useRef } from "react";
import { BASE_URL } from "../configration/Config";
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import { FaTableCells } from "react-icons/fa6";
import "../utils/css/batch.css";
import { BsFiletypeJson } from "react-icons/bs";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";

const BatchCalculation = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const reloadComponent = () => {
    setReloadKey((prevKey) => prevKey + 1);
    setJsonInput("");
    setResponse(null);
    setError("");
    setLoading(false);
    setShowTable(false);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/json") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileContent = JSON.parse(reader.result);
          setJsonInput(JSON.stringify(fileContent, null, 2));
        } catch (err) {
          setError("Invalid JSON file");
        }
      };
      reader.readAsText(uploadedFile);
    } else {
      setError("Please upload a valid JSON file");
    }
  };

  const handleConvert = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setError("");
      setLoading(true);

      const apiResponse = await fetch(`${BASE_URL}/User/garnishment_calculate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });
      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      setResponse(data);
      setShowTable(false);
    } catch (err) {
      setError(err.message || "An error occurred while processing your request.");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2)).then(
        () => alert("Response copied to clipboard!"),
        () => alert("Failed to copy response.")
      );
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const renderTable = (data) => {
    console.log("Render Table Data:", data); // Debugging log

    if (!data || !data.results || data.results.length === 0) {
      return <p style={{ color: "red" }}>No valid results found.</p>;
    }

    const allResults = [];

    data.results.forEach((result) => {
      result.garnishment_data?.forEach((garnishment) => {
        garnishment.data?.forEach((garnData, index) => {
          allResults.push({
            ee_id: result.ee_id,
            case_id: garnData.case_id,
            garnishment_type: garnishment.type,
            arrear_amount: garnData.arrear_amount || "N/A",
            withholding_amount: garnData.ordered_amount || "N/A",
            garnishment_fees: result.er_deduction?.garnishment_fees || "N/A", 
            garnishmentAmount:result.agency?.[0]?.withholding_amt?.[index]?.garnishment_amount || "N/A",
          });
        });
      });
    });

    return (
      <TableContainer component={Paper} style={{ marginTop: "20px", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Employee ID</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Case ID</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Garnishment Type</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Arrear Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Withholding Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Garnishment Fees</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allResults.length > 0 ? (
              allResults.map((item, index) => (
                console.log(item), // Debugging log
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "center" }}>{item.ee_id}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{item.case_id}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{item.garnishment_type}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{item.arrear_amount}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{item.garnishmentAmount}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{item.garnishment_fees}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center", color: "red" }}>
                  No garnishment data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <div className="container" ref={containerRef}></div>
        <h2 className="header text-lg">JSON Batch Run</h2>
        <p className="text-sx italic mb-2">Please upload the json file to get the result.... </p>
            
        <div className="inputSection space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input 
                type="file" 
                accept=".json" 
                onChange={handleFileUpload} 
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={handleConvert} 
                disabled={loading}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200 text-sm"
              >
                {loading ? "Processing..." : "Request"}
              </button>
              <button 
                type="button"
                onClick={reloadComponent} 
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-all duration-200 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste your JSON here..."
            value={jsonInput}
            rows={8}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {response && (
          <div className="responseSection">
            <div className="responseHeader">
              <h3>API Response</h3>
              <div>
                <button className="copyButton" onClick={handleCopy}>
                  <FaCopy />
                </button>
                <button className="toggleButton" onClick={() => setShowTable(!showTable)}>
                  {showTable ? <BsFiletypeJson /> : <FaTableCells />}
                </button>
                <button className="toggleButton" onClick={toggleFullscreen}>
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
            </div>
            <div className="responseContainer text-sm">
              {showTable ? renderTable(response) : <pre>{JSON.stringify(response, null, 2)}</pre>}
            </div>
          </div>
        )}
      
    </>
  );
};

export default BatchCalculation;
