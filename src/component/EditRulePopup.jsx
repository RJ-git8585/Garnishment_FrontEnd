/**
 * EditRulePopup Component
 *
 * A React component that renders a popup dialog for editing a rule. It allows users to modify
 * the "Deduction Basis" and "Withholding Limit (%)" fields, while the "State" field is read-only.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {boolean} props.open - A boolean indicating whether the dialog is open.
 * @param {Function} props.handleClose - A function to handle closing the dialog.
 * @param {Object} props.ruleData - The data of the rule to be edited.
 * @param {string} props.ruleData.state - The state associated with the rule.
 * @param {string} props.ruleData.deduction_basis - The current "Deduction Basis" value of the rule.
 * @param {string} props.ruleData.withholding_limit_percent - The current withholding limit percentage of the rule.
 * @param {Function} props.handleSave - A function to handle saving the updated rule data.
 *
 * @returns {JSX.Element} The rendered EditRulePopup component.
 */
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { sanitizeString } from "../utils/sanitizeData"; // Import the sanitize function

const deductionBasisOptions = [
  { value: "disposable earning", label: "Disposable Earning" },
  { value: "gross pay", label: "Gross Pay" },
  { value: "net pay", label: "Net Pay" },
];

function EditRulePopup({ open, handleClose, ruleData, handleSave }) {
  const [formData, setFormData] = useState({
    state: "",
    deduction_basis: "",
    withholding_limit: "",
  });

  useEffect(() => {
    if (ruleData) {
      console.log("Rule Data:", ruleData); // Debugging log
      const matchedOption = deductionBasisOptions.find(
        (option) =>
          sanitizeString(option.value.toLowerCase()) === sanitizeString(ruleData.deduction_basis?.toLowerCase())
      );
      setFormData({
        state: sanitizeString(ruleData.state) || "",
        deduction_basis: matchedOption ? matchedOption.value : "",
        withholding_limit: sanitizeString(ruleData.withholding_limit) || "",
      });
    }
  }, [ruleData]); // Re-run when `ruleData` changes

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
          <InputLabel>Deduction Basis</InputLabel>
          <Select
            name="deduction_basis"
            value={formData.deduction_basis || ""}
            onChange={handleChange}
            label="Deduction Basis"
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
