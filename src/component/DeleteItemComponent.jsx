import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../Config';
import Swal from 'sweetalert2';

// eslint-disable-next-line react/prop-types
function DeleteItemComponent({ id, cid, onDeleteSuccess, onDeleteError }) {
 

  const handleDelete = async () => {
    
    if (!id || !cid) {
      console.error('Missing id or cid for deletion:', { id, cid });
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to delete. Missing required details (id or cid).',
        showConfirmButton: true,
      });
      return;
    }

    console.log('Attempting to delete with id:', id, 'and cid:', cid);

    try {
      const response = await axios.delete(`${BASE_URL}/User/EmployeeDelete/${cid}/${id}`);

      if (response.status === 200 || response.status === 204) {
        console.log('Item deleted successfully!');
        Swal.fire({
          icon: 'success',
          title: 'Employee Deleted',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        onDeleteSuccess && onDeleteSuccess(id);
      } else {
        throw new Error(`Unexpected API response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete the employee. Please try again.',
        showConfirmButton: true,
      });
      onDeleteError && onDeleteError(error);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className="py-2 button-cls text-sm text-red font-semibold"
      >
        Delete
      </button>
    </div>
  );
}

export default DeleteItemComponent;
