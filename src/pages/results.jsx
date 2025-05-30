
/**
 * Results Component
 * 
 * This component fetches and displays paginated results in a DataGrid table.
 * It also provides options to export and import data.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Results component.
 * 
 * @example
 * // Usage
 * <Results />
 * 
 * @dependencies
 * - React hooks: useState, useEffect
 * - Material-UI components: Button, CircularProgress, Box, Typography
 * - Material-UI DataGrid: DataGrid
 * - React Icons: CgImport, TiExport
 * 
 * @state
 * - `page` (number): Current page number for pagination.
 * - `loading` (boolean): Indicates whether data is being fetched.
 * - `data` (array): Array of result data fetched from the API.
 * 
 * @variables
 * - `id` (string): User ID retrieved from sessionStorage.
 * - `link` (string): URL for exporting employee data.
 * - `columns` (array): Column definitions for the DataGrid.
 * - `rows` (array): Processed rows for the DataGrid, sliced based on pagination.
 * 
 * @effects
 * - Fetches result details from the API when the component mounts or `id` changes.
 * 
 * @functions
 * - `fetchData`: Asynchronous function to fetch data from the API and update state.
 * 
 * @UI
 * - Displays a DataGrid with paginated rows.
 * - Shows a loading spinner while data is being fetched.
 * - Provides buttons for exporting and importing data.
 * - Displays pagination controls for navigating between pages.
 */
import { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { CgImport } from 'react-icons/cg';
import { TiExport } from 'react-icons/ti';
import { DataGrid } from '@mui/x-data-grid';
import { BASE_URL } from '../configration/Config';

function Results() {
  const id = sessionStorage.getItem("id");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const link = `${BASE_URL}/User/ExportEmployees/${id}/`;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/User/GetResultDetails/${id}/`);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columns = [
    { field: 'timestamp', headerName: 'Timestamp', width: 250 },
    { field: 'employee_id', headerName: 'Employee Id', width: 180 },
    { field: 'employer_id', headerName: 'Employer Id', width: 180 },
    { field: 'result', headerName: 'Result Amount', width: 180 },
  ];

  const rows = data.slice((page - 1) * 10, page * 10).map((item, index) => ({
    id: index + 1, // Adding a unique id for each row
    timestamp: item.timestamp,
    employee_id: item.employee_id,
    employer_id: item.employer_id,
    result: item.result,
  }));

  return (
    <>
          <hr />
          <Box display="flex" justifyContent="flex-end" my={2}>
            <Button
              href={link}
              variant="outlined"
              color="primary"
              startIcon={<TiExport />}
              sx={{ marginRight: 2 }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CgImport />}
            >
              Import
            </Button>
          </Box>

          {/* DataGrid Section */}
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: 400, width: '100%', mt: 4 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                pagination
              />
            </Box>
          )}

          {/* Pagination Section */}
          {data && data.length > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Box>
                <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                  Pages:
                </Typography>
                {Array.from({ length: Math.ceil(data.length / 10) }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    variant={page === i + 1 ? 'contained' : 'outlined'}
                    color="primary"
                    sx={{ margin: 1 }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
    
    </>
  );
}

export default Results;
