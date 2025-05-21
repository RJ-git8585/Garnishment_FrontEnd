import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../configration/Config';
// import load from '../bouncing-circles.svg';
import Swal from 'sweetalert2';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
// import { Grid } from '@mui/x-data-grid';
import { 
  Typography, 
  TextField, 
  Grid, 
  Button, 
  Box, 
  Paper, 
  CircularProgress 
} from '@mui/material';
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
            <div className="container mx-auto mt-4">
  <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
    {loading ? (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    ) : (
      <>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Employee Profile
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Name:</strong></Typography>
            {isEditing ? (
              <TextField
                name="employee_name"
                value={editableFields.employee_name || ''}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
            ) : (
              <Typography variant="body2">{employee.employee_name}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Employee ID:</strong></Typography>
            <Typography variant="body2">{employee.employee_id}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Employer ID:</strong></Typography>
            <Typography variant="body2">{employee.employer_id}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Location:</strong></Typography>
            {isEditing ? (
              <TextField
                name="location"
                value={editableFields.location || ''}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
            ) : (
              <Typography variant="body2">{employee.location}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Department:</strong></Typography>
            {isEditing ? (
              <TextField
                name="department"
                value={editableFields.department || ''}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
            ) : (
              <Typography variant="body2">{employee.department}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Number of Garnishments:</strong></Typography>
            {isEditing ? (
              <TextField
                type="number"
                name="number_of_child_support_order"
                value={editableFields.number_of_child_support_order || ''}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
            ) : (
              <Typography variant="body2">{employee.number_of_child_support_order}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Pay Cycle:</strong></Typography>
            {isEditing ? (
              <TextField
                name="pay_cycle"
                value={editableFields.pay_cycle || ''}
                onChange={handleInputChange}
                fullWidth
                size="small"
              />
            ) : (
              <Typography variant="body2">{employee.pay_cycle}</Typography>
            )}
          </Grid>
        </Grid>

        <Box mt={4} display="flex" gap={2}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveClick}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate('/employee')}
          >
            Back to Employees
          </Button>
        </Box>
      </>
    )}
  </Paper>
</div>
          
    </>
  );
};

export default EmployeeProfile;
