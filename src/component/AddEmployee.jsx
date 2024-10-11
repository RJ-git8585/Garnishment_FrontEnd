// eslint-disable-next-line no-unused-vars
import {React, useState} from 'react'
import Headertop from '../component/Headertop'
import Sidebar from '../component/sidebar'

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Config';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';
// import { FaUserEdit } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import Swal from 'sweetalert2';


function AddEmployee() {

    const [employee_name, setName] = useState('');
    const [department, setDepart] = useState('');
     const [pay_cycle, setPayCycle] = useState('');
    const [number_of_garnishment, setNumberGarnihsment] = useState('');
      const [location, setLocation] = useState('');
      const employer_id = sessionStorage.getItem("id");

      const handleReset = () => {
                 setName('');
                setDepart('');
                setPayCycle('');
                setNumberGarnihsment('');
                setLocation('');
      };
      const handleState = (event) => {
        setLocation(event.target.value);
      };

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
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            employer_id,
            employee_name,
            department,
            pay_cycle,
            number_of_garnishment,
            location
          };

          fetch(`${BASE_URL}/User/employee_details/`, {
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
                  title: 'Employee added successfully',
                  text: "Plesse check ones!!",
                  showConfirmButton: false, // Hide the confirm button
                  timer: 3000, // Auto close after 3 seconds
                  timerProgressBar: true, // Show a progress bar
              });
              setTimeout(function(){
                window.location.reload();
             }, 3000);
                // navigate('/employee', { replace: true });
                handleReset();

                // Clear the form
                setName('');
                setDepart('');
                // setNet('');
                // setMinWages('');
                setPayCycle('');
                setNumberGarnihsment('');
                setLocation('');
              } else {
                // Handle submission errors
                console.error('Error submitting data:', response.statusText);
              }
            });
        };
    
  return (
    <div>

<div className="min-h-full">
       
        <div className="container main ml-auto">
        <div className='sidebar hidden lg:block'><Sidebar/></div>
        
        <div className=' contant content ml-auto mb-4'>
        <Headertop />
           
            <h1 className='edit-profile mt-6 mb-4 inline-block'><FaUserTie/>ADD EMPLOYEE</h1>
            <h6 className='mt-4 mb-4 font-bold  text-sm'>EMPLOYEE DETAILS : </h6>
              <form className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   gap-3 mt-8 border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50" action="#" method="POST">
             
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
                              placeholder="Enter Emaployee Name"
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
                              step="1"
                              autoComplete="name"
                              placeholder="Enter Department"
                              onChange={(e) => setDepart(e.target.value)}
                              
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>


                        <div className="">
                          <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-slate-500 block  text-sm font-medium leading-6 ">
                            Pay Cycle 
                            </label>
                          </div>
                          <div className="mt-2">
                            <input 
                              id="pay_cycle"
                              name="pay_cycle"
                              type="text"
                              value={pay_cycle}
                              placeholder="Enter Pay Cycle"
                              onChange={(e) => setPayCycle(e.target.value)}
                              // autoComplete="current-password"
                              
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                          </div>
                          
                        
            </div>
            
            <div className=""> 
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
                              step="1"
                              placeholder="Enter Number of Garnishment"
                              min="1" max="5"
                              value={number_of_garnishment}
                              onChange={(e) => setNumberGarnihsment(e.target.value)}    
                              // autoComplete="current-password"
                              
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                          </div>
                          
                        
            </div>
            <div className="">
                          <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-slate-500 block  text-sm font-medium leading-6 ">
                            Location 
                            </label>
                          </div>
                          <div className="mt-2">
                            <select className=" appearance-none   py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-black dark:focus:ring-white-500 dark:focus:border-white-500" id="selectField" value={location} onChange={handleState}>
                      <option value="" >Choose an State </option>
                      {StateList.map((option) => (
                        <option key={option.id} value={option.label}>
                          {option.label}
                         
                        </option>
                        
                      ))}
                    </select>

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
    </div>  
       
       </div>
       {/* <ToastContainer /> */}
       </div>
     
 
  )
}

export default AddEmployee