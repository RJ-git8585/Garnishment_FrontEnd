import { useState, useRef } from 'react';
import { BASE_URL } from '../Config';
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";

const Calculation = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  const handleConvert = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setError('');
      setLoading(true);

      const apiResponse = await fetch(`${BASE_URL}/User/MiltipleStudentLoanCalculationData/`, {
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

    if (data?.result) {
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

  return (
    <div style={styles.container} ref={containerRef}>
      <h2 style={styles.header}>Batch Converter</h2>
      <p style={styles.subHeader}>
        Currently this is only for: <strong style={styles.highlight}>Multiple Student Loan Garnishment Batches</strong>
      </p>

      <div style={styles.columnContainer}>
        {/* Input Section */}
        <div style={styles.inputSection}>
          <textarea
            style={styles.textArea}
            placeholder="Paste your JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <button style={styles.button} onClick={handleConvert} disabled={loading}>
            {loading ? 'Processing...' : 'Request'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
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
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: { textAlign: 'center', marginBottom: '10px' },
  subHeader: { textAlign: 'center', marginBottom: '20px' },
  highlight: { color: '#ffa500' },
  columnContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  responseSection: {
    flex: 1.5,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#000',
    color: '#fff',
  },
  textArea: {
    width: '100%',
    height: '200px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#000',
    color: '#fff',
  },
  button: {
    padding: '10px',
    fontSize: '14px',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: { color: 'red', marginTop: '10px' },
  responseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  responseContainer: { maxHeight: '400px', overflowY: 'auto' },
  response: { fontFamily: 'monospace', color: '#fff', whiteSpace: 'pre-wrap' },
  toggleButton: {
    padding: '5px 10px',
    fontSize: '12px',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  copyButton: {
    padding: '10px 20px',
    fontSize: '12px',
    backgroundColor: 'rgb(62 72 76)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    marginTop: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: { backgroundColor: '#333', color: '#fff', padding: '8px', textAlign: 'left' },
  td: { border: '1px solid #ccc', padding: '8px', textAlign: 'left', color: '#fff' },
};

export default Calculation;