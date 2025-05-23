
/**
 * EditItemComponent - A React component that displays an "Edit" button and a popup form for editing employee details.
 *
 * @param {Object} props - The props object.
 * @param {string} props.id - The unique identifier for the employee.
 * @param {string} props.employerId - The unique identifier for the employer.
 * @param {string} props.baseUrl - The base URL for API requests.
 * @param {Function} props.onDeleteSuccess - Callback function to handle successful deletion.
 * @param {Function} props.onDeleteError - Callback function to handle deletion errors.
 *
 * @returns {JSX.Element} The rendered EditItemComponent.
 *
 * @description
 * This component fetches employee data from the server when the "Edit" button is clicked
 * and displays a popup form with the fetched data. The form allows users to update employee
 * details such as name, department, pay cycle, number of garnishments, and location.
 *
 * @example
 * <EditItemComponent
 *   id="123"
 *   employerId="456"
 *   baseUrl="https://api.example.com"
 *   onDeleteSuccess={() => console.log('Delete successful')}
 *   onDeleteError={() => console.error('Delete failed')}
 * />
 */
import React, { useState } from 'react';
import Popup from './Popup';

function EditItemComponent({ id, employerId, baseUrl, onDeleteSuccess, onDeleteError }) {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = (id) => {
    fetchData(id);
    setIsOpen(!isOpen);
  };

  const fetchData = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/User/GetSingleEmployee/${employerId}/${id}/`); // Dynamic URL
      const jsonData = await response.json();
      setData(jsonData.data);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors appropriately (display error message, etc.)
    }
  };

  return (
    <div>
      <button
        onClick={() => togglePopup(id)}
        key={id}
        id={id}
        className="py-2 button-cls text-sm text-blue font-semibold"
      >
        Edit
      </button>
      {isOpen && (
        <Popup
          content={
            <>
              {data?.length > 0 &&
                data.map((item) => (
                  <>
                    <form
                      className="popupform grid grid-cols-2 gap-2 mt-8 border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50"
                      action="#"
                      method="POST"
                    >
                      <div className="hidden">
                        <div className="mt-2 hidden">
                          <input
                            id="employer_id"
                            name="employer_id"
                            value={item.employer_id}
                            type="hidden"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="max-w-80">
                        <label
                          htmlFor="name"
                          className="block text-slate-500 text-sm font-medium leading-6"
                        >
                          Employee Name
                        </label>
                        <div className="mt-2">
                          <input
                            id="employee_name"
                            name="employee_name"
                            value={item.employee_name}
                            type="text"
                            autoComplete="employee_name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="max-w-80">
                        <label
                          htmlFor="name"
                          className="block text-slate-500 text-sm font-medium leading-6"
                        >
                          Department
                        </label>
                        <div className="mt-2">
                          <input
                            id="department"
                            name="department"
                            value={item.department}
                            type="text"
                            step="1"
                            autoComplete="name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="max-w-80">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="text-slate-500 block text-sm font-medium leading-6"
                          >
                            Pay Cycle
                          </label>
                        </div>
                        <div className="mt-2">
                          <input
                            id="pay_cycle"
                            name="pay_cycle"
                            type="text"
                            value=""
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="max-w-80">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="text-slate-500 block text-sm font-medium leading-6"
                          >
                            Number of Garnishment
                          </label>
                        </div>
                        <div className="mt-2">
                          <input
                            id="number_of_child_support_order"
                            name="number_of_child_support_order"
                            type="number"
                            step="1"
                            min="1"
                            max="5"
                            value=""
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="max-w-80">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="text-slate-500 block text-sm font-medium leading-6"
                          >
                            Location
                          </label>
                        </div>
                        <div className="mt-2">
                          <input
                            id="location"
                            name="location"
                            type="text"
                            value=""
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 justify-center mt-4">
                        <div className="max-w-96">
                          <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 custom-btn"
                          >
                            Update
                          </button>
                        </div>
                        <div className="max-w-96">
                          <button
                            type="reset"
                            className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                ))}
            </>
          }
          handleClose={togglePopup}
        />
      )}
    </div>
  );
}

export default EditItemComponent;