import React, { useState, useEffect } from "react";
import { FaBalanceScaleRight } from "react-icons/fa";
import axios from "axios";
import { StateList } from "../Constant";
import { BASE_URL } from '../Config';
import Swal from "sweetalert2"; // Import Swal for popup messages
import ErrorBoundary from "../component/ErrorBoundary"; // Import the ErrorBoundary component

function Garnishment2() {
  const generateBatchId = () => {
    const timestamp = Date.now().toString(16);
    const randomString = Math.random().toString(36).substring(2, 8); // Ensure randomString is defined here
    return `BATCH-${timestamp}-${randomString}`;
  };

  const [formData, setFormData] = useState({
    batch_id: generateBatchId(),
    ee_id: "",
    work_state: "",
    pay_period: "",
    filing_status: "",
    wages: "",
    commission_and_bonus: "",
    non_accountable_allowances: "",
    gross_pay: "",
    federal_income_tax: "",
    social_security_tax: "",
    medicare_tax: "",
    state_tax: "",
    local_tax: "",
    union_dues: "",
    wilmington_tax: "",
    
    industrial_insurance: "",
    life_insurance: "",
    CaliforniaSDI: "",
    famli_tax: "",
    medical_insurance: "",
    net_pay: "",
    no_of_dependent_child: "",
    support_second_family: "",
    arrears_greater_than_12_weeks: "",
    garnishment_data: [
      {
        type: "",
        data: [
          {
            case_id: "",
            ordered_amount: "",
            arrear_amount: "",
          },
        ],
      },
    ],
  });

  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // Maintenance mode state
  const [errors, setErrors] = useState({}); // State to track errors
  const resultsRef = React.createRef(); // Create a reference for the results section

  useEffect(() => {
    // Simulate fetching maintenance mode status from an API or config
    const fetchMaintenanceMode = async () => {
      const maintenanceStatus = false; // Replace with actual API call or config
      setIsMaintenanceMode(maintenanceStatus);
    };
    fetchMaintenanceMode();
  }, []);

  useEffect(() => {
    if (calculationResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the results section
    }
  }, [calculationResult]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (e, index, key) => {
    const { value } = e.target;
    const updatedGarnishmentData = [...formData.garnishment_data];
    updatedGarnishmentData[0].data[index][key] = value;
    setFormData((prevData) => ({
      ...prevData,
      garnishment_data: updatedGarnishmentData,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ee_id) {
      newErrors.ee_id = "Employee ID is mandatory.";
    }
    if (formData.garnishment_data[0].type === "Creditor Debt" && !formData.no_of_dependent_child) {
      newErrors.no_of_dependent_child = "No. of Dependent Child is mandatory for Creditor Debt.";
    }
    formData.garnishment_data[0].data.forEach((item, index) => {
      if (!item.case_id) {
        newErrors[`case_id_${index}`] = "Case ID is mandatory.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formattedData = {
        batch_id: formData.batch_id,
        cases: [
          {
            ee_id: formData.ee_id,
            work_state: formData.work_state,
            no_of_exemption_including_self: 0, // Add this field if required
            pay_period: formData.pay_period,
            filing_status: formData.filing_status,
            wages: parseFloat(formData.wages) || 0,
            commission_and_bonus: parseFloat(formData.commission_and_bonus) || 0,
            non_accountable_allowances: parseFloat(formData.non_accountable_allowances) || 0,
            gross_pay: parseFloat(formData.gross_pay) || 0,
            payroll_taxes: {
              federal_income_tax: parseFloat(formData.federal_income_tax) || 0,
              social_security_tax: parseFloat(formData.social_security_tax) || 0,
              medicare_tax: parseFloat(formData.medicare_tax) || 0,
              state_tax: parseFloat(formData.state_tax) || 0,
              local_tax: parseFloat(formData.local_tax) || 0,
              union_dues: parseFloat(formData.union_dues) || 0,
              wilmington_tax: parseFloat(formData.wilmington_tax) || 0,
              
              industrial_insurance: parseFloat(formData.industrial_insurance) || 0,
              life_insurance: parseFloat(formData.life_insurance) || 0,
              california_sdi: parseFloat(formData.california_sdi) || 0,
              famli_tax: parseFloat(formData.famli_tax) || 0,
            },
            payroll_deductions: {
              medical_insurance: parseFloat(formData.medical_insurance) || 0,
            },
            net_pay: parseFloat(formData.net_pay) || 0,
            age: formData.age, // Add this field if required
            is_blind: formData.is_blind, // Add this field if required
            is_spouse_blind: formData.is_spouse_blind, // Add this field if required
            spouse_age: formData.spouse_age, // Add this field if required
            support_second_family: formData.support_second_family,
            no_of_student_default_loan: formData.no_of_student_default_loan,
            arrears_greater_than_12_weeks: formData.arrears_greater_than_12_weeks,
            no_of_dependent_child: parseInt(formData.no_of_dependent_child, 10) || 0, // Include this field
            garnishment_data: formData.garnishment_data.map((garnishment) => ({
              type: garnishment.type,
              data: garnishment.data.map((garnData) => ({
                case_id: garnData.case_id,
                ordered_amount: parseFloat(garnData.ordered_amount) || 0,
                arrear_amount: parseFloat(garnData.arrear_amount) || 0,
                current_medical_support: garnData.current_medical_support || 0, // Add if required
                past_due_medical_support: garnData.past_due_medical_support || 0, // Add if required
                current_spousal_support: garnData.current_spousal_support || 0, // Add if required
                past_due_spousal_support: garnData.past_due_spousal_support || 0, // Add if required
              })),
            })),
          },
        ],
      };

      const response = await axios.post(
        `${BASE_URL}/User/garnishment_calculate/`,
        formattedData
      );

      if (response.data.results?.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.results.error,
        });
      } else {
        setCalculationResult(response.data);
      }
    } catch (error) {
      console.error("Error calculating garnishment:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting the form. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      batch_id: generateBatchId(),
      ee_id: "",
      work_state: "",
      pay_period: "",
      filing_status: "",
      wages: "",
      commission_and_bonus: "",
      non_accountable_allowances: "",
      gross_pay: "",
      federal_income_tax: "",
      social_security_tax: "",
      medicare_tax: "",
      state_tax: "",
      local_tax: "",
      union_dues: "",
      wilmington_tax: "",
    
      industrial_insurance: "",
      life_insurance: "",
      california_sdi: "",
      famli_tax: "",
      medical_insurance: "",
      net_pay: "",
      no_of_dependent_child: "",
      support_second_family: "",
      arrears_greater_than_12_weeks: "",
      garnishment_data: [
        {
          type: "",
          data: [
            {
              case_id: "",
              ordered_amount: "",
              arrear_amount: "",
            },
          ],
        },
      ],
    });
    setCalculationResult(null);
  };

  useEffect(() => {
    // Regenerate batch_id on component mount
    setFormData((prevData) => ({
      ...prevData,
      batch_id: generateBatchId(),
    }));
  }, []);

  return (
    <div className="relative">
      {isMaintenanceMode && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <h1 className="text-white text-2xl font-bold">
            This component is currently under maintenance. Please check back later.
          </h1>
        </div>
      )}
      <div className={isMaintenanceMode ? "pointer-events-none opacity-50" : ""}>
        <h1 className="edit-profile mt-6 mb-4 inline-block">
          <FaBalanceScaleRight />
          Garnishment Calculator 
        </h1>
        <h2 className="text-lg font-bold mb-4">Batch ID: {formData.batch_id}</h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="batch_id" value={formData.batch_id} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
            <div>
              <label htmlFor="ee_id" className="block text-sm font-bold mb-1">
                Employee ID <span className="text-red-700">*</span>:
              </label>
              <input
                type="text"
                id="ee_id"
                placeholder="Enter Employee ID"
                name="ee_id"
                value={formData.ee_id}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              />
              {errors.ee_id && <p className="text-red-600 text-xs mt-1">{errors.ee_id}</p>}
            </div>
            <div>
              <label htmlFor="garnishment_type" className="block text-sm font-bold mb-1">
                Garnishment Type:
              </label>
              <select
                id="garnishment_type"
                name="garnishment_type"
                value={formData.garnishment_data[0].type}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    garnishment_data: [
                      {
                        ...prevData.garnishment_data[0],
                        type: e.target.value,
                      },
                    ],
                  }))
                }
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              >
                <option value="">Select Garnishment Type</option>
                <option value="Child Support">Child Support Garnishment</option>
                <option value="Creditor Debt">Creditor Debt Garnishment</option>
                <option value="Federal Tax Levy">Federal Tax Levy</option>
                {/* <option value="Tax Refund Garnishment">Tax Refund Garnishment</option> */}
                {/* <option value="Social Security Garnishment">Social Security Garnishment (limited cases)</option> */}
                <option value="student default loan">Student Loan Garnishment</option>
                <option value="State Tax Levy">State Tax Levy</option>
                
              </select>
            </div>
            <div>
              <label htmlFor="work_state" className="block text-sm font-bold mb-1">
                Work State:
              </label>
              <select
                id="work_state"
                name="work_state"
                value={formData.work_state}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              >
                <option value="">Select Work State</option>
                {StateList.map((state) => (
                  <option key={state.id} value={state.label}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pay_period" className="block text-sm font-bold mb-1">
                Pay Period <span className="text-red-700">*</span>:
              </label>
              <select
                id="pay_period"
                name="pay_period"
                value={formData.pay_period}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              >
                <option value="">Select Pay Period</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="semimonthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="filing_status" className="block text-sm font-bold mb-1">
                Filing Status:
              </label>
              <select
                id="filing_status"
                name="filing_status"
                value={formData.filing_status}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              >
                <option value="">Select Filing Status</option>
                <option value="single">Single</option>
                <option value="married_filing_joint_return">Married Filing Joint Return</option>
                <option value="married_filing_separate_return">Married Filing Separate Return</option>
                <option value="head_of_household">Head of Household</option>
                <option value="qualifying_widowers">Qualifying Widowers</option>
                <option value="additional_exempt_amount">Additional Exempt Amount</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="wages" className="block text-sm font-bold mb-1">
                Wages:
              </label>
              <input
                type="number"
                id="wages"
                name="wages"
                placeholder="Enter Wages Amount"
                value={formData.wages}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="commission_and_bonus" className="block text-sm font-bold mb-1">
                Commission and Bonus:
              </label>
              <input
                type="number"
                id="commission_and_bonus"
                name="commission_and_bonus"
                placeholder="Enter Commission and Bonus Amount"
                value={formData.commission_and_bonus}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="non_accountable_allowances" className="block text-sm font-bold mb-1">
                Non-Accountable Allowances:
              </label>
              <input
                type="number"
                id="non_accountable_allowances"
                name="non_accountable_allowances"
                placeholder="Enter Non-Accountable Amount"
                value={formData.non_accountable_allowances}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="gross_pay" className="block text-sm font-bold mb-1">
                Gross Pay:
              </label>
              <input
                type="number"
                id="gross_pay"
                name="gross_pay"
                placeholder="Enter Gross Pay Amount"
                value={formData.gross_pay}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="federal_income_tax" className="block text-sm font-bold mb-1">
                Federal Income Tax:
              </label>
              <input
                type="number"
                id="federal_income_tax"
                name="federal_income_tax"
                placeholder="Enter Federal Income Tax Amount"
                value={formData.federal_income_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="social_security_tax" className="block text-sm font-bold mb-1">
                Social Security Tax:
              </label>
              <input
                type="number"
                id="social_security_tax"
                name="social_security_tax"
                placeholder="Enter Social Security Tax Amount"
                value={formData.social_security_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="medicare_tax" className="block text-sm font-bold mb-1">
                Medicare Tax:
              </label>
              <input
                type="number"
                id="medicare_tax"
                name="medicare_tax"
                placeholder="Enter Medicare Tax Amount"
                value={formData.medicare_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="state_tax" className="block text-sm font-bold mb-1">
                State Tax:
              </label>
              <input
                type="number"
                id="state_tax"
                name="state_tax"
                placeholder="Enter State Tax Amount"
                value={formData.state_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="local_tax" className="block text-sm font-bold mb-1">
                Local Tax:
              </label>
              <input
                type="number"
                id="local_tax"
                name="local_tax"
                placeholder="Enter Local Tax Amount"
                value={formData.local_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="union_dues" className="block text-sm font-bold mb-1">
                Union Dues:
              </label>
              <input
                type="number"
                id="union_dues"
                name="union_dues"
                placeholder="Enter Union Dues Amount"
                value={formData.union_dues}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="wilmington_tax" className="block text-sm font-bold mb-1">
                Wilmington Tax:
              </label>
              <input
                type="number"
                id="wilmington_tax"
                name="wilmington_tax"
                 placeholder="Enter Wilmington Tax Amount"
                value={formData.wilmington_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            
            <div>
              <label htmlFor="industrial_insurance" className="block text-sm font-bold mb-1">
                Industrial Insurance:
              </label>
              <input
                type="number"
                id="industrial_insurance"
                name="industrial_insurance"
                 placeholder="Enter Industrial Insurance Amount"
                value={formData.industrial_insurance}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="life_insurance" className="block text-sm font-bold mb-1">
                Life Insurance:
              </label>
              <input
                type="number"
                id="life_insurance"
                name="life_insurance"
                placeholder="Enter Life Insurance Amount"
                value={formData.life_insurance}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="california_sdi" className="block text-sm font-bold mb-1">
                SDI:
              </label>
              <input
                type="number"
                id="california_sdi"
                name="california_sdi"
                placeholder="Enter SDI Amount"
                value={formData.california_sdi}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="famli_tax" className="block text-sm font-bold mb-1">
                FAMLI Tax:
              </label>
              <input
                type="number"
                id="famli_tax"
                name="famli_tax"
                placeholder="Enter FAMLI Tax Amount"
                value={formData.famli_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="medical_insurance" className="block text-sm font-bold mb-1">
                Medical Insurance:
              </label>
              <input
                type="number"
                id="medical_insurance"
                name="medical_insurance"
                placeholder="Enter Medical Insurance Amount"
                value={formData.medical_insurance}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="net_pay" className="block text-sm font-bold mb-1">
                Net Pay:
              </label>
              <input
                type="number"
                id="net_pay"
                name="net_pay"
                 placeholder="Enter Net Pay Amount"
                value={formData.net_pay}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="no_of_dependent_child" className="block text-sm font-bold mb-1">
                No. of Dependent Child:
                {formData.garnishment_data[0].type === "Creditor Debt" && (
                  <span className="text-red-700"> *</span>
                )}
              </label>
              <input
                type="number"
                id="no_of_dependent_child"
                name="no_of_dependent_child"
                placeholder="Enter Number of Dependent Child"
                value={formData.no_of_dependent_child}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required={formData.garnishment_data[0].type === "Creditor Debt"}
              />
              {errors.no_of_dependent_child && (
                <p className="text-red-600 text-xs mt-1">{errors.no_of_dependent_child}</p>
              )}
            </div>
            <div>
              <label htmlFor="support_second_family" className="block text-sm font-bold mb-1">
                Support Second Family:
              </label>
              <select
                id="support_second_family"
                name="support_second_family"
                value={formData.support_second_family}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              >
                <option value="">Select Support Second Family</option>
                <option value="Yes">True</option>
                <option value="No">False</option>
              </select>
            </div>
            <div>
              <label htmlFor="arrears_greater_than_12_weeks" className="block text-sm font-bold mb-1">
                Arrears Greater Than 12 Weeks:
              </label>
              <select
                id="arrears_greater_than_12_weeks"
                name="arrears_greater_than_12_weeks"
                value={formData.arrears_greater_than_12_weeks}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              >
                <option value="">Select Arrears Greater Than 12 Weeks</option>
                <option value="Yes">True</option>
                <option value="No">False</option>
              </select>
            </div>
          </div>
          <h2 className="mt-6 text-lg font-bold">Garnishment Data</h2>
          {formData.garnishment_data[0].data.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 border p-4 rounded-md">
              <div>
                <label htmlFor={`case_id_${index}`} className="block text-sm font-bold mb-1">
                  Case ID <span className="text-red-700">*</span>:
                </label>
                <input
                  type="text"
                  id={`case_id_${index}`}
                  value={item.case_id}
                   placeholder="Enter Case ID"
                  onChange={(e) => handleNestedInputChange(e, index, "case_id")}
                  className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  required
                />
                {errors[`case_id_${index}`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`case_id_${index}`]}</p>
                )}
              </div>
              <div>
                <label htmlFor={`ordered_amount_${index}`} className="block text-sm font-bold mb-1">
                  Ordered Amount:
                </label>
                <input
                  type="number"
                  id={`ordered_amount_${index}`}
                  placeholder="Enter Ordered Amount"
                  value={item.ordered_amount}
                  onChange={(e) => handleNestedInputChange(e, index, "ordered_amount")}
                  className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor={`arrear_amount_${index}`} className="block text-sm font-bold mb-1">
                  Arrear Amount:
                </label>
                <input
                  type="number"
                  id={`arrear_amount_${index}`}
                  value={item.arrear_amount}
                   placeholder="Enter Arrear Amount "
                  onChange={(e) => handleNestedInputChange(e, index, "arrear_amount")}
                  className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-all duration-200 text-sm"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white py-3 px-4 rounded hover:bg-gray-600 transition-all duration-200 text-sm"
            >
              Reset
            </button>
          </div>
        </form>
        <div ref={resultsRef} className="mt-6">
          {calculationResult && calculationResult.results && (
            <>
              <h2 className="text-lg font-bold mb-4">Calculation Result:</h2>
              <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">Disposable Earnings</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Allowable Disposable Earnings</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total Mandatory Deduction</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Withholding Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Withholding Arrear</th>
                  </tr>
                </thead>
                <tbody>
                  {calculationResult.results.map((result, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{result.disposable_earning}</td>
                      <td className="border border-gray-300 px-4 py-2">{result.allowable_disposable_earning}</td>
                      <td className="border border-gray-300 px-4 py-2">{result.total_mandatory_deduction}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {result.agency[0]?.withholding_amt[0]?.child_support !== undefined
                          ? result.agency[0]?.withholding_amt[0]?.child_support
                          : result.agency[0]?.withholding_amt[0]?.garnishment_amount !== undefined
                          ? result.agency[0]?.withholding_amt[0]?.garnishment_amount
                          : result.agency[0]?.withholding_amt[0]?.creditor_debt !== undefined
                          ? result.agency[0]?.withholding_amt[0]?.creditor_debt
                          : 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {result.agency[1]?.arrear[0]?.withholding_arrear !== undefined
                          ? result.agency[1]?.arrear[0]?.withholding_arrear
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Garnishment2Wrapper() {
  return (
    <ErrorBoundary>
      <Garnishment2 />
    </ErrorBoundary>
  );
}
