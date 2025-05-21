// eslint-disable-next-line no-unused-vars
import { React, useState } from 'react';
import Headertop from '../component/Headertop';
import Sidebar from './sidebar';
import { TextField } from '@mui/material';

import { BASE_URL } from '../configration/Config';
import Swal from 'sweetalert2';
import { FaUserTie } from "react-icons/fa";
import InputMask from 'react-input-mask';

function AddEmployee() {
  const [employee_name, setName] = useState('');
  const [department, setDepart] = useState('');
  const [pay_cycle, setPayCycle] = useState('');
  const [number_of_child_support_order, setNumberGarnihsment] = useState('');
  const [location, setLocation] = useState('');
  const employer_id = sessionStorage.getItem("id");
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  
  // New fields state
  const [blind, setBlind] = useState(null);
  const [age, setAge] = useState(45);
  const [home_state, setHomeState] = useState("CA");
  const [gender, setGender] = useState("Male");
  const [pay_period, setPayPeriod] = useState("Biweekly");
  const [number_of_exemptions, setNumberOfExemptions] = useState(2);
  const [work_state, setWorkState] = useState("CA");
  const [filing_status, setFilingStatus] = useState("single_filing_status");
  const [marital_status, setMaritalStatus] = useState("Single");
  const [number_of_student_default_loan, setNumberOfStudentLoans] = useState(1);
  const [support_second_family, setSupportSecondFamily] = useState(false);
  const [spouse_age, setSpouseAge] = useState(null);
  const [is_spouse_blind, setIsSpouseBlind] = useState(null);

  const StateList = [
    { id: 1, label: 'Alabama' },
    { id: 2, label: 'Arizona' },
    { id: 3, label: 'California' },
    { id: 4, label: 'Colorado' },
    { id: 5, label: 'Connecticut' },
    { id: 6, label: 'Florida' },
    { id: 7, label: 'Georgia' },
    { id: 8, label: 'Idaho' },
    { id: 9, label: 'Illinois' },
    { id: 10, label: 'Indiana' },
    { id: 11, label: 'Iowa' },
    { id: 12, label: 'Kansas' },
    { id: 13, label: 'Kentucky' },
    { id: 14, label: 'Louisiana' },
    { id: 15, label: 'Maine' },
    { id: 16, label: 'Maryland' },
    { id: 17, label: 'Massachusetts' },
    { id: 18, label: 'Michigan' },
    { id: 19, label: 'Minnesota' },
    { id: 20, label: 'Mississippi' },
    { id: 21, label: 'Missouri' },
    { id: 22, label: 'Montana' },
    { id: 23, label: 'Nebraska' },
    { id: 24, label: 'Nevada' },
    { id: 25, label: 'New Hampshire' },
    { id: 26, label: 'New Jersey' },
    { id: 27, label: 'New Mexico' },
    { id: 28, label: 'North Carolina' },
    { id: 29, label: 'North Dakota' },
    { id: 30, label: 'Ohio' },
    { id: 31, label: 'Oklahoma' },
    { id: 32, label: 'Oregon' },
    { id: 33, label: 'Pennsylvania' },
    { id: 34, label: 'Rhode Island' },
    { id: 35, label: 'South Carolina' },
    { id: 36, label: 'South Dakota' },
    { id: 37, label: 'Tennessee' },
    { id: 38, label: 'Texas' },
    { id: 39, label: 'Utah' },
    { id: 40, label: 'Vermont' },
    { id: 41, label: 'Virginia' },
    { id: 42, label: 'Washington' },
    { id: 43, label: 'West Virginia' },
    { id: 44, label: 'Wisconsin' },
    { id: 45, label: 'Wyoming' },
    { id: 46, label: 'Alaska' },
    { id: 47, label: 'Arkansas' },
    { id: 48, label: 'Delaware' },
    { id: 49, label: 'Hawaii' },
    { id: 50, label: 'New York' },
  ];

  const handleReset = () => {
    setName('');
    setDepart('');
    setPayCycle('');
    setNumberGarnihsment('');
    setLocation('');
    setSocialSecurityNumber('');
    // Reset new fields
    setBlind(null);
    setAge(45);
    setHomeState("CA");
    setGender("Male");
    setPayPeriod("Biweekly");
    setNumberOfExemptions(2);
    setWorkState("CA");
    setFilingStatus("single_filing_status");
    setMaritalStatus("Single");
    setNumberOfStudentLoans(1);
    setSupportSecondFamily(false);
    setSpouseAge(null);
    setIsSpouseBlind(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { employer_id, employee_name, department, pay_cycle, number_of_child_support_order, location, socialSecurityNumber, 
                   blind, age, home_state, gender, pay_period, number_of_exemptions, work_state, filing_status, marital_status,
                   number_of_student_default_loan, support_second_family, spouse_age, is_spouse_blind };

    fetch(`${BASE_URL}/User/employee_details/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Employee added successfully',
          text: "Please check once!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        handleReset();
      } else {
        console.error('Error submitting data:', response.statusText);
      }
    });
  };

  return (
    <>
          <h1 className="edit-profile mt-6 mb-4 inline-block"><FaUserTie />ADD EMPLOYEE</h1>
          <h6 className="mt-4 mb-4 font-bold text-sm">EMPLOYEE DETAILS:</h6>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8 border-gray-50 rounded-md space-y-6 p-6 shadow-lg shadow-blue-500/50" action="#" method="POST">
            <div className="hidden">
              <input id="employer_id" name="employer_id" value={employer_id} type="hidden" className="block w-full" />
            </div>
            <div>
              <label htmlFor="employee_name" className="block text-slate-500 text-sm font-medium leading-6">Employee Name</label>
              <input id="employee_name" name="employee_name" value={employee_name} type="text" placeholder="Enter Employee Name" onChange={(e) => setName(e.target.value)} className="block w-full text-lg rounded-md" />
            </div>
            <div>
              <label htmlFor="department" className="block text-slate-500 text-sm font-medium leading-6">Department</label>
              <input id="department" name="department" value={department} type="text" placeholder="Enter Department" onChange={(e) => setDepart(e.target.value)} className="block text-lg w-full rounded-md" />
            </div>
            <div>
              <label htmlFor="pay_cycle" className="block text-slate-500 text-sm font-medium leading-6">Pay Cycle</label>
              <input id="pay_cycle" name="pay_cycle" value={pay_cycle} type="text" placeholder="Enter Pay Cycle" onChange={(e) => setPayCycle(e.target.value)} className="block text-lg w-full rounded-md" />
            </div>
            <div>
              <label htmlFor="number_of_garnishment" className="block text-slate-500 text-sm font-medium leading-6">Number of Garnishment</label>
              <input id="number_of_garnishment" name="number_of_garnishment" value={number_of_child_support_order} type="number" placeholder="Enter Number of Garnishment" onChange={(e) => setNumberGarnihsment(e.target.value)} className="block w-full rounded-md text-lg" />
            </div>
            <div>
              <label htmlFor="location" className="block text-slate-500 text-sm font-medium leading-6">Location</label>
              <select id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="block text-lg w-full rounded-md">
                <option value="">Choose a State</option>
                {StateList.map((option) => (
                  <option key={option.id} value={option.label}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="socialSecurityNumber" className="block text-lg text-slate-500 text-sm font-medium leading-6">Social Security Number</label>
              <InputMask
                mask="999-99-9999"
                value={socialSecurityNumber}
                onChange={(e) => setSocialSecurityNumber(e.target.value)}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    placeholder="XXX-XX-XXXX"
                    variant="outlined"
                    className='text-lg'
                  />
                )}
              </InputMask>
            </div>

            {/* New Fields */}
            <div>
              <label htmlFor="blind" className="block text-slate-500 text-sm font-medium leading-6">Blind</label>
              <input id="blind" name="blind" type="checkbox" value={blind} onChange={(e) => setBlind(e.target.checked)} />
            </div>
            <div>
              <label htmlFor="age" className="block text-slate-500 text-sm font-medium leading-6">Age</label>
              <input id="age" name="age" value={age} type="number" onChange={(e) => setAge(e.target.value)} className="block text-lg w-full rounded-md" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-slate-500 text-sm font-medium leading-6">Gender</label>
              <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="block w-full text-lg rounded-md">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="pay_period" className="block text-slate-500 text-sm font-medium leading-6">Pay Period</label>
              <input id="pay_period" name="pay_period" value={pay_period} type="text" onChange={(e) => setPayPeriod(e.target.value)} className="block text-lg w-full rounded-md" />
            </div>
            <div>
              <label htmlFor="number_of_exemptions" className="block text-lg text-slate-500 text-sm font-medium leading-6">Number of Exemptions</label>
              <input id="number_of_exemptions" name="number_of_exemptions" value={number_of_exemptions} type="number" onChange={(e) => setNumberOfExemptions(e.target.value)} className="block w-full text-lg rounded-md" />
            </div>
            <div>
              <label htmlFor="work_state" className="block text-slate-500 text-sm font-medium leading-6">Work State</label>
              <select id="work_state" value={work_state} onChange={(e) => setWorkState(e.target.value)} className="block text-lg w-full rounded-md">
                <option value="CA">California</option>
                {/* Add more options here as needed */}
              </select>
            </div>
            <div>
              <label htmlFor="filing_status" className="block text-slate-500 text-sm font-medium leading-6">Filing Status</label>
              <select id="filing_status" value={filing_status} onChange={(e) => setFilingStatus(e.target.value)} className="block w-full text-lg rounded-md">
                <option value="single_filing_status">Single</option>
                <option value="married_filing_status">Married</option>
              </select>
            </div>
            <div>
              <label htmlFor="marital_status" className="block text-slate-500 text-sm font-medium leading-6">Marital Status</label>
              <select id="marital_status" value={marital_status} onChange={(e) => setMaritalStatus(e.target.value)} className="block w-full text-lg rounded-md">
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

          </form>
          <div className="flex items-center gap-4 justify-center mt-4">
            <button type="submit" onClick={handleSubmit} className="w-full rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">ADD</button>
            <button type="reset" onClick={handleReset} className="w-full rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">CANCEL</button>
          </div>
        </>
  );
}

export default AddEmployee;
