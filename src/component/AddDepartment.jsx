/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../configration/Config";

function AddDepartment() {
  const navigate = useNavigate();
  const [department_name, setDepart] = useState("");
  const employer_id = sessionStorage.getItem("id");

  const handleReset = () => setDepart("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { employer_id, department_name };

    fetch(`${BASE_URL}/User/Department`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => {
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
    });
  };

  return (
    <>
        <h2 className="font-bold text-base mb-6 mt-3">Add Department</h2>
        <hr />
        <form className="grid grid-cols-2 gap-4 p-6 shadow-lg shadow-blue-500/50">
          <input type="hidden" name="employer_id" value={employer_id} />
          <div>
            <label className="block text-slate-500 text-sm font-medium">
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
