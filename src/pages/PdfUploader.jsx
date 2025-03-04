import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Box, Typography, Grid } from "@mui/material";

// ✅ Set workerSrc to avoid errors
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
      extractTextFromPdf(fileUrl);
    } else {
      alert("Please upload a valid PDF file.");
      setPdfFile(null);
      setPdfUrl(null);
    }
  };

  const extractTextFromPdf = async (fileUrl) => {
    const loadingTask = pdfjs.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += `\nPage ${pageNum}:\n${pageText}\n`;
    }

    setExtractedText(fullText);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload & Extract Text from PDF
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

        {/* Extracted Text Section */}
        <Grid item xs={12}>
          <Typography variant="h6">Extracted Text:</Typography>
          <Box sx={{ p: 2, border: "1px solid #ccc", minHeight: "100px", maxHeight: "300px", overflow: "auto" }}>
            {extractedText ? extractedText : "No text extracted yet."}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PdfUploader;
