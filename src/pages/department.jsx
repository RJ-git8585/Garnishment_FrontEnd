
/**
 * Department component displays a list of departments fetched from an API.
 * It includes functionality to fetch department data, display it in a table,
 * and provide actions for editing and deleting departments.
 *
 * @component
 * @returns {JSX.Element} The rendered Department component.
 *
 * @example
 * <Department />
 *
 * @description
 * - Fetches department data from the API using the `useEffect` hook.
 * - Displays the data in a table with columns for Employer ID, Department Name, Department ID, and actions.
 * - Includes a button for exporting data (currently non-functional).
 *
 * @dependencies
 * - React
 * - react-icons (TiExport)
 * - ProfileHeader (custom component)
 *
 * @state
 * - `data` (Array): Stores the fetched department data.
 *
 * @hooks
 * - `useState`: Manages the state of the department data.
 * - `useEffect`: Fetches department data when the component mounts.
 *
 * @notes
 * - The `id` is retrieved from `sessionStorage`.
 * - Error handling is implemented for the fetch operation.
 * - Some commented-out code is present for additional functionality (e.g., adding departments).
 */
import { React, useState,useEffect } from 'react'
import ProfileHeader from '../component/ProfileHeader'
import { TiExport } from "react-icons/ti";


function Department() {

    // const id = localStorage.getItem("id");
//   const Link = `https://garnishment-backend.onrender.com/User/ExportEmployees/${id}/`;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [data, setData] = useState([]);
  
  useEffect(()=>{
  // const name = localStorage.getItem("name");
    const fetchData = async () => {
      try {
        const id = sessionStorage.getItem("id");
        const response = await fetch(`https://garnishment-backend.onrender.com/User/GetDepartmentDetails/${id}`); // Replace with your API URL
        const jsonData = await response.json();
        setData(jsonData.data) ;
      
        // console.log(jsonData)    
        // console.log(Data)
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors appropriately (display error message, etc.)
      }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks, no-undef
    
    fetchData(); // Call the function
    // toast.success('All Department Data !!');
  },[])
    // eslint-disable-next-line no-unused-vars
   
   


  return (
    <>


            <ProfileHeader/>
            
            <hr />
            <div className='items-right text-right mt-4 mb-4 customexport'>
            <a href="#" className=" border inline-flex items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><TiExport />
        Export
        </a>
        {/* <a href="/adddepartment" className=" border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><FaPlusCircle />
       Add
       </a> */}
       </div>
            <table className="min-w-full divide-y divide-gray-200 mt-6">
              
               <thead>
                 <tr>
                 {/* <th className="text-center border border-slate-300 p-2 uppercase text-xs">Sr</th> */}
                   <th className="pb-4 text-start text-xs  text-gray-500 uppercase">Employer Id</th>
                   <th className="pb-4 text-start text-xs  text-gray-500 uppercase">Department </th>
                   <th className="pb-4 text-start text-xs  text-gray-500 uppercase">Department Id</th>
                   
                   <th className="pb-4 text-start text-xs  text-gray-500 uppercase">Action</th>
                   <th className="pb-4 text-start text-xs  text-gray-500 uppercase">Action</th>
                 </tr>
               </thead>
               
            {data && (
              
                 <tbody className='divide-y divide-gray-200'> 
                
                {data.map((item) => (
                  <>
               
                   <tr key="1">
                   {/* <td className="border border-slate-300 text-xs">{index + 1}</td> */}
                  <td className=" text-xs">{item.employer_id}</td><td className=" text-xs">{item.department_name}</td><td className=" text-xs">{item.department_id}</td><button className="button-cls text-sm  text-blue font-semibold "id={item.employee_id} >Edit</button><td><button id={item.employee_id} className="button-cls text-sm  text-blue font-semibold ">Delete</button></td>
                
                  </tr>
                
                </>
 
  
                ))}
             </tbody>
            
               
      )}
  
  </table>
        
    
      {/* <ToastContainer /> */}
   
 </>
  )
}

export default Department