/**
 * AddTax Component
 * 
 * This component renders a form to add tax details for an employee. It includes fields for
 * employee name, department, net pay, minimum wages, pay cycle, number of garnishments, 
 * and location. The form data is submitted to the server via a POST request.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered AddTax component.
 * 
 * @example
 * <AddTax />
 * 
 * State Variables:
 * @state {string} employee_name - The name of the employee.
 * @state {string} department - The department of the employee.
 * @state {string} net_pay - The net pay of the employee.
 * @state {string} minimun_wages - The minimum wages of the employee.
 * @state {string} pay_cycle - The pay cycle of the employee.
 * @state {string} number_of_garnishment - The number of garnishments for the employee.
 * @state {string} location - The location of the employee.
 * 
 * Functions:
 * @function handleReset - Resets all form fields to their initial state.
 * @function handleSubmit - Handles form submission, sends data to the server, and navigates to the employee page on success.
 * 
 * Dependencies:
 * - `useState` from React for managing form state.
 * - `useNavigate` from react-router-dom for navigation.
 * - `BASE_URL` from configuration for API endpoint.
 * - `API_URLS` from configuration for API URLs.
 * - `FaMoneyBill` from react-icons for the icon in the header.
 */
import {React,useState} from 'react'
import { BASE_URL } from '../configration/Config';
import { API_URLS } from "../configration/apis";
import { useNavigate } from 'react-router-dom';
import {  FaMoneyBill } from 'react-icons/fa';


function AddTax() {
  const navigate = useNavigate();
     const [employee_name, setName] = useState('');
     const [department, setDepart] = useState('');
     const [net_pay, setNet] = useState('');
     const [minimun_wages, setMinWages] = useState('');
     const [pay_cycle, setPayCycle] = useState('');
     const [number_of_garnishment, setNumberGarnihsment] = useState('');
     const [location, setLocation] = useState('');
 
      const employer_id = sessionStorage.getItem("id");
      const handleReset = () => {
                 setName('');
                setDepart('');
                setNet('');
                setMinWages('');
                setPayCycle('');
                setNumberGarnihsment('');
                setLocation('');
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(API_URLS.GET_EMPLOYEE_DETAILS, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          // ... rest of the function
        } catch (error) {
          console.error("Error submitting data:", error);
        }
    };
    
  return (
    <div>


            {/* <h2 className='edit-profile mt-6 mb-4 inline-block'> <FaMoneyBill /> Add Tax</h2> */}
            <h1 className='edit-profile mt-6 mb-4 inline-block'><FaMoneyBill/>Add Tax</h1>
            
            <hr />
            <form className=" grid grid-cols-2 gap-4 border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50" action="#" method="POST">
                    
            <div className='hidden'> 
                        
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
                    <div className=''> 
                        <label htmlFor="name" className="block text-slate-500 text-sm font-medium leading-6">
                        Employee Name 
                        </label>
                        <div className="mt-2">
                          <input
                            id="employee_name"
                            name="employee_name"
                             value={employee_name}
                            type="text"
                            autoComplete="employee_name"
                            onChange={(e) => setName(e.target.value)}
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className=''>
                        <label htmlFor="name" className="block text-slate-500 text-sm font-medium leading-6">
                        Department
                        </label>
                        <div className="mt-2">
                          <input
                            id="department"
                            name="department"
                            value={department}
                            type="text"
                            step="0.01"
                            autoComplete="name"
                            onChange={(e) => setDepart(e.target.value)}
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className=''>
                        <label htmlFor="email" className="text-slate-500 block  text-sm font-medium leading-6 ">
                        Net Pay 
                        </label>
                        <div className="mt-2">
                          <input
                            id="net_pay"
                            name="net_pay"
                            value={net_pay}
                            type="number"
                            step="0.01"
                            autoComplete="net_pay"
                            onChange={(e) => setNet(e.target.value)}
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="text-slate-500 block  text-sm font-medium leading-6 ">
                        Minimun Wages 
                        </label>
                        <div className="mt-2">
                          <input
                            id="minimun_wages"
                            name="minimun_wages"
                            value={minimun_wages}
                            type="number"
                            step="0.01"
                            autoComplete="minimun_wages"
                            onChange={(e) => setMinWages(e.target.value)}
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-slate-500 block  text-sm font-medium leading-6 ">
                          Pay Cycle 
                          </label>
                        </div>
                        <div className="mt-2">
                          <input 
                            id="pay_cycle"
                            name="pay_cycle"
                            type="number"
                            step="0.01"
                            value={pay_cycle}
                            onChange={(e) => setPayCycle(e.target.value)}
                            // autoComplete="current-password"
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />

                        </div>
                        
                      
          </div>
          <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-slate-500 block  text-sm font-medium leading-6 ">
                          Number of Garnishment 
                          </label>
                        </div>
                        <div className="mt-2">
                          <input 
                            id="number_of_garnishment"
                            name="number_of_garnishment"
                            type="number"
                            value={number_of_garnishment}
                            onChange={(e) => setNumberGarnihsment(e.target.value)}    
                            // autoComplete="current-password"
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />

                        </div>
                        
                      
          </div>
          <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-slate-500 block  text-sm font-medium leading-6 ">
                          Location 
                          </label>
                        </div>
                        <div className="mt-2">
                          <input 
                            id="location"
                            name="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}    
                            // autoComplete="current-password"
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />

                        </div>
                        
                      
          </div>

            
          
        </form>
        <div className="flex items-center  gap-4 justify-center mt-4">
          <div className="max-w-96">
      
            <button
              type="submit"
             onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 custom-btn"
            >
              ADD
            </button>
            </div>
            <div className="max-w-96">
            <button
              type="reset"
              onClick={handleReset}
              className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              CANCEL
            </button>
            
           
          </div>
          </div>





    </div>
    
     
 
  )
}

export default AddTax