/**
 * CreditorRule Component
 * 
 * This component displays a paginated list of creditor debt rules.
 * 
 * @component
 * @returns {JSX.Element} The rendered CreditorRule component.
 */
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { API_URLS } from "../configration/apis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import CreditorRulePopup from "../component/CreditorRulePopup";
import ExemptAmountPopup from "../component/ExemptAmountPopup";
import { sanitizeString } from "../utils/sanitizeData";

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

// List of specific states for logic
const SPECIFIC_STATES = [
  "california",
  "hawaii",
  "massachusetts",
  "minnesota",
  "missouri",
  "nebraska",
  "nevada",
  "new york",
  "south dakota",
  "tennessee",
  "new jersey",
  "north dakota"
];
const deductionBasisOptions = [
  { value: "disposable earning", label: "Disposable Earning" },
  { value: "gross pay", label: "Gross Pay" },
  { value: "net pay", label: "Net Pay" },
];

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
const CreditorRule = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreditorRulePopupOpen, setIsCreditorRulePopupOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [isExemptPopupOpen, setIsExemptPopupOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [formData, setFormData] = useState({
    state: '',
    rule: '',
    deduction_basis: '',
    withholding_limit: ''
  });
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URLS.GET_CREDITOR_RULES);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        const sortedData = jsonData.data.sort((a, b) =>
          a.state.localeCompare(b.state, undefined, { numeric: true })
        );
        setData(sortedData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch creditor debt rules'
        });
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  const handleEditClick = async (rule) => {
    try {
      // Fetch fresh data for the rule before showing the popup
      const response = await fetch(API_URLS.GET_CREDITOR_RULES);
      if (!response.ok) {
        throw new Error('Failed to fetch updated rule data');
      }
      const result = await response.json();
      const updatedRule = result.data.find(r => r.state === rule.state);
      
      if (!updatedRule) {
        throw new Error('Rule not found');
      }

      console.log('API Response for Rule:', updatedRule);
      
      // Find the matching deduction basis option
      const matchedOption = deductionBasisOptions.find(
        option => sanitizeString(option.value.toLowerCase()) === 
                sanitizeString(updatedRule.deduction_basis?.toLowerCase())
      );

      // Extract numeric value from withholding_limit if it has a % symbol
      const withholding_limit = updatedRule.withholding_limit?.toString().replace('%', '') || '';
      
      // Create form data with proper field mapping and sanitization
      const formDataToSet = {
        state: sanitizeString(updatedRule.state) || '',
        rule: updatedRule.rule || '', // Don't sanitize rule as it might contain special characters
        deduction_basis: matchedOption ? matchedOption.value : '',
        withholding_limit: withholding_limit
      };
      
      console.log('Form Data Being Set:', formDataToSet);
      
      // Set the current rule and form data
      setCurrentRule(updatedRule);
      setFormData(formDataToSet);
      
      // Open the edit dialog
      setEditDialogOpen(true);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load rule data',
        allowOutsideClick: false,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rule') {
      // Don't sanitize rule field
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: sanitizeString(value)
      }));
    }
  };

  const handleEditNext = async () => {
    if (!formData.rule.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Rule field cannot be empty',
      });
      return;
    }
    
    setEditDialogOpen(false);
    
    try {
      const confirmResult = await Swal.fire({
        title: 'Confirm Rule Changes',
        html: `
          <div class="text-left">
            <p class="mb-2">Please review the following changes:</p>
            <ul class="list-disc pl-5">
              <li><strong>State:</strong> ${formData.state}</li>
              <li><strong>Rule:</strong> ${formData.rule}</li>
              <li><strong>Deduction Basis:</strong> ${formData.deduction_basis}</li>
              <li><strong>Withholding Limit:</strong> ${formData.withholding_limit}%</li>
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
        cancelButtonColor: '#d33'
      });

      if (confirmResult.isConfirmed) {
        await handleConfirmSave();
      } else {
        setEditDialogOpen(true);
      }
    } catch (error) {
      console.error("Error in confirmation dialog:", error);
      setEditDialogOpen(true);
    }
  };

  const handleConfirmSave = async () => {
    try {
      const response = await fetch(API_URLS.UPDATE_CREDITOR_RULE.replace(':state', formData.state), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: formData.state,
          withholding_limit_rule: formData.rule,
          deduction_basis: formData.deduction_basis,
          withholding_limit: formData.withholding_limit
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update rule');
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Rule updated successfully. The page will now reload.',
        confirmButtonColor: '#3085d6'
      });

      // Close the dialog and reload the page
      handleCloseDialogs();
      window.location.reload();
    } catch (error) {
      console.error("Error updating rule:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'An error occurred while updating the rule. Please try again later.'
      });
      setEditDialogOpen(true);
    }
  };

  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setConfirmDialogOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleCreditorRuleSave = (creditorRuleData) => {
    console.log("Creditor Rule Data Submitted:", creditorRuleData);
    setIsCreditorRulePopupOpen(false);
    // Add logic to save creditor rule data to the backend
    Swal.fire({
      icon: 'success',
      title: 'Request Submitted',
      text: 'Your creditor rule edit request has been submitted successfully.',
    });
  };

  // Helper function to check if withholding_limit has multiple values
  const hasMultipleValues = (value) => {
    if (!value) return false;
    return /[,/-]/.test(value.toString());
  };

  const formatWithholdingValue = (value) => {
    // Return 'N/A' if value is null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    
    // Check for multiple values (containing , / or -)
    if (hasMultipleValues(value)) {
      return value; // Return as is for multiple values
    }
    
    // Add % only for valid numeric values
    return `${value}%`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">  
        <h1 className="text-2xl font-bold">Creditor Debt Rules</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setIsCreditorRulePopupOpen(true)}
        >
          Rule Change Request
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left text-sm">Sr</th>
              <th className="px-6 py-3 text-left text-sm">State</th>
              <th className="px-6 py-3 text-left text-sm">Deduction Basis</th>
              <th className="px-6 py-3 text-left text-sm">Withholding cap</th>
              <th className="px-6 py-3 text-left text-sm">Rule</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6">
                  <div className="flex justify-center h-40">
                    <AiOutlineLoading3Quarters className="animate-spin text-gray-500 text-4xl" role="progressbar" />
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((rule, index) => {
                const isSpecificState = SPECIFIC_STATES.includes(rule.state);

                const stateCell = isSpecificState ? (
                  <span className="text-gray-600 ">{rule.state}</span>
                ) : (
                  <button
                    onClick={() => handleEditClick(rule)}
                    className="text-sky-900 capitalize rulebtn_cls hover:underline"
                  >
                    {rule.state}
                  </button>
                );

                const ruleCellIcon = isSpecificState ? (
                  <span className="text-gray-400 ml-2">
                    <FaExternalLinkAlt />
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedState(rule.state);
                      setIsExemptPopupOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    title="View Exempt Amount Configuration"
                  >
                    <FaExternalLinkAlt />
                  </button>
                );

                return (
                  <tr key={rule.state} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-3 text-sm">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm capitalize rulebtn_cls">
                      {stateCell}
                    </td>
                    <td className="px-6 py-3 text-sm capitalize">
                      {rule.deduction_basis}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {formatWithholdingValue(rule.withholding_limit)}
                    </td>
                    <td className="px-6 py-3 text-sm flex items-center justify-between border-0">
                      <span className="capitalize">{rule.rule}</span>
                      {ruleCellIcon}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No rules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!loading && data.length > 0 && (
        <div className="flex justify-between  mt-4">
          <p className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, data.length)} to{" "}
            {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
          </p>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-2 py-1 border rounded text-sm ${
                  currentPage === index + 1 ? "bg-gray-500 text-white" : "bg-white text-gray-700"
                }`}
                data-testid={`page-button-${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit Rule Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Rule Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              label="Rule"
              name="rule"
              value={formData.rule}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="deduction-basis-label">Deduction Basis *</InputLabel>
              <Select
                labelId="deduction-basis-label"
                id="deduction_basis"
                name="deduction_basis"
                value={formData.deduction_basis || ""}
                label="Deduction Basis *"
                onChange={handleInputChange}
                displayEmpty
                MenuProps={menuProps}
                required
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {deductionBasisOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Withholding Cap"
              name="withholding_limit"
              type="number"
              value={formData.withholding_limit}
              onChange={handleInputChange}
              margin="normal"
              inputProps={{
                step: "0.01",
                min: "0",
                max: "100"
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleEditNext} variant="contained" color="primary">
            Next
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation handled by Swal.fire in handleEditNext */}

      {/* Creditor Rule Popup */}
      {isCreditorRulePopupOpen && (
        <CreditorRulePopup
          open={isCreditorRulePopupOpen}
          handleClose={() => setIsCreditorRulePopupOpen(false)}
          handleSave={handleCreditorRuleSave}
        />
      )}

      {/* Exempt Amount Popup */}
      {isExemptPopupOpen && (
        <ExemptAmountPopup
          open={isExemptPopupOpen}
          handleClose={() => setIsExemptPopupOpen(false)}
          state={selectedState}
        />
      )}
    </div>
  );
};

export default CreditorRule;
