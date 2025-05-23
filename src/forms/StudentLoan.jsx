

/**
 * StudentLoan Component
 * 
 * This component renders a form for calculating student loan garnishment details for employees.
 * It fetches employee data, allows input of garnishment details, and displays the calculation results.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered StudentLoan component.
 * 
 * @example
 * <StudentLoan />
 * 
 * @function
 * @name StudentLoan
 * 
 * @description
 * - Fetches employee details from the server on component mount.
 * - Allows the user to select an employee and input garnishment details.
 * - Submits the data to the server for calculation and displays the results.
 * - Provides a reset functionality to clear the form.
 * 
 * @state {string} employee_name - The name of the selected employee.
 * @state {string} disposable_income - The disposable income entered by the user.
 * @state {string} garnishment_fees - The garnishment fees entered by the user.
 * @state {string} order_id - The order ID entered by the user.
 * @state {number|null} employee_id - The ID of the selected employee.
 * @state {object|null} calculationResult - The result of the garnishment calculation.
 * @state {Array} options - The list of employees fetched from the server.
 * 
 * @constant {number} employer_id - The employer ID retrieved from session storage.
 * 
 * @function generateUniqueNumber
 * @description Generates a unique identifier using the current timestamp and a random string.
 * @returns {string} A unique identifier.
 * 
 * @function handleSubmit
 * @description Handles form submission, sends data to the server, and fetches calculation results.
 * @param {Event} event - The form submission event.
 * 
 * @function handleReset
 * @description Resets the form fields and clears the calculation result.
 * 
 * @function handleChangeName
 * @description Handles the selection of an employee and updates the employee name.
 * @param {Event} e - The change event from the employee selection dropdown.
 * 
 * @useEffect
 * @description Fetches employee details from the server when the component mounts.
 */
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../configration/Config';
import Swal from 'sweetalert2';

function StudentLoan() {
  const [employee_name, setEmpName] = useState('');
  const [disposable_income, setDisposableIncome] = useState('');
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [employee_id, setSelectedOption] = useState(null);
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
        if (jsonData.data) setOptions(jsonData.data);
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
      rows: [{ employer_id, employee_id, employee_name, disposable_income, garnishment_fees, order_id }],
    };

    try {
      const response = await fetch(`${BASE_URL}/User/StudentLoanCalculationData/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to submit data');
      Swal.fire({
        icon: 'success',
        title: 'Your Calculation was successfully stored',
        text: "Now Calculation result will show below the form !!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => window.scrollTo(0, document.body.scrollHeight),
      });

      const resultResponse = await fetch(`${BASE_URL}/User/GetSingleStudentLoanResult/${employer_id}/${employee_id}/`);
      const resultData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error('Failed to fetch results');

      setCalculationResult(resultData.data[0]);
    } catch (error) {
      console.error('Submission Error:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Your action was unsuccessful',
        text: "Now Calculation result will not be stored !!",
        showConfirmButton: false,
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
    setCalculationResult(null);
  };

  const handleChangeName = (e) => {
    setSelectedOption(parseInt(e.target.value, 10));
    const selectedEmployee = options.find(option => option.employee_id === parseInt(e.target.value, 10));
    if (selectedEmployee) setEmpName(selectedEmployee.employee_name);
  };

  return (
    <>
      <div className="min-h-full">
        <div className="container">
          <div className="contant">
            <div className="p-0">
              <form onSubmit={handleSubmit}>
                <h6 className="mt-4 mb-4 font-bold text-sm">EMPLOYEE DETAILS :</h6>
                <div className="hidden">
                  <div className="mt-2 hidden">
                    <input
                      id="employer_id"
                      name="employer_id"
                      value={employer_id}
                      type="hidden"
                      onChange={handleChangeName}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                  <div>
                    <label htmlFor="empID" className="block text-gray-700 text-sm font-bold mb-3">
                      Employee ID:
                    </label>
                    <select
                      value={employee_id}
                      onChange={handleChangeName}
                      id="countries"
                      className="appearance-none py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500"
                      required
                    >
                      <option value="Select Employee">Select Employee</option>
                      {options.map((option) => (
                        <option key={option.employee_id} value={parseInt(option.employee_id, 10)}>
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
                      onChange={(e) => setEmpName(e.target.value)}
                      readOnly
                      disabled
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="earning" className="block text-gray-700 text-sm font-bold mb-2">
                      Disposable Income:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="disposable_income"
                      placeholder="Enter Disposable Income"
                      className="appearance-none border text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={disposable_income}
                      onChange={(e) => setDisposableIncome(parseFloat(e.target.value, 10))}
                      required
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
                      placeholder="Enter Garnishment Fees"
                      className="appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={garnishment_fees}
                      onChange={(e) => setGarnishmentFees(parseFloat(e.target.value))}
                      required
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
                  <p>Garnishment Result: ${calculationResult.garnishment_amount}</p>
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

export default StudentLoan;
