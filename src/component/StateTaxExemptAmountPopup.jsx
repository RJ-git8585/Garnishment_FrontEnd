/**
 * StateTaxExemptAmountPopup Component
 * 
 * This component renders a popup dialog for editing state tax exempt amounts.
 * It includes proper z-index layering for all UI elements and confirmation dialogs.
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import Swal from 'sweetalert2';

// Add custom styles for proper layering
const swalStyles = document.createElement('style');
swalStyles.textContent = `
  .custom-swal-container {
    z-index: 999999 !important;
  }
  .custom-swal-popup {
    z-index: 999999 !important;
  }
  .swal2-container {
    z-index: 999999 !important;
  }
  .swal2-popup {
    z-index: 999999 !important;
  }
  .custom-dialog {
    z-index: 1400;
  }
  div[role='presentation'].MuiModal-root {
    z-index: 99999 !important;
  }
  .MuiPopover-root {
    z-index: 99999 !important;
  }
  .MuiMenu-paper {
    z-index: 99999 !important;
  }
`;
document.head.appendChild(swalStyles);

const swalConfig = {
  customClass: {
    container: 'custom-swal-container',
    popup: 'custom-swal-popup'
  },
  backdrop: 'rgba(0,0,0,0.7)',
  allowOutsideClick: false
};

const menuProps = {
  PaperProps: {
    style: {
      zIndex: 99999,
    },
  },
  sx: {
    zIndex: 99999,
    '& .MuiMenu-paper': {
      zIndex: 99999,
    },
    '& .MuiPopover-paper': {
      zIndex: 99999,
    },
  },
  MenuListProps: {
    style: {
      zIndex: 99999,
    },
  },
  PopoverClasses: {
    root: 'MuiPopover-root'
  }
};

const payPeriodOrder = {
  weekly: 1,
  biweekly: 2,
  semimonthly: 3,
  monthly: 4
};

const comparePayPeriods = (a, b) => {
  const aOrder = payPeriodOrder[a.pay_period.toLowerCase()];
  const bOrder = payPeriodOrder[b.pay_period.toLowerCase()];
  return (aOrder || 100) - (bOrder || 100);
};

const StateTaxExemptAmountPopup = ({ open, handleClose, state }) => {
  const [exemptData, setExemptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    minimum_wage_amount: '',
    minimum_hourly_wage_basis: '',
    multiplier_lt: '',
    condition_expression_lt: '',
    lower_threshold_amount: '',
    multiplier_ut: '',
    condition_expression_ut: '',
    upper_threshold_amount: ''
  });

  useEffect(() => {
    const fetchExemptData = async () => {
      if (!state) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${API_URLS.STATE_TAX_LEVY_EXEMPT}${state.toLowerCase()}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch exempt data');
        }
        const result = await response.json();
        setExemptData(result.data || []);
      } catch (error) {
        console.error('Error fetching exempt data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExemptData();
  }, [state]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditFormData({
      minimum_wage_amount: item.minimum_wage_amount,
      minimum_hourly_wage_basis: item.minimum_hourly_wage_basis || 'Federal Minimum Wage',
      multiplier_lt: item.multiplier_lt,
      condition_expression_lt: item.condition_expression_lt,
      lower_threshold_amount: item.lower_threshold_amount,
      multiplier_ut: item.multiplier_ut,
      condition_expression_ut: item.condition_expression_ut,
      upper_threshold_amount: item.upper_threshold_amount
    });
  };

  const handleEditClose = () => {
    setEditingItem(null);
    setEditFormData({
      minimum_wage_amount: '',
      minimum_hourly_wage_basis: '',
      multiplier_lt: '',
      condition_expression_lt: '',
      lower_threshold_amount: '',
      multiplier_ut: '',
      condition_expression_ut: '',
      upper_threshold_amount: ''
    });
  };

  // Function to get the display value for condition expressions (with result)
  const getDisplayConditionExpression = (baseExpression, minWage, multiplier) => {
    if (!minWage || !multiplier) return '';
    const result = parseFloat(minWage) * parseFloat(multiplier);
    return `${baseExpression} = ${result.toFixed(2)}`;
  };

  const handleEditSubmit = async () => {
    try {
      // Show confirmation dialog first
      const confirmResult = await Swal.fire({
        title: 'Confirm Changes',
        html: `
          <div class="text-left">
            <p class="mb-2">Please review the following changes:</p>
            <ul class="list-disc pl-5">
              <li><strong>State:</strong> ${state}</li>
              <li><strong>Pay Period:</strong> ${editingItem.pay_period}</li>
              <li><strong>Minimum Wage Amount:</strong> ${formatCurrency(editFormData.minimum_wage_amount)}</li>
              <li><strong>Minimum Wage Basis:</strong> ${editFormData.minimum_hourly_wage_basis}</li>
              <li><strong>Lower Threshold:</strong> ${formatCurrency(editFormData.lower_threshold_amount)} (${editFormData.minimum_wage_amount} * ${editFormData.multiplier_lt})</li>
              <li><strong>Upper Threshold:</strong> ${formatCurrency(editFormData.upper_threshold_amount)} (${editFormData.minimum_wage_amount} * ${editFormData.multiplier_ut})</li>
            </ul>
            <p class="mt-4 text-sm text-gray-600">
              Are you sure you want to save these changes?
            </p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save Changes',
        cancelButtonText: 'No, Review Changes',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        ...swalConfig
      });

      if (confirmResult.isConfirmed) {
        // Only send the necessary fields to the API, excluding the calculated threshold amounts and full expressions
        const { 
          lower_threshold_amount, 
          upper_threshold_amount,
          condition_expression_lt,
          condition_expression_ut,
          ...formDataToSubmit 
        } = editFormData;
        
        const response = await fetch(`${API_URLS.STATE_TAX_LEVY_EXEMPT}${state.toLowerCase()}/${editingItem.pay_period}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...editingItem,
            ...formDataToSubmit,
            // Ensure we only send the calculation part, not the result
            condition_expression_lt: `${editFormData.minimum_wage_amount || 0} * ${editFormData.multiplier_lt || 0}`,
            condition_expression_ut: `${editFormData.minimum_wage_amount || 0} * ${editFormData.multiplier_ut || 0}`
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update exempt data');
        }

        // Update local state
        setExemptData(prevData => 
          prevData.map(item => 
            item.pay_period === editingItem.pay_period ? { ...item, ...editFormData } : item
          )
        );

        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          html: `
            <div class="text-center">
              <p className="text-center">The exempt amount has been updated successfully.</p>
             
            </div>
          `,
          confirmButtonText: 'Close',
          confirmButtonColor: '#3085d6',
          ...swalConfig
        });

        handleEditClose();
      }
    } catch (error) {
      console.error('Error updating exempt data:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update exempt amount. Please try again.',
        ...swalConfig
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Create a new form data object with the current change
    const newFormData = {
      ...editFormData,
      [name]: value
    };

    // If minimum wage or multipliers change, update the corresponding threshold amounts
    if (name === 'minimum_wage_amount' || name === 'multiplier_lt' || name === 'multiplier_ut') {
      // Update lower threshold if minimum wage or lower threshold multiplier changes
      if (name === 'minimum_wage_amount' || name === 'multiplier_lt') {
        const minWage = name === 'minimum_wage_amount' ? value : editFormData.minimum_wage_amount;
        const multiplierLT = name === 'multiplier_lt' ? value : editFormData.multiplier_lt;
        const lowerThreshold = calculateThresholdAmount(minWage, multiplierLT);
        
        newFormData.lower_threshold_amount = lowerThreshold;
        
        // Update condition expression for lower threshold (only calculation part, no result)
        newFormData.condition_expression_lt = `${minWage || 0} * ${multiplierLT || 0}`;
      }

      // Update upper threshold if minimum wage or upper threshold multiplier changes
      if (name === 'minimum_wage_amount' || name === 'multiplier_ut') {
        const minWage = name === 'minimum_wage_amount' ? value : editFormData.minimum_wage_amount;
        const multiplierUT = name === 'multiplier_ut' ? value : editFormData.multiplier_ut;
        const upperThreshold = calculateThresholdAmount(minWage, multiplierUT);
        
        newFormData.upper_threshold_amount = upperThreshold;
        
        // Update condition expression for upper threshold (only calculation part, no result)
        newFormData.condition_expression_ut = `${minWage || 0} * ${multiplierUT || 0}`;
      }
    }

    setEditFormData(newFormData);
  };

  const calculateThresholdAmount = (minimumWage, multiplier) => {
    if (!minimumWage || !multiplier) return 0;
    return Number((parseFloat(minimumWage) * parseFloat(multiplier)).toFixed(2));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle className="bg-gray-100">
        <div className="flex justify-between items-center">
          <span className='capitalize'>State Tax Levy Exempt Amount - {state}</span>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold">State</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pay Period</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Minimum Wage Basis</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Minimum Wage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Multiplier (LT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Condition (LT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Lower Threshold</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Multiplier (UT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Condition (UT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Upper Threshold</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exemptData.length > 0 ? (
                  [...exemptData].sort(comparePayPeriods).map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm capitalize">{item.state}</td>
                      <td className="px-4 py-3 text-sm capitalize">{item.pay_period}</td>
                      <td className="px-4 py-3 text-sm">{item.minimum_hourly_wage_basis}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(item.minimum_wage_amount)}</td>
                      <td className="px-4 py-3 text-sm">{item.multiplier_lt}</td>
                      <td className="px-4 py-3 text-sm">{item.condition_expression_lt}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(item.lower_threshold_amount)}</td>
                      <td className="px-4 py-3 text-sm">{item.multiplier_ut}</td>
                      <td className="px-4 py-3 text-sm">{item.condition_expression_ut}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(item.upper_threshold_amount)}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-4 py-4 text-center text-gray-500">
                      No exempt amount data available for this state.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>

      {/* Edit Modal */}
      <Dialog 
        open={!!editingItem} 
        onClose={handleEditClose}
        maxWidth="sm" 
        fullWidth
        className="custom-dialog"
        sx={{
          '& .MuiDialog-paper': {
            position: 'relative',
            zIndex: 1400
          }
        }}
      >
        <DialogTitle>Edit Exempt Amount</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <FormControl fullWidth>
              <InputLabel id="minimum-wage-basis-label">Minimum Wage Basis</InputLabel>
              <Select
                labelId="minimum-wage-basis-label"
                id="minimum-wage-basis"
                name="minimum_hourly_wage_basis"
                value={editFormData.minimum_hourly_wage_basis}
                label="Minimum Wage Basis"
                onChange={handleInputChange}
                MenuProps={menuProps}
              >
                <MenuItem value="Federal Minimum Wage">Federal Minimum Wage</MenuItem>
                <MenuItem value="State Minimum Wage">State Minimum Wage</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Minimum Wage Amount"
              name="minimum_wage_amount"
              type="number"
              value={editFormData.minimum_wage_amount}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Multiplier (LT)"
              name="multiplier_lt"
              type="number"
              value={editFormData.multiplier_lt}
              onChange={handleInputChange}
            />
            <div className="relative">
              <TextField
                fullWidth
                label="Condition Expression (LT)"
                name="condition_expression_lt"
                value={editFormData.condition_expression_lt}
                onChange={handleInputChange}
                disabled
              />
              {editFormData.minimum_wage_amount && editFormData.multiplier_lt && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  = {formatCurrency(parseFloat(editFormData.minimum_wage_amount) * parseFloat(editFormData.multiplier_lt))}
                </div>
              )}
            </div>
            <TextField
              fullWidth
              label="Lower Threshold Amount"
              name="lower_threshold_amount"
              type="number"
              value={editFormData.lower_threshold_amount}
              onChange={handleInputChange}
              disabled
            />
            <TextField
              fullWidth
              label="Multiplier (UT)"
              name="multiplier_ut"
              type="number"
              value={editFormData.multiplier_ut}
              onChange={handleInputChange}
            />
            <div className="relative">
              <TextField
                fullWidth
                label="Condition Expression (UT)"
                name="condition_expression_ut"
                value={editFormData.condition_expression_ut}
                onChange={handleInputChange}
                disabled
              />
              {editFormData.minimum_wage_amount && editFormData.multiplier_ut && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  = {formatCurrency(parseFloat(editFormData.minimum_wage_amount) * parseFloat(editFormData.multiplier_ut))}
                </div>
              )}
            </div>
            <TextField
              fullWidth
              label="Upper Threshold Amount"
              name="upper_threshold_amount"
              type="number"
              value={editFormData.upper_threshold_amount}
              onChange={handleInputChange}
              disabled
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default StateTaxExemptAmountPopup; 