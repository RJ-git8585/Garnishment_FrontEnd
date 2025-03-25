import React, { useState, useEffect, useMemo } from 'react';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import { FaBalanceScaleRight } from "react-icons/fa";
import { BASE_URL } from '../Config';

function Garnishment() {
  const employer_id = useMemo(() => parseInt(sessionStorage.getItem("id")), []);
  const [formData, setFormData] = useState({
    employee_name: '',
    earnings: '',
    garnishment_fees: '',
    order_id: '',
    state: '',
    minimum_wages: '',
    amount_to_withhold: '',
    social: '',
    fit: '',
    medicare: '',
    arrears_amt: '',
    statetax: '',
    selectedType: '',
    arrears_greater_than_12_weeks: false,
    support_second_family: false,
    employee_id: null,
  });
  const [options, setOptions] = useState([]);
  const [inputs, setInputs] = useState([{ id: 1 }]);
  const [arrearInputs, setArrearInputs] = useState([{ id: 1 }]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddInput = (type) => {
    const newInput = { id: (type === 'arrears' ? arrearInputs : inputs).length + 1 };
    type === 'arrears'
      ? setArrearInputs([...arrearInputs, newInput])
      : setInputs([...inputs, newInput]);
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
    setFormData({
      employee_name: '',
      earnings: '',
      garnishment_fees: '',
      order_id: '',
      state: '',
      minimum_wages: '',
      amount_to_withhold: '',
      social: '',
      fit: '',
      medicare: '',
      arrears_amt: '',
      statetax: '',
      selectedType: '',
      arrears_greater_than_12_weeks: false,
      support_second_family: false,
      employee_id: null,
    });
    setInputs([{ id: 1 }]);
    setArrearInputs([{ id: 1 }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { ...formData, employer_id };
    try {
      const response = await fetch('https://garnishment-backend.onrender.com/User/CalculationDataView', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        handleReset();
      } else {
        console.error('Error submitting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="min-h-full">
        <div className="container main ml-auto">
          <div className="sidebar hidden lg:block"><Sidebar /></div>
          <div className="contant content ml-auto">
            <Headertop />
            <div className="p-0">
              <h1 className='edit-profile mt-6 mb-4 inline-block'><FaBalanceScaleRight />Garnishment Calculator</h1>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="selectedType" className="block italic text-red-700 text-sm font-semibold mb-3">
                    Please Select Garnishment Type:
                  </label>
                  <select
                    name="selectedType"
                    value={formData.selectedType}
                    onChange={handleInputChange}
                    className="custom-select mb-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="SingleChild">Single Child</option>
                    <option value="MultipleChild">Multiple Child</option>
                    <option value="StudentLoan">Student Loan</option>
                    <option value="MultiStudentLoan">Multiple Student Loan</option>
                    <option value="FederalTax">Federal Tax</option>
                    <option value="StateTax">State Tax</option>
                    <option value="Creditor">Creditor</option>
                    <option value="Bankruptcy">Bankruptcy</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-2">
                  <div>
                    <label htmlFor="employee_id" className="block text-gray-700 text-sm font-bold mb-3">
                      Employee ID:
                    </label>
                    <select
                      name="employee_id"
                      value={formData.employee_id || ''}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    <label htmlFor="employee_name" className="block text-gray-700 text-sm font-bold mb-2">
                      Employee Name:
                    </label>
                    <input
                      type="text"
                      name="employee_name"
                      value={formData.employee_name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label htmlFor="earnings" className="block text-gray-700 text-sm font-bold mb-2">
                      Earnings:
                    </label>
                    <input
                      type="number"
                      name="earnings"
                      value={formData.earnings}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <label htmlFor="garnishment_fees" className="block text-gray-700 text-sm font-bold mb-2">
                      Garnishment Fees:
                    </label>
                    <input
                      type="number"
                      name="garnishment_fees"
                      value={formData.garnishment_fees}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>

                {formData.arrears_greater_than_12_weeks && (
                  <div>
                    <button
                      type="button"
                      onClick={() => handleAddInput('arrears')}
                      className="rounded-md bg-indigo-600 px-3.5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Add Arrears Amount
                    </button>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {arrearInputs.map((input) => (
                        <div key={input.id}>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Arrears {input.id}:
                          </label>
                          <input
                            type="number"
                            name="arrears_amt"
                            value={formData.arrears_amt}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 m-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Calculate
                  </button>
                  <button
                    type="reset"
                    onClick={handleReset}
                    className="bg-blue-500 m-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Garnishment;
