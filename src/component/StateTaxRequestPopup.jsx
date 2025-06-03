/**
 * StateTaxRequestPopup Component
 * 
 * This component renders a popup dialog for requesting a state tax rule change.
 * It includes a form with fields for selecting a state, providing a description,
 * choosing a deduction type, and specifying a withholding limit percentage.
 * 
 * Props:
 * @param {boolean} open - Determines whether the popup is open or closed.
 * @param {function} handleClose - Function to handle closing the popup.
 * @param {function} handleSave - Function to handle saving the form data.
 * 
 * State:
 * @typedef {Object} FormData
 * @property {string} state - The selected state.
 * @property {string} description - The description of the tax rule change.
 * @property {string} deduction_basis - The type of deduction (e.g., disposable earnings, gross pay, net pay).
 * @property {string} withholding_limit - The withholding limit percentage.
 * 
 * @param {FormData} formData - The state object holding form data.
 * 
 * Functions:
 * @function handleChange - Updates the form data state when a field value changes.
 * @param {Object} e - The event object from the input field.
 * 
 * @function validateForm - Validates the form fields to ensure all required fields are filled.
 * @returns {boolean} - Returns true if the form is valid, otherwise false.
 * 
 * @function handleSubmit - Submits the form data to the server via an API call.
 * If successful, it displays a success notification, calls the parent save handler,
 * and closes the popup. If unsuccessful, it displays an error notification.
 * 
 * Dependencies:
 * - React (useState)
 * - Material-UI components: Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem
 * - StateList (imported from "../constants/Constant")
 * - API_URLS (imported from "../configration/apis")
 * - Swal (imported from "sweetalert2" for notifications)
 * 
 * Usage:
 * <StateTaxRequestPopup open={open} handleClose={handleClose} handleSave={handleSave} />
 */
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { StateList } from "../constants/Constant";
import { API_URLS } from "../configration/apis";
import Swal from "sweetalert2";

const deductFromOptions = [
  { value: "disposable earnings", label: "Disposable Earnings" },
  { value: "gross pay", label: "Gross Pay" },
  { value: "net pay", label: "Net Pay" },
];

function StateTaxRequestPopup({ open, handleClose, handleSave }) {
  const [formData, setFormData] = useState({
    state: "",
    description: "",
    deduction_basis: "",
    withholding_limit: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { state, description, deduction_basis, withholding_limit } = formData;
    if (!state || !description || !deduction_basis || !withholding_limit) {
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
      const response = await fetch(API_URLS.CREDITOR_RULE_EDIT_REQUEST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: formData.state,
          description: formData.description,
          deduction_basis: formData.deduction_basis,
          withholding_limit: formData.withholding_limit
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Request is submitted successfully.",
        });
        handleSave(formData);
        handleClose();
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
            placeholder="e.g., 25% of Gross Income"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Deduction Basis</InputLabel>
          <Select
            name="deduction_basis"
            value={formData.deduction_basis}
            onChange={handleChange}
            label="Deduction Basis"
          >
            <MenuItem value="">Select deduction basis</MenuItem>
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
            name="withholding_limit"
            type="number"
            value={formData.withholding_limit}
            onChange={handleChange}
            variant="outlined"
            inputProps={{ min: 0, max: 100 }}
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

export default StateTaxRequestPopup;