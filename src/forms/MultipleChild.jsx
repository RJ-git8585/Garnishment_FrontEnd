
/* eslint-disable react/no-unknown-property */
import  { useState, useEffect } from 'react';
import { BASE_URL } from '../Config';
import { FaTrashAlt } from "react-icons/fa";
import { RxQuestionMarkCircled } from "react-icons/rx";
import Swal from 'sweetalert2';
import { StateList } from "../Constant";

function MultipleChild() {
  const [employee_name, setEmpName] = useState('');
  const [disposable_income, setDisposableIncome] = useState(''); 
  const [filledInputs, setFilledInputs] = useState([]);
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [state, setState] = useState('');
  const [number_of_arrear, setnumber_of_arrears] = useState('');
  const [number_of_child_support_order, setnumber_of_ganishment] = useState('');
  const [arrears_greater_than_12_weeks, setIsChecked] = useState(false);
  const [support_second_family, setIsCheckedFamily] = useState(false);
  const [employee_id, setSelectedOption] = useState(null);
  const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
  const [arrearInputs, setArrearInputs] = useState([{ id: 1, value: '' }]);
  const [calculationResult, setCalculationResult] = useState('');
  const employer_id = parseInt(sessionStorage.getItem("id"));
  const [options, setOptions] = useState([]);
  const style = { color: "#b90707", fontSize: "1.2em" };
  // eslint-disable-next-line no-unused-vars
  const [numFields, setNumFields] = useState(0);
  const [fieldValues, setFieldValues] = useState([]);
  const [pay_period, setPay] = useState('weekly');
  


  function generateUniqueNumber() {
    const timestamp = Date.now().toString(36); // Convert timestamp to base-36 (alphanumeric)
      const randomString = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
      return timestamp + randomString; // Combine both for uniqueness
}

const handleChangePay = (e) => {
  setPay(e.target.value);
};
  
    // Handle number input change
    // eslint-disable-next-line no-unused-vars
    const handleNumberChange = (e) => {
      // alert('this is testing');
      const number = parseInt(e.target.value) || 0;
      setNumFields(number);
      // Adjust the field values array based on the number of fields
      setFieldValues(new Array(number).fill(''));
        if (number < 5) {
          // alert(number)d
          setIsChecked(true); // Check the checkbox if value > 5
        } else {
          setIsChecked(false); // Uncheck otherwise
        }

    };
  
    // Handle dynamic field value changes
    // eslint-disable-next-line no-unused-vars
    const handleFieldChange = (index, value) => {
      const updatedValues = [...fieldValues];
      updatedValues[index] = value;
      setFieldValues(updatedValues);
    };

  const handleState = (event) => {
    setState(event.target.value);
  };

  const handleAddInput = () => {
    if (inputs.length < 5) {
      const newInput = { id: inputs.length + 1, value: '' };
      setInputs([...inputs, newInput]);
    } else {
    
      Swal.fire({
      
        title: 'You can only add up to 5 inputs.',
        showConfirmButton: false, // Hide the confirm button
        timer: 3000, // Auto close after 3 seconds
        timerProgressBar: true, // Show a progress bar
    });
    }
  };

  const handleRemoveInput = (id) => {
    if (inputs.length > 1) {
      const updatedInputs = inputs.filter(input => input.id !== id);
      setInputs(updatedInputs);
    } else {
      Swal.fire({
        icon: 'error', // 'success', 'error', 'warning', 'info', 'question'
        title: 'One Input Required',
        // text: "Now Calculation result will not stored !!",
        showConfirmButton: false, // Hide the confirm button
        timer: 3000, // Auto close after 3 seconds
        timerProgressBar: true, // Show a progress bar
    });
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleChange = (event) => {
    setSelectedOption(parseInt(event.target.value, 10));
  };

  const handleAddArrearInput = () => {
    if (arrearInputs.length < 5) {
      const newInputArrear = { id: arrearInputs.length + 1, value: '' };
      setArrearInputs([...arrearInputs, newInputArrear]);
    } else {
      Swal.fire({
        icon: 'error', // 'success', 'error', 'warning', 'info', 'question'
        title: 'You can only add up to 5 inputs.',
        // text: "Now Calculation result will not stored !!",
        showConfirmButton: false, // Hide the confirm button
        timer: 3000, // Auto close after 3 seconds
        timerProgressBar: true, // Show a progress bar
    });
    }
  };

  const handleRemoveArrearInput = (id) => {
    if (arrearInputs.length > 1) {
      const updatedInputs = arrearInputs.filter(input => input.id !== id);
      setArrearInputs(updatedInputs);
    } else {
      Swal.fire({
        icon: 'error', // 'success', 'error', 'warning', 'info', 'question'
        title: 'One Input Required',
        // text: "Now Calculation result will not stored !!",
        showConfirmButton: false, // Hide the confirm button
        timer: 3000, // Auto close after 3 seconds
        timerProgressBar: true, // Show a progress bar
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

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleCheckboxChange1 = (event) => {
    setIsCheckedFamily(event.target.checked);
  };

  const handleChangeName = (e) => {
    setSelectedOption(parseInt(e.target.value, 10));
    const selectedEmployee = options.find(option => option.employee_id === parseInt(e.target.value, 10));
    if (selectedEmployee) {
      setEmpName(selectedEmployee.employee_name);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cid = sessionStorage.getItem("cid");
        const response = await fetch(`${BASE_URL}/User/getemployeedetails/${cid}/`);
        const jsonData = await response.json();
        setOptions(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // toast.success('All Employee Data !!');
  }, []);

  const handleReset = () => {
    setSelectedOption('');
    setEmpName('');
    setDisposableIncome('');
    setGarnishmentFees('');
    setOrderID('');
    setState('');
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

    const filledInputs = [...inputs];
    const filledArrears = [...arrearInputs];
    
    let newFilledInputs = [...inputs]; // Assuming you have 'inputs' defined
    setFilledInputs(newFilledInputs);

    while (filledInputs.length < 5) {
      filledInputs.push({ id: filledInputs.length + 1, value: '0' });
    }


    while (filledArrears.length < 5) {
      filledArrears.push({ id: filledArrears.length + 1, value: '0' });
    }

    const postData = {

      batch_id:generateUniqueNumber(),

    "rows":[{
      employer_id,
      employee_id,
      employee_name,
      disposable_income: parseFloat(disposable_income),  // Ensure it's a number
      garnishment_fees: parseFloat(garnishment_fees),
      order_id,
      state,
      pay_period,
      number_of_arrear: parseInt(number_of_arrear, 10) || 0,
      number_of_child_support_order: parseInt(number_of_child_support_order, 10),
      amount_to_withhold_child1: parseFloat(filledInputs[0].value),
      amount_to_withhold_child2: parseFloat(filledInputs[1].value),
      amount_to_withhold_child3: parseFloat(filledInputs[2].value),
      amount_to_withhold_child4: parseFloat(filledInputs[3].value),
      amount_to_withhold_child5: parseFloat(filledInputs[4].value),
      arrears_greater_than_12_weeks,
      support_second_family,
      arrears_amt_Child1: parseFloat(filledArrears[0]?.value) || 0,
      arrears_amt_Child2: parseFloat(filledArrears[1].value),
      arrears_amt_Child3: parseFloat(filledArrears[2].value),
      arrears_amt_Child4: parseFloat(filledArrears[3].value),
      arrears_amt_Child5: parseFloat(filledArrears[4].value),
    }]};

  try {
    // First, send the POST request
    const postResponse = await fetch(`${BASE_URL}/User/CalculationDataView`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });

    if (!postResponse.ok) throw new Error('Failed to submit data');
   
    const resultResponse = await fetch(`${BASE_URL}/User/Gcalculations/${employer_id}/${employee_id}/`);
    const resultLoanData = await resultResponse.json();
    if (!resultResponse.ok) throw new Error('Failed to fetch loan results');
    Swal.fire({
      icon: 'success', // 'success', 'error', 'warning', 'info', 'question'
      title: 'Your Calculation was successful stored.',
      text: "Now Calculation result will show below the form !!",
      showConfirmButton: false, // Hide the confirm button
      timer: 3000, // Auto close after 3 seconds
      timerProgressBar: true, 
      didClose: () => window.scrollTo(0, document.body.scrollHeight)// Show a progress bar
  });

  
  window.scrollTo({ bottom: 1000, behavior: 'smooth' });
    setCalculationResult(resultLoanData.data[0]);
} catch (error) {
    console.error('Submission Error:', error);
    Swal.fire({
      icon: 'error', // 'success', 'error', 'warning', 'info', 'question'
      title: 'Your action was unsuccessful',
      text: "Now Calculation result will not stored !!",
      showConfirmButton: false, // Hide the confirm button
      timer: 3000, // Auto close after 3 seconds
      timerProgressBar: true,
      didClose: () => window.scrollTo(0, document.body.scrollHeight)// Show a progress bar
  });
}
};


return (
  <>
    <div className="min-h-full">
      <div className="container">
        <div className="">
          <div className="p-0">
            <form onSubmit={handleSubmit}>
             <h6 className='mt-4 mb-4 font-bold  text-sm'>EMPLOYEE DETAILS : </h6>
             

              <div className=" appearance-none border-slate-900 border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                
                <div>
                  <label htmlFor="empID" className="block text-gray-700 text-sm font-bold mb-3">
                    Employee ID <span className="text-red-700"> * </span>:
                  </label>  
                  <select value={employee_id}   onChange={handleChangeName} id="countries" className=" appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" required>
                        <option value="">Select Employee</option>
                        {options.map((option) => (
                          <option key={option.ee_id}   value={(parseInt(option.ee_id,10))}>
                            {option.employee_name}_{option.ee_id} 
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
                    className=" text-left appearance-none border text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={disposable_income}
                    onChange={(e) => setDisposableIncome(parseFloat(e.target.value, 10))}
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                    State <span className="text-red-700"> * </span>:
                  </label>
                  <select className=" appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" id="selectField" value={state} onChange={handleState}>
                      <option value="" >Choose an State </option>
                      {StateList.map((option) => (
                        <option key={option.id} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                </div>
                </div>
                <h6 className='mt-4 mb-4 font-bold  text-sm'>GARNISHMENT DETAILS :</h6>
                <div className=" appearance-none border-slate-500 border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
 
                <div>
                  <label htmlFor="garnishmentFees" className="block text-gray-700 text-sm font-bold mb-2">
                    Garnishment Fees <span className="text-red-700"> * </span>:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="garnishmentFees"
                    placeholder='Enter Fees'
                    className=" appearance-none text-left border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={garnishment_fees}
                    onChange={(e) => setGarnishmentFees(parseFloat(e.target.value, 10))}
                  />
                </div>
                <div>
                    <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                      Pay Period:
                    </label>
                    <select id="options" value={pay_period} onChange={handleChangePay} className=" appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="options">
                      <option value="weekly">Weekly</option>
                      {/* <option value="Daily"> Daily</option> */}
                      <option value="biweekly">Biweekly
                      </option>
                    </select>
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
                    className=" appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    min="0"
                    max="5"
                    placeholder='Enter Number of Arrears'
                    className=" appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={number_of_arrear}
                    onChange={(e) => {setnumber_of_arrears(parseInt(e.target.value, 10));
                      // handleNumberChange(e);
                    }}
                  />
                </div>

                <div>
                 
                  
                          <label htmlFor="number_of_garnishment" className="block text-gray-700 text-sm font-bold mb-2">
                          No. of Child Support  <span className="text-red-700"> *  </span>:
                          <div className="inline relative group">
                          <RxQuestionMarkCircled className="inline custom-note-icon" />
                                  <div className="absolute bottom-full transform -translate-x-y 
                                  hidden group-hover:block bg-gray-600 text-white w-48 text-sm px-3 py-1 rounded  mini-font">
                                   ( Number of Child Support ) require numeric values. Please ensure that you enter only numbers in these fields.
                                      
                                  </div>
                                  </div>
                          </label>
                
                  <input
                    type="number"
                    id="number_of_garnishment"
                     min="0"
                    max="5"
                    placeholder='Enter Number of Child Support'
                    className=" appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={number_of_child_support_order}
                    onChange={(e) => setnumber_of_ganishment(parseInt(e.target.value, 10))}
                  />
                  {/* <p className="text-red-700 custom-note"> Need to enter number for Fields.</p>   */}
                </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
            <div className="row-span-3 w-full flex items-center mt-4 mb-4">
                    <input id="showFieldCheckboxFamily" checked={support_second_family} onChange={handleCheckboxChange1} type="checkbox" className="mr-2 mb-2" />
                    <label htmlFor="showFieldCheckboxFamily" className="block text-gray-700 text-sm font-bold mb-2">
                      Support Second Family
                    </label>
            </div>

            <div className="row-span-3 w-full flex items-center mt-4 mb-4">
                    <input id="showFieldCheckbox" checked={arrears_greater_than_12_weeks} onChange={handleCheckboxChange} type="checkbox" className="mr-2 mb-2" />
                    <label htmlFor="showFieldCheckbox" className="block text-gray-700 text-sm font-bold mb-2">
                      Arrears Greater Than 12 Weeks
                    </label>
            </div>
          </div>
            {arrears_greater_than_12_weeks && (
              <>
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-3.5  py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleAddArrearInput} >
                  Add Arrears Amount
                </button>
                
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
                      onChange={(event) => handleArrearInputChange(event, index)}
                      className=" appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                ))}
                </div>
              </>
            )}

            <div className="flex items-center mt-4 mb-4">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3.5  py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAddInput}
              >
                Add Child Withhold Amount
              </button>
            </div>
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
                  onChange={(event) => handleInputChange(event, index)}
                  className=" appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

              {/* TUESDAY */}
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
{/*               <ToastContainer /> */}
            </form>
{calculationResult && (
       <div id="calculation_results" className="result-section  appearance-none border mt-4 rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                 
          <p>Garnishment Amount: ${calculationResult.result} </p>
          <p>Net Pay: ${calculationResult.net_pay} </p>
          
          {/* Display based on the number of filled inputs */}
          {filledInputs.length >= 1 && (
            <p>Allowed Amount for Child1: ${calculationResult.amount_to_withhold_child1} </p>
          )}
          {filledInputs.length >= 2 && (
            <p>Allowed Amount for Child2: ${calculationResult.amount_to_withhold_child2} </p>
          )}
          {filledInputs.length >= 3 && (
            <p>Allowed Amount for Child3: ${calculationResult.amount_to_withhold_child3} </p>
          )}
          {filledInputs.length >= 4 && (
            <p>Allowed Amount for Child4: ${calculationResult.amount_to_withhold_child4} </p>
          )}
          {filledInputs.length >= 5 && (
            <p>Allowed Amount for Child5: ${calculationResult.amount_to_withhold_child5} </p>
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

export default MultipleChild;
