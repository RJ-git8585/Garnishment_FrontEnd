import { useState, useRef } from 'react';
import { BASE_URL } from '../Config';
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import { FaTableCells } from "react-icons/fa6";
import './batch.css'
import { BsFiletypeJson  } from "react-icons/bs";
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
      return <p style={{ color: "red" }}>No valid results found.</p>;
    }
  
    const allCases = [];
  
    // Extract relevant data from results
    data.results.forEach((result) => {
      result.cases.forEach((caseItem) => {
        caseItem.garnishment_data.forEach((garnishment) => {
          garnishment.data.forEach((garnData) => {
            // Extract Agency details
            // const arrearAmount =
            //   caseItem.Agency?.find((agency) => agency.Arrear)?.Arrear[0]?.arrear_amount || "0";
            const withholdingAmount =
              caseItem.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt[0]
                ?.child_support || "0";
            const garnishmentFees = caseItem.ER_deduction?.garnishment_fees || "N/A";
  
            allCases.push({
              ee_id: caseItem.ee_id,
              case_id: garnData.case_id, // ✅ Correctly extract case_id from garnishment data
              garnishment_type: garnishment.type,
              ordered_amount: garnData.ordered_amount,
              arrear_amount: garnData.arrear_amount, // ✅ Use garnishment arrear amount instead of unrelated Agency data
              withholding_amount: withholdingAmount,
              garnishment_fees: garnishmentFees,
            });
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
              {/* <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Ordered Amount</TableCell> */}
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Arrear Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Withholding Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Garnishment Fees</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCases.map((caseItem, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>{caseItem.ee_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.case_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.garnishment_type}</TableCell>
                {/* <TableCell style={{ textAlign: "center" }}>{caseItem.ordered_amount}</TableCell> */}
                <TableCell style={{ textAlign: "center" }}>{caseItem.arrear_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.withholding_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.garnishment_fees}</TableCell>
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
          <div className="container" ref={containerRef}>
            <h2 className="header" >Garnishment Processor</h2>

            <div className="columnContainer" >
              <div  className="inputSection">
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleFileUpload} 
               
                  className="fileInput"
                />
                <textarea
                className="textArea"
                  
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                <div className="text-center">
                  <button  className="button" onClick={handleConvert} disabled={loading}>
                    {loading ? 'Processing...' : 'Request'}
                  </button>
                  {error && <p  className="error">{error}</p>}
                  <button onClick={reloadComponent} className="resetButton">Reset</button>
                </div>
              </div>

              {response && (
                <div className="responseSection">
                  <div className="responseHeader">
                    <h3>API Response</h3>
                    <div>
                      <button className="copyButton"  onClick={handleCopy}> <FaCopy /></button>
                      <button className="toggleButton"  onClick={() => setShowTable(!showTable)}>
                         {showTable ? <BsFiletypeJson /> : <FaTableCells />}
                      </button>
                      <button className="toggleButton" onClick={toggleFullscreen}>
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                      </button>
                    </div>
                  </div>
                  <div className="responseContainer">
                    {showTable ? renderTable(response) : (
                      <pre className="response">{JSON.stringify(response, null, 2)}</pre>
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


export default BatchCalculation;
