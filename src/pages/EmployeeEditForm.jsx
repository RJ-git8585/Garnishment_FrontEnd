import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Config";
import Headertop from "../component/Headertop";
import Sidebar from "../component/sidebar";

function EmployeeEditForm() {
  const { cid, ee_id } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    ee_id: "",
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
  });
  const GenderList = [
    { id: 1, label: 'Male' },
    { id: 2, label: 'Female' },
    { id: 3, label: 'Other' }
  ]
  const StateList = [
    { id: 1, label: 'Alabama' },
    { id: 2, label: 'Arizona' },
    { id: 3, label: 'California' },
    { id: 4, label: 'Colorado' },
    { id: 5, label: 'Connecticut' },
    { id: 6, label: 'Florida' },
    { id: 7, label: 'Georgia' },
    { id: 8, label: 'Idaho' },
    { id: 9, label: 'Illinois' },
    { id: 10, label: 'Indiana' },
    { id: 11, label: 'Iowa' },
    { id: 12, label: 'Kansas' },
    { id: 13, label: 'Kentucky' },
    { id: 14, label: 'Louisiana' },
    { id: 511, label: 'Maine' },
    { id: 15, label: 'Maryland' },
    { id: 16, label: 'Massachusetts' },
    { id: 17, label: 'Michigan' },
    { id: 18, label: 'Minnesota' },
    { id: 19, label: 'Mississippi' },
    { id: 20, label: 'Missouri' },
    { id: 21, label: 'Montana' },
    { id: 22, label: 'Nebraska' },
    { id: 23, label: 'Nevada' },
    { id: 24, label: 'New Hampshire' },
    { id: 25, label: 'New Jersey' },
    { id: 26, label: 'New Mexico' },
    { id: 27, label: 'North Carolina' },
    { id: 28, label: 'North Dakota' },
    { id: 29, label: 'Ohio' },
    { id: 30, label: 'Oklahoma' },
    { id: 31, label: 'Oregon' },
    { id: 32, label: 'Pennsylvania' },
    { id: 33, label: 'Rhode Island' },
    { id: 34, label: 'South Carolina' },
    { id: 35, label: 'South Dakota' },
    { id: 36, label: 'Tennessee' },
    { id: 37, label: 'Texas' },
    { id: 38, label: 'Utah' },
    { id: 39, label: 'Vermont' },
    { id: 40, label: 'Virginia' },
    { id: 41, label: 'Washington' },
    { id: 42, label: 'West Virginia' },
    { id: 43, label: 'Wisconsin' },
    { id: 44, label: 'Wyoming' },
    { id: 45, label: 'Alaska' },
    { id: 46, label: 'Arkansas' },
    { id: 47, label: 'Delaware' },
    { id: 48, label: 'Hawaii' },
    { id: 49, label: 'Montana' },
    { id: 50, label: 'New York' },
  ];
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/GetSingleEmployee/${cid}/${ee_id}/`);
        const jsonData = await response.json();
        setEmployeeData(jsonData.data[0]);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, [cid, ee_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = name.includes("blind") ? value === "true" : value;

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
      const response = await fetch(`${BASE_URL}/User/update_employee_details/${cid}/${ee_id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      if (response.ok) navigate("/employee");
      else console.error("Failed to update employee");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const renderInput = (label, name, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={employeeData[name]}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...(name === "ee_id" && { readOnly: true })}
        {...(name === "social_security_number" && { maxLength: 11, placeholder: "XXX-XX-XXXX" })}
      />
    </div>
  );

  const renderRadio = (label, name) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex items-center space-x-4">
        {["Yes", "No"].map((option, idx) => (
          <label key={idx} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option === "Yes"}
              checked={employeeData[name] === (option === "Yes")}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
  const renderSelect = (label, name, options) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={employeeData[name]}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
  return (
    <div className="min-h-full">
      <div className="container main ml-auto">
        <Sidebar className="sidebar hidden lg:block" />
        <div className="content ml-auto flex flex-col">
          <Headertop />
          <hr />
          <h2 className="mb-2">Edit Employee</h2>
          <hr className="mb-4" />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 p-4">
              {renderInput("Employee ID", "ee_id")}
              {renderInput("Social Security Number", "social_security_number")}
              {renderRadio("Is Blind", "is_blind")}
              {renderInput("Age", "age")}
              {renderSelect("Gender", "gender",GenderList)}
              {renderSelect("Home State", "home_state", StateList)}
              {renderSelect("Work State", "work_state", StateList)}
              {renderInput("Pay Period", "pay_period")}
              {renderInput("Support Family", "support_second_family")}
              {renderInput("Exemptions", "number_of_exemptions")}
              {renderInput("Filing Status", "filing_status")}
              {renderInput("Marital Status", "marital_status")}
              {renderInput("Student Default Loan", "number_of_student_default_loan")}
              {renderInput("Spouse Age", "spouse_age")}
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
        </div>
      </div>
    </div>
  );
}

export default EmployeeEditForm;
