import { BASE_URL } from '../Config';
import Headertop from '../component/Headertop';
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import Sidebar from '../component/sidebar';
import { useState, useRef } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import * as XLSX from 'xlsx'; // Library to parse Excel files
import xml2js from 'xml2js'; // Library to convert XML to JSON and vice versa

const XmlProcessor = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setFile] = useState(null);
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
      formData.append('file', uploadedFile); // Append file to form data
      setLoading(true); // Set loading true when file upload starts

      try {
        // Make the fetch request to convert Excel to JSON
        const apiResponse = await fetch(`${BASE_URL}/User/ConvertExcelToJson`, {
          method: 'POST',
          body: formData, // Send form data
        });

        if (!apiResponse.ok) {
          throw new Error(`API Error: ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json(); // Wait for the JSON data
        setJsonInput(JSON.stringify(data, null, 2)); // Set the JSON response in the textarea

        // Call the garnishment calculation function
        await handleGarnishmentCalculation(data); // Wait for this to complete before proceeding

      } catch (err) {
        setError(err.message || 'An error occurred while uploading the file.');
      } finally {
        setLoading(false); // Set loading false after request completes
      }
    }
  };

  const handleConvertToXml = (jsonContent) => {
    try {
      const builder = new xml2js.Builder();
      const xmlData = builder.buildObject(jsonContent); // Convert JSON to XML
      return xmlData;
    } catch (err) {
      setError('Error converting JSON to XML');
      return null;
    }
  };

  // Convert XML to JSON (if needed)
  const handleConvertXmlToJson = async (xmlContent) => {
    try {
      setLoading(true);
      setError('');

      // Parse XML to JSON
      const parser = new xml2js.Parser();
      parser.parseString(xmlContent, (err, result) => {
        if (err) {
          throw new Error('Error parsing XML to JSON');
        }

        const jsonData = JSON.stringify(result, null, 2);
        setJsonInput(jsonData); // Show JSON in the textarea

        // Optionally call another API for garnishment calculations, if needed
        // await handleGarnishmentCalculation(result);
      });

    } catch (err) {
      setError(err.message || 'An error occurred while converting the XML.');
      setResponse(null);
      console.error('Error in handleConvertXmlToJson:', err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  const handleGarnishmentCalculation = async (data) => {
    try {
      setLoading(true);
      const apiResponse = await fetch(`${BASE_URL}/User/garnishment_calculate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
      }

      const result = await apiResponse.json();
      setResponse(result); // Set the response to display
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
      return <p style={styles.error}>No valid results found.</p>;
    }

    const groupedData = data.results.reduce((acc, result) => {
      result.employees.forEach((employee) => {
        const clientId = result.cid;
        if (!acc[clientId]) {
          acc[clientId] = [];
        }
        acc[clientId].push(employee);
      });
      return acc;
    }, {});

    return Object.keys(groupedData).map((clientId) => (
      <div key={clientId} style={styles.resultContainer}>
        <h4 style={styles.subTableHeader}>
          CID: {clientId}
        </h4>
        <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}> CID</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Employee ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Case ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Garnishment Type</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Additional Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedData[clientId].map((employee, empIndex) =>
                employee.garnishment.map((garnishment, garnIndex) => (
                  <TableRow key={`${empIndex}-${garnIndex}`}>
                    <TableCell style={{ textAlign: 'center' }}>{clientId}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{employee.ee_id}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{garnishment.case_id}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{garnishment.garnishment_type}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {garnishment.student_loan_withhold_amt ||
                        garnishment.child_support_withhold_amt ||
                        'N/A'}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {garnishment.arrear_amount
                        ? `Arrear Amount: ${garnishment.arrear_amount}`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
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
          <div style={styles.container} ref={containerRef}>
            <h2 style={styles.header}>Batch Processor</h2>

            <div style={styles.columnContainer}>
              <div style={styles.inputSection}>
                <div style={styles.fileInputContainer}>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                    style={styles.fileInput}
                  />
                  <button
                    style={styles.resetButton}
                    onClick={reloadComponent}
                    disabled={loading}
                  >
                    {loading ? 'Loading Responses...' : 'Reset'}
                  </button>
                </div>

                <textarea
                  style={styles.textArea}
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                {error && <p style={styles.error}>{error}</p>}
              </div>

              {response && (
                <div style={styles.responseSection}>
                  <div style={styles.responseHeader}>
                    <h3>API Response</h3>
                    <div>
                      <button style={styles.copyButton} onClick={handleCopy}><FaCopy /></button>
                      <button style={styles.toggleButton} onClick={() => setShowTable(!showTable)}>
                        {showTable ? 'Show JSON' : 'Show Table'}
                      </button>
                      <button style={styles.toggleButton} onClick={toggleFullscreen}>
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                      </button>
                    </div>
                  </div>
                  <div style={styles.responseContainer}>
                    {showTable ? renderTable(response) : (
                      <pre style={styles.response}>{JSON.stringify(response, null, 2)}</pre>
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

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' },
  header: { textAlign: 'center', marginBottom: '10px' },
  columnContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputSection: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  responseSection: { flex: 1.5, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' },
  textArea: { width: '100%', height: '200px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', backgroundColor: '#000', color: '#fff' },
  button: { padding: '10px', fontSize: '14px', backgroundColor: 'rgb(163 163 163)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '40%', marginLeft: '10px' },
  resetButton: { padding: '10px', fontSize: '14px', backgroundColor: 'rgb(163 163 163)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', width: '40%', marginLeft: '10px' },
  error: { color: 'red', marginTop: '10px' },
  responseHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  responseContainer: { maxHeight: '400px', overflowY: 'auto' },
  response: { fontFamily: 'monospace', color: '#000', whiteSpace: 'pre-wrap', fontSize: '12px' },
  toggleButton: { padding: '5px 10px', fontSize: '12px', backgroundColor: 'rgb(62 72 76)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  copyButton: { padding: '10px 20px', fontSize: '12px', backgroundColor: 'rgb(62 72 76)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' },
  resultContainer: { marginBottom: '30px' },
  subTableHeader: { fontSize: '18px', fontWeight: 'bold', margin: '10px 0' },
  employeeSection: { marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9' },
  employeeHeader: { fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
  fileInputContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  fileInput: { marginBottom: '10px' }
};

export default XmlProcessor;
