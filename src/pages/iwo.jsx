import { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, CircularProgress } from '@mui/material';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import PdfUploader from './PdfUploader'; // Import the new component

function Iwo() {
  const [empID, setEmpID] = useState('');
  const [upload, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file) => {
    setUploadFile(file);
  };

  const handleReset = () => {
    setEmpID('');
    setUploadFile(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', { empID, upload });

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              IWO Upload Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <PdfUploader onFileSelect={handleFileSelect} /> {/* Reusable component */}
                </Grid>

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

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading || !upload}
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
       </>
  );
}

export default Iwo;
