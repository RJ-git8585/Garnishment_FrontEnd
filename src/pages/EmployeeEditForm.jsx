

/**
 * EmployeeEditForm Component
 * 
 * This component renders a form to edit employee details. It fetches employee data
 * based on `case_id` and `ee_id` from the URL parameters and allows the user to update
 * the details. The form includes various input fields, radio buttons, and dropdowns
 * for editing employee information.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered EmployeeEditForm component.
 * 
 * @example
 * <EmployeeEditForm />
 * 
 * @dependencies
 * - React hooks: `useState`, `useEffect`
 * - React Router hooks: `useParams`, `useNavigate`
 * - Material-UI components: `TextField`, `Radio`, `FormControl`, `InputLabel`, `Select`, 
 *   `MenuItem`, `FormLabel`, `RadioGroup`, `FormControlLabel`
 * 
 * @state {Object} employeeData - The state object containing employee details.
 * @state {string} employeeData.ee_id - Employee ID (read-only).
 * @state {string} employeeData.case_id - Case ID (read-only).
 * @state {string} employeeData.social_security_number - Social Security Number (formatted as XXX-XX-XXXX).
 * @state {string} employeeData.age - Employee's age.
 * @state {string} employeeData.gender - Employee's gender.
 * @state {string} employeeData.home_state - Employee's home state.
 * @state {string} employeeData.work_state - Employee's work state.
 * @state {string} employeeData.pay_period - Employee's pay period.
 * @state {boolean} employeeData.support_second_family - Whether the employee supports a second family.
 * @state {string} employeeData.number_of_exemptions - Number of exemptions.
 * @state {string} employeeData.filing_status - Filing status.
 * @state {string} employeeData.marital_status - Marital status.
 * @state {string} employeeData.number_of_student_default_loan - Number of student default loans.
 * @state {string} employeeData.spouse_age - Spouse's age.
 * @state {boolean} employeeData.is_spouse_blind - Whether the spouse is blind.
 * @state {boolean} employeeData.garnishment_fees_status - Garnishment fees status (active/suspended).
 * @state {string} employeeData.garnishment_fees_suspended_till - Date until garnishment fees are suspended.
 * 
 * @hooks
 * - `useEffect`: Fetches employee data when `case_id` or `ee_id` changes.
 * - `useState`: Manages the state of employee data.
 * - `useParams`: Retrieves `case_id` and `ee_id` from the URL.
 * - `useNavigate`: Navigates to the employee list page after successful update.
 * 
 * @functions
 * @function fetchEmployeeData - Fetches employee data from the API and updates the state.
 * @function handleInputChange - Handles changes to input fields and updates the state.
 * @function handleSubmit - Submits the updated employee data to the API.
 * @function renderInput - Renders a Material-UI `TextField` for input fields.
 * @function renderRadio - Renders a Material-UI `RadioGroup` for boolean options.
 * @function renderSelect - Renders a Material-UI `Select` dropdown for predefined options.
 * 
 * @api
 * - GET `${BASE_URL}/User/GetSingleEmployee/:case_id/:ee_id/` - Fetches employee data.
 * - PUT `${BASE_URL}/User/update_employee_details/:case_id/:ee_id/` - Updates employee details.
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../configration/Config";
import { StateList,GenderList,PeriodList,FillingStatusList } from "../constants/Constant";
import { Radio,TextField } from "@mui/material"; 
import { FormControl, InputLabel, Select, MenuItem,FormLabel, RadioGroup, FormControlLabel } from "@mui/material";




function EmployeeEditForm() {
  const { case_id, ee_id } = useParams();
  console.log(case_id, ee_id)
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    ee_id: "",
    case_id: "",
    social_security_number: "",
    blind: "",
    age: "",
    gender: "",
    home_state: "",
    work_state: "",
    pay_period: "",
    support_second_family: "",
    number_of_exemptions: "",
    filing_status: "",
    marital_status: "",
    number_of_student_default_loan: "",
    spouse_age: "",
    is_spouse_blind: "",
    garnishment_fees_status: "",
    garnishment_fees_suspended_till: "",
  });
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/GetSingleEmployee/${case_id}/${ee_id}/`);
        const jsonData = await response.json();
        setEmployeeData(jsonData.data[0]);
        console.log(jsonData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, [case_id, ee_id]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  let updatedValue = value;

  if (type === "radio") {
    updatedValue = value === "true";  // Convert "true"/"false" strings to boolean
  }

    if (name === "social_security_number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 9);
      updatedValue = updatedValue
        .replace(/^(\d{3})(\d{0,2})/, "$1-$2")
        .replace(/^(\d{3}-\d{2})(\d{0,4})/, "$1-$2");
    }
    setEmployeeData({ ...employeeData, [name]: updatedValue });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/User/update_employee_details/${case_id}/${ee_id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      if (response.ok) navigate("/employee");
      else { 
        console.error("Failed to update employee");
        alert("Failed to update employee. Please try again.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  const renderInput = (label, name, type = "text") => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={employeeData[name]}
      onChange={handleInputChange}
      variant="outlined"
      fullWidth
      size="small"
      sx={{
        mt: 1,
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6366F1" }, // Indigo-500
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366F1" },
        },
      }}
      InputProps={{
        readOnly: name === "ee_id" || name === "case_id",
      }}
      inputProps={{
        ...(name === "social_security_number" && { maxLength: 11, placeholder: "XXX-XX-XXXX" }),
      }}
    />
  );

  const renderRadio = (label, name, garnishment_fees_status = false) => (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <FormLabel sx={{ fontSize: "14px", color: "#374151", fontWeight: 500 }}>
        {label}
      </FormLabel>
      <RadioGroup
        row
        name={name}
        value={String(employeeData[name])}
        onChange={handleInputChange}
        sx={{ mt: 0.5 }}
      >
        {["true", "false"].map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio color={option === "false" ? "error" : "success"} />}
            label={
              garnishment_fees_status
                ? option === "true"
                  ? "Active"
                  : "Suspended"
                : option === "true"
                ? "Yes"
                : "No"
            }
            sx={{
              "& .MuiTypography-root": {
                fontSize: "14px",
                fontWeight: option === "false" ? 600 : 400,
                color: option === "false" ? "#D32F2F" : "#4B5563", // Red-700 & Gray-600
              },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
  
  const renderSelect = (label, name, options) => (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={employeeData[name]}
        onChange={handleInputChange}
        label={label}
        size="small"
        sx={{
          borderRadius: "6px",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6366F1" }, // Indigo-500
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366F1" },
        }}
      >
        <MenuItem value="" disabled>Select {label}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  return (
    <>
        
          <h2 className="edit-profile text-lg mt-6 mb-4 inline-block">Edit Employee</h2>
        
          <form onSubmit={handleSubmit} className="space-y-6 form_cls">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 p-4">
                  {renderInput("Employee ID", "ee_id")}
                  {renderInput("Case ID", "case_id")}
                  {renderInput("Social Security Number", "social_security_number")}
                  {renderInput("Age", "age")}
                  {renderSelect("Gender", "gender", GenderList)}
                  {renderSelect("Home State", "home_state", StateList)}
                  {renderSelect("Work State", "work_state", StateList)}
                  {renderSelect("Pay Period", "pay_period" , PeriodList)}
                  {renderInput("Exemptions", "number_of_exemptions")}
                  {renderSelect("Filing Status", "filing_status",FillingStatusList)}
                  {renderInput("Marital Status", "marital_status")}
                  {renderInput("Student Default Loan", "number_of_student_default_loan")}
                  {renderInput("Spouse Age", "spouse_age")}
                  {renderInput("Garnishment Fees Suspended Till", "garnishment_fees_suspended_till", "date")}
              </div>
              <hr className="" />
              <div className="grid grid-cols-1 m-0 gap-6 sm:grid-cols-2 p-4">
                  {renderRadio("Garnishment Fees Status", "garnishment_fees_status", true)}
                  {renderRadio("Support Family", "support_second_family")}
                  {renderRadio("Is Blind", "is_blind")}
                  {renderRadio("Spouse Blind", "is_spouse_blind")}
              </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-sm text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Save Changes
              </button>
            </div>
          </form> 
          </>
  );
}

export default EmployeeEditForm;
