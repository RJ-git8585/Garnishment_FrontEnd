import { BASE_URL } from '../Config';
import Headertop from '../component/Headertop';
import { FaTableCells } from "react-icons/fa6";
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import { BsFiletypeJson,BsFiletypeXml  } from "react-icons/bs";
import Tooltip from '@mui/material/Tooltip';

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
  
    const groupedData = response.results.reduce((acc, result) => {
      result.employees.forEach((employee) => {
        employee.garnishment_data.forEach((garnishment) => {
          garnishment.data.forEach((caseData) => {
            acc.push({
              CID: result.cid,
              "Employee ID": employee.ee_id,
              "Case ID": caseData.case_id,
              "Garnishment Type": garnishment.type,
              Amount: caseData.amount,
              "Arrear Amount": caseData.arrear,
              "ER Deduction": employee.ER_deduction?.garnishment_fees || "N/A",
            });
          });
        });
      });
      return acc;
    }, []);
  
    const worksheet = XLSX.utils.json_to_sheet(groupedData);
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
      return <p className="error">No valid results found.</p>;
    }

    const groupedData = data.results.reduce((acc, result) => {
      result.employees.forEach((employee) => {
        const clientId = result.cid;
  
        if (!acc[clientId]) {
          acc[clientId] = [];
        }
  
        // Extract garnishment details correctly
        employee.garnishment_data.forEach((garnishment) => {
          garnishment.data.forEach((caseData) => {
            acc[clientId].push({
              ee_id: employee.ee_id,
              case_id: caseData.case_id,
              garnishment_type: garnishment.type,
              amount: caseData.amount,
              arrear_amount: caseData.arrear,
              er_deduction: employee.ER_deduction?.garnishment_fees || "N/A",
            });
          });
        });
      });
      return acc;
    }, {});
  
    return Object.keys(groupedData).map((clientId) => (
      <div key={clientId} className="resultContainer">
        {/* <h4 style={styles.subTableHeader}>CID: {clientId}</h4> */}
        <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#c1c1c1' }}>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>CID</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Employee ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Case ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Garnishment Type</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Arrear Amount</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>ER Deduction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedData[clientId].map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: 'center' }}>{clientId}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.ee_id}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.case_id}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.garnishment_type}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>${item.amount}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>${item.arrear_amount}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.er_deduction}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    ));
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
              {fileUploadTime && <p className="text-black">File Upload Time: <b>{fileUploadTime}</b> ms</p>}
              {garnishmentCalcTime && <p className="text-black">Garnishment Calculation Time:<b> {garnishmentCalcTime}</b> ms</p>}
            </div>

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
              <Tooltip title="Copy JSON Response">
                <button className="copyButton" onClick={handleCopy}>
                  <FaCopy />
                </button>
              </Tooltip>

              <Tooltip title={showTable ? "Show JSON" : "Show Table"}>
                <button className="toggleButton" onClick={() => setShowTable(!showTable)}>
                  {showTable ? <BsFiletypeJson /> : <FaTableCells />}
                </button>
              </Tooltip>

              <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                <button className="toggleButton" onClick={toggleFullscreen}>
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </Tooltip>

              <Tooltip title="Export to Excel">
                <button className="toggleButton" onClick={exportToExcel}>
                  <BsFiletypeXml />
                </button>
              </Tooltip>
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
