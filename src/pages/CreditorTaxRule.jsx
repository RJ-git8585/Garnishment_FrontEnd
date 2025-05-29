/**
 * Component to display Creditor Tax Rules for a given case ID.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.caseId - The ID of the case for which creditor tax rules are fetched.
 *
 * @returns {JSX.Element} The rendered component displaying creditor tax rules.
 *
 * @example
 * <CreditorTaxRule caseId="12345" />
 */
import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { BASE_URL } from "../configration/Config";

const CreditorTaxRule = ({ caseId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${BASE_URL}/User/creditor-tax-applied-rule/${caseId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [caseId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!data) {
    return <p>No data available for the selected case ID.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" style={{ fontWeight: "bold", marginBottom: "20px" }}>
        Creditor Tax Rules
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Sr</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Parameter</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>{data.ee_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Case ID</TableCell>
              <TableCell>{data.case_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell>State</TableCell>
              <TableCell>{data.state}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4</TableCell>
              <TableCell>Deduction Type</TableCell>
              <TableCell>{data.deduction_type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5</TableCell>
              <TableCell>Withholding Cap</TableCell>
              <TableCell>{data.withholding_cap}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>6</TableCell>
              <TableCell>Withholding Limit (%)</TableCell>
              <TableCell>
                {data.withholding_limit
                  ? `${Number(data.withholding_limit)}%`
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>7</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>{data.priority}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CreditorTaxRule; 