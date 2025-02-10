/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Select, FormControl, 
  InputLabel, Grid, CircularProgress 
} from "@mui/material";
import { motion } from "framer-motion"; // Import Framer Motion
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

  const [allRules, setAllRules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rule || !open) return;

    const fetchRule = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/User/GarnishmentFeesRules/${rule}/`);
        const { data } = await response.json();
        if (data?.length) setFormData({ ...data[0] });
      } catch (error) {
        console.error("Error fetching rule:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllRules = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/GarnishmentFeesStatesRules/`);
        const data = await response.json();
        setAllRules([...new Set(data?.data?.map(item => item.rule) || [])]);
      } catch (error) {
        console.error("Error fetching all rules:", error);
      }
    };

    fetchRule();
    fetchAllRules();
  }, [rule, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/User/GarnishmentFeesRulesUpdate/${rule}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Update Success!");
        handleClose();
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
          Edit Garnishment Rule
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <TextField 
                  label="ID" 
                  name="id" 
                  fullWidth 
                  value={formData.id} 
                  disabled 
                  variant="outlined" 
                />
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Rule</InputLabel>
                  <Select name="rule" value={formData.rule} onChange={handleChange} label="Rule">
                    {allRules.map((ruleOption, index) => (
                      <MenuItem key={index} value={ruleOption}>{ruleOption}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </motion.div>
            </Grid>

            {["maximum_fee_deduction", "per_pay_period", "per_month", "per_remittance"].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                >
                  <TextField 
                    label={field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} 
                    name={field} 
                    fullWidth 
                    value={formData[field]} 
                    onChange={handleChange} 
                    variant="outlined"
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary" 
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Updating..." : "Save"}
            </Button>
          </motion.div>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
}

export default EditGarnishmentRule;
