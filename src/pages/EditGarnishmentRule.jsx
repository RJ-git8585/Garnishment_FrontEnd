/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { BASE_URL } from "../Config";

function EditGarnishmentRule({ rule, open, handleClose }) {
  const [formData, setFormData] = useState({
    id: "",
    rule: "",
    maximum_fee_deduction: "",
    per_pay_period: "",
    per_month: "",
    per_remittance: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rule || !open) return;

    const fetchRule = async () => {
      setLoading(true);
      try {
        const ruleResponse = await fetch(`${BASE_URL}/User/GarnishmentFeesRules/${rule}/`);
        const ruleData = await ruleResponse.json();

        if (ruleData?.data) {
          const ruleDetails = ruleData.data[0];
          setFormData({
            id: ruleDetails.id || "",
            rule: ruleDetails.rule || "",
            maximum_fee_deduction: ruleDetails.maximum_fee_deduction || "",
            per_pay_period: ruleDetails.per_pay_period || "",
            per_month: ruleDetails.per_month || "",
            per_remittance: ruleDetails.per_remittance || "",
          });
        }
      } catch (error) {
        console.error("Error fetching rule data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRule();
  }, [rule, open]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit the updated rule
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/User/GarnishmentFeesRulesUpdate/${rule}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Update Success!");
        handleClose(); // Close popup
      } else {
        console.error("Failed to update rule");
      }
    } catch (error) {
      console.error("Error updating rule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Garnishment Rule</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Rule ID"
          name="id"
          fullWidth
          value={formData.id}
          onChange={handleChange}
          disabled
        />
        <TextField
          margin="dense"
          label="Rule Name"
          name="rule"
          fullWidth
          value={formData.rule}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Maximum Fee Deduction"
          name="maximum_fee_deduction"
          fullWidth
          value={formData.maximum_fee_deduction}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Per Pay Period"
          name="per_pay_period"
          fullWidth
          value={formData.per_pay_period}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Per Month"
          name="per_month"
          fullWidth
          value={formData.per_month}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Per Remittance"
          name="per_remittance"
          fullWidth
          value={formData.per_remittance}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? "Updating..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditGarnishmentRule;
