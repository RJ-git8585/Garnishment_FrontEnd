import { BASE_URL } from '../Config';
import Headertop from '../component/Headertop';
import { FaTableCells } from "react-icons/fa6";
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import { BsFiletypeJson,BsFiletypeXml  } from "react-icons/bs";
// import Tooltip from '@mui/material/Tooltip';
import Sidebar from '../component/sidebar';
import { useState, useRef } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import './xml.css'
import * as XLSX from "xlsx";

const XmlProcessor = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setFile] = useState(null);
  const [fileUploadTime, setFileUploadTime] = useState(null);
  const [garnishmentCalcTime, setGarnishmentCalcTime] = useState(null);
  const containerRef = useRef(null);

  const reloadComponent = () => {
    setReloadKey(prevKey => prevKey + 1);
    setJsonInput('');
    setResponse(null);
    setError('');
    setLoading(false);
    setFile(null);
    setShowTable(false);
    setFileUploadTime(null);
    setGarnishmentCalcTime(null);
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      setLoading(true);
      const startTime = new Date().getTime();

      try {
        const apiResponse = await fetch(`${BASE_URL}/User/ConvertExcelToJson`, {
          method: 'POST',
          body: formData,
        });

        const endTime = new Date().getTime();
        setFileUploadTime(endTime - startTime);

        if (!apiResponse.ok) {
          throw new Error(`API Error: ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        setJsonInput(JSON.stringify(data, null, 2));

        await handleGarnishmentCalculation(data);
      } catch (err) {
        setError(err.message || 'An error occurred while uploading the file.');
      } finally {
        setLoading(false);
      }
    }  
  };


  const exportToExcel = () => {
    if (!response || !response.results) {
      alert("No data available to export.");
      return;
    }
  
    const formattedData = response.results.reduce((acc, result) => {
      result.garnishment_data.forEach((garnishment) => {
        garnishment.data.forEach((garnData) => {
          acc.push({
            "Employee ID": result.ee_id, // Fixed reference
            "Case ID": garnData.case_id, // Corrected case ID extraction
            "Garnishment Type": garnishment.type,
            "Ordered Amount": garnData.ordered_amount ?? "N/A",
            "Arrear Amount":
              result.Agency?.find((agency) => agency.Arrear)?.Arrear[0]?.arrear_amount ?? "N/A",
            "Withholding Amount":
              result.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt[0]?.child_support ?? "N/A",
            "ER Deduction": result.ER_deduction?.garnishment_fees || "N/A",
          });
        });
      });
      return acc;
    }, []);
  
    if (formattedData.length === 0) {
      alert("No valid data found for export.");
      return;
    }
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Garnishment Data");
  
    XLSX.writeFile(workbook, "Garnishment_Data.xlsx");
  };
  
  
  const handleGarnishmentCalculation = async (data) => {
    try {
      setLoading(true);
      const startTime = new Date().getTime();
      const apiResponse = await fetch(`${BASE_URL}/User/garnishment_calculate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const endTime = new Date().getTime();
      setGarnishmentCalcTime(endTime - startTime);

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
      }

      const result = await apiResponse.json();
      setResponse(result);
      setShowTable(false);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2)).then(
        () => alert('Response copied to clipboard!'),
        () => alert('Failed to copy response.')
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
    if (!data || !data.results) {
      return <p style={{ color: "red" }}>No valid results found.</p>;
    }
  
    const allCases = [];
  
    // Extract relevant data from results
    data.results.forEach((result) => {
      result.garnishment_data.forEach((garnishment) => {
        garnishment.data.forEach((garnData) => {
          // Extract Agency details
          const arrearAmount =
            result.Agency?.find((agency) => agency.Arrear)?.Arrear[0]?.arrear_amount || "0";
          const withholdingAmount =
            result.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt[0]
              ?.child_support || "0";
          const garnishmentFees = result.ER_deduction?.garnishment_fees || "N/A";
  
          allCases.push({
            ee_id: result.ee_id,
            no_of_exemption_including_self: result.no_of_exemption_including_self,
            Work_State: result.work_state, // Fixed to correctly reference the employee ID
            case_id: garnData.case_id, // Correctly extracting case ID from garnishment data
            garnishment_type: garnishment.type,
            ordered_amount: garnData.ordered_amount,
            arrear_amount: arrearAmount,
            withholding_amount: withholdingAmount,
            garnishment_fees: garnishmentFees,
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
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>work_state </TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>no_of_exemption_including_self</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCases.map((caseItem, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>{caseItem.ee_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.case_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.garnishment_type}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.arrear_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.withholding_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.garnishment_fees}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.Work_State}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.no_of_exemption_including_self}</TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  
  

  return (
    <div className="min-h-full" key={reloadKey}>
      <div className="container main ml-auto">
        <div className='sidebar hidden lg:block'><Sidebar /></div>
        <div className='contant content ml-auto customBatchProcessing'>
          <Headertop />
          <hr />
          <div className="bg_cls container" ref={containerRef}>
            <h2 className="header">Batch Processor</h2>

            {/* Display time response outside API response box */}
            <div className="timeContainer">
            <div className="timeContainer">
                {fileUploadTime !== null && (
                  <p className="text-black">
                    File Upload Time: <b>{fileUploadTime}</b> ms
                  </p>
                )}
                {garnishmentCalcTime !== null && (
                  <p className="text-black">
                    Garnishment Calculation Time: <b>{garnishmentCalcTime}</b> ms
                  </p>
                )}
              </div></div>

            <div className="columnContainer">
              <div className="inputSection">
                <div className="fileInputContainer">
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                    className="fileInput"
                  />
                  <button
                    className="resetButton"
                    onClick={reloadComponent}
                    disabled={loading}
                  >
                    {loading ? 'Loading Responses...' : 'Reset'}
                  </button>
                </div>

                <textarea
                  className="textArea"
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
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

              
                <button className="toggleButton" onClick={exportToExcel}>
                  <BsFiletypeXml />
                </button>
              
          </div>


                  </div>
                  <div className="responseContainer">
                    {showTable ? renderTable(response) : (
                      <pre className="responsejson">{JSON.stringify(response, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default XmlProcessor;
