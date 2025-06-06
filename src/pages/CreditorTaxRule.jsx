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
      <div style={{ 
        padding: '16px',
        maxWidth: '500px',
        minWidth: '500px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '10px',
        zIndex: 1000
      }}>
        <div style={{ 
          borderBottom: '2px solid #0066cc', 
          marginBottom: '12px', 
          paddingBottom: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: '#0066cc', 
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Creditor Tax Details
          </h3>
        </div>
        <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
          <table style={{ 
            borderCollapse: 'collapse', 
            width: '100%',
            margin: '0 auto'
          }}>
            <tbody>
              <tr>
                <td style={labelStyle}>State</td>
                <td style={valueStyle}>{state?.toUpperCase() || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Pay Period</td>
                <td style={valueStyle}>{weekly?.toUpperCase() || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Minimum Hourly Wage Basis</td>
                <td style={valueStyle}>{tooltipData.minimum_hourly_wage_basis || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Minimum Wage Amount</td>
                <td style={valueStyle}>${tooltipData.minimum_wage_amount || '0.00'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Multiplier LT</td>
                <td style={valueStyle}>{tooltipData.multiplier_lt || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Condition Expression LT</td>
                <td style={valueStyle}>{tooltipData.condition_expression_lt || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Lower Threshold Amount</td>
                <td style={valueStyle}>${tooltipData.lower_threshold_amount || '0.00'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Multiplier UT</td>
                <td style={valueStyle}>{tooltipData.multiplier_ut || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Condition Expression UT</td>
                <td style={valueStyle}>{tooltipData.condition_expression_ut || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Upper Threshold Amount</td>
                <td style={valueStyle}>${tooltipData.upper_threshold_amount || '0.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Styles for table cells
  const labelStyle = {
    padding: '8px 16px 8px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    color: '#666',
    whiteSpace: 'nowrap',
    width: '40%'
  };

  const valueStyle = {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    color: '#333'
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
        Creditor Debt Rules
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
              <TableCell className="text-capitalize">{data.state}</TableCell>
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