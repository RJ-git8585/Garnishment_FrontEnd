import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { StateList } from "../Constant"; // Import state list

const deductFromOptions = [
  { value: "disposable earnings", label: "Disposable Earnings" },
  { value: "gross pay", label: "Gross Pay" },
  { value: "net pay", label: "Net Pay" },
];

function StateTaxPopup({ open, handleClose, handleSave }) {
  const [formData, setFormData] = useState({
    state: "",
    description: "",
    deduct_from: "",
    withholding_limit_percent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>State Tax Rule</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>State</InputLabel>
          <Select
            name="state"
            value={formData.state}
            onChange={handleChange}
            label="State"
          >
            <MenuItem value="">Select a state</MenuItem>
            {StateList.map((state) => (
              <MenuItem key={state.id} value={state.label}>
                {state.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Deduct From</InputLabel>
          <Select
            name="deduct_from"
            value={formData.deduct_from}
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
        <Button
          onClick={handleClose}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          style={{
            backgroundColor: "red", // Light pink color
            color: "white",
          }}
        >
          Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StateTaxPopup;
