import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const StateTaxExemptAmountPopup = ({ open, handleClose, state }) => {
  const [exemptData, setExemptData] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pay Period</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Minimum Wage Basis</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Minimum Wage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Multiplier (LT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Condition (LT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Lower Threshold</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Multiplier (UT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Condition (UT)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Upper Threshold</th>
                </tr>
              </thead>
              <tbody>
                {exemptData.length > 0 ? (
                  exemptData.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm capitalize">{item.pay_period}</td>
                      <td className="px-4 py-3 text-sm">{item.minimum_hourly_wage_basis}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(item.minimum_wage_amount)}</td>
                      <td className="px-4 py-3 text-sm">{item.multiplier_lt}</td>
                      <td className="px-4 py-3 text-sm">{item.condition_expression_lt}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(item.lower_threshold_amount)}</td>
                      <td className="px-4 py-3 text-sm">{item.multiplier_ut}</td>
                      <td className="px-4 py-3 text-sm">{item.condition_expression_ut}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(item.upper_threshold_amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                      No exempt amount data available for this state.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StateTaxExemptAmountPopup; 