
/**
 * Garnishment Component
 * 
 * This component provides a Garnishment Calculator with multiple tabs for different garnishment types.
 * It includes functionality for form submission, tab switching, and maintenance mode display.
 * 
 * @component
 * 
 * @returns {JSX.Element} The Garnishment Calculator component.
 * 
 * @example
 * <Garnishment />
 * 
 * @state {string} employee_name - The name of the employee.
 * @state {string} earnings - The earnings of the employee.
 * @state {string} garnishment_fees - The garnishment fees.
 * @state {string} order_id - The order ID.
 * @state {string} state - The state associated with the garnishment.
 * @state {string} arrears_amt - The arrears amount.
 * @state {boolean} arrears_greater_than_12_weeks - Checkbox state for arrears greater than 12 weeks.
 * @state {boolean} support_second_family - Checkbox state for supporting a second family.
 * @state {Array} options - Options for employee selection.
 * @state {string|null} employee_id - Selected employee ID.
 * @state {string} activeTab - The currently active tab.
 * @state {boolean} isMaintenanceMode - Indicates if the component is in maintenance mode.
 * 
 * @effect Fetches the maintenance mode status when the component mounts.
 * 
 * @function handleCheckboxChange - Handles changes to the arrears checkbox.
 * @param {Object} event - The event object from the checkbox change.
 * 
 * @function handleReset - Resets all form fields and states to their initial values.
 * 
 * @function handleTabClick - Handles switching between tabs.
 * @param {string} tab - The name of the tab to switch to.
 * 
 * @function handleSubmit - Handles form submission and sends data to the server.
 * @param {Object} event - The event object from the form submission.
 * 
 * @constant {number} employer_id - The employer ID retrieved from session storage.
 * 
 * @dependencies
 * - React
 * - react-icons (FaBalanceScaleRight)
 * - MultipleChild, StudentLoan, MultipleStudentLoan, FederalTax components
 * - BASE_URL from configuration
 */
import React, { useState, useEffect } from "react";
import { FaBalanceScaleRight } from "react-icons/fa";
import MultipleChild from "../forms/MultipleChild";
import StudentLoan from "../forms/StudentLoan";
import { BASE_URL } from "../configration/Config";
import MultipleStudentLoan from "../forms/MultipleStudentLoan";
import FederalTax from "../forms/FederalTax";

function Garnishment() {
  const [employee_name, setEmpName] = useState("");
  const [earnings, setEarnings] = useState("");
  const [garnishment_fees, setGarnishmentFees] = useState("");
  const [order_id, setOrderID] = useState("");
  const [state, setState] = useState("");
  const [arrears_amt, setArrears] = useState("");
  const [arrears_greater_than_12_weeks, setIsChecked] = useState(false);
  const [support_second_family, setIsCheckedFamily] = useState(false); // Initialize checkbox state as unchecked
  const [options, setOptions] = useState([]);
  const [employee_id, setSelectedOption] = useState(null);
  const employer_id = parseInt(sessionStorage.getItem("id"));
  const [activeTab, setActiveTab] = useState("Child Support");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // Maintenance mode state

  useEffect(() => {
    // Simulate fetching maintenance mode status from an API or config
    const fetchMaintenanceMode = async () => {
      const maintenanceStatus = true; // Replace with actual API call or config
      setIsMaintenanceMode(maintenanceStatus);
    };
    fetchMaintenanceMode();
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleReset = () => {
    setSelectedOption("");
    setEmpName("");
    setEarnings("");
    setGarnishmentFees("");
    setOrderID("");
    setState("");
    setArrears("");
    setIsChecked("");
    setIsCheckedFamily("");
  };

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      employer_id,
      employee_id,
      employee_name,
      earnings,
      garnishment_fees,
      order_id,
      state,
      arrears_greater_than_12_weeks,
      support_second_family,
      arrears_amt,
    };

    console.log(data);

    fetch(`${BASE_URL}/User/CalculationDataView`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        console.log("Data submitted successfully!");
        // toast.success('Calculation Added Successfully !!');
        handleReset();
        setSelectedOption("");
        setEmpName("");
        setEarnings("");
        setGarnishmentFees("");
        setSelectedOption("");
        setOrderID("");
        setState("");
        setIsChecked("");
        setIsCheckedFamily("");
        setArrears("");
      } else {
        console.error("Error submitting data:", response.statusText);
      }
    });
  };

  return (
    <div className="relative">
      {isMaintenanceMode && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center z-50">
          <h1 className="text-white text-3xl font-bold mb-4">
            Maintenance Mode
          </h1>
          <p className="text-white text-lg mb-6">
            This feature is currently under maintenance. Please check back later.
          </p>
          <p><a className="text-sm" href="/garnishment-pro">Calculator Pro</a></p>
        </div>
      )}
      <div className={isMaintenanceMode ? "pointer-events-none opacity-50" : ""}>
        <div>
          <div className="p-0">
            <h1 className="edit-profile mt-6 mb-4 inline-block">
              <FaBalanceScaleRight />
              Garnishment Calculator
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="hidden">
                <div className="mt-2 hidden">
                  <input
                    id="employer_id"
                    name="employer_id"
                    value={employer_id}
                    type="hidden"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="tabs mb-6">
                <label
                  htmlFor="empID"
                  className="block text-red-700 text-sm font-semibold mb-3"
                >
                  Please Select Garnishment Type:
                </label>

                <button
                  className={
                    activeTab === "Child Support"
                      ? "custom active mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                      : "mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-gray-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                  }
                  onClick={() => handleTabClick("Child Support")}
                >
                  Child Support
                </button>
                <button
                  className={
                    activeTab === "Student loan"
                      ? "active mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                      : "mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                  }
                  onClick={() => handleTabClick("Student loan")}
                >
                  Student loan
                </button>
                <button
                  className={
                    activeTab === "MultiStudent Loan"
                      ? "active mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                      : "mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                  }
                  onClick={() => handleTabClick("MultiStudent Loan")}
                >
                  MultiStudent Loan
                </button>
                <button
                  className={
                    activeTab === "Federal Tax"
                      ? "active inline-flex mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                      : "inline-flex mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                  }
                  onClick={() => handleTabClick("Federal Tax")}
                >
                  Federal Tax
                </button>
              </div>
              {/* Tab content */}
              <div className="tab-content">
                {activeTab === "Child Support" && (
                  <div>
                    <MultipleChild />
                  </div>
                )}
                {activeTab === "Student loan" && (
                  <div>
                    <StudentLoan />
                  </div>
                )}
                {activeTab === "MultiStudent Loan" && (
                  <div>
                    <MultipleStudentLoan />
                  </div>
                )}
                {activeTab === "Federal Tax" && (
                  <div>
                    <FederalTax />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Garnishment;
