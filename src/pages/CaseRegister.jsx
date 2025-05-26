
/**
 * CaseRegistrationForm Component
 *
 * This component renders a form for case registration, allowing users to input
 * various details related to a case, such as case ID, employee ID, garnishment type,
 * ordered amounts, and support details. It also includes functionality to reset the form
 * and submit the data.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered CaseRegistrationForm component.
 *
 * @example
 * <CaseRegistrationForm />
 *
 * State:
 * - `formData` (object): Holds the form data for all input fields.
 *   - `caseID` (string): Case ID.
 *   - `eeID` (string): Employee ID.
 *   - `fein` (string): Federal Employer Identification Number.
 *   - `issuingState` (string): State issuing the garnishment.
 *   - `garnishmentType` (string): Type of garnishment.
 *   - `orderedAmount` (string): Ordered amount for garnishment.
 *   - `payPeriod` (string): Pay period for garnishment.
 *   - `arrear` (string): Arrear amount.
 *   - `arrearPayPeriod` (string): Pay period for arrears.
 *   - `arrearsGreaterThan12Weeks` (boolean): Indicates if arrears exceed 12 weeks.
 *   - `currentMedicalSupport` (string): Current medical support amount.
 *   - `medicalSupportPayPeriod` (string): Pay period for medical support.
 *   - `pastDueMedicalSupport` (string): Past due medical support amount.
 *   - `pastDueMedicalSupportPayPeriod` (string): Pay period for past due medical support.
 *   - `currentSpousalSupport` (string): Current spousal support amount.
 *   - `spousalSupportPayPeriod` (string): Pay period for spousal support.
 *   - `pastDueSpousalSupport` (string): Past due spousal support amount.
 *   - `pastDueSpousalSupportPayPeriod` (string): Pay period for past due spousal support.
 *
 * Handlers:
 * - `handleChange`: Updates the `formData` state when an input field changes.
 * - `handleSubmit`: Handles form submission and logs the form data.
 * - `handleReset`: Resets the form to its initial state.
 *
 * Dependencies:
 * - `@mui/material`: Used for UI components like TextField, Button, Grid, Typography, Paper, Divider, and Checkbox.
 * - `Headertop`: Custom component for the header section.
 * - `Sidebar`: Custom component for the sidebar navigation.
 */
import { useState } from "react";
import { 
  TextField, FormControlLabel, 
  Checkbox, Button, Grid, Typography, Paper, Divider 
} from "@mui/material";
import Headertop from "../component/Headertop";
import Sidebar from "../component/Sidebar";

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
