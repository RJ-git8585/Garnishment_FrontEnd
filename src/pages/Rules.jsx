
/**
 * Component to display child support computation rules based on provided parameters.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.workState - The work state of the employee.
 * @param {string} props.employeeId - The unique identifier for the employee.
 * @param {boolean} props.supportsSecondFamily - Indicates if the employee supports a second family.
 * @param {boolean} props.arrearsMoreThan12Weeks - Indicates if the employee has arrears for more than 12 weeks.
 * @param {number} props.disposableEarnings - The disposable earnings of the employee.
 * @param {number} [props.dataCount=0] - The count of data to be fetched (default is 0).
 *
 * @returns {JSX.Element} The rendered Rules component.
 *
 * @example
 * <Rules
 *   workState="CA"
 *   employeeId="12345"
 *   supportsSecondFamily={true}
 *   arrearsMoreThan12Weeks={false}
 *   disposableEarnings={5000}
 *   dataCount={1}
 * />
 */
import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from "@mui/material";
import { API_URLS } from '../configration/apis';

// Helper function to clean and convert disposableEarnings to a number
const cleanNumber = (value) => {
  if (typeof value === 'string') {
    // Remove any commas and convert to number
    return Number(value.replace(/,/g, ''));
  }
  return value; // Return as is if it's already a number
};

const Rules = ({ workState, employeeId, supportsSecondFamily, arrearsMoreThan12Weeks, disposableEarnings, dataCount = 0 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Received dataCount:", dataCount); // Debugging to ensure dataCount is passed correctly
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Clean the disposableEarnings value before making the API call
        const cleanDisposableEarnings = cleanNumber(disposableEarnings);
        
        const response = await fetch(
          `${API_URLS.RULESDATA3}/${workState}/${employeeId}/${supportsSecondFamily}/${arrearsMoreThan12Weeks}/${cleanDisposableEarnings}/${dataCount}/`
        );
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
  }, [workState, employeeId, supportsSecondFamily, arrearsMoreThan12Weeks, disposableEarnings, dataCount]); // Include dataCount in the dependency array

  const formatText = (text) => {
    return text
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" ");
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!data) {
    return <p>No data available for the selected parameters.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" style={{ fontWeight: "bold", marginBottom: "20px" }}>
        Child Support Rules
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead className="headecssbg_colr">
            <TableRow>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Sr</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Parameter</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>State</TableCell>
              <TableCell>{data.state}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Allocation Method</TableCell>
              <TableCell>{data.allocation_method}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell>Withholding Limit</TableCell>
              <TableCell>{data.withholding_limit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4</TableCell>
              <TableCell>Rule</TableCell>
              <TableCell>{data.rule}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5</TableCell>
              <TableCell>Applied Withholding Limit</TableCell>
              <TableCell>{data.applied_withholding_limit}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>6</TableCell>
              <TableCell>Disposable Earning</TableCell>
              <TableCell>
                (Wages + Commissions + Bonuses + Non-Accountable Allowances) - Mandatory Deductions
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>7</TableCell>
              <TableCell>Mandatory Deductions</TableCell>
              <TableCell>
                {Object.values(data.mandatory_deductions)
                  .map((value) => formatText(value))
                  .join(", ")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>8</TableCell>
              <TableCell>Allowable Disposable Earning</TableCell>
              <TableCell>Applied Withholding Limit * Disposable Earning</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Rules;
