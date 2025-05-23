

/**
 * EmpImport Component
 * 
 * This component provides a form for uploading employee details via a file. 
 * It allows users to upload a file, associate it with an employer ID, and submit the data to the server.
 * 
 * Features:
 * - File upload with support for `.csv`, `.pdf`, `.doc`, and `.docx` formats.
 * - Displays success or error messages based on the server response.
 * - Includes a reset button to clear the form.
 * - Shows a loading spinner during the file upload process.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Employee Upload Form component.
 * 
 * @example
 * <EmpImport />
 * 
 * State Variables:
 * - `empID` (string): Stores the employer ID entered by the user.
 * - `upload` (File | null): Stores the uploaded file object.
 * - `loading` (boolean): Indicates whether the file upload is in progress.
 * - `error` (string): Stores error messages to display to the user.
 * - `success` (string): Stores success messages to display to the user.
 * 
 * Functions:
 * - `handleReset`: Resets the form fields and clears error/success messages.
 * - `handleSubmit`: Handles the form submission, validates the input, and sends the file and employer ID to the server.
 * 
 * Dependencies:
 * - `@mui/material`: Used for UI components like Button, Box, Grid, Input, Typography, and CircularProgress.
 * - `BASE_URL`: The base URL for the API endpoint, imported from the configuration file.
 * - `Headertop` and `Sidebar`: Custom components for the page layout (not used in this specific code snippet).
 */
import { useState } from 'react';
import {

  Button,
  Box,
  Grid,
  Input,
  Typography,
  CircularProgress,
} from '@mui/material';
import { BASE_URL } from '../configration/Config';


function EmpImport() {
  const [empID, setEmpID] = useState('');
  const [upload, setuploadfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = () => {
    setEmpID('');
    setuploadfile(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!upload) {
      setError('Please upload a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', upload);
    formData.append('employer_id', empID);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
        // const id = sessionStorage.getItem("id");
      const response = await fetch(`${BASE_URL}/User/upsert-employees-details/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || 'Failed to upload the file. Please try again.');
      }

      setSuccess('File uploaded successfully and data imported.');
      console.log('Response from server:', data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
               Employee Upload Form
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* File Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload File Here:
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Input
                      type="file"
                      inputProps={{ accept: '.csv,.pdf,.doc,.docx' }}
                      onChange={(e) => setuploadfile(e.target.files[0])}
                      sx={{
                        display: 'none',
                      }}
                      id="upload-file"
                    />
                    <label htmlFor="upload-file">
                      <Button variant="contained" component="span">
                        upload File
                      </Button>
                    </label>
                    {upload && (
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {upload.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Error/Success Messages */}
                <Grid item xs={12}>
                  {error && <Typography color="error">{error}</Typography>}
                  {success && <Typography color="primary">{success}</Typography>}
                </Grid>

                {/* Submit and Reset Buttons */}
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
                        'Upload'
                      )}
                    </Button>
                    <Button
                      type="reset"
                      variant="outlined"
                      color="secondary"
                      onClick={handleReset}
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

export default EmpImport;