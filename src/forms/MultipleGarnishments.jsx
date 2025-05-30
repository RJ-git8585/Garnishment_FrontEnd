
/**
 * MultipleGarnishments Component
 * 
 * This component is used to manage and calculate garnishments for employees. It provides a form to input employee details,
 * garnishment details, and other related information. The component also allows users to add multiple inputs for arrears 
 * and withhold amounts, and calculates the garnishment results based on the provided data.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered MultipleGarnishments component.
 * 
 * @example
 * <MultipleGarnishments />
 * 
 * @state {string} employee_name - The name of the selected employee.
 * @state {string} pay_period - The selected pay period (e.g., Weekly, Monthly).
 * @state {number} no_of_exception - The number of exemptions entered by the user.
 * @state {string} disposable_income - The disposable income entered by the user.
 * @state {string} garnishment_fees - The garnishment fees entered by the user.
 * @state {string} order_id - The order ID entered by the user.
 * @state {string} state - The selected state from the dropdown.
 * @state {string} number_of_arrear - The number of arrears entered by the user.
 * @state {string} number_of_garnishment - The number of child support garnishments entered by the user.
 * @state {boolean} arrears_greater_than_12_weeks - Whether arrears are greater than 12 weeks.
 * @state {boolean} support_second_family - Whether the employee supports a second family.
 * @state {number|null} employee_id - The selected employee ID.
 * @state {Array} inputs - Array of input objects for withhold amounts.
 * @state {Array} arrearInputs - Array of input objects for arrears amounts.
 * @state {string} calculationResult - The result of the garnishment calculation.
 * @state {Array} options - List of employee options fetched from the API.
 * @state {string} filing_status - The selected filing status.
 * @state {Array} selectedOptionradio - Array of selected garnishment types.
 * 
 * @constant {Array} optionsradio - List of garnishment types available for selection.
 * @constant {Array} StateList - List of states available for selection.
 * @constant {number} employer_id - The employer ID fetched from session storage.
 * @constant {Object} style - Style object for the trash icon.
 * 
 * @function handleChangeName - Handles the change event for the employee dropdown and updates the employee name.
 * @function handleChangeoptionredio - Handles the change event for garnishment type checkboxes.
 * @function handleAddInput - Adds a new input field for withhold amounts (up to 5).
 * @function handleRemoveInput - Removes an input field for withhold amounts.
 * @function handleAddArrearInput - Adds a new input field for arrears amounts (up to 5).
 * @function handleRemoveArrearInput - Removes an input field for arrears amounts.
 * @function handleReset - Resets the form fields to their initial state.
 * @function handleSubmit - Handles the form submission and performs garnishment calculations.
 * 
 * @useEffect fetchData - Fetches employee details from the API when the component mounts.
 */
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../Config';
import { FaTrashAlt } from "react-icons/fa";
import { RxQuestionMarkCircled } from "react-icons/rx";
import Swal from 'sweetalert2';

function MultipleGarnishments() {
  const [employee_name, setEmpName] = useState('');
  const [pay_period, setPay] = useState('');
  const [no_of_exception, setExceptions] = useState(0);
  const [disposable_income, setDisposableIncome] = useState('');
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [state, setState] = useState('');
  const [number_of_arrear, setnumber_of_arrears] = useState('');
  const [number_of_garnishment, setnumber_of_ganishment] = useState('');
  const [arrears_greater_than_12_weeks, setIsChecked] = useState(false);
  const [support_second_family, setIsCheckedFamily] = useState(false);
  const [employee_id, setSelectedOption] = useState(null);
  const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
  const [arrearInputs, setArrearInputs] = useState([{ id: 1, value: '' }]);
  const [calculationResult, setCalculationResult] = useState('');
  const [options, setOptions] = useState([]);
  const [filing_status, setFilingStatus] = useState('');
  const [selectedOptionradio, setSelectedOptionRadio] = useState([]);
  const employer_id = parseInt(sessionStorage.getItem("id"));
  const style = { color: "#b90707", fontSize: "1.2em" };

  const optionsradio = [
    'Child Support',
    'Bankruptcy Orders',
    'Federal Tax Levy',
    'State Tax Levy',
    'Local Tax Levy',
    'Federal Agency Garnishments (Non-IRS)',
    'Creditor Debt',
    'Student Loan Default',
  ];

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

  const handleChangeName = (e) => {
    setSelectedOption(parseInt(e.target.value, 10));
    const selectedEmployee = options.find(option => option.employee_id === parseInt(e.target.value, 10));
    if (selectedEmployee) {
      setEmpName(selectedEmployee.employee_name);
    }
  };

  const handleChangeoptionredio = (event) => {
    const { value, checked } = event.target;
    setSelectedOptionRadio((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((item) => item !== value)
    );
  };

  const handleAddInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { id: inputs.length + 1, value: '' }]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'You can only add up to 5 inputs.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleRemoveInput = (id) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter(input => input.id !== id));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'One Input Required',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleAddArrearInput = () => {
    if (arrearInputs.length < 5) {
      setArrearInputs([...arrearInputs, { id: arrearInputs.length + 1, value: '' }]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'You can only add up to 5 inputs.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleRemoveArrearInput = (id) => {
    if (arrearInputs.length > 1) {
      setArrearInputs(arrearInputs.filter(input => input.id !== id));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'One Input Required',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = sessionStorage.getItem("id");
        const response = await fetch(`${BASE_URL}/User/getemployeedetails/${id}/`);
        const jsonData = await response.json();
        setOptions(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleReset = () => {
    setSelectedOption('');
    setEmpName('');
    setDisposableIncome('');
    setGarnishmentFees('');
    setOrderID('');
    setState('');
    setPay('');
    setnumber_of_arrears('');
    setnumber_of_ganishment('');
    setIsChecked(false);
    setIsCheckedFamily(false);
    setInputs([{ id: 1, value: '' }]);
    setCalculationResult('');
    setArrearInputs([{ id: 1, value: '' }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ...existing code...
  };

  return (
    <>
      <div className="min-h-full">
        <div className="container">
          <div className="">
            <div className="p-0">
              <form onSubmit={handleSubmit}>
                <h6 className='mt-4 mb-4 font-bold  text-sm'>EMPLOYEE DETAILS: </h6>
                <div className=" appearance-none border-slate-900 border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                  <div>
                    <label htmlFor="empID" className="block text-gray-700 text-sm font-bold mb-3">
                      Employee ID <span className="text-red-700"> * </span>:
                    </label>
                    <select value={employee_id} onChange={handleChangeName} id="countries" className=" appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" required>
                      <option value="">Select Employee</option>
                      {options.map((option) => (
                        <option key={option.employee_id} value={(parseInt(option.employee_id, 10))}>
                          {option.employee_name}_{option.employee_id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="empName" className="block text-gray-700 text-sm font-bold mb-2">
                      Employee Name:
                    </label>
                    <input
                      type="text"
                      id="empName"
                      placeholder='Enter Employee Name'
                      className=" appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={employee_name}
                      onChange={(e) => setEmpName(e.target.value)}
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="earning" className="block text-gray-700 text-sm font-bold mb-2">
                      Disposable Income <span className="text-red-700"> * </span>:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="disposable_income"
                      placeholder='Enter Disposable Income'
                      className=" text-right appearance-none border text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={disposable_income}
                      onChange={(e) => setDisposableIncome(parseFloat(e.target.value, 10))}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                      State <span className="text-red-700"> * </span>:
                    </label>
                    <select className=" appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" id="selectField" value={state} onChange={(e) => setState(e.target.value)}>
                      <option value="" >Choose an State </option>
                      {StateList.map((option) => (
                        <option key={option.id} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <h6 className='mt-4 mb-4 font-bold  text-sm'>Select Garnishment Type Please(Select Multiple if you wan): </h6>
                <div className=" appearance-none border-slate-500 border text-sm p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                  {optionsradio.map((option, index) => (
                    <div key={index} className="mb-1">
                      <label className="text-2xl  flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="block text-gray-700 text-sm font-bold "
                          value={option}
                          checked={selectedOptionradio.includes(option)}
                          onChange={handleChangeoptionredio}
                        />
                        <span className="text-sm font-bold ">{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <h6 className='mt-4 mb-4 font-bold  text-sm'>GARNISHMENT DETAILS :</h6>
                <div className=" appearance-none border-slate-500 border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      Pay Period:
                    </label>
                    <select id="options" value={pay_period} onChange={(e) => setPay(e.target.value)} className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="options">
                      <option value="Weekly">Weekly</option>
                      <option value="Daily"> Daily</option>
                      <option value="Biweekly">Biweekly
                      </option>
                      <option value="Semimonthly">Semimonthly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="options" className="block text-gray-700 text-sm font-bold mb-2">Filling Status:</label>
                    <select id="options" value={filing_status} onChange={(e) => setFilingStatus(e.target.value)} className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="options">
                      <option value="single filing status"> Single filing status</option>
                      <option value="married filing sepearte return">Married filing sepearte return</option>
                      <option value="married filing joint return">Married filing joint return
                      </option>
                      <option value="head of household">Head of household</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      No of Exemptions:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      id="Exception"
                      onWheel={(e) => e.target.blur()}
                      placeholder='Enter No Of Exemptions'
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={no_of_exception}
                      onChange={(e) => setExceptions(parseInt(e.target.value, 10))}
                    />
                  </div>
                  <div>
                    <label htmlFor="garnishmentFees" className="block text-gray-700 text-sm font-bold mb-2">
                      Garnishment Fees <span className="text-red-700"> * </span>:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="garnishmentFees"
                      placeholder='Enter Fees'
                      className=" appearance-none text-right border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={garnishment_fees}
                      onChange={(e) => setGarnishmentFees(parseFloat(e.target.value, 10))}
                    />
                  </div>
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      Order ID <span className="text-red-700"> * </span>:
                      <div className="inline relative group">
                        <RxQuestionMarkCircled className="inline custom-note-icon" />
                        <div className="absolute bottom-full transform -translate-x-y 
                                  hidden group-hover:block bg-gray-600 text-white w-48 text-sm px-3 py-1 rounded  mini-font">
                          ( Order ID ) require numeric values. Please ensure that you enter only numbers in these fields.
                          example: {' API123# '}
                        </div>
                      </div>
                    </label>
                    <input
                      type="text"
                      id="orderID"
                      placeholder='Enter Order Id'
                      className=" appearance-none border text-right rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={order_id}
                      onChange={(e) => setOrderID(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="number_of_arrears" className="block text-gray-700 text-sm font-bold mb-2">
                      Number of Arrears <span className="text-red-700"> * </span>:
                      <div className="inline relative group">
                        <RxQuestionMarkCircled className="inline custom-note-icon" />
                        <div className="absolute bottom-full transform -translate-x-y 
                                  hidden group-hover:block bg-gray-600 text-white w-48 text-sm px-3 py-1 rounded  mini-font">
                          ( Number of Arrears ) require numeric values. Please ensure that you enter only numbers in these fields.
                        </div>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="number_of_arrears"
                      placeholder='Enter Number of Arrears'
                      className=" appearance-none border text-right rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={number_of_arrear}
                      onChange={(e) => setnumber_of_arrears(parseInt(e.target.value, 10))}
                    />
                  </div>
                  <div>
                    <label htmlFor="number_of_garnishment" className="block text-gray-700 text-sm font-bold mb-2">
                      No. of Child Support  <span className="text-red-700"> *  </span>:
                      <div className="inline relative group">
                        <RxQuestionMarkCircled className="inline custom-note-icon" />
                        <div className="absolute bottom-full transform -translate-x-y 
                                  hidden group-hover:block bg-gray-600 text-white w-48 text-sm px-3 py-1 rounded  mini-font">
                          ( Number of Garnishment ) require numeric values. Please ensure that you enter only numbers in these fields.
                        </div>
                      </div>
                    </label>
                    <input
                      type="number"
                      id="number_of_garnishment"
                      placeholder='Enter Number of Garnishment'
                      className=" appearance-none border text-right rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={number_of_garnishment}
                      onChange={(e) => setnumber_of_ganishment(parseInt(e.target.value, 10))}
                    />
                  </div>
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                  <div className="row-span-3 w-full flex items-center mt-4 mb-4">
                    <input id="showFieldCheckboxFamily" checked={support_second_family} onChange={(e) => setIsCheckedFamily(e.target.checked)} type="checkbox" className="mr-2 mb-2" />
                    <label htmlFor="showFieldCheckboxFamily" className="block text-gray-700 text-sm font-bold mb-2">
                      Support Second Family
                    </label>
                  </div>
                  <div className="row-span-3 w-full flex items-center mt-4 mb-4">
                    <input id="showFieldCheckbox" checked={arrears_greater_than_12_weeks} onChange={(e) => setIsChecked(e.target.checked)} type="checkbox" className="mr-2 mb-2" />
                    <label htmlFor="showFieldCheckbox" className="block text-gray-700 text-sm font-bold mb-2">
                      Arrears Greater Than 12 Weeks
                    </label>
                  </div>
                </div>
                {arrears_greater_than_12_weeks && (
                  <div className=" appearance-none border mt-4 p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                    {arrearInputs.map((input, index) => (
                      <div key={input.id} className="mt-4">
                        <div className='flex items-center'>
                          <label className="block text-gray-700 text-sm font-bold mb-2">Arrears Amount {index + 1}:</label>
                          <button type="button" className="text-sm text-red ml-10 mb-2" onClick={() => handleRemoveArrearInput(input.id)}>
                            <FaTrashAlt style={style} />
                          </button>
                        </div>
                        <input
                          type="number"
                          value={input.value}
                          placeholder='Enter Amount'
                          onChange={(event) => setArrearInputs(arrearInputs.map((arrearInput, i) => i === index ? { ...arrearInput, value: event.target.value } : arrearInput))}
                          className=" appearance-none border text-right rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className=" appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                  {inputs.map((input, index) => (
                    <div key={input.id} className="mb-4 ">
                      <div className='flex items-center'>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Withhold Amount {index + 1}:</label>
                        <button type="button" className="text-sm text-red ml-10 mb-2" onClick={() => handleRemoveInput(input.id)}>
                          <FaTrashAlt style={style} />
                        </button>
                      </div>
                      <input
                        type="number"
                        placeholder='Enter amount'
                        value={input.value}
                        onChange={(event) => setInputs(inputs.map((input, i) => i === index ? { ...input, value: event.target.value } : input))}
                        className=" appearance-none border text-right rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center sm:mx-auto sm:w-full sm:max-w-lg justify-center mt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-500 m-2 sm:mx-auto sm:w-full  text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Calculate
                  </button>
                  <button
                    type="reset"
                    onClick={handleReset}
                    className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm mb-10 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Reset
                  </button>
                </div>
              </form>
              {calculationResult && (
                <div id="calculation_results" className="result-section appearance-none border mt-4 rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <p>Garnishment Amount: {calculationResult.result}</p>
                  <p>Net Pay: {calculationResult.net_pay}</p>
                  {inputs.length >= 1 && (
                    <p>Allowed Amount for Child1: {calculationResult.amount_to_withhold_child1}</p>
                  )}
                  {inputs.length >= 2 && (
                    <p>Allowed Amount for Child2: {calculationResult.amount_to_withhold_child2}</p>
                  )}
                  {inputs.length >= 3 && (
                    <p>Allowed Amount for Child3: {calculationResult.amount_to_withhold_child3}</p>
                  )}
                  {inputs.length >= 4 && (
                    <p>Allowed Amount for Child4: {calculationResult.amount_to_withhold_child4}</p>
                  )}
                  {inputs.length >= 5 && (
                    <p>Allowed Amount for Child5: {calculationResult.amount_to_withhold_child5}</p>
                  )}
                </div>
              )}
              <div className="p-10"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MultipleGarnishments;
