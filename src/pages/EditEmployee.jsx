import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../Config';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import { Button, TextField, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CgImport } from "react-icons/cg";
import { TiExport } from "react-icons/ti";
import { FaPlus } from "react-icons/fa";

function EditEmployee() {
  const { cid, ee_id } = useParams(); // Get the company ID and employee ID from the URL parameters
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
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
  const navigate = useNavigate();
  const Link1 = `${BASE_URL}/User/ExportEmployees/${cid}/`;

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/User/GetSingleEmployee/${cid}/${ee_id}/`);
        const data1 = await response.json();
        console.log("Fetched Employee Data:", data1);

        if (data1?.data) {
          setEmployee(data1.data); // Ensure we're using the correct data object
          setFormData({
            social_security_number: data1.data.social_security_number || '',
            blind: data1.data.blind || '',
            age: data1.data.age || '',
            gender: data1.data.gender || '',
            home_state: data1.data.home_state || '',
            work_state: data1.data.work_state || '',
            pay_period: data1.data.pay_period || '',
            support_second_family: data1.data.support_second_family || '',
            number_of_exemptions: data1.data.number_of_exemptions || '',
            filing_status: data1.data.filing_status || '',
            marital_status: data1.data.marital_status || '',
            number_of_student_default_loan: data1.data.number_of_student_default_loan || '',
            spouse_age: data1.data.spouse_age || '',
            is_spouse_blind: data1.data.is_spouse_blind || '',
          });
          console.log("Fetched Employee Data1:", data1);
        } else {
          console.error("Error: data.data is not available.");
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, [cid, ee_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/User/updateEmployee/${cid}/${ee_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Employee updated successfully!');
        navigate(`/employee/${cid}/${ee_id}`); // Redirect to the employee detail page after successful update
      } else {
        alert('Failed to update employee!');
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
              <a href={Link1} className="border inline-flex items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><TiExport /> Export</a>
              <a href="/EmpImport" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><CgImport /> Import</a>
              <a type="button" href="/addemployee" className="border inline-flex ml-2 items-right rounded-md bg-white px-3 py-2 text-sm font-semibold text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><FaPlus /> Add</a>
            </div>
            <h2>Edit Employee Details</h2>
            {employee ? (
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Social Security Number"
                        name="social_security_number"
                        value={formData.social_security_number || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Age"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleChange}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Home State"
                        name="home_state"
                        value={formData.home_state || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Work State"
                        name="work_state"
                        value={formData.work_state || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Pay Period"
                        name="pay_period"
                        value={formData.pay_period || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Number of Exemptions"
                        name="number_of_exemptions"
                        value={formData.number_of_exemptions || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Filing Status"
                        name="filing_status"
                        value={formData.filing_status || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Marital Status"
                        name="marital_status"
                        value={formData.marital_status || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Number of Student Default Loans"
                        name="number_of_student_default_loan"
                        value={formData.number_of_student_default_loan || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Spouse Age"
                        name="spouse_age"
                        value={formData.spouse_age || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Spouse Blind</InputLabel>
                        <Select
                          name="is_spouse_blind"
                          value={formData.is_spouse_blind || ''}
                          onChange={handleChange}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Blind"
                        name="blind"
                        value={formData.blind || ''}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary">
                        Update Employee
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            ) : (
              <p>Loading employee data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;
