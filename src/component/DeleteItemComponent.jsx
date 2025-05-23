
/**
 * DeleteItemComponent - A React component for deleting an item (employee or order) 
 * with confirmation and error handling.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the item to be deleted.
 * @param {string} props.cid - The customer ID associated with the item.
 * @param {string} props.type - The type of item to delete ("emp" for employee, otherwise order).
 * @param {Function} [props.onDeleteSuccess] - Callback function to execute on successful deletion.
 * @param {Function} [props.onDeleteError] - Callback function to execute on deletion error.
 *
 * @example
 * <DeleteItemComponent
 *   id="123"
 *   cid="456"
 *   type="emp"
 *   onDeleteSuccess={(id) => console.log(`Deleted item with id: ${id}`)}
 *   onDeleteError={(error) => console.error('Deletion error:', error)}
 * />
 */
import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../configration/Config';
import Swal from 'sweetalert2';
import { RiDeleteBin6Line } from "react-icons/ri";
function DeleteItemComponent({ id, cid, type, onDeleteSuccess, onDeleteError }) {
  const handleDelete = async () => {
    if (!cid) {
      console.error('Missing cid for deletion:', { cid });
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to delete. Missing required details (cid).',
        showConfirmButton: true,
      });
      return;
    }

    const endpoint =
      type === "emp"
        ? `${BASE_URL}/User/EmployeeDelete/${cid}/${id}`
        : `${BASE_URL}/User/GarOrderDelete/${cid}/`;

    console.log('Attempting to delete with id:', id, 'cid:', cid, 'type:', type);

    try {
      const response = await axios.delete(endpoint);

      if (response.status === 200 || response.status === 204) {
        console.log('Item deleted successfully!');
        Swal.fire({
          icon: 'success',
          title: type === "emp" ? 'Employee Deleted' : 'Order Deleted',
          text: type === "emp"
            ? 'The employee has been successfully deleted.'
            : 'The order has been successfully deleted.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        onDeleteSuccess && onDeleteSuccess(id);
      } else {
        throw new Error(`Unexpected API response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to delete the ${type === "emp" ? 'employee' : 'order'}. Please try again.`,
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
         <RiDeleteBin6Line />
      </button>
    </div>
  );
}

export default DeleteItemComponent;
