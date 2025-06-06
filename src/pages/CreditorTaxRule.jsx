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
import { FaExternalLinkAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from "@mui/material";
import { BASE_URL } from "../configration/Config";
import { API_URLS } from "../configration/apis";
import Swal from "sweetalert2";
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const AnimatedSpan = styled.span`
  cursor: help;
  color: #0066cc;
  transition: color 0.3s ease;
  display: inline-block;

  &:hover {
    color: #0066cc;
    animation: ${shakeAnimation} 0.5s ease;
  }
`;

const CreditorTaxRule = ({ caseId, state, weekly }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipLoading, setTooltipLoading] = useState(false);

  const handleWithholdingBasisClick = async (state, weekly) => {
    try {
      // Open new popup with API data
      const response = await fetch(API_URLS.GET_CREDITOR_DEBT_EXEMPT_CONFIG(state, weekly));
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
        width: '800px',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
          closeButton: 'custom-close-button',
          header: 'custom-header'
        },
        didClose: () => {
          // Reset tooltip data when modal closes
          setTooltipData(null);
          setTooltipLoading(false);
          // Force a new fetch of the main data
          fetchData();
        }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to fetch withholding basis details',
        showConfirmButton: false,
        showCloseButton: true
      });
    }
  };

  const fetchTooltipData = async (state, weekly) => {
    if (!tooltipData && !tooltipLoading) {
      setTooltipLoading(true);
      try {
        const response = await fetch(API_URLS.GET_CREDITOR_DEBT_EXEMPT_CONFIG(state, weekly));
        if (!response.ok) {
          throw new Error(`Failed to fetch withholding basis details`);
        }
        const result = await response.json();
        const data = Array.isArray(result.data) ? result.data[0] : result.data;
        setTooltipData(data);
      } catch (err) {
        console.error('Error fetching tooltip data:', err);
      } finally {
        setTooltipLoading(false);
      }
    }
  };

  const renderTooltipContent = () => {
    if (tooltipLoading) return "Loading...";
    if (!tooltipData) return "Hover to load details";
    
    return (
      <div style={{ maxWidth: '700px', padding: '4px', backgroundColor: 'white', color: '#333' }}>
        <div style={{ 
          borderBottom: '2px solid #0066cc', 
          marginBottom: '8px', 
          paddingBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: '#0066cc', 
            fontSize: '16px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Withholding Basis Details
          </h3>
          <span style={{ 
            fontSize: '12px', 
            color: '#666',
            backgroundColor: '#f0f0f0',
            padding: '4px 8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap'
          }}>
            {state?.toUpperCase()} - {weekly?.toUpperCase()}
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: 'auto' }}>
            <tbody>
              {Object.entries(tooltipData)
                .filter(([key]) => key !== 'id')
                .map(([key, value], index) => (
                  <tr key={key}>
                    <td style={{ 
                      padding: '6px 12px 6px 0', 
                      borderBottom: '1px solid #e0e0e0', 
                      color: '#2c3e50', 
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      minWidth: 'max-content'
                    }}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </td>
                    <td style={{ 
                      padding: '6px 0 6px 12px', 
                      borderBottom: '1px solid #e0e0e0', 
                      color: '#444',
                      whiteSpace: 'nowrap',
                      minWidth: 'max-content',
                      textTransform: 'capitalize'
                    }}>
                      {typeof value === 'object' ? JSON.stringify(value) : value ?? 'N/A'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URLS.GET_CREDITOR_DEBT_APPLIED_RULE(caseId));
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

  useEffect(() => {
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
        Creditor Dept Rules
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
                <Tooltip
                  title={renderTooltipContent()}
                  onOpen={() => fetchTooltipData(data.state, "weekly")}
                  arrow
                  interactive
                  placement="top"
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -8],
                        },
                      },
                    ],
                    sx: {
                      zIndex: 999999,
                      '& .MuiTooltip-tooltip': {
                        zIndex: 999999
                      },
                      '& .MuiTooltip-popper': {
                        zIndex: 999999
                      }
                    },
                    style: {
                      zIndex: 999999,
                    }
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        zIndex: 999999,
                        bgcolor: 'white',
                        '& .MuiTooltip-arrow': {
                          color: 'white',
                        },
                      },
                    },
                  }}
                >
                  <AnimatedSpan>{data.withholding_basis || 'N/A'}</AnimatedSpan>
                </Tooltip>
                <button
                  onClick={() => handleWithholdingBasisClick(data.state, "weekly")}
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
                  
                  {/* <FaExternalLinkAlt style={{
                    fontSize: '14px',
                    marginLeft: '5px',
                    verticalAlign: 'middle',
                    color: '#0066cc'
                  }} /> */}
                </button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>5</TableCell>
              <TableCell>Withholding Cap</TableCell>
              <TableCell>{data.withholding_cap || 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CreditorTaxRule; 