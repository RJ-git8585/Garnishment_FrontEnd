import React from 'react';

const FileUpload = ({ onFileUpload, onReset, loading, jsonInput, setJsonInput, error }) => {
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    onFileUpload(uploadedFile);
  };

  return (
    <div className="inputSection">
      <div className="fileInputContainer">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="fileInput"
        />
        <button className="resetButton" onClick={onReset} disabled={loading}>
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
  );
};

export default FileUpload;
