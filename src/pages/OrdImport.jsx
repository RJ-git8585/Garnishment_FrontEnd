/**
 * OrdImport Component
 * 
 * This component provides a form for uploading order files and submitting them to the server.
 * It includes file upload functionality and displays success or error messages.
 * 
 * @component
 * @returns {JSX.Element} The rendered Order Upload Form component.
 * @example
 * <OrdImport />
 */
import { useState } from 'react';
import { API_URLS } from '../configration/apis';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Input,
} from '@mui/material';

function OrdImport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = () => {
    setFile(null);
    setError('');
    setSuccess('');
    // Reset file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Confirm Upload',
      text: `Are you sure you want to upload ${file.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Upload',
      cancelButtonText: 'Cancel',
    });

    if (!confirmResult.isConfirmed) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(API_URLS.UPSERT_ORDER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('File uploaded successfully!');
      handleReset();
      
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'File uploaded successfully!',
        confirmButtonText: 'OK'
      });
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to upload file';
      setError(errorMessage);
      
      await Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Upload Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Order File:
              </Typography>
              <Box display="flex" alignItems="center">
                <Input
                  type="file"
                  inputProps={{ accept: '.csv,.pdf,.doc,.docx' }}
                  onChange={(e) => setFile(e.target.files[0])}
                  sx={{
                    display: 'none',
                  }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="contained" component="span">
                    Choose File
                  </Button>
                </label>
                {file && (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {file.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Error/Success Messages */}
            <Grid item xs={12}>
              {error && <Typography color="error">{error}</Typography>}
              {success && <Typography color="primary">{success}</Typography>}
            </Grid>

            {/* Buttons */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2}>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ width: '150px' }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Upload Order'
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleReset}
                  disabled={loading}
                  sx={{ width: '150px' }}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
}

export default OrdImport;