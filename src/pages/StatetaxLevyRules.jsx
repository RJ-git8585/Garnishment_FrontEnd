
/**
 * Component to display State Tax Levy Rules for a given case ID.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.caseId - The ID of the case for which state tax levy rules are fetched.
 *
 * @returns {JSX.Element} The rendered component displaying state tax levy rules.
 *
 * @example
 * <StatetaxLevyRules caseId="12345" />
 *
 * @description
 * This component fetches and displays state tax levy rules for a specific case ID.
 * It shows a loading spinner while data is being fetched, an error message if the
 * fetch fails, or a table of data if the fetch is successful.
 *
 * The data displayed includes:
 * - Employee ID
 * - Case ID
 * - State
 * - Deduct From
 * - Withholding Limit Rule
 * - Withholding Limit (%)
 * - Reasoning
 *
 * @dependencies
 * - React
 * - Material-UI components: CircularProgress, Typography, Table, TableBody, TableCell,
 *   TableContainer, TableHead, TableRow, Paper
 * - `BASE_URL` from the configuration file
 *
 * @state {Object|null} data - The fetched data for the state tax levy rules.
 * @state {boolean} loading - Indicates whether the data is being loaded.
 * @state {string} error - Stores any error message encountered during data fetching.
 *
 * @hooks
 * - `useEffect` to fetch data when the `caseId` prop changes.
 */
import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { BASE_URL } from "../configration/Config";

const StatetaxLevyRules = ({ caseId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${BASE_URL}/User/state-tax-levy-rule/${caseId}`);
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
        State Tax Levy Rules
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
              <TableCell>Deduct Basic</TableCell>
              <TableCell>{data.deduction_basis}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5</TableCell>
              <TableCell>Withholding Cap</TableCell>
              <TableCell>{data.withholding_cap}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>6</TableCell>
              <TableCell>Withholding Limit (%)</TableCell>
              <TableCell>{data.withholding_limit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>7</TableCell>
              <TableCell>Withholding Basis</TableCell>
              <TableCell>{data.withholding_basis}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StatetaxLevyRules;
