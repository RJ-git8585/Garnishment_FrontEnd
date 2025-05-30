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
import { FaInfoCircle } from "react-icons/fa";

import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { BASE_URL } from "../configration/Config";
import Swal from "sweetalert2";

const CreditorTaxRule = ({ caseId, state, weekly }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleWithholdingBasisClick = async (state, weekly) => {
    try {
      // Close the current popup
      Swal.close();
      
      // Convert state and weekly to lowercase
      const stateParam = state.toLowerCase();
      const weeklyParam = weekly.toLowerCase();
      
      // Open new popup with API data
      const response = await fetch(`${BASE_URL}/garnishment/creditor-debt-exempt-amt-config/${stateParam}/${weeklyParam}/`);
      console.log(`${BASE_URL}/garnishment/creditor-debt-exempt-amt-config/${stateParam}/${weeklyParam}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch withholding basis details`);
      }
      const result = await response.json();
      console.log('API Response:', result); // Debug log

      // Create table rows from the data
      const data = Array.isArray(result.data) ? result.data[0] : result.data;
      const tableRows = Object.entries(data)
        .filter(([key]) => key !== 'id') // Exclude id field
        .map(([key, value], index) => {
          const formattedKey = key.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          // Handle different value types
          let displayValue = value;
          if (typeof value === 'object' && value !== null) {
            displayValue = JSON.stringify(value);
          } else if (value === null || value === undefined) {
            displayValue = 'N/A';
          }
          
          return `
            <tr>
              <td style="text-sm border: 1px solid #ddd; padding: 8px; text-align: center">${index + 1}</td>
              <td style="text-sm  border: 1px solid #ddd; padding: 8px">${formattedKey}</td>
              <td style="text-sm border: 1px solid #ddd; padding: 8px">${displayValue}</td>
            </tr>
          `;
        })
        .join('');
      
      Swal.fire({
        title: 'Exempt Amount Configuration',
        html: `
          <div style="max-height: 70vh; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="text-sm border: 1px solid #ddd; padding: 12px; text-align: center">Sr</th>
                  <th style="text-sm border: 1px solid #ddd; padding: 12px; text-align: left">Parameter</th>
                  <th style="text-sm border: 1px solid #ddd; padding: 12px; text-align: left">Value</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        `,
        confirmButtonText: 'Close',
        width: '800px'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to fetch withholding basis details'
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${BASE_URL}/garnishment/creditor-debt-applied-rule/${caseId}/`);
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
              <TableCell>Withholding Basis</TableCell>
              <TableCell>
                <button
                  onClick={() => handleWithholdingBasisClick(state, weekly)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0066cc',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                    font: 'inherit'
                  }}
                >
                  {data.withholding_basis}
                </button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5</TableCell>
              <TableCell>Withholding Cap</TableCell>
              <TableCell>{data.withholding_cap}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CreditorTaxRule; 