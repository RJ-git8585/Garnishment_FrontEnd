import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import Swal from 'sweetalert2';

// Add custom styles for Swal
const swalConfig = {
  customClass: {
    container: 'swal-container-class',
    popup: 'swal-popup-class'
  }
};

// Add style tag for custom Swal classes
const styleTag = document.createElement('style');
styleTag.textContent = `
  .swal-container-class {
    z-index: 9999 !important;
  }
  .swal-popup-class {
    z-index: 9999 !important;
  }
`;
document.head.appendChild(styleTag);

const StateTaxExemptAmountPopup = ({ open, handleClose, state }) => {
  const [exemptData, setExemptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    minimum_wage_amount: '',
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
      multiplier_lt: '',
      condition_expression_lt: '',
      lower_threshold_amount: '',
      multiplier_ut: '',
      condition_expression_ut: '',
      upper_threshold_amount: ''
    });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${API_URLS.STATE_TAX_LEVY_EXEMPT}${state.toLowerCase()}/${editingItem.pay_period}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingItem,
          ...editFormData
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

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Exempt amount updated successfully!',
        ...swalConfig
      });

      handleEditClose();
    } catch (error) {
      console.error('Error updating exempt data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update exempt amount. Please try again.',
        ...swalConfig
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
                  exemptData.map((item, index) => (
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
      <Dialog open={!!editingItem} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Exempt Amount</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
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
            <TextField
              fullWidth
              label="Condition Expression (LT)"
              name="condition_expression_lt"
              value={editFormData.condition_expression_lt}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Lower Threshold Amount"
              name="lower_threshold_amount"
              type="number"
              value={editFormData.lower_threshold_amount}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Multiplier (UT)"
              name="multiplier_ut"
              type="number"
              value={editFormData.multiplier_ut}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Condition Expression (UT)"
              name="condition_expression_ut"
              value={editFormData.condition_expression_ut}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Upper Threshold Amount"
              name="upper_threshold_amount"
              type="number"
              value={editFormData.upper_threshold_amount}
              onChange={handleInputChange}
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