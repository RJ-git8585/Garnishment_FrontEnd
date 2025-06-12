/**
 * EditRulePopup Component
 *
 * A React component that renders a popup dialog for editing a rule. It allows users to modify
 * the "Rule", "Deduction Basis" and "Withholding Limit (%)" fields, while the "State" field is read-only.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {boolean} props.open - A boolean indicating whether the dialog is open.
 * @param {Function} props.handleClose - A function to handle closing the dialog.
 * @param {Object} props.ruleData - The data of the rule to be edited.
 * @param {string} props.ruleData.state - The state associated with the rule.
 * @param {string} props.ruleData.rule - The rule description.
 * @param {string} props.ruleData.deduction_basis - The current "Deduction Basis" value of the rule.
 * @param {string} props.ruleData.withholding_limit - The current withholding limit percentage of the rule.
 * @param {Function} props.handleSave - A function to handle saving the updated rule data.
 *
 * @returns {JSX.Element} The rendered EditRulePopup component.
 */
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { sanitizeString } from "../utils/sanitizeData"; // Import the sanitize function
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

const deductionBasisOptions = [
  { value: "disposable earning", label: "Disposable Earning" },
  { value: "gross pay", label: "Gross Pay" },
  { value: "net pay", label: "Net Pay" },
];

function EditRulePopup({ open, handleClose, ruleData, handleSave }) {
  const [formData, setFormData] = useState({
    state: "",
    rule: "",
    deduction_basis: "",
    withholding_limit: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ruleData) {
      console.log("Rule Data:", ruleData); // Debugging log
      const matchedOption = deductionBasisOptions.find(
        (option) =>
          sanitizeString(option.value.toLowerCase()) === sanitizeString(ruleData.deduction_basis?.toLowerCase())
      );

      // Extract numeric value from withholding_limit if it has a % symbol
      const withholding_limit = ruleData.withholding_limit?.toString().replace('%', '') || "";

      setFormData({
        state: sanitizeString(ruleData.state) || "",
        rule: ruleData.rule || "", // Don't sanitize rule as it might contain special characters
        deduction_basis: matchedOption ? matchedOption.value : "",
        withholding_limit: withholding_limit,
      });
    }
  }, [ruleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rule') {
      // Don't sanitize rule field
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: sanitizeString(value) }));
    }
  };

  const validateForm = () => {
    const { rule, state, deduction_basis, withholding_limit } = formData;
    if (!rule.trim() || !state.trim() || !deduction_basis || !withholding_limit) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields are required. Please fill out the form completely.",
        ...swalConfig
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
        title: 'Confirm Rule Changes',
        html: `
          <div class="text-left">
            <p class="mb-2">Please review the following changes:</p>
            <ul class="list-disc pl-5">
              <li><strong>State:</strong> ${formData.state}</li>
              <li><strong>Rule:</strong> ${formData.rule}</li>
              <li><strong>Deduction Basis:</strong> ${formData.deduction_basis}</li>
              <li><strong>Withholding Limit:</strong> ${formData.withholding_limit}%</li>
            </ul>
            <p class="mt-4 text-sm text-gray-600">
              Are you sure you want to save these changes?
            </p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save Changes',
        cancelButtonText: 'No, Review Changes',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        ...swalConfig
      });

      if (confirmResult.isConfirmed) {
        setLoading(true);
        
        // Create the API URL with the state parameter
        const stateParam = formData.state.toLowerCase();
        const apiUrl = `${API_URLS.UPDATE_STATE_TAX_RULE}${stateParam}/`;

        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: formData.state,
            withholding_limit_rule: formData.rule,
            deduction_basis: formData.deduction_basis,
            withholding_limit: formData.withholding_limit
          }),
        });

        if (response.ok) {
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Rule updated successfully. The page will now reload.",
            ...swalConfig
          }).then(() => {
            handleClose(); // Close the dialog
            window.location.reload(); // Reload the page to reflect changes
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update rule.");
        }
      }
    } catch (error) {
      console.error("Error updating rule:", error);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "An error occurred while updating the rule. Please try again later.",
        ...swalConfig
      });
    } finally {
      setLoading(false);
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
      <DialogTitle>Edit Rule</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="State"
            name="state"
            value={formData.state ? formData.state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''}
            InputProps={{ 
              readOnly: true,
              className: 'capitalize'
            }}
            variant="outlined"
            inputProps={{
              'data-original-value': formData.state // Store original lowercase value
            }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Rule"
            name="rule"
            value={formData.rule}
            onChange={handleChange}
            variant="outlined"
            placeholder="e.g., 25% of Gross Income"
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Deduction Basis</InputLabel>
          <Select
            name="deduction_basis"
            value={formData.deduction_basis || ""}
            onChange={handleChange}
            label="Deduction Basis"
            MenuProps={menuProps}
          >
            <MenuItem value="">Select an option</MenuItem>
            {deductionBasisOptions.map((option) => (
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
          color="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRulePopup;
