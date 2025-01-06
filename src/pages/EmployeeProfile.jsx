import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Config';
import load from '../bouncing-circles.svg';
import Swal from 'sweetalert2';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';

const EmployeeProfile = () => {
  const { employeeId } = useParams();
  const id = sessionStorage.getItem("id"); // Employer ID
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({});
  const navigate = useNavigate();

  // Fetch Employee Details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/User/GetSingleEmployee/${id}/${employeeId}/`);
        const jsonData = await response.json();
        setEmployee(jsonData.data);
        setEditableFields(jsonData.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load',
          text: 'Unable to fetch employee details. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId, id]);

  // Handle Edit Click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle Save Click
  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${BASE_URL}/User/employee_details/${employeeId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableFields),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Employee Updated',
          text: 'Employee details updated successfully!',
        });
        setEmployee(editableFields); // Update displayed data
        setIsEditing(false);
      } else {
        console.error('Failed to update employee');
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update employee details. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while updating employee details.',
      });
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableFields({ ...editableFields, [name]: value });
  };

  return (
    <>
      <div className="min-h-full">
        <div className="container main ml-auto">
          <div className='sidebar hidden lg:block'><Sidebar /></div>
          <div className='content ml-auto flex flex-col'>
            <Headertop />

            <div className="container mx-auto bg-white p-8 rounded-lg shadow-md mt-4">
              {loading ? (
                <div className="text-center">
                  <img src={load} alt="Loading..." className="mx-auto h-12 w-12" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">Employee Profile</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Name:</strong> 
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="employee_name" 
                          value={editableFields.employee_name || ''} 
                          onChange={handleInputChange} 
                          className="border p-1 rounded"
                        />
                      ) : (
                        employee.employee_name
                      )}
                    </p>
                    <p><strong>Employee ID:</strong> {employee.employee_id}</p>
                    <p><strong>Employer ID:</strong> {employee.employer_id}</p>
                    <p><strong>Location:</strong> 
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="location" 
                          value={editableFields.location || ''} 
                          onChange={handleInputChange} 
                          className="border p-1 rounded"
                        />
                      ) : (
                        employee.location
                      )}
                    </p>
                    <p><strong>Department:</strong> 
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="department" 
                          value={editableFields.department || ''} 
                          onChange={handleInputChange} 
                          className="border p-1 rounded"
                        />
                      ) : (
                        employee.department
                      )}
                    </p>
                    <p><strong>Number of Garnishments:</strong> 
                      {isEditing ? (
                        <input 
                          type="number" 
                          name="number_of_child_support_order" 
                          value={editableFields.number_of_child_support_order || ''} 
                          onChange={handleInputChange} 
                          className="border p-1 rounded"
                        />
                      ) : (
                        employee.number_of_child_support_order
                      )}
                    </p>
                    <p><strong>Pay Cycle:</strong> 
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="pay_cycle" 
                          value={editableFields.pay_cycle || ''} 
                          onChange={handleInputChange} 
                          className="border p-1 rounded"
                        />
                      ) : (
                        employee.pay_cycle
                      )}
                    </p>
                  </div>

                  <div className="mt-6 flex space-x-4 text-sm">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={handleSaveClick} 
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)} 
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleEditClick} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/employee')} 
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Back to Employees
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfile;
