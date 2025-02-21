import { useState } from "react";
import { 
  TextField, FormControlLabel, 
  Checkbox, Button, Grid, Typography, Paper, Divider 
} from "@mui/material";
import Headertop from "../component/Headertop";
import Sidebar from "../component/sidebar";

const CaseRegistrationForm = () => {
  const [formData, setFormData] = useState({
    caseID: "",
    eeID: "",
    fein: "",
    issuingState: "",
    garnishmentType: "",
    orderedAmount: "",
    payPeriod: "",
    arrear: "",
    arrearPayPeriod: "",
    arrearsGreaterThan12Weeks: false,
    currentMedicalSupport: "",
    medicalSupportPayPeriod: "",
    pastDueMedicalSupport: "",
    pastDueMedicalSupportPayPeriod: "",
    currentSpousalSupport: "",
    spousalSupportPayPeriod: "",
    pastDueSpousalSupport: "",
    pastDueSpousalSupportPayPeriod: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  const handleReset = () => {
    setFormData({
      caseID: "",
      eeID: "",
      fein: "",
      issuingState: "",
      garnishmentType: "",
      orderedAmount: "",
      payPeriod: "",
      arrear: "",
      arrearPayPeriod: "",
      arrearsGreaterThan12Weeks: false,
      currentMedicalSupport: "",
      medicalSupportPayPeriod: "",
      pastDueMedicalSupport: "",
      pastDueMedicalSupportPayPeriod: "",
      currentSpousalSupport: "",
      spousalSupportPayPeriod: "",
      pastDueSpousalSupport: "",
      pastDueSpousalSupportPayPeriod: "",
    });
  };

  return (
    <>  
      <div className="min-h-full">
      <div className="container main ml-auto">
        <Sidebar className="sidebar hidden lg:block" />
        <div className="content ml-auto flex flex-col">
          <Headertop />
          <hr />
          <Divider sx={{ my: 2 }} />
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Case Registration
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Case Info Section */}
                <Grid item xs={12}>
                  <Typography variant="h6">Case Info</Typography>
                </Grid>

                {["caseID", "eeID", "fein", "issuingState", "garnishmentType"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      required
                      label={field.replace(/([A-Z])/g, " $1").trim()} // Formats label dynamically
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </Grid>
                ))}

                {/* Ordered Amount Section */}
                <Grid item xs={12}>
                  <Typography variant="h6">Ordered Amount</Typography>
                </Grid>

                {["orderedAmount", "payPeriod", "arrear", "arrearPayPeriod"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={field.replace(/([A-Z])/g, " $1").trim()}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </Grid>
                ))}

                {/* Checkbox for Arrears */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="arrearsGreaterThan12Weeks"
                        checked={formData.arrearsGreaterThan12Weeks}
                        onChange={handleChange}
                      />
                    }
                    label="Arrears Greater Than 12 Weeks"
                  />
                </Grid>

                {/* Medical Support Section */}
                <Grid item xs={12}>
                  <Typography variant="h6">Medical Support</Typography>
                </Grid>

                {["currentMedicalSupport", "medicalSupportPayPeriod", "pastDueMedicalSupport", "pastDueMedicalSupportPayPeriod"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={field.replace(/([A-Z])/g, " $1").trim()}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </Grid>
                ))}

                {/* Spousal Support Section */}
                <Grid item xs={12}>
                  <Typography variant="h6">Spousal Support</Typography>
                </Grid>

                {["currentSpousalSupport", "spousalSupportPayPeriod", "pastDueSpousalSupport", "pastDueSpousalSupportPayPeriod"].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={field.replace(/([A-Z])/g, " $1").trim()}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </Grid>
                ))}

                {/* Buttons */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                    Submit
                  </Button>
                  <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </div>
     
    </div>
    </div>

    </>

  );
};

export default CaseRegistrationForm;
