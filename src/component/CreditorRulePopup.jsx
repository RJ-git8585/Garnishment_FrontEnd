import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControl } from '@mui/material';
import { API_URLS } from "../configration/apis";
import Swal from "sweetalert2";

const swalStyles = document.createElement('style');
swalStyles.textContent = `
  .custom-swal-container {
    z-index: 999999 !important;
  }
  .custom-swal-popup {
    z-index: 999999 !important;
  }
  .swal2-container {
    z-index: 999999 !important;
  }
  .swal2-popup {
    z-index: 999999 !important;
  }
`;
document.head.appendChild(swalStyles);

const swalConfig = {
  customClass: {
    container: 'custom-swal-container',
    popup: 'custom-swal-popup'
  },
  backdrop: 'rgba(0,0,0,0.7)',
  allowOutsideClick: false
};

const CreditorRulePopup = ({ open, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    state: '',
    description: '',
    deduction_basis: '',
    withholding_limit: '',
    current_rule: ''
  });

  const [loading, setLoading] = useState(false);

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'state' && value) {
      const stateValue = value.toLowerCase();
      setLoading(true);
      try {
        const response = await fetch(`${API_URLS.GET_CREDITOR_RULES}${stateValue}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch rule data');
        }
        const result = await response.json();
        
        if (result.data) {
          const currentRule = result.data;
          setFormData(prev => ({
            ...prev,
            current_rule: currentRule.rule || 'No rule defined !!',
            deduction_basis: currentRule.deduction_basis || '',
            withholding_limit: currentRule.withholding_limit || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching rule:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch current rule data'
        });
        setFormData(prev => ({
          ...prev,
          current_rule: 'Failed to load current rule'
        }));
      } finally {
        setLoading(false);
      }
    }
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
    try {
      const confirmResult = await Swal.fire({
        title: 'Confirm Rule Change Request',
        html: `
          <div class="text-left">
            <p class="mb-2">Please review the following changes:</p>
            <ul class="list-disc pl-5">
              <li><strong>State:</strong> ${formData.state}</li>
              <li><strong>Current Rule:</strong> ${formData.current_rule || 'No rule defined'}</li>
              <li><strong>New Rule Description:</strong> ${formData.description}</li>
              <li><strong>Deduction Basis:</strong> ${formData.deduction_basis}</li>
              <li><strong>Withholding Limit:</strong> ${formData.withholding_limit}%</li>
            </ul>
            <p class="mt-4 text-sm text-gray-600">
              Are you sure you want to submit this rule change request?
            </p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Submit Request',
        cancelButtonText: 'No, Review Changes',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        ...swalConfig
      });

      if (confirmResult.isConfirmed) {
        const response = await fetch(API_URLS.CREDITOR_RULE_EDIT_REQUEST, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit the form.");
        }

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          html: `
            <div class="text-center">
              <p>The rule change request has been submitted successfully.</p>
            </div>
          `,
          confirmButtonText: 'Close',
          confirmButtonColor: '#3085d6',
          ...swalConfig
        });

        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.message || "An error occurred while submitting the form. Please try again later.",
        ...swalConfig
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Creditor Rule Edit Request</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <FormControl fullWidth margin="normal">
            <TextField
              select
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {states.map((state) => (
                <MenuItem key={state.name} value={state.name}>
                  {state.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Current Rule"
              value={formData.current_rule || 'No rule defined'}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              multiline
              rows={2}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="New Rule Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={3}
              variant="outlined"
              placeholder="e.g., 25% of Gross Income"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
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
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Withholding Limit (%)"
              name="withholding_limit"
              value={formData.withholding_limit}
              onChange={handleChange}
              required
              type="number"
              variant="outlined"
              inputProps={{ min: 0, max: 100 }}
            />
          </FormControl>
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
          disabled={loading || !formData.state || !formData.description || !formData.deduction_basis || !formData.withholding_limit}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditorRulePopup; 