import { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from "../configration/Config"; // Replace with your actual base URL

function Iwo() {
  const [upload, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(''); // State to store the response message

  const handleFileSelect = (event) => {
    setUploadFile(event.target.files[0]);
  };
  

  const handleUpload = async () => {
    if (!upload) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setResponseMessage(''); // Clear previous response message

    const formData = new FormData();
    formData.append('file', upload);

    try {
      const response = await axios.post(`${BASE_URL}/User/UploadIWOPdfFiles/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data.data.name);
      setResponseMessage(`Success: uploaded ${response.data.data.name || 'File uploaded successfully!'}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResponseMessage(`Error: ${error.response?.data?.message || 'Failed to upload file. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload PDF File
      </Typography>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        style={{ marginBottom: '16px' }}
      />
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        disabled={loading || !upload}
        sx={{ width: '150px' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
      </Button>
      {responseMessage && (
        <Typography variant="body1" color={responseMessage.startsWith('Error') ? 'error' : 'primary'} sx={{ mt: 2 }}>
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
}

export default Iwo;
