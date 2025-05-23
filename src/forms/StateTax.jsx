
/**
 * StateTax Component
 * 
 * This component renders a multi-step form for collecting user information, including personal details,
 * address information, and a review step. It uses React state to manage the current step and form data.
 * 
 * @component
 * @returns {JSX.Element} The rendered StateTax component.
 * 
 * @example
 * <StateTax />
 * 
 * State:
 * - `step` (number): Tracks the current step of the form.
 * - `employee_name` (string): Stores the employee name (currently unused).
 * - `formData` (object): Stores the form data with the following fields:
 *   - `name` (string): The user's name.
 *   - `email` (string): The user's email address.
 *   - `address` (string): The user's address.
 *   - `city` (string): The user's city.
 *   - `state` (string): The user's state.
 *   - `zip` (string): The user's zip code.
 * 
 * Functions:
 * - `handleChange(e: React.ChangeEvent<HTMLInputElement>): void`
 *   Handles input changes and updates the `formData` state.
 * 
 * - `nextStep(): void`
 *   Advances to the next step of the form.
 * 
 * - `prevStep(): void`
 *   Returns to the previous step of the form.
 * 
 * - `handleSubmit(e: React.FormEvent<HTMLFormElement>): void`
 *   Handles form submission and logs the form data to the console.
 * 
 * - `renderStep(): JSX.Element | null`
 *   Renders the appropriate form step based on the current `step` state.
 * 
 * Steps:
 * - Step 1: Collects personal information (name and email).
 * - Step 2: Collects address information (address, city, state, zip code).
 * - Step 3: Displays a review of the entered information and provides a submit button.
 */
import React, { useState } from 'react';
import { RxQuestionMarkCircled } from "react-icons/rx";
import { FaCarSide } from "react-icons/fa";
const StateTax = () => {
  const [step, setStep] = useState(1); // Step state
  const employer_id = parseInt(sessionStorage.getItem("id"));
  const [employee_name, setEmpName] = useState('');
 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Go to the next step
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Go to the previous step
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // You can send formData to the server or process it further
  };

  // Render the form steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          
          <div>
            <h2 className="text-center border-bottom mb-10 pb-4" >Multistep Form </h2>
            <h2>Step 1: Employee  Information</h2>
            {/* <marquee className="border-bottom"><FaCarSide /></marquee> */}
            {/* <div className="flex items-center space-x-2">
            <label htmlFor="empName" className="block text-gray-700 text-sm font-bold mb-2">
                    Employee Name:
                  </label>
                  <input
                    type="text"
                    id="empName"
                    placeholder='Enter Employee Name'
                    className=" appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={employee_name}
                    onChange={(e) => setEmpName(e.target.value)}
                    readOnly
                    disabled
                    
                  />
                  </div> */}
                  {/* s{errors.employee_name && <span className="cutom_error" style={{ color: 'red' }}>{errors.employee_name}</span>}   */}
                  <div className="flex items-center space-x-2 grid-cols-subgrid gap-2 col-span-3">
                  <label className="text-gray-700 font-medium">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Email enter"
                className=" col-start-2 appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2 grid-cols-subgrid gap-2 col-span-3">
    <label className="text-gray-700 font-medium">Name:</label>
    <input type="text" id="name" className="col-start-2 appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your name" />
       
        
        </div>

            {/* <div className="grid grid-cols-subgrid gap-2 col-span-2" >
            <button type="button" className="col-start-1 bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >Next</button>
            </div> */}
            <div className="grid items-center justify-end">
            <button onClick={nextStep} className="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded">
              Next
            </button>
                  </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Address Information</h2>
            <label>
              Address:
              <input
                type="text"
                name="address"
                className=" appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                className=" appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    
                value={formData.city}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                className=" appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    
                value={formData.state}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="zip"
                value={formData.zip}
                className=" appearance-none border bg-gray-100 text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
                required
              />
            </label>
            <button type="button" className='bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={prevStep}>Previous</button>
            <button type="button" className='bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={nextStep}>Next</button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Review Information</h2>
            <h4>Personal Information:</h4>
            <p>Name: {formData.name}</p>
            <p>Email: {formData.email}</p>
            <h4>Address Information:</h4>
            <p>Address: {formData.address}</p>
            <p>City: {formData.city}</p>
            <p>State: {formData.state}</p>
            <p>Zip Code: {formData.zip}</p>
            <button type="button" className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={prevStep}>Previous</button>
            <button className="bg-blue-500 m-2 sm:mx-auto sm:w-full text-sm hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderStep()}
    </form>
  );
};

export default StateTax;
