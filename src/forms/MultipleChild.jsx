import { useState, useEffect } from 'react';
import { BASE_URL } from '../configration/Config';
import { FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { StateList } from "../constants/Constant";

function MultipleChild() {
  const [employee_name, setEmpName] = useState('');
  const [disposable_income, setDisposableIncome] = useState('');
  const [garnishment_fees, setGarnishmentFees] = useState('');
  const [order_id, setOrderID] = useState('');
  const [state, setState] = useState('');
  const [number_of_arrear, setNumberOfArrears] = useState('');
  const [number_of_child_support_order, setNumberOfGarnishment] = useState('');
  const [arrears_greater_than_12_weeks, setIsChecked] = useState(false);
  const [support_second_family, setIsCheckedFamily] = useState(false);
  const [employee_id, setSelectedOption] = useState(null);
  const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
  const [arrearInputs, setArrearInputs] = useState([{ id: 1, value: '' }]);
  const [calculationResult, setCalculationResult] = useState('');
  const [options, setOptions] = useState([]);
  const [pay_period, setPay] = useState('weekly');
  const employer_id = parseInt(sessionStorage.getItem("id"));

  const generateUniqueNumber = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8);
    return timestamp + randomString;
  };

  const handleAddInput = (type) => {
    const inputList = type === 'arrears' ? arrearInputs : inputs;
    const setInputList = type === 'arrears' ? setArrearInputs : setInputs;

    if (inputList.length < 5) {
      setInputList([...inputList, { id: inputList.length + 1, value: '' }]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'You can only add up to 5 inputs.',
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleRemoveInput = (type, id) => {
    const inputList = type === 'arrears' ? arrearInputs : inputs;
    const setInputList = type === 'arrears' ? setArrearInputs : setInputs;

    if (inputList.length > 1) {
      setInputList(inputList.filter(input => input.id !== id));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'At least one input is required.',
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleInputChange = (type, event, index) => {
    const inputList = type === 'arrears' ? arrearInputs : inputs;
    const setInputList = type === 'arrears' ? setArrearInputs : setInputs;

    const updatedInputs = [...inputList];
    updatedInputs[index].value = event.target.value;
    setInputList(updatedInputs);
  };

  const handleChangeName = (e) => {
    const selectedEmployeeId = parseInt(e.target.value, 10);
    const selectedEmployee = options.find(option => option.employee_id === selectedEmployeeId);
    if (selectedEmployee) {
      setSelectedOption(selectedEmployeeId);
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
  }, []);

  const handleReset = () => {
    setSelectedOption('');
    setEmpName('');
    setDisposableIncome('');
    setGarnishmentFees('');
    setOrderID('');
    setState('');
    setNumberOfArrears('');
    setNumberOfGarnishment('');
    setIsChecked(false);
    setIsCheckedFamily(false);
    setInputs([{ id: 1, value: '' }]);
    setArrearInputs([{ id: 1, value: '' }]);
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
      batch_id: generateUniqueNumber(),
      rows: [{
        employer_id,
        employee_id,
        employee_name,
        disposable_income: parseFloat(disposable_income),
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
      }],
    };

    try {
      const postResponse = await fetch(`${BASE_URL}/User/CalculationDataView`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!postResponse.ok) throw new Error('Failed to submit data');

      const resultResponse = await fetch(`${BASE_URL}/User/Gcalculations/${employer_id}/${employee_id}/`);
      const resultLoanData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error('Failed to fetch results');

      Swal.fire({
        icon: 'success',
        title: 'Calculation stored successfully!',
        text: 'The result will be displayed below.',
        timer: 3000,
        timerProgressBar: true,
      });

      setCalculationResult(resultLoanData.data[0]);
    } catch (error) {
      console.error('Submission Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission failed!',
        text: 'The calculation result could not be stored.',
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <>
      <div className="min-h-full">
        <div className="container">
          <div className="p-0">
            <form onSubmit={handleSubmit}>
              <h6 className="mt-4 mb-4 font-bold text-sm">EMPLOYEE DETAILS  :</h6>
              <div className="appearance-none border-slate-900 border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                <div>
                  <label htmlFor="empID" className="block text-gray-700 text-sm font-bold mb-3">
                    Employee ID <span className="text-red-700"> * </span>:
                  </label>
                  <select value={employee_id} onChange={handleChangeName} id="countries" className="appearance-none py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" required>
                    <option value="">Select Employee</option>
                    {options.map((option) => (
                      <option key={option.ee_id} value={parseInt(option.ee_id, 10)}>
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
                    placeholder="Enter Employee Name"
                    className="appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    placeholder="Enter Disposable Income"
                    className="text-left appearance-none border text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={disposable_income}
                    onChange={(e) => setDisposableIncome(parseFloat(e.target.value, 10))}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                    State <span className="text-red-700"> * </span>:
                  </label>
                  <select className="appearance-none py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" id="selectField" value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="">Choose a State</option>
                    {StateList.map((option) => (
                      <option key={option.id} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <h6 className="mt-4 mb-4 font-bold text-sm">GARNISHMENT DETAILS:</h6>
              <div className="appearance-none border-slate-500 border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                <div>
                  <label htmlFor="garnishmentFees" className="block text-gray-700 text-sm font-bold mb-2">
                    Garnishment Fees <span className="text-red-700"> * </span>:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="garnishmentFees"
                    placeholder="Enter Fees"
                    className="appearance-none text-left border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={garnishment_fees}
                    onChange={(e) => setGarnishmentFees(parseFloat(e.target.value, 10))}
                  />
                </div>
                <div>
                  <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                    Pay Period:
                  </label>
                  <select id="options" value={pay_period} onChange={(e) => setPay(e.target.value)} className="appearance-none border rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="options">
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="orderID" className="block text-gray-700 text-sm font-bold mb-2">
                    Order ID <span className="text-red-700"> * </span>:
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
                  <label htmlFor="number_of_arrears" className="block text-gray-700 text-sm font-bold mb-2">
                    Number of Arrears <span className="text-red-700"> * </span>:
                  </label>
                  <input
                    type="number"
                    id="number_of_arrears"
                    min="0"
                    max="5"
                    placeholder="Enter Number of Arrears"
                    className="appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={number_of_arrear}
                    onChange={(e) => setNumberOfArrears(parseInt(e.target.value, 10))}
                  />
                </div>
                <div>
                  <label htmlFor="number_of_garnishment" className="block text-gray-700 text-sm font-bold mb-2">
                    No. of Child Support <span className="text-red-700"> * </span>:
                  </label>
                  <input
                    type="number"
                    id="number_of_garnishment"
                    min="0"
                    max="5"
                    placeholder="Enter Number of Child Support"
                    className="appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={number_of_child_support_order}
                    onChange={(e) => setNumberOfGarnishment(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
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
                <>
                  <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => handleAddInput('arrears')}
                  >
                    Add Arrears Amount
                  </button>
                  <div className="appearance-none border mt-4 p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                    {arrearInputs.map((input, index) => (
                      <div key={input.id} className="mt-4">
                        <div className="flex items-center">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Arrears Amount {index + 1}:</label>
                          <button type="button" className="text-sm text-red ml-10 mb-2" onClick={() => handleRemoveInput('arrears', input.id)}>
                            <FaTrashAlt style={{ color: "#b90707", fontSize: "1.2em" }} />
                          </button>
                        </div>
                        <input
                          type="number"
                          value={input.value}
                          placeholder="Enter Amount"
                          onChange={(event) => handleInputChange('arrears', event, index)}
                          className="appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  onClick={() => handleAddInput('child')}
                >
                  Add Child Withhold Amount
                </button>
              </div>
              <div className="appearance-none border p-2 pb-4 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-reverse sm:mx-auto sm:w-full gap-4 mb-2">
                {inputs.map((input, index) => (
                  <div key={input.id} className="mb-4">
                    <div className="flex items-center">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Withhold Amount {index + 1}:</label>
                      <button type="button" className="text-sm text-red ml-10 mb-2" onClick={() => handleRemoveInput('child', input.id)}>
                        <FaTrashAlt style={{ color: "#b90707", fontSize: "1.2em" }} />
                      </button>
                    </div>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={input.value}
                      onChange={(event) => handleInputChange('child', event, index)}
                      className="appearance-none border text-left rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                ))}
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
                  className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm mb-10 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Reset
                </button>
              </div>
            </form>
            {calculationResult && (
              <div className="result-section border mt-4 rounded w-full text-sm py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <p>Garnishment Amount: ${calculationResult.result}</p>
                <p>Net Pay: ${calculationResult.net_pay}</p>
                {inputs.length >= 1 && <p>Allowed Amount for Child1: ${calculationResult.amount_to_withhold_child1}</p>}
                {inputs.length >= 2 && <p>Allowed Amount for Child2: ${calculationResult.amount_to_withhold_child2}</p>}
                {inputs.length >= 3 && <p>Allowed Amount for Child3: ${calculationResult.amount_to_withhold_child3}</p>}
                {inputs.length >= 4 && <p>Allowed Amount for Child4: ${calculationResult.amount_to_withhold_child4}</p>}
                {inputs.length >= 5 && <p>Allowed Amount for Child5: ${calculationResult.amount_to_withhold_child5}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MultipleChild;
