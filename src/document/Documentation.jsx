import { useState, useRef, useEffect } from 'react';
import { FaCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AppBar, Toolbar, Typography, TextField, Box, Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { TbArrowBigDownLinesFilled } from "react-icons/tb";
import { CompanyOnboarding, EmployeeOnboarding, Authentication } from '../constants/apiConstants';
import { Documentations } from '../constants/signature';

const Documentation = () => {
  const [activeCode, setActiveCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const textFieldRef = useRef(null);

  const toggleCode = (codeType) => {
    setActiveCode((prev) => (prev === codeType ? null : codeType));
  };

  useEffect(() => {
                const handleKeyDown = (event) => {
                if (event.key.toLowerCase() === 's') {
                    event.preventDefault();
                    textFieldRef.current.focus();
                }
                };

                window.addEventListener('keydown', handleKeyDown);
                return () => window.removeEventListener('keydown', handleKeyDown);
     }, []);

  const sections = [
    {
      id: 'Introduction',
      title: 'Introduction',
      description:
        'The GarnishEdge Engine API provides programmatic access to manage and process garnishment orders, including employee wage deductions and reporting. It is designed for payroll systems and financial institutions to handle garnishment workflows efficiently and accurately.',
      hideButton: true,
    },
    {
      id: 'PEOLogin',
      title: 'Login',
      description:
        'The Login API allows users to authenticate and gain access to the application. Upon successful authentication, the API returns an access token, enabling secure communication with other protected endpoints.',
      inputs: (
        <ul>
          <li><kbd>Username/email</kbd> - Login identifier for the user (email or username)</li>
          <li><kbd>Password</kbd> - Password of the user</li>
        </ul>
      ),
      inputsText: 'PEOID, PEO Name, Address, User name, Email, Organisation',
      code: Authentication,
    },
    {
      id: 'CompanyOnboarding',
      title: Documentations.CompanyOnboardingtitle,
      description: Documentations.CompanyOnboardingSubtext,
      inputs: (
        <ul>
          <li><kbd>Company Name</kbd> - Unique Company Name</li>
          <li><kbd>PEOID</kbd> - ID of the Professional Employer Organization</li>
          <li><kbd>Address</kbd> - Registered or official address of the PEO</li>
          <li><kbd>User name</kbd> - Unique identifier for the PEO</li>
          <li><kbd>Email</kbd> - Email ID for the PEO</li>
          <li><kbd>Bank name</kbd> - Name of the bank associated with the company</li>
          <li><kbd>Bank account number</kbd> - Bank account number of the company</li>
          <li><kbd>Location (presence)</kbd> - Locations where the company operates</li>
          <li><kbd>DBA Name</kbd> - Doing Business As name, if applicable</li>
          <li><kbd>EIN</kbd> - Unique Employer Identifier Number</li>
        </ul>
      ),
      inputsText: 'CID, PEO Name, Address, User name, Email',
      code: CompanyOnboarding,
    },
    {
      id: 'EmployeeOnboarding',
      title: Documentations.EmployeeOnboardingtitle,
      description: Documentations.EmployeeOnboardingSubtext,
      inputs: (
        <ul>
          <li><kbd>Company ID</kbd> - Unique identifier for the company</li>
          <li><kbd>EEID</kbd> - Unique Employee Identification Number</li>
          <li><kbd>First Name</kbd> - First name of the employee</li>
          <li><kbd>Middle Name</kbd> (Optional) - Middle name of the employee</li>
          <li><kbd>Last Name</kbd> - Last name of the employee</li>
          <li><kbd>Disability</kbd> - Indicates if an employee has any disability</li>
          <li><kbd>Age</kbd> - Employees age in years</li>
          <li><kbd>Work location</kbd> - Address where the employee works</li>
          <li><kbd>Home location</kbd> - Employees residential address</li>
          <li><kbd>Number of garnishments</kbd> - Number of garnishments on employee wages</li>
          <li><kbd>Types of garnishments</kbd> - Types of garnishments applied to wages</li>
          <li><kbd>SDU</kbd> - State Disbursement Unit responsible for garnishment</li>
        </ul>
      ),
      inputsText: '',
      code: EmployeeOnboarding,
    },
  ];

  const filteredSections = sections.filter(
    ({ title, description, inputsText, code }) =>
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inputsText && inputsText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (code && code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Documentation
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            className="search_bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputRef={textFieldRef} // Attach the ref to the TextField
            sx={{
                backgroundColor: 'transparent',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#9c9c9c40' },
                '&:hover fieldset': { borderColor: '#aaa' },
                '&.Mui-focused fieldset': { borderColor: '#aaa' },
                },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment className='search_icon' position="end">
                  <TbArrowBigDownLinesFilled style={{ color: '#aaa' }} />
                  <span style={{ color: '#aaa', marginLeft: 2 }}>S</span>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" sx={{ ml: 2, backgroundColor: '#0066cc' }}>
            Search
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Typography variant="h5" className='Headeing_doc' gutterBottom>
        GarnishEdge Engine API Documentation
        </Typography>
        {filteredSections.length > 0 ? (
          filteredSections.map(({ id, title, description, inputs, code, hideButton }) => (
            <Box key={id} sx={{ mb: 8 }}>
              <Typography variant="h6">{title}</Typography>
              <Typography>{description}</Typography>
              {inputs}
              {!hideButton && (
                <Button
                 className="show_btn"
                  onClick={() => toggleCode(id)}
                  startIcon={<FaCode />}
                  
                  
                  sx={{ mt: 1 }}
                >
                  {activeCode === id ? 'Hide Code' : 'Show Code'}
                </Button>
              )}
              {activeCode === id && (
                <SyntaxHighlighter language="json" style={xonokai}>
                  {code}
                </SyntaxHighlighter>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No matching documentation found.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Documentation;