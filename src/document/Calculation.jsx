import { useState } from 'react';
import { BASE_URL } from '../Config';

const Calculation = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false); // Toggle for table view

  const handleConvert = async () => {
    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);
      setError('');
      setLoading(true);

      // API Call
      const apiResponse = await fetch(`${BASE_URL}/User/MiltipleStudentLoanCalculationData/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      setResponse(data);
      setShowTable(false); // Reset to JSON view when new data comes
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (data) => {
    // Check if the response contains a 'result' key
    if (Array.isArray(data)) {
      return data.map((item, index) =>
        item.result && Array.isArray(item.result) ? (
          <div key={index}>
            <h4 style={styles.subTableHeader}>Result Table for Item {index + 1}</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  {Object.keys(item.result[0] || {}).map((key) => (
                    <th key={key} style={styles.th}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.result.map((resultRow, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(resultRow).map((value, colIndex) => (
                      <td key={colIndex} style={styles.td}>
                        {typeof value === 'object' ? JSON.stringify(value) : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p key={index} style={styles.error}>No result data available for item {index + 1}</p>
        )
      );
    } else if (typeof data === 'object' && data !== null && data.result) {
      // Single object with 'result' key
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              {Object.keys(data.result[0] || {}).map((key) => (
                <th key={key} style={styles.th}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.result.map((resultRow, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(resultRow).map((value, colIndex) => (
                  <td key={colIndex} style={styles.td}>
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return <p style={styles.error}>The response cannot be displayed as a table.</p>;
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Batch Converter</h2>
      <p style={styles.subHeader}>
        Currently this is only for: <strong style={styles.special}>Multiple Student loan garnishment batches</strong>
      </p>
      <div style={styles.flexContainer}>
        {/* Request Section */}
        <div style={styles.leftPane}>
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
          <div style={styles.rightPane}>
            <div style={styles.responseHeaderContainer}>
              <h3 style={styles.responseHeader}>API Response:</h3>
              <button
                style={styles.toggleButton}
                onClick={() => setShowTable(!showTable)}
              >
                {showTable ? 'Show JSON' : 'Show Table'}
              </button>
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
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
  },
  subHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  special: {
    color: '#ffa500',
  },
  flexContainer: {
    display: 'flex',
    gap: '20px',
  },
  leftPane: {
    flex: 0.5, // Reduced size to half
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
  },
  rightPane: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#000',
    color: '#fff',
    maxHeight: '400px', // Consistent height for scrolling
    overflowY: 'auto',
  },
  textArea: {
    width: '100%',
    height: '200px', // Reduced height
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: '#000',
    overflowY: 'auto', // Adds vertical scrolling
  },
  button: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    backgroundColor: 'transparent',
    color: '#fff',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  responseContainer: {
    maxHeight: '400px', // Consistent height for scrolling
    overflowY: 'auto', // Adds vertical scrolling
  },
  responseHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  responseHeader: {
    fontSize: '16px',
    color: '#fff',
  },
  response: {
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    color: '#fff',
  },
  toggleButton: {
    padding: '5px 10px',
    fontSize: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#fff',
  },
  th: {
    border: '1px solid #fff',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#333',
  },
  td: {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left',
  },
  
};

export default Calculation;