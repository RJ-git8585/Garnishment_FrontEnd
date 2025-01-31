import  { useState } from 'react';
import { TextField, Button, Box, Grid, Input, Typography, CircularProgress } from '@mui/material';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';

function Iwo() {
  const [empID, setEmpID] = useState('');
  const [upload, setuploadfile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setEmpID('');
    setuploadfile('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', {
      empID,
      upload
    });
    setLoading(true); // Set loading state while submitting
    setTimeout(() => {
      setLoading(false); // Simulate loading
    }, 2000); // Simulate a 2-second loading process
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
              IWO Upload Form
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* File Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload IWO Here:
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Input
                      type="file"
                      inputProps={{ accept: '.csv,.pdf,.doc,.docx' }}
                      onChange={(e) => setuploadfile(e.target.files[0])}
                      sx={{
                        display: 'none'
                      }}
                      id="upload-file"
                    />
                    <label htmlFor="upload-file">
                      <Button variant="contained" component="span">
                        Choose File
                      </Button>
                    </label>
                    {upload && (
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {upload.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Hidden Employer ID Field (keep it for later use if needed) */}
                <Grid item xs={12}>
                  <TextField
                    id="employer_id"
                    name="employer_id"
                    value={empID}
                    type="hidden"
                    variant="outlined"
                    fullWidth
                    sx={{ display: 'none' }}
                  />
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
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
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

export default Iwo;
