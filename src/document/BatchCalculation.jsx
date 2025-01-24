import { useState, useRef } from 'react';
import { BASE_URL } from '../Config';
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';

const BatchCalculation = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setFile] = useState(null); // New state for uploaded file
  const containerRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileContent = JSON.parse(reader.result);
          setJsonInput(JSON.stringify(fileContent, null, 2)); // Optionally display file content in textarea
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
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const renderTable = (data) => {
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        item.result && Array.isArray(item.result) ? (
          <div key={index}>
            <h4 style={styles.subTableHeader}>Result Table for Item {index + 1}</h4>
            {renderResultTable(item.result)}
          </div>
        ) : (
          <p key={index} style={styles.error}>No result data available for item {index + 1}</p>
        )
      ));
    }

    if (data?.results) {
      return renderResultTable(data.result);
    }

    return <p style={styles.error}>The response cannot be displayed as a table.</p>;
  };

  const renderResultTable = (resultData) => (
    <table style={styles.table}>
      <thead>
        <tr>
          {Object.keys(resultData[0] || {}).map((key) => (
            <th key={key} style={styles.th}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {resultData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((value, colIndex) => (
              <td key={colIndex} style={styles.td}>
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Function to reset the form and states
  const resetForm = () => {
    setJsonInput('');
    setResponse(null);
    setError('');
    setLoading(false);
    setFile(null); // Reset the file state
    setShowTable(false); // Hide the table by default
  };

  return (
    <div className="min-h-full">
      <div className="container main ml-auto">
        <div className='sidebar hidden lg:block'><Sidebar /></div>
        
        <div className='contant content ml-auto customBatchProcessing'>
          <Headertop />
          <hr />
          <div style={styles.container} ref={containerRef}>
            <h2 style={styles.header}>Batch Converter</h2>

            <div style={styles.columnContainer}>
              {/* Input Section */}
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
          
                <div className="text-center ">
                        <button style={styles.button} onClick={handleConvert} disabled={loading}>
                          {loading ? 'Processing...' : 'Request'}
                        </button>
                          {error && <p style={styles.error}>{error}</p>}
                
                         <button onClick={resetForm} style={styles.resetButton}>Reset</button> {/* Reset Button */}
                </div>
              </div>

              {/* Response Section */}
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

// Styles
const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif',backgroundColor: '#fff' },
  header: { textAlign: 'center', marginBottom: '10px' },
  columnContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputSection: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  responseSection: { flex: 1.5, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', color: '#fff' },
  textArea: { width: '100%', height: '200px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', backgroundColor: '#000', color: '#fff' },
  button: { padding: '10px', fontSize: '14px', backgroundColor: 'rgb(163 163 163)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',width: '40%' ,marginLeft: '10px' },
  resetButton: { padding: '10px', fontSize: '14px', backgroundColor: 'rgb(163 163 163)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', width: '40%',marginLeft: '10px'},
  error: { color: 'red', marginTop: '10px' },
  responseHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  responseContainer: { maxHeight: '400px', overflowY: 'auto' },
  response: { fontFamily: 'monospace', color: '#000', whiteSpace: 'pre-wrap' ,fontSize: '12px'},
  toggleButton: { padding: '5px 10px', fontSize: '12px', backgroundColor: 'rgb(62 72 76)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  copyButton: { padding: '10px 20px', fontSize: '12px', backgroundColor: 'rgb(62 72 76)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', marginTop: '5px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { backgroundColor: '#333', color: '#fff', padding: '8px', textAlign: 'left',fontSize: '12px' },
  td: { border: '1px solid #ccc', padding: '8px', textAlign: 'left', color: '#000',fontSize: '12px' },
  fileInput: { padding: '10px', fontSize: '14px', backgroundColor: '#f1f1f1', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  // container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  buttonContainer: { display: 'flex', gap: '10px', justifyContent: 'center', width: '100%' }, 
};

export default BatchCalculation;