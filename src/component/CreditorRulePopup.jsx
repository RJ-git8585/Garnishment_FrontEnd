import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const CreditorRulePopup = ({ open, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    state: '',
    rule: '',
    deduction_basis: '',
    withholding_limit: '',
    comments: ''
  });

  const states = [
    { abbr: 'AL', name: 'Alabama' },
    { abbr: 'AK', name: 'Alaska' },
    { abbr: 'AZ', name: 'Arizona' },
    { abbr: 'AR', name: 'Arkansas' },
    { abbr: 'CA', name: 'California' },
    { abbr: 'CO', name: 'Colorado' },
    { abbr: 'CT', name: 'Connecticut' },
    { abbr: 'DE', name: 'Delaware' },
    { abbr: 'FL', name: 'Florida' },
    { abbr: 'GA', name: 'Georgia' },
    { abbr: 'HI', name: 'Hawaii' },
    { abbr: 'ID', name: 'Idaho' },
    { abbr: 'IL', name: 'Illinois' },
    { abbr: 'IN', name: 'Indiana' },
    { abbr: 'IA', name: 'Iowa' },
    { abbr: 'KS', name: 'Kansas' },
    { abbr: 'KY', name: 'Kentucky' },
    { abbr: 'LA', name: 'Louisiana' },
    { abbr: 'ME', name: 'Maine' },
    { abbr: 'MD', name: 'Maryland' },
    { abbr: 'MA', name: 'Massachusetts' },
    { abbr: 'MI', name: 'Michigan' },
    { abbr: 'MN', name: 'Minnesota' },
    { abbr: 'MS', name: 'Mississippi' },
    { abbr: 'MO', name: 'Missouri' },
    { abbr: 'MT', name: 'Montana' },
    { abbr: 'NE', name: 'Nebraska' },
    { abbr: 'NV', name: 'Nevada' },
    { abbr: 'NH', name: 'New Hampshire' },
    { abbr: 'NJ', name: 'New Jersey' },
    { abbr: 'NM', name: 'New Mexico' },
    { abbr: 'NY', name: 'New York' },
    { abbr: 'NC', name: 'North Carolina' },
    { abbr: 'ND', name: 'North Dakota' },
    { abbr: 'OH', name: 'Ohio' },
    { abbr: 'OK', name: 'Oklahoma' },
    { abbr: 'OR', name: 'Oregon' },
    { abbr: 'PA', name: 'Pennsylvania' },
    { abbr: 'RI', name: 'Rhode Island' },
    { abbr: 'SC', name: 'South Carolina' },
    { abbr: 'SD', name: 'South Dakota' },
    { abbr: 'TN', name: 'Tennessee' },
    { abbr: 'TX', name: 'Texas' },
    { abbr: 'UT', name: 'Utah' },
    { abbr: 'VT', name: 'Vermont' },
    { abbr: 'VA', name: 'Virginia' },
    { abbr: 'WA', name: 'Washington' },
    { abbr: 'WV', name: 'West Virginia' },
    { abbr: 'WI', name: 'Wisconsin' },
    { abbr: 'WY', name: 'Wyoming' }
  ].sort((a, b) => a.name.localeCompare(b.name)); // Sort by full state name

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    handleSave(formData);
    handleClose();
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
              <MenuItem key={state.abbr} value={state.abbr}>
                {state.name} ({state.abbr})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Rule"
            name="rule"
            value={formData.rule}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Deduction Basis"
            name="deduction_basis"
            value={formData.deduction_basis}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Withholding Limit"
            name="withholding_limit"
            value={formData.withholding_limit}
            onChange={handleChange}
            required
            type="number"
          />

          <TextField
            fullWidth
            label="Comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!formData.state || !formData.rule || !formData.deduction_basis || !formData.withholding_limit || !formData.comments}
        >
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditorRulePopup; 