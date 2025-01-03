import { useState } from 'react';
import { BASE_URL } from '../Config';
const Calculation = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);
      setError('');
      setLoading(true);

      // API Call
      const apiResponse = await fetch(`${BASE_URL}/User/StudentLoanCalculationData/`, {
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
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Batch Converter</h2>
      <p>Currently this is only for: <strong style={styles.special}>Single Student loan garnishment batches</strong></p>
      <textarea
        style={styles.textArea}
        placeholder='Paste your JSON here...'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <button style={styles.button} onClick={handleConvert} disabled={loading}>
        {loading ? 'Processing...' : 'Response'}
      </button>

      {error && <p style={styles.error}>{error}</p>}
      {response && (
        <div style={styles.responseContainer}>
          <h3>API Response:</h3>
          <pre style={styles.response}>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// Inline Styles for simplicity
const styles = {
  container: {
    maxWidth: '500px',
    padding: '20px',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  special: {
    color: '#ffa500',
  },
  textArea: {
    width: '100%',
    height: '150px',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: '#000',
  },
  button: {
    padding: '5px 10px',
    fontSize: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#ffa500',
    color: '#fff',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  responseContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#000',
    color: '#fff',
  },
  response: {
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    color: '#fff',
  },
  strong:{
    fontWeight: 'bold',
  }
};

export default Calculation;
