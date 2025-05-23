
/**
 * AddLocation Component
 * 
 * This component allows users to add a new location by providing state and city information.
 * It includes a form with input fields for state and city, and buttons to submit or reset the form.
 * 
 * @component
 * 
 * @requires react - React library for building user interfaces.
 * @requires react-router-dom - For navigation using the `useNavigate` hook.
 * @requires sweetalert2 - For displaying success alerts.
 * @requires ../configration/Config - Contains the `BASE_URL` for API requests.
 * @requires ../component/Headertop - Header component.
 * @requires ./sidebar - Sidebar component.
 * 
 * @returns {JSX.Element} The rendered AddLocation component.
 * 
 * @example
 * <AddLocation />
 * 
 * @function
 * @name AddLocation
 * 
 * @property {string} state - The state input value.
 * @property {string} city - The city input value.
 * @property {number|null} employee_id - The employee ID (currently unused).
 * @property {string} employer_id - The employer ID retrieved from session storage.
 * 
 * @method handleReset - Resets the form fields to their initial state.
 * @method handleSubmit - Handles the form submission, sends a POST request to the API, and displays a success alert.
 * 
 * @event onClick - Triggered when the "Add" or "Reset" button is clicked.
 * @event onChange - Updates the state or city input values when the user types in the input fields.
 */
import {React,useState} from 'react'
import Headertop from '../component/Headertop'
import { BASE_URL } from '../configration/Config';
import Sidebar from './sidebar'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import { useNavigate } from 'react-router-dom';

function AddLocation() {
  const navigate = useNavigate();
    // eslint-disable-next-line no-undef
    const [state, setState] = useState('');
    const [employee_id, setEmployeeId] = useState(null);
   // eslint-disable-next-line no-undef
    const [city, setCity] = useState('');
    
      const employer_id = sessionStorage.getItem("id");
      const handleReset = () => {
        setState('');
        setCity('');
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            employer_id: parseInt(employer_id),
            state,
            city
          };

          fetch(`${BASE_URL}/User/Location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              if (response.ok) {
                // Handle successful submission
                console.log('Data submitted successfully!');
                
                Swal.fire({
                  // toast: true, // This enables the toast mode
                  // position: 'top-end', // You can position the toast (top, top-end, top-start, bottom, etc.)
                  icon: 'success', // 'success', 'error', 'warning', 'info', 'question'
                  title: 'Location Added',
                  // text: "Now Calculation result will not stored !!",
                  showConfirmButton: false, // Hide the confirm button
                  timer: 3000, // Auto close after 3 seconds
                  timerProgressBar: true, // Show a progress bar
              });
                navigate('/employee', { replace: true });
                handleReset();
                // Clear the form
                setState('');
                setCity('');
              
              } else {
                // Handle submission errors
                console.error('Error submitting data:', response.statusText);
              }
            });
        };
    
  return (
    <div>


    
            <h2 className='font-bold Ctext-base mb-6 mt-3'>Add Location</h2>
            
            <hr />
            <form className="border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50" action="#" method="POST">
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-2">
                      <div className='hidden'> 
                                  <div className="mt-2 hidden">
                                    <input
                                      id="employer_id"
                                      name="employer_id"
                                      value={employer_id}
                                      type="hidden"
                                      // autoComplete="employee_name"
                                       onChange={(e) => setEmployeeId(parseInt(e.target.value))}
                                      
                                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                    <div className=''> 
                          <label htmlFor="name" className="block text-slate-500 text-sm font-medium leading-6">
                          State 
                          </label>
                          <div className="mt-2">
                            <input
                              id="state"
                              name="stae"
                              value={state}
                              type="text"
                              autoComplete="state"
                              onChange={(e) => setState(e.target.value)}
                              
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                      </div>
                      <div className=''>
                        <label htmlFor="name" className="block text-slate-500 text-sm font-medium leading-6">
                        City
                        </label>
                          <div className="mt-2">
                            <input
                              id="city"
                              name="city"
                              value={city}
                              type="text"
                              step="0.01"
                              autoComplete="name"
                              onChange={(e) => setCity(e.target.value)}
                              
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                      </div>

                      
                      </div>   
         

        
          
        </form>
        <div className="flex items-center sm:mx-auto sm:w-full sm:max-w-lg justify-center mt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add
                  </button>
                  <button
                    type="reset"
                    onClick={handleReset}
                    className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Reset
                  </button>
</div>
 
       </div>
     
 
  )
}

export default AddLocation