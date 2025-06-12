import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  IconButton,
  useTheme
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@mui/icons-material';

const PaginationControls = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
}) => {
  const theme = useTheme();
  const totalPages = Math.ceil(count / rowsPerPage) || 1;

  const handleFirstPageButtonClick = () => {
    onPageChange(0);
  };

  const handleBackButtonClick = () => {
    onPageChange(page - 1);
  };

  const handleNextButtonClick = () => {
    onPageChange(page + 1);
  };

  const handleLastPageButtonClick = () => {
    onPageChange(Math.max(0, totalPages - 1));
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        p: 1,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Rows per page:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
            sx={{ height: 32 }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
          size="small"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
          size="small"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography variant="body2" sx={{ mx: 1 }}>
          {`${Math.min(page * rowsPerPage + 1, count)}-${Math.min(
            (page + 1) * rowsPerPage,
            count
          )} of ${count}`}
        </Typography>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= totalPages - 1}
          aria-label="next page"
          size="small"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= totalPages - 1}
          aria-label="last page"
          size="small"
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PaginationControls;
