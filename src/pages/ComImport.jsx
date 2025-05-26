

/**
 * ComImport Component
 * 
 * This component provides a form for uploading company-related files and submitting them to the server.
 * It includes file upload functionality, employer ID input, and displays success or error messages based on the server response.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Company Upload Form component.
 * 
 * @example
 * <ComImport />
 * 
 * @dependencies
 * - React hooks: useState
 * - Material-UI components: Button, Box, Grid, Input, Typography, CircularProgress
 * - Custom components: Headertop, Sidebar
 * - Configuration: BASE_URL from '../configration/Config'
 * 
 * @state
 * - {string} empID - The employer ID entered by the user.
 * - {File|null} upload - The file selected for upload.
 * - {boolean} loading - Indicates whether the form submission is in progress.
 * - {string} error - Error message to display if the submission fails.
 * - {string} success - Success message to display if the submission succeeds.
 * 
 * @functions
 * - handleReset: Resets the form fields and messages.
 * - handleSubmit: Handles form submission, validates input, sends the file and employer ID to the server, and manages success/error states.
 * 
 * @styles
 * - Uses Material-UI's `sx` prop for styling components.
 * 
 * @notes
 * - The file input accepts `.csv`, `.pdf`, `.doc`, and `.docx` file types.
 * - Displays a loading spinner on the submit button while the form is being processed.
 * - Error and success messages are displayed conditionally based on the state.
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
import Headertop from '../component/Headertop';
import Sidebar from '../component/Sidebar';

function ComImport() {
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
      const response = await fetch(`${BASE_URL}/User/upsert-company-details/`, {
        method: 'POST',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to upload the file. Please try again.');
      }

      const data = await response.json();
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
      <div className="container main ml-auto">
        <div className="sidebar hidden lg:block">
          <Sidebar />
        </div>
        <div className="content ml-auto">
          <Headertop />
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
               Company Upload Form
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
      </div>
    </div>
  );
}

export default ComImport;