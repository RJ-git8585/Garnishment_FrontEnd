import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../Config';
import Swal from 'sweetalert2';

function MultipleStudentLoan() {
  const [employee_name, setEmpName] = useState('');
  const [disposable_income, setDisposableIncome] = useState('');
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [options, setOptions] = useState([]);
  const [employee_id, setEmployeeId] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
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
        },
      ],
    };

    try {
      const response = await fetch(`${BASE_URL}/User/MiltipleStudentLoanCalculationData/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to submit data');

      Swal.fire({
        icon: 'success',
        title: 'Your Calculation was successfully stored.',
        text: 'Now Calculation result will show below the form!',
        timer: 3000,
        timerProgressBar: true,
        didClose: () => window.scrollTo(0, document.body.scrollHeight),
      });

      const resultResponse = await fetch(`${BASE_URL}/User/GetMultipleStudentLoanResult/${employer_id}/${employee_id}/`);
      const resultData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error('Failed to fetch results');

      setCalculationResult(resultData.data[0]);
    } catch (error) {
      console.error('Submission Error:', error);
      Swal.fire({
        icon: 'error',
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
    setCalculationResult(null);
  };

  const handleChange = (e) => {
    const selectedEmployeeId = e.target.value;
    const selectedEmployee = options.find((option) => option.employee_id === parseInt(selectedEmployeeId, 10));
    if (selectedEmployee) {
      setEmployeeId(selectedEmployee.employee_id);
      setEmpName(selectedEmployee.employee_name);
    }
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
                      className="appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={employee_name}
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="disposable_income" className="block text-gray-700 text-sm font-bold mb-2">
                      Disposable Income:
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Disposable Income"
                      step="0.01"
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
                </div>

                <div className="flex items-center sm:mx-auto sm:w-full sm:max-w-lg justify-center mt-4">
                  <button
                    type="submit"
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
                <div className="result-section shadow appearance-none mb-4 border mt-4 rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <p>Garnishment Result: ${calculationResult.garnishment_amount}</p>
                  <p>Net Pay: ${calculationResult.net_pay}</p>
                  <p>Student Loan 1: ${calculationResult.StudentLoanAmount1}</p>
                  <p>Student Loan 2: ${calculationResult.StudentLoanAmount2}</p>
                  <p>Student Loan 3: ${calculationResult.StudentLoanAmount3}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MultipleStudentLoan;
