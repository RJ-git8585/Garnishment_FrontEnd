import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { StateList } from "../constants/Constant"; // Import state list
import { BASE_URL } from "../configration/Config"; // Import BASE_URL for API calls
import Swal from "sweetalert2"; // Import Swal for notifications

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

  const validateForm = () => {
    const { state, description, deduct_from, withholding_limit_percent } = formData;
    if (!state || !description || !deduct_from || !withholding_limit_percent) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields are required. Please fill out the form completely.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`${BASE_URL}/User/state-tax-levy-rule-edit-request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Request is submitted successfully.",
        });
        handleSave(formData); // Call the parent save handler
        handleClose(); // Close the popup
      } else {
        throw new Error("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting the form. Please try again later.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Request State Tax Rule Change</DialogTitle>
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
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          style={{
            backgroundColor: "red",
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