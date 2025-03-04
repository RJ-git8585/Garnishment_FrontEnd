import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Box, Typography, Grid } from "@mui/material";

// ✅ Set workerSrc to avoid errors
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid PDF file.");
      setPdfFile(null);
      setPdfUrl(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload & Preview PDF
      </Typography>

      <Grid container spacing={2}>
        {/* Left Side - Upload */}
        <Grid item xs={12} md={6}>
          <Button variant="contained" component="label">
            Upload PDF
            <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
          </Button>
          {pdfFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {pdfFile.name}
            </Typography>
          )}
        </Grid>

        {/* Right Side - PDF Preview */}
        <Grid item xs={12} md={6}>
          {pdfUrl ? (
            <Box sx={{ border: "1px solid #ccc", height: "500px", overflow: "auto" }}>
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No PDF selected. Upload a file to preview.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PdfUploader;
