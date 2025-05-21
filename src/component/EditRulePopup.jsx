import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { sanitizeString } from "../utils/sanitizeData"; // Import the sanitize function

const deductFromOptions = [
  { value: "disposable earning", label: "Disposable Earning" },
  { value: "gross pay", label: "Gross Pay" },
  { value: "net pay", label: "Net Pay" },
];

function EditRulePopup({ open, handleClose, ruleData, handleSave }) {
  const [formData, setFormData] = useState({
    state: "",
    deduct_from: "",
    withholding_limit_percent: "",
  });

  useEffect(() => {
    if (ruleData) {
      const matchedOption = deductFromOptions.find(
        (option) =>
          sanitizeString(option.value.toLowerCase()) === sanitizeString(ruleData.deduct_from?.toLowerCase())
      );
      setFormData({
        state: sanitizeString(ruleData.state) || "",
        deduct_from: matchedOption ? matchedOption.value : "",
        withholding_limit_percent: sanitizeString(ruleData.withholding_limit_percent) || "",
      });
    }
  }, [ruleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeString(value) }));
  };

  const handleSubmit = () => {
    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Rule</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="State"
            name="state"
            value={formData.state}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Deduct From</InputLabel>
          <Select
            name="deduct_from"
            value={formData.deduct_from || ""}
            onChange={handleChange}
            label="Deduct From"
          >
            <MenuItem value="">Select an option</MenuItem>
            {deductFromOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Withholding Limit (%)"
            name="withholding_limit_percent"
            type="number"
            value={formData.withholding_limit_percent}
            onChange={handleChange}
            variant="outlined"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRulePopup;
