/**
 * Tax Component
 * 
 * This component fetches and displays tax details for a user. It includes functionality
 * to add new tax records, edit existing ones, and delete records using the DeleteItemComponent.
 * 
 * @component
 * 
 * @param {Function} onDeleteSuccess - Callback function triggered upon successful deletion of a tax record.
 * 
 * @returns {JSX.Element} The rendered Tax component.
 * 
 * @example
 * // Usage
 * <Tax onDeleteSuccess={handleDeleteSuccess} />
 * 
 * @remarks
 * - Fetches tax details from the API using the user's ID stored in sessionStorage.
 * - Displays tax details in a table format with options to edit or delete records.
 * - Includes a button to navigate to the "Add Tax" page.
 * 
 * @dependencies
 * - React (useState, useEffect)
 * - Headertop, Sidebar, DeleteItemComponent (custom components)
 * - react-icons (FaPlus)
 * - BASE_URL (API base URL)
 * 
 * @todo
 * - Add loading and error handling states for better user experience.
 * - Implement the edit functionality for tax records.
 */
import {React ,useState,useEffect} from 'react'
import Headertop from '../component/Headertop'
import Sidebar from '../component/sidebar'
import DeleteItemComponent from '../component/DeleteItemComponent';
import { BASE_URL } from '../configration/Config';
import { FaPlus } from "react-icons/fa";

function Tax(onDeleteSuccess) {

  const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  useEffect(()=>{

    const fetchData = async () => {
      try {
        const id = sessionStorage.getItem("id");
        const response = await fetch(`${BASE_URL}/User/GetTaxDetails/${id}/`); // Replace with your API URL
        const jsonData = await response.json();
        setData(jsonData.data) ;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call the function

  },[])
   
  return (
    <>
    
       <Headertop />
       {/* <ProfileHeader/> */}
       <hr />

       <div className='items-right text-right mt-4 mb-4 customexport'>
       <a type="button" href="/addtax" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><FaPlus />
        Add
      </a>
       </div>
       <div className="flex flex-col mt-6">
  <div className="-m-1.5 overflow-x-auto">
    <div className="p-1.5 min-w-full inline-block align-middle">
      <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
              
              <thead>
                <tr>
                {/* <th className="text-center  border-slate-300 p-2 uppercase text-xs">Sr</th> */}
                  <th className="pb-4 border-slate-300   uppercase text-xs">Tax Id  </th>
                  <th className=" pb-4 border-slate-300 uppercase text-xs">Employer Id</th>
                  <th className=" pb-4 border-slate-300  uppercase  text-xs">Fedral Income Tax(%)</th>
                  <th className=" pb-4 border-slate-300 uppercase text-xs">Social Security(%)</th>
                  <th className=" pb-4 border-slate-300 uppercase  text-xs">Medicare Tax(%)</th>
                  <th className=" pb-4 border-slate-300 uppercase text-xs">State Taxes(%)</th>
                  <th className="pb-4  border-slate-300 uppercase text-xs">Action</th>
                  <th className=" pb-4 border-slate-300 uppercase text-xs">Action</th>
                </tr>
              </thead>
           {data && (
             
                <tbody> 
               
               {data.map((item) => (
               
              
                  <tr key={item.employer_id}>
                 <td className=" border-slate-300 text-xs">{item.tax_id}</td><td className=" border-slate-300 text-xs">{item.employer_id}</td><td className=" border-slate-300 pr-20 text-right text-xs">{item.fedral_income_tax}</td><td className=" border-slate-300 text-right pr-20 text-xs">{item.social_and_security}</td><td className="text-right pr-20 border-slate-300 text-xs">{item.medicare_tax} </td><td className=" border-slate-300 text-xs pr-20 text-right">{item.state_taxes} </td><button className="py-2 button-cls text-sm  text-blue font-semibold" id={item.employee_id}>Edit</button><td>
                 <DeleteItemComponent
           id={item.employee_id} // Pass the record ID
           onDeleteSuccess={onDeleteSuccess} // Optional callback for successful deletion
         />
                 </td>
               
                 </tr>

               ))}
            </tbody>
           
              
     )}
 
 </table>
    </div>
    </div>
    </div>
    </div>
   
    </>
  )
}

export default Tax 