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
 *   TableContainer, TableHead, TableRow, Paper, Tooltip
 * - `BASE_URL` from the configuration file
 *
 * @state {Object|null} data - The fetched data for the state tax levy rules.
 * @state {boolean} loading - Indicates whether the data is being loaded.
 * @state {string} error - Stores any error message encountered during data fetching.
 * @state {Object|null} tooltipData - The fetched data for the state tax levy exempt configuration.
 * @state {boolean} tooltipLoading - Indicates whether the tooltip data is being loaded.
 * @state {string} tooltipError - Stores any error message encountered during tooltip data fetching.
 *
 * @hooks
 * - `useEffect` to fetch data when the `caseId` prop changes.
 * - `useCallback` to fetch tooltip data when the state or pay period changes.
 */
import React, { useEffect, useState, useCallback } from "react";
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from "@mui/material";
import { BASE_URL } from "../configration/Config";
import { API_URLS } from "../configration/apis";
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { FaExternalLinkAlt } from "react-icons/fa";
import Swal from "sweetalert2";

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

const StatetaxLevyRules = ({ caseId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipLoading, setTooltipLoading] = useState(false);
  const [tooltipError, setTooltipError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(API_URLS.GET_STATE_TAX_LEVY_APPLIED_RULE(caseId));
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

  const fetchTooltipData = useCallback(async () => {
    // alert(data.state, data.pay_period);
    if (!data?.state || !data?.pay_period) return;
    
    setTooltipLoading(true);
    setTooltipError("");
    setTooltipData(null);
    
    try {
      // console.log(data.state, data.pay_period);
      const response = await fetch(API_URLS.GET_STATE_TAX_LEVY_EXEMPT_CONFIG(data.state, data.pay_period));
      if (!response.ok) {
        throw new Error(`Failed to fetch tooltip data: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setTooltipData(result.data[0]);
      } else {
        setTooltipError("No configuration data available");
      }
    } catch (err) {
      console.error("Error fetching tooltip data:", err);
      setTooltipError(err.message || "Failed to load configuration data");
    } finally {
      setTooltipLoading(false);
    }
  }, [data?.state, data?.pay_period]);

  const handleWithholdingBasisClick = async () => {
    if (!data?.state || !data?.pay_period) return;
    
    try {
      const response = await fetch(API_URLS.GET_STATE_TAX_LEVY_EXEMPT_CONFIG(data.state, data.pay_period));
      if (!response.ok) {
        throw new Error(`Failed to fetch withholding basis details`);
      }
      const result = await response.json();
      
      // Create table rows from the data
      const tableData = Array.isArray(result.data) ? result.data[0] : result.data;
      const tableRows = Object.entries(tableData)
        .filter(([key]) => key !== 'id') // Exclude id field
        .map(([key, value], index) => {
          const formattedKey = key.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          let displayValue = value;
          if (typeof value === 'object' && value !== null) {
            displayValue = JSON.stringify(value);
          } else if (value === null || value === undefined) {
            displayValue = 'N/A';
          }
          
          return `
            <tr>
              <td style="text-sm border: 1px solid #ddd; padding: 8px; text-align: center">${index + 1}</td>
              <td style="text-sm border: 1px solid #ddd; padding: 8px">${formattedKey}</td>
              <td style="text-sm border: 1px solid #ddd; padding: 8px">${displayValue}</td>
            </tr>
          `;
        })
        .join('');
      
      Swal.fire({
        title: 'State Tax Levy Exempt Configuration',
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
          header: 'custom-header',
          container: 'custom-swal-container',
          popup: 'custom-swal-popup'
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

  const renderTooltipContent = () => {
    if (tooltipLoading) return "Loading...";
    if (tooltipError) return tooltipError;
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
            State Tax Levy Details
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
                <td style={valueStyle}>{data.state?.toUpperCase() || 'N/A'}</td>
              </tr>
              <tr>
                <td style={labelStyle}>Pay Period</td>
                <td style={valueStyle}>{data.pay_period?.toUpperCase() || 'N/A'}</td>
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
    color: '#333',
    fontWeight: '500'
  };

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
              <TableCell style={{ textTransform: 'capitalize' }}>{data.state}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4</TableCell>
              <TableCell>Deduction Basis</TableCell>
              <TableCell style={{ textTransform: 'capitalize' }}>{data.deduction_basis}</TableCell>
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
              <TableCell>Withholding Basis</TableCell>
              <TableCell>
                <Tooltip
                  title={renderTooltipContent()}
                  onOpen={() => fetchTooltipData()}
                  arrow
                  interactive
                  placement="right"
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
                        backgroundColor: '#fff',
                        color: '#000',
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        padding: '0',
                        maxWidth: 'none'
                      },
                      '& .MuiTooltip-arrow': {
                        color: '#fff',
                        '&::before': {
                          border: '1px solid #ccc'
                        }
                      }
                    }
                  }}
                >
                  <AnimatedSpan>
                    {data.withholding_basis || 'N/A'}
                  </AnimatedSpan>
                </Tooltip>
                <button
                  onClick={handleWithholdingBasisClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0066cc',
                    cursor: 'pointer',
                    marginLeft: '8px',
                    padding: 0,
                    verticalAlign: 'middle'
                  }}
                >
                  {/* <FaExternalLinkAlt size={12} />  */}
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StatetaxLevyRules;
