// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
// import {  toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Config';
import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function DeleteItemComponent({id,cid, onDeleteSuccess, onDeleteError }) {

  const handleDelete = async () => {

    console.log(id)
    try {
      const response = await axios.delete(`${BASE_URL}/User/EmployeeDelete/${cid}/${id}`);

      if (response.status === 200 || response.status === 204) { // Handle successful deletion
        console.log('Item deleted successfully!');
        Swal.fire({
          icon: 'error', // 'success', 'error', 'warning', 'info', 'question'
          title: 'Employee Deleted',
          // text: "Now Calculation result will not stored !!",
          showConfirmButton: false, // Hide the confirm button
          timer: 3000, // Auto close after 3 seconds
          timerProgressBar: true, // Show a progress bar
      });
      setTimeout(function(){
        window.location.reload();
     }, 3000);
        onDeleteSuccess && onDeleteSuccess(id); 
        // console.log("from if")
       
      } else {
        throw new Error('Unexpected API response status'); 
        // eslint-disable-next-line no-unreachable
        
      }
    } catch (error) {   
      console.error('Error deleting item:', error);
      onDeleteError && onDeleteError(error); // Optional callback for error handling
    } finally {
    //   setIsLoading(false);
    // toast.warning('Item deleted successfully!!!');
    }

  };

  return (
    <div>
      
        <button onClick={handleDelete} className="py-2 button-cls text-sm  text-red font-semibold  ">Delete</button>
    
    </div>
  );
}

export default DeleteItemComponent;
