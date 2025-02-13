/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Grid, CircularProgress
} from "@mui/material";
import { motion } from "framer-motion";
import { BASE_URL } from "../Config";


function EditGarnishmentRule({ rule, open, handleClose }) {
  const [formData, setFormData] = useState({ id: "", rule: "", maximum_fee_deduction: "", per_pay_period: "", per_month: "", per_remittance: "" });
  const [allRules, setAllRules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rule || !open) return;
    setLoading(true);
    Promise.all([
      fetch(`${BASE_URL}/User/GarnishmentFeesRules/${rule}/`).then(res => res.json()),
      fetch(`${BASE_URL}/User/GarnishmentFeesStatesRules/`).then(res => res.json())
    ]).then(([ruleData, rulesList]) => {
      if (ruleData?.data?.length) setFormData({ ...ruleData.data[0] });
      setAllRules([...new Set(rulesList?.data?.map(item => item.rule) || [])]);
    }).catch(console.error).finally(() => setLoading(false));
  }, [rule, open]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/User/GarnishmentFeesRulesUpdate/${rule}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) handleClose();
    } catch (error) {
      console.error("Error updating rule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>Edit Garnishment Rule</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="ID" name="id" fullWidth value={formData.id} disabled variant="outlined" /></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Rule</InputLabel>
                <Select name="rule" value={formData.rule} onChange={handleChange} label="Rule">
                  {allRules.map((r, i) => <MenuItem key={i} value={r}>{r}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            {["maximum_fee_deduction", "per_pay_period", "per_month", "per_remittance"].map((field, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <TextField label={field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} name={field} fullWidth value={formData[field]} onChange={handleChange} variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
            {loading ? "Updating..." : "Save"}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
}

export default EditGarnishmentRule;
