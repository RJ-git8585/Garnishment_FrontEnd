
/**
 * FederalTax Component
 * 
 * This component renders a form for calculating federal tax details for employees.
 * It allows users to input employee details, disposable income, garnishment fees, 
 * and other relevant information, and then submit the data for calculation.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered FederalTax component.
 * 
 * @example
 * <FederalTax />
 * 
 * @state {string} employee_name - The name of the selected employee.
 * @state {string} disposable_income - The disposable income entered by the user.
 * @state {string} garnishment_fees - The garnishment fees entered by the user.
 * @state {string} order_id - The order ID entered by the user.
 * @state {string} pay_period - The selected pay period (e.g., weekly, monthly).
 * @state {string} no_of_exception - The number of exemptions entered by the user.
 * @state {string} filing_status - The selected filing status (e.g., single, married).
 * @state {number|null} employee_id - The ID of the selected employee.
 * @state {object|null} calculationResult - The result of the tax calculation.
 * @state {Array} options - The list of employee options fetched from the API.
 * 
 * @function generateUniqueNumber
 * Generates a unique identifier using the current timestamp and a random string.
 * 
 * @function handleSubmit
 * Handles the form submission, sends the data to the server, and fetches the calculation result.
 * 
 * @function handleReset
 * Resets the form fields and clears the calculation result.
 * 
 * @function handleChange
 * Updates the selected employee ID and name based on the dropdown selection.
 * 
 * @function handleChangePay
 * Updates the selected pay period.
 * 
 * @function handleChangeStatus
 * Updates the selected filing status.
 * 
 * @useEffect
 * Fetches the employee details from the server when the component mounts.
 * 
 * @dependencies
 * - React (useState, useEffect)
 * - BASE_URL (from configuration)
 * - Swal (for displaying alerts)
 */
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../configration/Config';
import Swal from 'sweetalert2';

function FederalTax() {
  const [employee_name, setEmpName] = useState('');
  const [disposable_income, setDisposableIncome] = useState('');
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [pay_period, setPay] = useState('weekly');
  const [no_of_exception, setExceptions] = useState('');
  const [filing_status, setFilingStatus] = useState('');
  const [employee_id, setEmployeeId] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [options, setOptions] = useState([]);
  const employer_id = parseInt(sessionStorage.getItem("id"));

  function generateUniqueNumber() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8);
    return timestamp + randomString;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = sessionStorage.getItem("id");
        const response = await fetch(`${BASE_URL}/User/getemployeedetails/${id}/`);
        const jsonData = await response.json();
        if (jsonData.data) {
          setOptions(jsonData.data);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      batch_id: generateUniqueNumber(),
      rows: [
        {
          employer_id,
          employee_id,
          employee_name,
          disposable_income,
          garnishment_fees,
          order_id,
          pay_period,
          no_of_exception,
          filing_status,
        },
      ],
    };

    try {
      const response = await fetch(`${BASE_URL}/User/FederalCaseData/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to submit data');

      Swal.fire({
        icon: 'success',
        title: 'Your Calculation was successfully stored',
        text: 'Now Calculation result will show below the form!',
        timer: 3000,
        timerProgressBar: true,
        didClose: () => window.scrollTo(0, document.body.scrollHeight),
      });

      const resultResponse = await fetch(`${BASE_URL}/User/FederalCaseResult/${employer_id}/${employee_id}/`);
      const resultData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error('Failed to fetch results');

      setCalculationResult(resultData.data[0]);
    } catch (error) {
      console.error('Submission Error:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Your action was unsuccessful',
        text: 'Now Calculation result will not be stored!',
        timer: 3000,
        timerProgressBar: true,
        didClose: () => window.scrollTo(0, document.body.scrollHeight),
      });
    }
  };

  const handleReset = () => {
    setEmpName('');
    setDisposableIncome('');
    setGarnishmentFees('');
    setOrderID('');
    setPay('weekly');
    setExceptions('');
    setFilingStatus('');
    setCalculationResult(null);
  };

  const handleChange = (e) => {
    setEmployeeId(parseInt(e.target.value, 10));
    const selectedEmployee = options.find((option) => option.employee_id === parseInt(e.target.value, 10));
    if (selectedEmployee) {
      setEmpName(selectedEmployee.employee_name);
    }
  };

  const handleChangePay = (e) => {
    setPay(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setFilingStatus(e.target.value);
  };

  return (
    <>
      <div className="min-h-full">
        <div className="container">
          <div className="contant">
            <div className="p-0">
              <form onSubmit={handleSubmit}>
                <h6 className="mt-4 mb-4 font-bold text-sm">EMPLOYEE DETAILS:</h6>
                <div className="appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label htmlFor="empID" className="block text-gray-700 text-sm font-bold mb-3">
                      Employee ID:
                    </label>
                    <select
                      value={employee_id}
                      onChange={handleChange}
                      id="countries"
                      className="appearance-none py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
                      required
                    >
                      <option value="">Select Employee</option>
                      {options.map((option) => (
                        <option key={option.employee_id} value={option.employee_id}>
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
                      placeholder="Enter Employee Name"
                      className="appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={employee_name}
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="DisposableIncome" className="block text-gray-700 text-sm font-bold mb-2">
                      Disposable Income:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter Disposable Income"
                      id="disposable_income"
                      className="appearance-none border text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={disposable_income}
                      onChange={(e) => setDisposableIncome(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="garnishmentFees" className="block text-gray-700 text-sm font-bold mb-2">
                      Garnishment Fees:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter Garnishment Fees"
                      id="garnishmentFees"
                      className="appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={garnishment_fees}
                      onChange={(e) => setGarnishmentFees(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      Order ID:
                    </label>
                    <input
                      type="text"
                      id="orderID"
                      placeholder="Enter Order Id"
                      className="appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={order_id}
                      onChange={(e) => setOrderID(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      Pay Period:
                    </label>
                    <select
                      id="options"
                      value={pay_period}
                      onChange={handleChangePay}
                      className="appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Daily">Daily</option>
                      <option value="Biweekly">Biweekly</option>
                      <option value="Semimonthly">Semimonthly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      No. of Exemptions:
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      max="10"
                      id="Exception"
                      placeholder="Enter No Of Exemptions"
                      className="appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={no_of_exception}
                      onChange={(e) => setExceptions(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="options" className="block text-gray-700 text-sm font-bold mb-2">
                      Filing Status:
                    </label>
                    <select
                      id="options"
                      value={filing_status}
                      onChange={handleChangeStatus}
                      className="appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="married filing separate return">Married filing separate return</option>
                      <option value="married filing joint return">Married filing joint return</option>
                      <option value="single filing status">Single filing status</option>
                      <option value="head of household">Head of household</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center sm:mx-auto sm:w-full sm:max-w-lg justify-center mt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
              </form>
              {calculationResult && (
                <div className="result-section shadow appearance-none border mt-4 rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <p>Result: ${calculationResult.result}</p>
                  <p>Net Pay: ${calculationResult.net_pay}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FederalTax;
