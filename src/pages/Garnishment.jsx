
/**
 * Garnishment Component
 * 
 * This component represents a Garnishment Calculator page. It allows users to input garnishment-related data,
 * select garnishment types, and submit the data for processing. The component includes multiple tabs for 
 * different garnishment types and handles form submission, state management, and tab switching.
 * 
 * @component
 * 
 * @returns {JSX.Element} The Garnishment Calculator page.
 * 
 * @example
 * <Garnishment />
 * 
 * @state {string} employee_name - The name of the employee.
 * @state {string} earnings - The earnings of the employee.
 * @state {string} garnishment_fees - The garnishment fees.
 * @state {string} order_id - The order ID.
 * @state {string} state - The state of the garnishment.
 * @state {string} arrears_amt - The arrears amount.
 * @state {boolean} arrears_greater_than_12_weeks - Checkbox state for arrears greater than 12 weeks.
 * @state {boolean} support_second_family - Checkbox state for supporting a second family.
 * @state {Array} options - Options for employee selection.
 * @state {string|null} employee_id - The selected employee ID.
 * @state {string} activeTab - The currently active tab.
 * 
 * @function handleCheckboxChange - Handles the change event for the arrears checkbox.
 * @param {Object} event - The event object from the checkbox change.
 * 
 * @function handleReset - Resets the form fields and state values to their initial state.
 * 
 * @function handleTabClick - Handles tab switching by setting the active tab.
 * @param {string} tab - The name of the tab to activate.
 * 
 * @function handleSubmit - Handles form submission by sending the data to the server.
 * @param {Object} event - The event object from the form submission.
 * 
 * @constant {number} employer_id - The employer ID retrieved from session storage.
 * 
 * @dependencies
 * - React (useState, useEffect)
 * - Headertop (component)
 * - Sidebar (component)
 * - MultipleChild (component)
 * - StudentLoan (component)
 * - MultipleStudentLoan (component)
 * - FederalTax (component)
 * - BASE_URL (constant)
 * - FaBalanceScaleRight (icon from react-icons)
 */
import React, { useState, useEffect } from "react";
import Headertop from "../component/Headertop";
import Sidebar from "../component/sidebar";
import { FaBalanceScaleRight } from "react-icons/fa";
import MultipleChild from "../forms/MultipleChild";
import StudentLoan from "../forms/StudentLoan";
import { BASE_URL } from "../Config";
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

  // tab
  const [activeTab, setActiveTab] = useState("Child Support");
  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  // tabs cloased
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
    <>
      
            <div className="p-0">
              {/* <h1 className="uppercase font-bold mb-4 inline-block"><FaBalanceScaleRight/>Garnishment Calcultor</h1> */}
              <h1 className="edit-profile mt-6 mb-4 inline-block">
                <FaBalanceScaleRight />
                Garnishment Calculator
              </h1>
              <form onSubmit={handleSubmit}>
                {/* <MultiStep activeStep={2} > */}
                <div className="hidden">
                  <div className="mt-2 hidden">
                    <input
                      id="employer_id"
                      name="employer_id"
                      value={employer_id}
                      type="hidden"
                      // autoComplete="employee_name"
                      // onChange={(e) => setEid(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="tabs mb-6">
                  <label
                    htmlFor="empID"
                    className="block  text-red-700 text-sm font-semibold mb-3"
                  >
                    Please Select Garnishment Type:
                  </label>

                  <button
                    className={
                      activeTab === "Child Support"
                        ? " custom active  mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                        : " mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-gray-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                    }
                    onClick={() => handleTabClick("Child Support")}
                  >
                    Child Support
                  </button>
                  <button
                    className={
                      activeTab === "Student loan"
                        ? "active  mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                        : " mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                    }
                    onClick={() => handleTabClick("Student loan")}
                  >
                    Student loan
                  </button>
                  <button
                    className={
                      activeTab === "MultiStudent Loan"
                        ? "active  mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                        : " mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
                    }
                    onClick={() => handleTabClick("MultiStudent Loan")}
                  >
                    MultiStudent Loan
                  </button>
                  <button
                    className={
                      activeTab === "Federal Tax"
                        ? "active inline-flex  mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4"
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
                      {" "}
                      <MultipleChild/>
                    </div>
                  )}
                  {activeTab === "Student loan" && (
                    <div>
                      {" "}
                      <StudentLoan/>
                    </div>
                  )}
                  {activeTab === "MultiStudent Loan" && (
                    <div>
                      {" "}
                      <MultipleStudentLoan/>
                    </div>
                  )}
                  {activeTab === "Federal Tax" && (
                    <div>
                      {" "}
                      <FederalTax/>
                    </div>
                  )}
                  </div>
              </form>
            </div>
         
    </>
  );
}

export default Garnishment;
