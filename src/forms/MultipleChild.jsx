/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Config';
import { FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';

function MultipleChild() {
  const [employee_name, setEmpName] = useState('');
  const [earnings, setEarnings] = useState('');
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [state, setState] = useState('');
  const [number_of_arrear, setNumberOfArrears] = useState('');
  const [number_of_garnishment, setNumberOfGarnishment] = useState('');
  const [arrears_greater_than_12_weeks, setArrearsGreaterThan12Weeks] = useState(false);
  const [support_second_family, setSupportSecondFamily] = useState(false);
  const [employee_id, setSelectedOption] = useState(null);
  const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
  const [arrearInputs, setArrearInputs] = useState([{ id: 1, value: '' }]);
  const [calculationResult, setCalculationResult] = useState('');
  const employer_id = parseInt(sessionStorage.getItem("id"));
  const [options, setOptions] = useState([]);
  const style = { color: "#b90707", fontSize: "1.2em" };
  const [federal_income_tax, setFederalIncomeTax] = useState('');
  const [social_tax, setSocialTax] = useState('');
  const [medicare_tax, setMedicareTax] = useState('');
  const [state_tax, setStateTax] = useState('');
  const [newResult, setNewResult] = useState('');

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
    { id: 14, label: 'Maine' },
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

  const handleState = (event) => setState(event.target.value);

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

  const handleInputChange = (event, index) => {
    const newInputs = [...inputs];
    newInputs[index].value = event.target.value;
    setInputs(newInputs);
  };

  const handleArrearInputChange = (event, index) => {
    const newArrearInputs = [...arrearInputs];
    newArrearInputs[index].value = event.target.value;
    setArrearInputs(newArrearInputs);
  };

  const handleCheckboxChange = (event) => setArrearsGreaterThan12Weeks(event.target.checked);
  const handleCheckboxChange1 = (event) => setSupportSecondFamily(event.target.checked);

  const handleChangeName = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedOption(selectedId);
    const selectedEmployee = options.find(option => option.employee_id === selectedId);
    if (selectedEmployee) setEmpName(selectedEmployee.employee_name);
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
    setSelectedOption(null);
    setEmpName('');
    setEarnings('');
    setGarnishmentFees('');
    setOrderID('');
    setState('');
    setNumberOfArrears('');
    setNumberOfGarnishment('');
    setArrearsGreaterThan12Weeks(false);
    setSupportSecondFamily(false);
    setInputs([{ id: 1, value: '' }]);
    setArrearInputs([{ id: 1, value: '' }]);
    setFederalIncomeTax('');
    setSocialTax('');
    setMedicareTax('');
    setStateTax('');
    setCalculationResult('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const filledInputs = [...inputs];
    const filledArrears = [...arrearInputs];

    while (filledInputs.length < 5) {
      filledInputs.push({ id: filledInputs.length + 1, value: '0' });
    }

    while (filledArrears.length < 5) {
      filledArrears.push({ id: filledArrears.length + 1, value: '0' });
    }

    const postData = {
      employer_id,
      employee_id,
      employee_name,
      earnings: parseFloat(earnings),
      garnishment_fees: parseFloat(garnishment_fees),
      order_id: parseInt(order_id, 10),
      state,
      number_of_arrear: parseInt(number_of_arrear, 10),
      number_of_garnishment: parseInt(number_of_garnishment, 10),
      amount_to_withhold_child1: parseFloat(filledInputs[0].value),
      amount_to_withhold_child2: parseFloat(filledInputs[1].value),
      amount_to_withhold_child3: parseFloat(filledInputs[2].value),
      amount_to_withhold_child4: parseFloat(filledInputs[3].value),
      amount_to_withhold_child5: parseFloat(filledInputs[4].value),
      arrears_greater_than_12_weeks,
      support_second_family,
      arrears_amt_Child1: parseFloat(filledArrears[0].value),
      arrears_amt_Child2: parseFloat(filledArrears[1].value),
      arrears_amt_Child3: parseFloat(filledArrears[2].value),
      arrears_amt_Child4: parseFloat(filledArrears[3].value),
      arrears_amt_Child5: parseFloat(filledArrears[4].value),
      federal_income_tax: parseFloat(federal_income_tax),
      social_tax: parseFloat(social_tax),
      medicare_tax: parseFloat(medicare_tax),
      state_tax: parseFloat(state_tax),
    };

    try {
      const response = await fetch(`${BASE_URL}/submitData/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        setNewResult(result.message);
        toast.success('Data submitted successfully!');
      } else {
        toast.error('Error submitting data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('An error occurred');
    }
  };


return (
  <>
    <div className="min-h-full">
      <div className="container">
        <div className="">
          <div className="p-0">
            <form onSubmit={handleSubmit}>
              <div className="shadow appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                <div>
                  <label htmlFor="empID" className="block text-gray-700 text-sm font-bold mb-3">
                    Employee ID:
                  </label>
                  <select value={employee_id}   onChange={handleChangeName} id="countries" className="shadow appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" required>
                        <option value="">Select Employee</option>
                        {options.map((option) => (
                          <option key={option.employee_id}   value={(parseInt(option.employee_id,10))}>
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
                    className="shadow appearance-none border text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={employee_name}
                    onChange={(e) => setEmpName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="earning" className="block text-gray-700 text-sm font-bold mb-2">
                    Earnings:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="earning"
                    placeholder='Enter Earning'
                    className="shadow appearance-none border text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={earnings}
                    onChange={(e) => setEarnings(parseFloat(e.target.value, 10))}
                  />
                </div>
                <div>
                  <label htmlFor="garnishmentFees" className="block text-gray-700 text-sm font-bold mb-2">
                    Garnishment Fees:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="garnishmentFees"
                    placeholder='Enter Fees'
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={garnishment_fees}
                    onChange={(e) => setGarnishmentFees(parseFloat(e.target.value, 10))}
                  />
                </div>
                <div>
                  <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                    Order ID:
                  </label>
                  <input
                    type="number"
                    id="orderID"
                     placeholder='Enter Order Id'
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={order_id}
                    onChange={(e) => setOrderID(parseInt(e.target.value, 10))}
                  />
                </div>


                <div>
                  <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                    State:
                  </label>
                  <select className="shadow appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" id="selectField" value={state} onChange={handleState}>
                      <option value="" >Choose an State </option>
                      {StateList.map((option) => (
                        <option key={option.id} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                </div>


                <div>
                  <label htmlFor="number_of_arrears" className="block text-gray-700 text-sm font-bold mb-2">
                    Number of Arrears:
                  </label>
                  <input
                    type="number"
                    id="number_of_arrears"
                    placeholder='Enter Number of Arrears'
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={number_of_arrear}
                    onChange={(e) => setnumber_of_arrears(parseInt(e.target.value, 10))}
                  />
                </div>

                <div>
                  <label htmlFor="number_of_garnishment" className="block text-gray-700 text-sm font-bold mb-2">
                    Number of Garnishmant:
                  </label>
                  <input
                    type="number"
                    id="number_of_garnishment"
                    placeholder='Enter Number of Garnishment'
                    className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={number_of_garnishment}
                    onChange={(e) => setnumber_of_ganishment(parseInt(e.target.value, 10))}
                  />
                </div>
                </div>
            <div className="row-span-3 w-full flex items-center mt-4 mb-4">
                    <input id="showFieldCheckboxFamily" checked={support_second_family} onChange={handleCheckboxChange1} type="checkbox" className="mr-2" />
                    <label htmlFor="showFieldCheckboxFamily" className="block text-gray-700 text-sm font-bold mb-2">
                      Support Second Family
                    </label>
            </div>

            <div className="w-full flex items-center mb-4">
                    <input id="showFieldCheckbox" checked={arrears_greater_than_12_weeks} onChange={handleCheckboxChange} type="checkbox" className="mr-2" />
                    <label htmlFor="showFieldCheckbox" className="block text-gray-700 text-sm font-bold mb-2">
                      Arrears Greater Than 12 Weeks
                    </label>
            </div>

            {arrears_greater_than_12_weeks && (
              <>
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleAddArrearInput} >
                  Add Arrears Amount
                </button>
                <div className="shadow appearance-none border mt-4 p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
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
                      onChange={(event) => handleArrearInputChange(event, index)}
                      className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                ))}
                </div>
              </>
            )}

            <div className="flex items-center mt-4 mb-4">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAddInput}
              >
                Add Child Withhold Amount
              </button>
            </div>
            <div className="shadow appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
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
                  onChange={(event) => handleInputChange(event, index)}
                  className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

              {/* TUESDAY */}
                  </div>
                   ))}

             </div>
             <div className="mt-6 shadow appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                  <div>
                      <label htmlFor="federal_income_tax" className="block text-gray-700 text-sm font-bold mb-2">
                        Federal Income Tax:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder='Enter Federal Income Tax'
                        id="federal_income_tax"
                        className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={federal_income_tax}
                        onChange={(e) => setFederalIncmoeTax(parseFloat(e.target.value))}
                      />
                  </div>
                  {/* SOCIAL&SECURITY_TAX */}
                  <div>
                      <label htmlFor="social_tax" className="block text-gray-700 text-sm font-bold mb-2">
                        Social Security Tax:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="social_tax"
                         placeholder='Enter Social Security Tax'
                        className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={social_tax}
                        onChange={(e) => setSocialTax(parseFloat(e.target.value))}
                      />
                  </div>

                  <div>
                      <label htmlFor="medicare_tax" className="block text-gray-700 text-sm font-bold mb-2">
                        Medicare Tax:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="medicare_tax"
                       placeholder='Enter Medicare Tax'
                        className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={medicare_tax}
                        onChange={(e) => setMedicareTax(parseFloat(e.target.value))}
                      />
                  </div>
                    {/*  */}
                  <div>
                      <label htmlFor="state_tax" className="block text-gray-700 text-sm font-bold mb-2">
                        State Tax:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="state_tax"
                       placeholder='Enter State Tax'
                        className="shadow appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={state_tax}
                        onChange={(e) => setStateTax(parseFloat(e.target.value))}
                      />
                  </div>
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
                  className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Reset
                </button>
              </div> 
{/*               <ToastContainer /> */}
            </form>
{calculationResult && (
  <div className="result-section">
    <p>Garnishment Amount: {calculationResult.result}</p>
    <p>Net Pay: {calculationResult.net_pay}</p>

    {/* Conditionally render child withholdings based on filledInputs.length */}
    {filledInputs.length >= 1 && (
      <p>Allowed Amount for Child1: {calculationResult.amount_to_withhold_child1}</p>
    )}
    {filledInputs.length >= 2 && (
      <p>Allowed Amount for Child2: {calculationResult.amount_to_withhold_child2}</p>
    )}
    {filledInputs.length >= 3 && (
      <p>Allowed Amount for Child3: {calculationResult.amount_to_withhold_child3}</p>
    )}
    {filledInputs.length >= 4 && (
      <p>Allowed Amount for Child4: {calculationResult.amount_to_withhold_child4}</p>
    )}
    {filledInputs.length >= 5 && (
      <p>Allowed Amount for Child5: {calculationResult.amount_to_withhold_child5}</p>
    )}
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  </>
);
}

export default MultipleChild;

