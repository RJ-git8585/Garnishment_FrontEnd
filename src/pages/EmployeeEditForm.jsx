import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Config';

function EmployeeEditForm() {
  const { cid, ee_id } = useParams(); // Get the company ID and employee ID from URL
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    ee_id: '',
    social_security_number: '',
    blind: '',
    age: '',
    gender: '',
    home_state: '',
    work_state: '',
    pay_period: '',
    support_second_family: '',
    number_of_exemptions: '',
    filing_status: '',
    marital_status: '',
    number_of_student_default_loan: '',
    spouse_age: '',
    is_spouse_blind: '',
  });

  // Fetch the employee data when the component mounts
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/GetSingleEmployee/${cid}/${ee_id}/`);
        const jsonData = await response.json();
        setEmployeeData(jsonData.data[0]); // Assuming the response data is in jsonData.data
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [cid, ee_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/User/update_employee_details/${cid}/${ee_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        // Redirect back to the employee list page after successful update
        navigate('/employee');
      } else {
        console.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            name="ee_id"
            value={employeeData.ee_id}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div>
          <label>Social Security Number:</label>
          <input
            type="text"
            name="social_security_number"
            value={employeeData.social_security_number}
            onChange={handleInputChange}
          />
        </div>
        {/* Add the rest of the fields similar to above */}
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={employeeData.age}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeEditForm;
