// eslint-disable-next-line no-unused-vars
import {React,useState} from 'react'
import Headertop from '../component/Headertop'
import { BASE_URL } from '../Config';
import Sidebar from '../component/sidebar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

function AddLocation() {
  const navigate = useNavigate();
    // eslint-disable-next-line no-undef
    const [state, setState] = useState('');
   // eslint-disable-next-line no-undef
    const [city, setCity] = useState('');
    
      const employer_id = localStorage.getItem("id");
      const handleReset = () => {
        setState('');
        setCity('');
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            employer_id,
            state,
            city
            
          };

          fetch(`${BASE_URL}/User/Location/`, {
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
                
                toast('Data submitted successfully !!');
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

<div className="min-h-full">
       
        <div className="container main">
        <div className='sidebar hidden lg:block'><Sidebar/></div>
        
        <div className=' contant content ml-auto'>
        <Headertop />
            <h2 className='font-bold Ctext-base mb-6'>Add Location</h2>
            
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

                      
                      
         

          <div >
      
            <button
              type="submit"
             onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 custom-btn"
            >
              ADD
            </button>
            </div>
            <div >
            <button
              type="reset"
              onClick={handleReset}
              className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              CANCEL
            </button>
            
           
          </div>
          
        </form>





    </div>
    </div>  
       
       </div>
       <ToastContainer />
       </div>
     
 
  )
}

export default AddLocation