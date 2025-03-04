import { useState } from "react";
import { TextField, Button, Box, Grid, Input, Typography, CircularProgress } from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
// import { pdfjs } from "react-pdf"; // Import PDF.js

import Headertop from "../component/Headertop";
import Sidebar from "../component/sidebar";

import { pdfjs } from "react-pdf";


// Set the worker source manually (ensure correct path)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";




function Iwo() {
  const [empID, setEmpID] = useState("");
  const [upload, setUploadFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setEmpID("");
    setUploadFile(null);
    setPdfUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      if (file.type === "application/pdf") {
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
      } else {
        setPdfUrl(null);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", { empID, fileName: upload?.name });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
                {/* File Upload */}
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload IWO Here:
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Input
                      type="file"
                      inputProps={{ accept: ".pdf" }}
                      onChange={handleFileChange}
                      sx={{ display: "none" }}
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

                {/* Employer ID Field (Hidden) */}
                <Grid item xs={12}>
                  <TextField
                    id="employer_id"
                    name="employer_id"
                    value={empID}
                    type="hidden"
                    variant="outlined"
                    fullWidth
                    sx={{ display: "none" }}
                  />
                </Grid>

                {/* PDF Preview */}
                <Grid item xs={6} sx={{ display: pdfUrl ? "block" : "none" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    PDF Preview:
                  </Typography>
                  {pdfUrl && (
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        height: "500px",
                        overflow: "auto",
                      }}
                    >
                    <Worker workerUrl={pdfjs.GlobalWorkerOptions.workerSrc}>
                      <Viewer fileUrl={pdfUrl} />
                  </Worker>

                    </Box>
                  )}
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ width: "150px" }}>
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
                    </Button>
                    <Button type="reset" variant="outlined" color="secondary" onClick={handleReset} sx={{ width: "150px" }}>
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
