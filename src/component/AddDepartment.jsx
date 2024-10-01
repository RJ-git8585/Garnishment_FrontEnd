// eslint-disable-next-line no-unused-vars
import {React,useState} from 'react'
import Headertop from '../component/Headertop'

import Sidebar from '../component/sidebar'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AddDepartment() {
  const navigate = useNavigate();
    // eslint-disable-next-line no-undef
   // eslint-disable-next-line no-undef
    const [department_name, setDepart] = useState('');
     // eslint-disable-next-line no-undef
    
      // eslint-disable-next-line no-undef
      const employer_id = sessionStorage.getItem("id");
      const handleReset = () => {
                
                setDepart('');
               
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            employer_id,
            department_name,
            
          };

          fetch(`${BASE_URL}/User/Department`, {
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
                  title: 'Department Added',
                  // text: "Now Calculation result will not stored !!",
                  showConfirmButton: false, // Hide the confirm button
                  timer: 3000, // Auto close after 3 seconds
                  timerProgressBar: true, // Show a progress bar
              });
              setTimeout(function(){
                window.location.reload();
             }, 3000);
                handleReset();

                // Clear the form
              
                setDepart('');
                
              } else {
                // Handle submission errors
                console.error('Error submitting data:', response.statusText);
              }
            });
        };
    
  return (
    <div>

<div className="min-h-full">
       
        <div className="container main ml-auto mt-6">
        <div className='sidebar hidden lg:block'><Sidebar/></div>
        
        <div className=' contant content ml-auto '>
        <Headertop />
            <h2 className='font-bold Ctext-base mb-6 mt-3'>Add Department</h2>
            
            <hr />
            <form className=" grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50" action="#" method="POST">
                    
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
                        Department
                        </label>
                        <div className="mt-2">
                          <input
                            id="department"
                            name="department"
                            value={department_name}
                            type="text"
                            step="0.01"
                            autoComplete="name"
                            onChange={(e) => setDepart(e.target.value)}
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                     


          
          </form>
         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4">
          <div className="flex justify-center items-center" >
      
            <button
              type="submit"
             onClick={handleSubmit}
              className="flex w-full mt-2  justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 custom-btn"
            >
              ADD
            </button>
            </div>
            <div className="flex justify-center items-center"  >
            <button
              type="reset"
              onClick={handleReset}
              className="flex w-full mt-2 justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
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

export default AddDepartment