/* eslint-disable react/no-unknown-property */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Config';
import Swal from 'sweetalert2';

function FederalTax() {
  const [employee_name, setEmpName] = useState('');
  const [disposable_income, setDisposableIncome] = useState('');
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [pay_period, setPay] = useState('');
  const [no_of_exception, setExceptions] = useState(0);
  const [filing_status, setFilingStatus] = useState('');
  const [employee_id, setEmployeeId] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  // const [local_tax, setlocal_tax] = useState(null);
  // const [workers_compensation, setworkers_compensation] = useState(null);
  // const [medical_insurance, setmedical_insurance] = useState(null);
  // const [contribution, setcontribution] = useState(null);
  // const [united_way_contribution, setUnitedWayContribution] = useState(null);
  // const [social_and_security, setSocialandSecurity] = useState(null);
  // const [medicare_tax, setMedicareTax] = useState(null);
  // const [state_tax, setStateTax] = useState(null);
  // const [federal_income_tax, setFederalIncomeTaxRate] = useState(null);
  const [options, setOptions] = useState([]);
  const employer_id = parseInt(sessionStorage.getItem("id"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = sessionStorage.getItem("id");
        const response = await fetch(`${BASE_URL}/User/getemployeedetails/${id}/`);
        const jsonData = await response.json();
        if (jsonData.data) {
          // setEmployeeId(jsonData.data[0].employee_id);
          // Auto select data
          // setEmpName(jsonData.data[0].employee_name);
          setOptions(jsonData.data); // Store the employee options
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        // toast.error('Failed to fetch employee data.');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      employer_id,
      employee_id,
      employee_name,
      disposable_income,
      garnishment_fees,
      order_id,
      pay_period,
      no_of_exception,
      filing_status,
      // local_tax,
      // workers_compensation,
      // medical_insurance,
      // contribution,
      // united_way_contribution,
      // social_and_security,
      // medicare_tax,
      // state_tax,
      // federal_income_tax
    };

    try {
      const response = await fetch(`${BASE_URL}/User/FederalCaseData/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to submit data');

      Swal.fire({
        // toast: true, // This enables the toast mode
        // position: 'top-end', // You can position the toast (top, top-end, top-start, bottom, etc.)
        icon: 'success', // 'success', 'error', 'warning', 'info', 'question'
        title: 'Your Calculation was successful stored',
        text: "Now Calculation result will show below the form !!",
        showConfirmButton: false, // Hide the confirm button
        timer: 3000, // Auto close after 3 seconds
        timerProgressBar: true, // Show a progress bar
    });
    

      const resultResponse = await fetch(`${BASE_URL}/User/FederalCaseResult/${employer_id}/${employee_id}/`);
      const resultData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error('Failed to fetch results');

      setCalculationResult(resultData.data[0]);
      // toast.success(`Result: ${resultData.data[0].result.toLocaleString()}`);
    } catch (error) {
      console.error('Submission Error:', error);
      Swal.fire({
        // toast: true, // This enables the toast mode
        // position: 'top-end', // You can position the toast (top, top-end, top-start, bottom, etc.)
        icon: 'warning', // 'success', 'error', 'warning', 'info', 'question'
        title: 'Your action was unsuccessful ',
        text: "Now Calculation result will not stored !!",
        showConfirmButton: false, // Hide the confirm button
        timer: 3000, // Auto close after 3 seconds
        timerProgressBar: true, // Show a progress bar
        didClose: () => window.scrollTo(0, document.body.scrollHeight)
    });
    }
  };

  const handleReset = () => {
    setEmpName('');
    setDisposableIncome('');
    setGarnishmentFees('');
    setOrderID('');
    setPay('');
    setExceptions(0);
    setFilingStatus('');
    setCalculationResult(null);
    // setlocal_tax('');
    // setworkers_compensation('');
    // setmedical_insurance('');
    setGarnishmentFees('');
    // setcontribution('');
    // setUnitedWayContribution('');
    // setSocialandSecurity('');
    // setmedical_insurance('');
    // setMedicareTax('');
    // setStateTax('');
    // setFederalIncomeTaxRate('');
  };

  const handleChange = (e) => {
    setEmployeeId(parseInt(e.target.value, 10));
    const selectedEmployee = options.find(option => option.employee_id === parseInt(e.target.value, 10));
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
          <div className="contant ">
            <div className="p-0">
              <form onSubmit={handleSubmit}>
              <h6 className='mt-4 mb-4 font-bold  text-sm'>EMPLOYEE DETAILS : </h6>
              {/* <MultiStep activeStep={2} > */}    
            <div className='hidden'> 
                        
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
               <div className=" appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
               <div>
                    <label htmlFor="empID" className="block text-gray-700 text-sm font-bold mb-3">
                      Employee ID:
                    </label>
               
                    <select value={employee_id}  onChange={handleChange} id="countries" className=" appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" required>
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
                      placeholder="Enter Employee Name"
                      className=" appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={employee_name}
                      onChange={(e) => setEmpName(e.target.value)}
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
                        placeholder='Enter Disposable Income'
                      id="disposable_income"
                      className=" appearance-none border text-sm  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={disposable_income}
                      onChange={(e) => setDisposableIncome(parseFloat(e.target.value,10))}
                    />
                  </div>
                 
                  <div>
                    <label htmlFor="garnishmentFees" className="block text-gray-700 text-sm font-bold mb-2">
                      Garnishment Fees:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder='Enter Garnishment Fees'
                      id="garnishmentFees"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={garnishment_fees}
                      onChange={(e) => setGarnishmentFees(parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      Order ID:
                    </label>
                    <input
                      type="number"
                      id="orderID"
                      placeholder='Enter Order ID'
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={order_id}
                      onChange={(e) => setOrderID(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      Pay Period:
                    </label>
                    <select id="options" value={pay_period} onChange={handleChangePay} className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                    No of Exemptions:
                    </label>
                    <input
                      type="number"
                      id="Exception"
                      placeholder='Enter No Of Exemptions'
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={no_of_exception}
                      onChange={(e) => setExceptions(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                  <label htmlFor="options" className="block text-gray-700 text-sm font-bold mb-2">Filling Status:</label>
                    <select id="options" value={filing_status} onChange={handleChangeStatus} className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="options">
                      
                      <option value="married filing sepearte return">Married filing sepearte return</option>
                      <option value="married filing joint return">Married filing joint return
                      </option>
                      <option value="single filing status"> Single filing status</option>
                      <option value="head of household">Head of household</option>
                    </select>

                  </div>
                  </div>
             {/* <h6 className='mt-4 mb-4 font-bold  text-sm'>TAX DETAILS : </h6> */}
             {/* <div className="mt-6  appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2"> */}
            
                  {/* <div>
                    <label htmlFor="local_tax" className="block text-gray-700 text-sm font-bold mb-2">
                    Local Tax:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder='Enter Local Tax'
                      id="local_tax"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={local_tax}
                      onChange={(e) => setlocal_tax(parseFloat(e.target.value))}
                    />
                  </div> */}
             
                  {/* <div>
                    <label htmlFor="workers_compensation" className="block text-gray-700 text-sm font-bold mb-2">
                    Workers Compensation:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder='Enter Workers Compensation'
                      id="workers_compensation"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={workers_compensation}
                      onChange={(e) => setworkers_compensation(parseFloat(e.target.value))}
                    />
                  </div> */}
                  {/* <div>
                    <label htmlFor="medical_insurance" className="block text-gray-700 text-sm font-bold mb-2">
                    Medical Insurance:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder='Enter Medical Insurance'
                      id="medical_insurance"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={medical_insurance}
                      onChange={(e) => setmedical_insurance(parseFloat(e.target.value))}
                    />
                  </div> */}
                  {/* <div>
                    <label htmlFor="contribution" className="block text-gray-700 text-sm font-bold mb-2">
                    Contribution
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="contribution"
                        placeholder='Enter Contribution'
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={contribution}
                      onChange={(e) => setcontribution(parseFloat(e.target.value))}
                    />
                  </div> */}
                  {/* <div>
                    <label htmlFor="united_way_contribution" className="block text-gray-700 text-sm font-bold mb-2">
                    United Way Contribution:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                       placeholder='Enter United Way Contribution'
                      id="united_way_contribution"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={united_way_contribution}
                      onChange={(e) => setUnitedWayContribution(parseFloat(e.target.value))}
                    />
                  </div> */}
                 
                  {/* <div>
                    <label htmlFor="social_and_security" className="block text-gray-700 text-sm font-bold mb-2">
                    Social Security Tax:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                        placeholder='Enter Social Security Tax'
                      id="social_and_security"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={social_and_security}
                      onChange={(e) => setSocialandSecurity(parseFloat(e.target.value))}
                    />
                  </div> */}
                  {/* <div>
                    <label htmlFor="medicare_tax" className="block text-gray-700 text-sm font-bold mb-2">
                    Medicare Tax:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder='Enter Medicare Tax'
                      id="medicare_tax"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={medicare_tax}
                      onChange={(e) => setMedicareTax(parseFloat(e.target.value))}
                    />
                  </div> */}
                  {/* <div>
                    <label htmlFor="state_tax" className="block text-gray-700 text-sm font-bold mb-2">
                    State Tax:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="state_tax"
                       placeholder='Enter State Tax'
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={state_tax}
                      onChange={(e) => setStateTax(parseFloat(e.target.value))}
                    />
                  </div> */}
                  {/* <div>
                    <label htmlFor="federal_income_tax" className="block text-gray-700 text-sm font-bold mb-2">
                    Federal Income Tax:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                        placeholder='Enter  Federal Income Tax'
                      id="federal_income_tax"
                      className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={federal_income_tax}
                      onChange={(e) => setFederalIncomeTaxRate(parseFloat(e.target.value))}
                    />
                  </div> */}

             
             
             {/* </div> */}
                
              
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
                {/* <ToastContainer/> */}
              </form>
              {calculationResult && (
             <div className="result-section shadow appearance-none border mt-4 rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                 
                {/* <h2>Calculation Result:</h2> */}
                <p>Result: {calculationResult.result}</p>
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
