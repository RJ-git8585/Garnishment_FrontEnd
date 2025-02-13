import { useState, useRef } from 'react';
import { BASE_URL } from '../Config';
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
const BatchCalculation = () => {
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
    setReloadKey((prevKey) => prevKey + 1);
    setJsonInput('');
    setResponse(null);
    setError('');
    setLoading(false);
    setFile(null);
    setShowTable(false);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileContent = JSON.parse(reader.result);
          setJsonInput(JSON.stringify(fileContent, null, 2));
          setFile(uploadedFile);
        } catch (err) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(uploadedFile);
    } else {
      setError('Please upload a valid JSON file');
    }
  };

  const handleConvert = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setError('');
      setLoading(true);

      const apiResponse = await fetch(`${BASE_URL}/User/garnishment_calculate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      setResponse(data);
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
  
    // Grouping data by client_id
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
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Arrear Amount</TableCell> 
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
                        garnishment.federal_tax_withhold_amt ||
                        '0'}
                    </TableCell>
                    {/* Display the arrear amount if available, otherwise show 'N/A' */}
                    <TableCell style={{ textAlign: 'center' }}>
                      {garnishment.arrear_amount ? garnishment.arrear_amount : '0'}
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
            <h2 style={styles.header}>Garnishment Processor</h2>

            <div style={styles.columnContainer}>
              <div style={styles.inputSection}>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleFileUpload} 
                  style={styles.fileInput}
                />
                <textarea
                  style={styles.textArea}
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                <div className="text-center">
                  <button style={styles.button} onClick={handleConvert} disabled={loading}>
                    {loading ? 'Processing...' : 'Request'}
                  </button>
                  {error && <p style={styles.error}>{error}</p>}
                  <button onClick={reloadComponent} style={styles.resetButton}>Reset</button>
                </div>
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
  container: { maxWidth: '100%',  padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' },
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
  fileInput: { marginBottom: '10px' }
};

export default BatchCalculation;
