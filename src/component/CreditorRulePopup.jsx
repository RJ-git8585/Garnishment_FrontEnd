import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { API_URLS } from "../configration/apis";
import Swal from "sweetalert2";

const CreditorRulePopup = ({ open, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    state: '',
    description: '',
    deduction_basis: '',
    withholding_limit: ''
  });

  const states = [
    { name: 'Alabama' },
    { name: 'Alaska' },
    { name: 'Arizona' },
    { name: 'Arkansas' },
    { name: 'California' },
    { name: 'Colorado' },
    { name: 'Connecticut' },
    { name: 'Delaware' },
    { name: 'Florida' },
    { name: 'Georgia' },
    { name: 'Hawaii' },
    { name: 'Idaho' },
    { name: 'Illinois' },
    { name: 'Indiana' },
    { name: 'Iowa' },
    { name: 'Kansas' },
    { name: 'Kentucky' },
    { name: 'Louisiana' },
    { name: 'Maine' },
    { name: 'Maryland' },
    { name: 'Massachusetts' },
    { name: 'Michigan' },
    { name: 'Minnesota' },
    { name: 'Mississippi' },
    { name: 'Missouri' },
    { name: 'Montana' },
    { name: 'Nebraska' },
    { name: 'Nevada' },
    { name: 'New Hampshire' },
    { name: 'New Jersey' },
    { name: 'New Mexico' },
    { name: 'New York' },
    { name: 'North Carolina' },
    { name: 'North Dakota' },
    { name: 'Ohio' },
    { name: 'Oklahoma' },
    { name: 'Oregon' },
    { name: 'Pennsylvania' },
    { name: 'Rhode Island' },
    { name: 'South Carolina' },
    { name: 'South Dakota' },
    { name: 'Tennessee' },
    { name: 'Texas' },
    { name: 'Utah' },
    { name: 'Vermont' },
    { name: 'Virginia' },
    { name: 'Washington' },
    { name: 'West Virginia' },
    { name: 'Wisconsin' },
    { name: 'Wyoming' }
  ].sort((a, b) => a.name.localeCompare(b.name));

  const deductionOptions = [
    { value: 'disposable earnings', label: 'Disposable Earnings' },
    { value: 'gross pay', label: 'Gross Pay' },
    { value: 'net pay', label: 'Net Pay' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Creditor Rule Edit Request</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            select
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            {states.map((state) => (
              <MenuItem key={state.name} value={state.name}>
                {state.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={3}
            placeholder="e.g., 25% of Gross Income"
          />

          <TextField
            select
            fullWidth
            label="Deduction Basis"
            name="deduction_basis"
            value={formData.deduction_basis}
            onChange={handleChange}
            required
          >
            {deductionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Withholding Limit (%)"
            name="withholding_limit"
            value={formData.withholding_limit}
            onChange={handleChange}
            required
            type="number"
            inputProps={{ min: 0, max: 100 }}
          />
        </div>
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
          disabled={!formData.state || !formData.description || !formData.deduction_basis || !formData.withholding_limit}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditorRulePopup; 