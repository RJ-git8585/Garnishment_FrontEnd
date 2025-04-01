import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography, CircularProgress, Grid } from "@mui/material";
import { API_URLS } from '../constants/apis';

const Rules = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const state = queryParams.get("rule") || "No state provided";

  const [data, setData] = useState(null);
  const [mandatoryDeductions, setMandatoryDeductions] = useState(null); // State for second API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch data from the first API
        const response1 = await fetch(`${API_URLS.RULESDATA}/${state}`);
        if (!response1.ok) {
          throw new Error(`Failed to fetch data: ${response1.statusText}`);
        }
        const result1 = await response1.json();
        setData(result1.data);

        // Fetch data from the second API
        const response2 = await fetch(`${API_URLS.RULESDATA2}/${state}`);
        if (!response2.ok) {
          throw new Error(`Failed to fetch mandatory deductions: ${response2.statusText}`);
        }
        const result2 = await response2.json();
        setMandatoryDeductions(result2.mandatory_deductions); // Access the "data" key from the second API response
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (state !== "No state provided") {
      fetchData();
    }
  }, [state]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Withholding Limit Rule Details for {state}
      </Typography>
      {data ? (
        <Card style={{ maxWidth: 800, margin: "20px auto", padding: "20px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rule Details:
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(data).map(([key, value], index) => (
                <Grid container item xs={12} key={key}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                      {key}:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{value}</Typography>
                  </Grid>
                </Grid>
              ))}
              {data.WithholdingLimit && (
                <Grid container item xs={12}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                      Withholding Limit:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{data.WithholdingLimit}</Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography>No data available for the selected state.</Typography>
      )}

      {mandatoryDeductions ? (
        <Card style={{ maxWidth: 800, margin: "20px auto", padding: "20px" }}>
          <CardContent>
          <Typography variant="h6" style={{ fontSize: 12, margin: "20px auto", padding: "20px" }} gutterBottom>
          Disposable income = Gross Pay - Mandatory Deductions:
            </Typography>
            <Typography variant="h6" gutterBottom>
              Mandatory Deductions:
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(mandatoryDeductions).map(([key, value], index) => (
                <Grid container item xs={12} key={key}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                      {index + 1}:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{value}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography>No mandatory deductions data available for Florida.</Typography>
      )}
    </div>
  );
};

export default Rules;
