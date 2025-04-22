import { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from "../Config"; // Replace with your actual base URL

function Iwo() {
  const [uploads, setUploads] = useState([]); // State to store multiple files
  const [previews, setPreviews] = useState([]); // State to store preview URLs
  const [loading, setLoading] = useState(false);
  const [responseMessages, setResponseMessages] = useState([]); // State to store response messages

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploads(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file)); // Generate preview URLs for each file
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    if (uploads.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    setLoading(true);
    setResponseMessages([]); // Clear previous response messages

    const uploadPromises = uploads.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file); // Append each file individually

      try {
        const response = await axios.post(`${BASE_URL}/User/UploadIWOPdfFiles/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return `Success: Uploaded ${response.data.data.name || file.name}`;
      } catch (error) {
        return `Error: ${error.response?.data?.message || `Failed to upload ${file.name}`}`;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      setResponseMessages(results);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload PDF Files
      </Typography>
      <input
        type="file"
        accept="application/pdf"
        multiple // Allow multiple file selection
        onChange={handleFileSelect}
        style={{ marginBottom: '16px' }}
      />
      {previews.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Previews:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {previews.map((previewUrl, index) => (
              <iframe
                key={index}
                src={previewUrl}
                title={`PDF Preview ${index + 1}`}
                width="200px"
                height="250px"
                style={{ border: '1px solid #ccc' }}
              ></iframe>
            ))}
          </Box>
        </Box>
      )}
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        disabled={loading || uploads.length === 0}
        sx={{ width: '150px' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
      </Button>
      {responseMessages.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {responseMessages.map((message, index) => (
            <Typography
              key={index}
              variant="body1"
              color={message.startsWith('Error') ? 'error' : 'primary'}
            >
              {message}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Iwo;
