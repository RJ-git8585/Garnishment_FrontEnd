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

// Add custom styles for proper layering
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
  .custom-dialog {
    z-index: 1400;
  }
  div[role='presentation'].MuiModal-root {
    z-index: 99999 !important;
  }
  .MuiPopover-root {
    z-index: 99999 !important;
  }
  .MuiMenu-paper {
    z-index: 99999 !important;
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

const menuProps = {
  PaperProps: {
    style: {
      zIndex: 99999,
    },
  },
  sx: {
    zIndex: 99999,
    '& .MuiMenu-paper': {
      zIndex: 99999,
    },
    '& .MuiPopover-paper': {
      zIndex: 99999,
    },
  },
  MenuListProps: {
    style: {
      zIndex: 99999,
    },
  },
  PopoverClasses: {
    root: 'MuiPopover-root'
  }
};

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
    withholding_limit: "",
    current_rule: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'state' && value) {
      setLoading(true);
      try {
        // Convert state name to lowercase for API call
        const stateValue = value.toLowerCase();
        const response = await fetch(`${API_URLS.GET_STATE_TAX_RULES}${stateValue}`);
        if (!response.ok) {
          throw new Error('Failed to fetch rule data');
        }
        const result = await response.json();
        
        if (result.data) {
          const currentRule = result.data;
          setFormData(prev => ({
            ...prev,
            current_rule: currentRule.withholding_limit_rule || 'No rule defined',
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
    if (!validateForm()) return;

    try {
      // Show confirmation dialog first
      const confirmResult = await Swal.fire({
        title: 'Confirm Rule Change Request',
        html: `
          <div class="text-left">
            <p class="mb-2">Please review the following changes:</p>
            <ul class="list-disc pl-5">
              <li><strong>State:</strong> ${formData.state}</li>
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
        const response = await fetch(API_URLS.STATE_TAX_RULE_EDIT_REQUEST, {
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
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Request is submitted successfully.",
            ...swalConfig
          });
          handleSave(formData);
          handleClose();
        } else {
          throw new Error("Failed to submit the form.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting the form. Please try again later.",
        ...swalConfig
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      className="custom-dialog"
      sx={{
        '& .MuiDialog-paper': {
          position: 'relative',
          zIndex: 1400
        }
      }}
    >
      <DialogTitle>Request State Tax Rule Change</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>State</InputLabel>
          <Select
            name="state"
            value={formData.state}
            onChange={handleChange}
            label="State"
            disabled={loading}
            MenuProps={menuProps}
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
            MenuProps={menuProps}
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
          disabled={loading}
        >
          Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StateTaxRequestPopup;