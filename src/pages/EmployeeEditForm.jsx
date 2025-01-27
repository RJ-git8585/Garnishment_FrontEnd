import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Config';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';


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
  
    let updatedValue = value;
  
    // Special handling for 'social_security_number'
    if (name === 'social_security_number') {
      // Remove any non-numeric characters
      let formattedValue = value.replace(/\D/g, '');
  
      // Ensure that the SSN is properly formatted (XXX-XX-XXXX)
      if (formattedValue.length <= 3) {
        // eslint-disable-next-line no-self-assign
        formattedValue = formattedValue;
      } else if (formattedValue.length <= 5) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3)}`;
      } else if (formattedValue.length <= 9) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 5)}-${formattedValue.slice(5, 9)}`;
      } else {
        formattedValue = formattedValue.slice(0, 9); // Limit to 9 digits
      }
  
      updatedValue = formattedValue;
    }
  
    // Special handling for 'is_spouse_blind'
    if (name === 'is_spouse_blind') {
      updatedValue = value === 'true'; // Convert 'true' string to boolean
    }
   // Special handling for 'is_blind'
   if (name === 'is_blind') {
    updatedValue = value === 'true'; // Convert 'true' string to boolean
  }
    // Update state
    setEmployeeData({
      ...employeeData,
      [name]: updatedValue,
    });
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
      <div className="min-h-full">
        <div className="container main ml-auto">
          <div className="sidebar hidden lg:block"><Sidebar /></div>
          <div className="content ml-auto flex flex-col">
            <Headertop />
            <hr />
            <div className="items-right text-right mt-4 mb-4 customexport">
              
            </div>

            <h2 className="mb-2">Edit Employee</h2>
            <hr className="mb-4"></hr>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="ee_id" className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    name="ee_id"
                    value={employeeData.ee_id}
                    onChange={handleInputChange}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="social_security_number" className="block text-sm font-medium text-gray-700">
                    Social Security Number
                  </label>
                  <input
                    type="text"
                    name="social_security_number"
                    value={employeeData.social_security_number}
                    onChange={handleInputChange}
                    maxLength={11} // Restrict total input length (XXX-XX-XXXX)
                    placeholder="XXX-XX-XXXX"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
  <label htmlFor="is_spouse_blind" className="block text-sm font-medium text-gray-700">Is Blind</label>
  <div className="mt-1 flex items-center space-x-4">
    <div className="flex items-center">
      <input
        type="radio"
        name="is_blind"
        value="true" // Use 'true' as string value for the radio button
        checked={employeeData.is_blind === true} // Compare to boolean true
        onChange={handleInputChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <label htmlFor="is_blindYes" className="ml-2 text-sm text-gray-700">Yes</label>
    </div>
    <div className="flex items-center">
      <input
        type="radio"
        name="is_blind"
        value="false" // Use 'false' as string value for the radio button
        checked={employeeData.is_blind === false} // Compare to boolean false
        onChange={handleInputChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <label htmlFor="is_blindNo" className="ml-2 text-sm text-gray-700">No</label>
    </div>
  </div>
</div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={employeeData.age}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={employeeData.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="home_state" className="block text-sm font-medium text-gray-700">Home State</label>
                  <input
                    type="text"
                    name="home_state"
                    value={employeeData.home_state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="work_state" className="block text-sm font-medium text-gray-700">Work State</label>
                  <input
                    type="text"
                    name="work_state"
                    value={employeeData.work_state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="pay_period" className="block text-sm font-medium text-gray-700">Pay Period</label>
                  <input
                    type="text"
                    name="pay_period"
                    value={employeeData.pay_period}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="support_second_family" className="block text-sm font-medium text-gray-700">Support Family</label>
                  <input
                    type="text"
                    name="support_second_family"
                    value={employeeData.support_second_family}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="number_of_exemptions" className="block text-sm font-medium text-gray-700">Exemptions</label>
                  <input
                    type="text"
                    name="number_of_exemptions"
                    value={employeeData.number_of_exemptions}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="filing_status" className="block text-sm font-medium text-gray-700">Filing Status</label>
                  <input
                    type="text"
                    name="filing_status"
                    value={employeeData.filing_status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <input
                    type="text"
                    name="marital_status"
                    value={employeeData.marital_status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="number_of_student_default_loan" className="block text-sm font-medium text-gray-700">Student Default Loan</label>
                  <input
                    type="text"
                    name="number_of_student_default_loan"
                    value={employeeData.number_of_student_default_loan}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="spouse_age" className="block text-sm font-medium text-gray-700">Spouse Age</label>
                  <input
                    type="text"
                    name="spouse_age"
                    value={employeeData.spouse_age}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
  <label htmlFor="is_spouse_blind" className="block text-sm font-medium text-gray-700">Spouse Blind</label>
  <div className="mt-1 flex items-center space-x-4">
    <div className="flex items-center">
      <input
        type="radio"
        name="is_spouse_blind"
        value="true" // Use 'true' as string value for the radio button
        checked={employeeData.is_spouse_blind === true} // Compare to boolean true
        onChange={handleInputChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <label htmlFor="is_spouse_blindYes" className="ml-2 text-sm text-gray-700">Yes</label>
    </div>
    <div className="flex items-center">
      <input
        type="radio"
        name="is_spouse_blind"
        value="false" // Use 'false' as string value for the radio button
        checked={employeeData.is_spouse_blind === false} // Compare to boolean false
        onChange={handleInputChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <label htmlFor="is_spouse_blindNo" className="ml-2 text-sm text-gray-700">No</label>
    </div>
  </div>
</div>


              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeEditForm;
