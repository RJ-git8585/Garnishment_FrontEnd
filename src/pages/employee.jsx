// /* eslint-disable react-hooks/rules-of-hooks */
// // eslint-disable-next-line no-unused-vars
// import { React, useState, useEffect } from 'react'
// import Headertop from '../component/Headertop'
// // import ProfileHeader from '../component/ProfileHeader'
// import Sidebar from '../component/sidebar'
// // import {  toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// import DeleteItemComponent from '../component/DeleteItemComponent';
// import EditItemComponent from '../component/editItemComponent';
// import { CgImport } from "react-icons/cg";
// import { TiExport } from "react-icons/ti";
// import { FaPlus } from "react-icons/fa";
// // import Garnishment from './Garnishment';
// import load  from '../bouncing-circles.svg';
// import { BASE_URL } from '../Config';


// function employee(onDeleteSuccess,onEditSuccess) {
//   // this is for the pagination
//   const id = sessionStorage.getItem("id");
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   // const [Loading, setIsLoading] = useState(true);
//   const Link = `${BASE_URL}/User/ExportEmployees/${id}/`;
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [data, setData] = useState(null);
//   // const totalPages = Math.ceil(data.length / 10);  
//   useEffect(()=>{
//   // const name = localStorage.getItem("name");
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const id = sessionStorage.getItem("id");
//         const response = await fetch(`${BASE_URL}/User/getemployeedetails/${id}/`); // Replace with your API URL
//         const jsonData = await response.json();
//         setData(jsonData.data);
//         setLoading(false);
        
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//         // Handle errors appropriately (display error message, etc.)
//       }
      
//     };

//     fetchData(); // Call the function
//     // toast.success('All Employee Data !!');
//   },[])
//     // eslint-disable-next-line no-unused-vars
//     const selectPageHandler = (seletedPage) =>{
//       setPage(seletedPage);
//     }

   

//   return (
//     <div>


// <div className="min-h-full">
        
//         <div className="container main ml-auto">
//         <div className='sidebar hidden lg:block'><Sidebar/></div>
        
//         <div className=' contant content ml-auto flex flex-col'>
//             <Headertop />
//             {/* <ProfileHeader/> */}
            
//             <hr />
            
//             <div className='items-right text-right mt-4 mb-4 customexport'>
            
//             <a href={Link} className=" border inline-flex items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><TiExport />
//         Export
//         </a>
//         <a href="#" className=" border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><CgImport />
//        Import
//        </a>

//       <a type="button" href="/addemployee" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><FaPlus />
//         Add
//       </a>
    
//        </div>
//        <div className="flex flex-col mt-6">
//   <div className="-m-1.5 overflow-x-auto">
//     <div className="p-1.5 min-w-full inline-block align-middle">
//       <div className="overflow-hidden">
     
//       <div className="overflow-x-auto">
//   <table className="min-w-full divide-y divide-gray-200 table-auto">
//     <thead>
//       <tr>
//         <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Employee Name</th>
//         <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Employee Id</th>
//         <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Employer Id</th>
//         <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Location</th>
//         <th className="pb-4  pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Department</th>
//         <th className="pb-4  pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">No. of Garnishment</th>
//         <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Pay Cycle</th>
//         <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Edit</th>
//         <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Delete</th>
//       </tr>
//     </thead>

//     {loading ? (
//       <div className="text-sm w-full text-center m-0">
//         <div className="text-sm w-full text-center m-0">
//           <img className="mx-auto h-10 w-auto custom_logo_side" src={load} alt="Loading" />
//         </div>
//       </div>
//     ) : data ? (
//       <tbody className="divide-y divide-gray-200">
//         {data.slice(page * 10 - 10, page * 10).map((item) => (
//           <tr key={item.employer_id} className="hover:bg-gray-100 bg-gray-200">
//             <td className="p-2 text-xs sm:text-sm">{item.employee_name}</td>
//             <td className="p-2 text-xs sm:text-sm">{item.employee_id}</td>
//             <td className="p-2 text-xs sm:text-sm">{item.employer_id}</td>
//             <td className="p-2 text-xs sm:text-sm">{item.location}</td>
//             <td className="p-2 text-xs sm:text-sm">{item.department}</td>
//             <td className="p-2 text-xs sm:text-sm">{item.number_of_garnishment}</td>
//             <td className="p-2 text-xs sm:text-sm">{item.pay_cycle}</td>
//             <td className="p-2 text-xs sm:text-sm">
//               <EditItemComponent id={item.employee_id} onEditSuccess={onEditSuccess} />
//             </td>
//             <td className="p-2 text-xs sm:text-sm">
//               <DeleteItemComponent id={item.employee_id} onDeleteSuccess={onDeleteSuccess} />
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     ) : (
//       <div className="text-center text-sm nodatacls">No data found</div>
//     )}
//   </table>
// </div>

//   {data?.length  > 0 &&  <div className="pagination">
    
//         <span className="text-sm p-2 mt-4 text-blue colr font-semibold">Pages : </span>
       
//           {[...Array(Math.ceil(data.length / 10 ))].map((_,i) => {    // <span>1</span>
//               return <span className={`text-sm p-2 mt-4 custom-cls-pagei text-blue font-semibold ${
//                 i === 0 ? 'active' : ''
//               }`} onClick={()=>selectPageHandler(i + 1)} key={i}>{i + 1}</span>
              

//           })}
//         {/* <span>2</span>
//         <span>3</span> */}
//         </div>}
//   </div>
//     </div>
//   </div>
// </div>

//         </div>  
//       </div>

//       </div>
//     </div>
//   )
// }

// export default employee

////////////////////////////////////////////////////
import { React, useState, useEffect } from 'react';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import DeleteItemComponent from '../component/DeleteItemComponent';
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
import { FaPlus } from "react-icons/fa";
import load from '../bouncing-circles.svg';
import { BASE_URL } from '../Config';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

function Employee({ onDeleteSuccess, onEditSuccess }) {
  const id = sessionStorage.getItem("id");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const Link = `${BASE_URL}/User/ExportEmployees/${id}/`;
  const [editId, setEditId] = useState(null);
  const [editableFields, setEditableFields] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/User/getemployeedetails/${id}/`);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const selectPageHandler = (selectedPage) => {
    setPage(selectedPage);
  };

  const handleEditClick = (item) => {
    setEditId(item.employee_id);
    setEditableFields({
      location: item.location,
      department: item.department,
      number_of_garnishment: item.number_of_garnishment,
      pay_cycle: item.pay_cycle,
    });
  };

  const handleSaveClick = async (employeeId) => {
    const updatedEmployee = {
      ...editableFields,
    };
    
    try {
      const response = await fetch(`${BASE_URL}/User/employee_details/${employeeId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });
              console.log('Employee updated successfully!');  
              Swal.fire({
                // toast: true, // This enables the toast mode
                // position: 'top-end', // You can position the toast (top, top-end, top-start, bottom, etc.)
                icon: 'success', // 'success', 'error', 'warning', 'info', 'question'
                title: 'Employee updated successfully',
                // text: "Plesse check ones!!",
                showConfirmButton: false, // Hide the confirm button
                timer: 3000, // Auto close after 3 seconds
                timerProgressBar: true, // Show a progress bar
            });
            
      if (response.ok) {
        onEditSuccess(); // Call the success callback
        setEditId(null); // Clear edit state
        setEditableFields({}); // Clear editable fields
         navigate('/employee', { replace: true });
        // Optionally fetch data again or update state locally
      } else {
        console.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      <div className="min-h-full">
        <div className="container main ml-auto">
          <div className='sidebar hidden lg:block'><Sidebar /></div>
          <div className='content ml-auto flex flex-col'>
            <Headertop />
            <hr />
            <div className='items-right text-right mt-4 mb-4 customexport'>
              <a href={Link} className="border inline-flex items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><TiExport /> Export</a>
              <a href="#" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><CgImport /> Import</a>
              <a type="button" href="/addemployee" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><FaPlus /> Add</a>
            </div>
            <div className="flex flex-col mt-6">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                      <thead>
                        <tr>
                          <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Employee Name</th>
                          <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Employee Id</th>
                          <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Employer Id</th>
                          <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Location</th>
                          <th className="pb-4 pl-4 text-start text-xs sm:text-sm text-gray-500 uppercase">Department</th>
                          <th className="pb-4 pl-4 text-xs sm:text-sm text-gray-500 uppercase">No. of Garnishment</th>
                          <th className="pb-4 pl-4 text-xs sm:text-sm text-gray-500 uppercase">Pay Cycle</th>
                          <th className="pb-4 pl-4 text-xs sm:text-sm text-gray-500 uppercase">Edit</th>
                          <th className="pb-4 pl-4 text-xs sm:text-sm text-gray-500 uppercase">Delete</th>
                        </tr>
                      </thead>
                      {loading ? (
                        <tbody>
                          <tr>
                            <td colSpan="9" className="text-center">
                              <img className="mx-auto h-10 w-auto" src={load} alt="Loading" />
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody className="divide-y divide-gray-200">
                          {data.slice(page * 10 - 10, page * 10).map((item) => (
                            <tr key={item.employee_id} className="hover:bg-gray-100 bg-gray-200">
                              <td className="p-2 text-xs sm:text-sm">{item.employee_name}</td>
                              <td className="p-2 text-xs sm:text-sm">{item.employee_id}</td>
                              <td className="p-2 text-xs sm:text-sm">{item.employer_id}</td>
                              <td className="p-2 text-xs sm:text-sm">
                                {editId === item.employee_id ? (
                                  <input
                                    type="text"
                                    value={editableFields.location}
                                    onChange={(e) => setEditableFields({ ...editableFields, location: e.target.value })}
                                  />
                                ) : (
                                  item.location
                                )}
                              </td>
                              <td className="p-2 text-xs sm:text-sm">
                                {editId === item.employee_id ? (
                                  <input
                                    type="text"
                                    value={editableFields.department}
                                    onChange={(e) => setEditableFields({ ...editableFields, department: e.target.value })}
                                  />
                                ) : (
                                  item.department
                                )}
                              </td>
                              <td className="p-2 text-xs sm:text-sm">
                                {editId === item.employee_id ? (
                                  <input
                                    type="number"
                                    value={editableFields.number_of_garnishment}
                                    onChange={(e) => setEditableFields({ ...editableFields, number_of_garnishment: e.target.value })}
                                  />
                                ) : (
                                  item.number_of_garnishment
                                )}
                              </td>
                              <td className="p-2 text-xs sm:text-sm">
                                {editId === item.employee_id ? (
                                  <input
                                    type="text"
                                    value={editableFields.pay_cycle}
                                    onChange={(e) => setEditableFields({ ...editableFields, pay_cycle: e.target.value })}
                                  />
                                ) : (
                                  item.pay_cycle
                                )}
                              </td>
                              <td className="p-2 text-xs sm:text-sm">
                                {editId === item.employee_id ? (
                                  <button onClick={() => handleSaveClick(item.employee_id)} className="text-blue-500">Save</button>
                                ) : (
                                  <button onClick={() => handleEditClick(item)} className="text-blue-500">Edit</button>
                                )}
                              </td>
                              <td className="p-2 text-xs sm:text-sm">
                                <DeleteItemComponent id={item.employee_id} onDeleteSuccess={onDeleteSuccess} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                  {data.length > 0 && (
                    <div className="pagination">
                      <span className="text-sm p-2 mt-4 text-blue font-semibold">Pages:</span>
                      {[...Array(Math.ceil(data.length / 10))].map((_, i) => (
                        <span
                          className={`text-sm p-2 mt-4 custom-cls-pagei text-blue font-semibold ${i === page - 1 ? 'active' : ''}`}
                          onClick={() => selectPageHandler(i + 1)}
                          key={i}
                        >
                          {i + 1}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;
