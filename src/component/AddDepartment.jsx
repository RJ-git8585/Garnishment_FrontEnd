/**
 * AddDepartment Component
 * 
 * This component renders a form to add a new department for an employer. 
 * It includes input fields for department name and buttons to submit or reset the form.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered AddDepartment component.
 * 
 * @example
 * <AddDepartment />
 * 
 * @dependencies
 * - React: For component creation and state management.
 * - react-router-dom: For navigation using `useNavigate`.
 * - sweetalert2: For displaying success alerts.
 * 
 * @state
 * - department_name {string}: Stores the name of the department entered by the user.
 * 
 * @functions
 * - handleReset: Resets the department name input field.
 * - handleSubmit: Submits the department data to the server and handles the response.
 * 
 * @variables
 * - employer_id {string | null}: The employer ID retrieved from session storage.
 * - BASE_URL {string}: The base URL for API requests, imported from the configuration file.
 * - API_URLS {object}: The API URLs, imported from the configuration file.
 */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../configration/Config";
import { API_URLS } from "../configration/apis";

const AddDepartment = ({ onClose, onDepartmentAdded }) => {
  const navigate = useNavigate();
  const [department_name, setDepart] = useState("");
  const employer_id = sessionStorage.getItem("id");
  const [loading, setLoading] = useState(false);

  const handleReset = () => setDepart("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URLS.GET_DEPARTMENTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department_name: department_name,
          description: "",
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Department Added",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setTimeout(() => window.location.reload(), 3000);
        handleReset();
      } else {
        console.error("Error submitting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <h2 className="font-bold text-base mb-6 mt-3">Add Department</h2>
        <hr />
        <form className="grid grid-cols-2 gap-4 p-6 shadow-lg shadow-blue-500/50">
          <input type="hidden" name="employer_id" value={employer_id} />
          <div>
            <label htmlFor="department" className="block text-slate-500 text-sm font-medium">
              Department
            </label>
            <input
              id="department"
              name="department"
              value={department_name}
              type="text"
              autoComplete="name"
              onChange={(e) => setDepart(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>
        </form>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            ADD
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="w-full rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            CANCEL
          </button>
        </div>
     </>
  );
}

export default AddDepartment;
