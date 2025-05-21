import React, { useState, useEffect } from "react";
import { FaBalanceScaleRight } from "react-icons/fa";
import axios from "axios";
import { StateList, StateCreditorList, StateLevyContactList } from "../constants/Constant";
import { BASE_URL } from '../configration/Config';
import Swal from "sweetalert2"; // Import Swal for popup messages
import ErrorBoundary from "../component/ErrorBoundary"; // Import the ErrorBoundary component

function Garnishment2() {
  const generateBatchId = () => {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-3); // Shorten and capitalize timestamp
    const randomString = Math.random().toString(36).toUpperCase().substring(2, 5); // Capitalize random string
    return `B${timestamp}${randomString}`; // Combine and return in uppercase
  };

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-3);
    const randomString = Math.random().toString(36).toUpperCase().substring(2, 5);
    return `EE${timestamp}${randomString}`;
  };

  const generateCaseId = () => {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-3);
    const randomString = Math.random().toString(36).toUpperCase().substring(2, 5);
    return `C${timestamp}${randomString}`;
  };

  const [formData, setFormData] = useState(() => {
    const initialFormData = {
      batch_id: generateBatchId(),
      ee_id: generateEmployeeId(),
      work_state: "",
      pay_period: "",
      filing_status: "",
      gross_pay: "",
      federal_income_tax: "",
      net_pay: "",
      no_of_dependent_child: "",
      support_second_family: "",
      arrears_greater_than_12_weeks: "",
      no_of_exemption_including_self: "",
      garnishment_data: [
        {
          type: "",
          data: [],
        },
      ],
    };

    return initialFormData;
  });

  const [stateOptions, setStateOptions] = useState(StateList); // Default to StateList
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

  const handleGarnishmentTypeChange = (e) => {
    const selectedType = e.target.value;

    if (selectedType === "Reset") {
      handleReset(); // Reset the form
      return;
    }

    if (selectedType === "Federal Tax Levy" || selectedType === "student default loan") {
      Swal.fire({
        icon: "info",
        title: "Not Implemented",
        text: "This calculation is not implemented yet.",
      });
      return; // Prevent further processing for these types
    }

    setFormData((prevData) => {
      let updatedData = { ...prevData };

      switch (selectedType) {
        case "Child Support":
        case "Creditor Debt":
          updatedData = {
            ...prevData,
            garnishment_data: [
              {
                type: selectedType,
                data: [
                  {
                    ordered_amount: "",
                    arrear_amount: "",
                  },
                ],
              },
            ],
          };
          break;

        case "State Tax Levy":
          updatedData = {
            ...prevData,
            garnishment_data: [
              {
                type: "State Tax Levy",
                data: [
                  {
                    case_id: generateCaseId(),
                    ordered_amount: "",
                    arrear_amount: "",
                  },
                ],
              },
            ],
          };
          break;

        default:
          updatedData.garnishment_data[0] = {
            ...updatedData.garnishment_data[0],
            type: selectedType,
          };
          break;
      }

      return updatedData;
    });

    // Update state options based on garnishment type
    switch (selectedType) {
      case "Child Support":
        setStateOptions(StateList);
        console.log("Child Support selected");
        break;
      case "Creditor Debt":
        setStateOptions(StateCreditorList);
        console.log("Creditor Debt selected");
        break;
      case "State Tax Levy":
        setStateOptions(StateLevyContactList);
        console.log("State Tax Levy selected");
        break;
      default:
        setStateOptions([]); // Clear options if no valid type is selected
        break;
    }
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
            case_id: formData.case_id, // Pass case_id
            work_state: formData.work_state,
            no_of_exemption_including_self: parseInt(formData.no_of_exemption_including_self, 10) || 0,
            pay_period: formData.pay_period,
            filing_status: formData.filing_status,
            gross_pay: parseFloat(formData.gross_pay) || 0,
            wages: 0, // Default to 0
            commission_and_bonus: parseFloat(formData.gross_pay) || 0, // Default to 0
            non_accountable_allowances: 0, // Default to 0
            payroll_taxes: {
              federal_income_tax: parseFloat(formData.federal_income_tax) || 0,
              social_security_tax: 0, // Pass 0
              medicare_tax: 0, // Pass 0
              state_tax: 0, // Pass 0
              local_tax: 0, // Pass 0
              union_dues: 0, // Pass 0
              wilmington_tax: 0, // Pass 0
              industrial_insurance: 0, // Pass 0
              life_insurance: 0, // Pass 0
              california_sdi: 0, // Pass 0
              famli_tax: 0, // Pass 0
              medical_insurance: 0, // Pass 0
            },
            net_pay: parseFloat(formData.net_pay) || 0,
            support_second_family: formData.support_second_family,
            arrears_greater_than_12_weeks: formData.arrears_greater_than_12_weeks,
            no_of_dependent_child: parseInt(formData.no_of_dependent_child, 10) || 0,
            garnishment_data: formData.garnishment_data.map((garnishment) => ({
              type: garnishment.type,
              data: garnishment.data.map((garnData) => ({
                ordered_amount: parseFloat(garnData.ordered_amount) || 0,
                arrear_amount: parseFloat(garnData.arrear_amount) || 0,
              })),
            })),
          },
        ],
      };

      const response = await axios.post(
        `${BASE_URL}/User/garnishment_calculate/`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
      ee_id: generateEmployeeId(),
      case_id: generateCaseId(),
      work_state: "",
      pay_period: "",
      filing_status: "",
      gross_pay: "",
      federal_income_tax: "",
      net_pay: "",
      no_of_dependent_child: "",
      support_second_family: "",
      arrears_greater_than_12_weeks: "",
      no_of_exemption_including_self: "",
      garnishment_data: [
        {
          type: "",
          data: [
            {
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
    // Regenerate batch_id and ee_id on component mount
    setFormData((prevData) => ({
      ...prevData,
      batch_id: generateBatchId(),
      ee_id: generateEmployeeId(),
      case_id: generateCaseId(),
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
        <h1 className="edit-profile text-lg mt-6 mb-4 inline-block">
          <FaBalanceScaleRight />
          Garnishment Calculator 
        </h1>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="batch_id" value={formData.batch_id} />
          <input type="hidden" name="ee_id" value={formData.ee_id} />
          <input type="hidden" name="case_id" value={formData.case_id} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md">
            <div>
              <label htmlFor="garnishment_type" className="block text-sm font-bold mb-1">
                Garnishment Type <span className="text-red-700">*</span>:
              </label>
              <select
                id="garnishment_type"
                name="garnishment_type"
                value={formData.garnishment_data[0].type}
                onChange={handleGarnishmentTypeChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              >
                <option value="">Select Garnishment Type</option>
                <option value="Child Support">Child Support</option>
                <option value="Creditor Debt">Creditor Debt</option>
                <option value="Federal Tax Levy">Federal Tax Levy</option>
                <option value="student default loan">Student Default Loan </option>
                <option value="State Tax Levy">State Tax Levy</option>
              </select>
            </div>
            <div>
              <label htmlFor="work_state" className="block text-sm font-bold mb-1">
                Work State <span className="text-red-700">*</span>:
              </label>
              <select
                id="work_state"
                name="work_state"
                value={formData.work_state}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              >
                <option value="">Select Work State</option>
                {stateOptions.map((state) => (
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
            {formData.garnishment_data[0].type === "Creditor Debt" && (
              <>
                <div>
                  <label htmlFor="filing_status" className="block text-sm font-bold mb-1">
                    Filing Status <span className="text-red-700">*</span>:
                  </label>
                  <select
                    id="filing_status"
                    name="filing_status"
                    value={formData.filing_status}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    required  
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
                  <label htmlFor="no_of_dependent_child" className="block text-sm font-bold mb-1">
                    No. of Dependent Child  <span className="text-red-700">*</span>:
                  </label>
                  <input
                    type="number"
                    id="no_of_dependent_child"
                    name="no_of_dependent_child"
                    placeholder="Enter Number of Dependent Child"
                    value={formData.no_of_dependent_child}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    required
                />
                </div>
              </>
            )}
            <div>
              <label htmlFor="gross_pay" className="block text-sm font-bold mb-1">
                Gross Pay <span className="text-red-700">*</span>:
              </label>
              <input
                type="number"
                id="gross_pay"
                name="gross_pay"
                placeholder="Enter Gross Pay Amount"
                value={formData.gross_pay}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              />
              <p className="text-xs note_cls text-gray-400 mt-1">
                (Wages + Commission & Bonus + Non-Accountable Allowances)
              </p>
            </div>
            <div>
              <label htmlFor="federal_income_tax" className="block text-sm font-bold mb-1">
                Total Mandatory Deduction <span className="text-red-700">*</span>:
              </label>
              <input
                type="number"
                id="federal_income_tax"
                name="federal_income_tax"
                placeholder="Enter Total Mandatory Deduction Amount"
                value={formData.federal_income_tax}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                required
              />
            </div>
            {["State Tax Levy", "Creditor Debt"].includes(formData.garnishment_data[0].type) && (
              <div>
                <label htmlFor="net_pay" className="block text-sm font-bold mb-1">
                  Net Pay <span className="text-red-700">*</span>:
                </label>
                <input
                  type="number"
                  id="net_pay"
                  name="net_pay"
                  placeholder="Enter Net Pay Amount"
                  value={formData.net_pay}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  required
                />
              </div>
            )}
            {formData.garnishment_data[0].type !== "Child Support" && (
              <div>
                <label htmlFor="no_of_exemption_including_self" className="block text-sm font-bold mb-1">
                  No. of Exemptions <span className="text-red-700">*</span>:
                </label>
                <input
                  type="number"
                  id="no_of_exemption_including_self"
                  name="no_of_exemption_including_self"
                  placeholder="Enter No. of Exemptions"
                  value={formData.no_of_exemption_including_self}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  required
                                 />
              </div>
            )}
            {!["Creditor Debt", "State Tax Levy"].includes(formData.garnishment_data[0].type) && (
              <>
                <div>
                  <label htmlFor="support_second_family" className="block text-sm font-bold mb-1">
                    Support Second Family <span className="text-red-700">*</span>:
                  </label>
                  <select
                    id="support_second_family"
                    name="support_second_family"
                    value={formData.support_second_family}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    required
                  >
                    <option value="">Select Support Second Family</option>
                    <option value="Yes">True</option>
                    <option value="No">False</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="arrears_greater_than_12_weeks" className="block text-sm font-bold mb-1">
                    Arrears Greater Than 12 Weeks <span className="text-red-700">*</span>:
                  </label>
                  <select
                    id="arrears_greater_than_12_weeks"
                    name="arrears_greater_than_12_weeks"
                    value={formData.arrears_greater_than_12_weeks}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    required
                  >
                    <option value="">Select Arrears Greater Than 12 Weeks</option>
                    <option value="Yes">True</option>
                    <option value="No">False</option>
                  </select>
                </div>
              </>
            )}
          </div>
         
          {["Child Support", "Federal Tax Levy", "student default loan"].includes(
            formData.garnishment_data[0].type
          ) && (
            <div>
              <h2 className="mt-6 text-lg font-bold">Garnishment Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 border p-4 rounded-md"> 
              <div>
                <label htmlFor="ordered_amount" className="block text-sm font-bold mb-1">
                  Ordered Amount <span className="text-red-700">*</span>:
                </label>
                <input
                  type="number"
                  id="ordered_amount"
                  name="ordered_amount"
                  placeholder="Enter Ordered Amount"
                  value={formData.garnishment_data[0].data[0].ordered_amount}
                  onChange={(e) => handleNestedInputChange(e, 0, "ordered_amount")}
                  className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="arrear_amount" className="block text-sm font-bold mb-1">
                  Arrear Amount <span className="text-red-700">*</span>:
                </label>
                <input
                  type="number"
                  id="arrear_amount"
                  name="arrear_amount"
                  placeholder="Enter Arrear Amount"
                  value={formData.garnishment_data[0].data[0].arrear_amount}
                  onChange={(e) => handleNestedInputChange(e, 0, "arrear_amount")}
                  className="block w-full rounded-md border border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  required
                />
              </div>
            </div>
            </div>
          )}
          <div className="flex justify-end mt-2 space-x-1">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600 transition-all duration-200 text-sm"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-3 rounded hover:bg-gray-600 transition-all duration-200 text-sm"
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
                    <th className="border border-gray-300 px-4 py-2 text-left">Garnishment Fees</th>
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

                      <td className="border border-gray-300 px-4 py-2">
                        {result.er_deduction?.garnishment_fees || "N/A"}
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
