import { useState,useRef, useEffect } from 'react';
import { FaCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AppBar, Toolbar, Typography, TextField, Box, Button } from '@mui/material';
import { CompanyOnboarding, EmployeeOnboarding, Authentication } from '../constants/apiConstants';
import { Documentations } from '../constants/signature';
import InputAdornment from '@mui/material/InputAdornment';
import { TbArrowBigDownLinesFilled } from "react-icons/tb";


// import TextField from '@mui/material/TextField';

function Documentation() {
  const [activeCode, setActiveCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const textFieldRef = useRef(null);

  const toggleCode = (codeType) => {
    setActiveCode(activeCode === codeType ? null : codeType);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for a specific key, e.g., "F"
      if (event.key === 'F' || event.key === 'f') {
        event.preventDefault(); // Prevent defafult browser behavior
        textFieldRef.current.focus(); // Focus the TextField
      }
    };

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown);
    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Documentation Sections
  const sections = [

    {
        id: 'Introduction',
        title: 'Introduction',
        description: 'The Garnishment Engine API provides programmatic access to manage and process garnishment orders, including employee wage deductions and reporting. It is designed for payroll systems and financial institutions to handle garnishment workflows efficiently and accurately',
        hideButton: true, // Hide the button
        inputsText: '',
        code: '',
      },
    {
      id: 'PEOLogin',
      title: 'Login',
      description: 'The Login API allows users to authenticate and gain access to the application. upon successful authentication, the API returns an access token, enabling secure communication with other protected endpoints.',
      inputs: (
        <>
          <li><kbd>Username/email</kbd> - Login identifier for the user (email or username)</li>
          <li><kbd>Password</kbd> - Password of the user</li>
        
        </>
      ),
      inputsText: 'PEOID, PEO Name, Address, User name, Email,Organisation',
      code: Authentication,
    },
    // {
    //   id: 'AuthLogin',s
    //   title: Documentations.AuthLogin,
    //   description: Documentations.authLoginSubtext,
    //   inputsText: '',
    //   code: LoginCrl,
    // },
    {
      id: 'CompanyOnboarding',
      title: Documentations.CompanyOnboardingtitle,
      description: Documentations.CompanyOnboardingSubtext,
      inputs: (
        <>
          <li><kbd>CID</kbd> - Unique Company / Client identifier no.</li>
          <li><kbd>PEO Name</kbd> - Name of the Professional employer organisation</li>
          <li><kbd>Address</kbd> - Registered or official address of the PEO</li>
          <li><kbd>User name</kbd> - unique identifier for the PEO</li>
          <li><kbd>Email</kbd> -  Email ID for the PEO</li>
        </>
      ),
      inputsText: 'CID, PEO Name, Address, User name, Email',
      code: CompanyOnboarding,
    },
    {
      id: 'EmployeeOnboarding',
      title: Documentations.EmployeeOnboardingtitle,
      description: Documentations.EmployeeOnboardingSubtext,
      inputsText: '',
      code: EmployeeOnboarding,
    },
  ];

  // Filter Sections Based on Search Query
  const filteredSections = sections.filter((section) => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.inputsText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* MUI Header with Search Bar */}
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
                    <InputAdornment className="Inputset_cls" position="end">
                    <TbArrowBigDownLinesFilled sx={{ color: 'white', mr: 0.5 }} />
                    <span style={{ color: '#817f7f99', fontWeight: 'bold', fontSize: '0.8rem',marginRight:'5px' }}>F</span>
                  </InputAdornment>
                ),
            }}
            />
          <Button className="show_btn_New" variant="contained" sx={{ ml: 1, backgroundColor: '#2980b9' }}>
            Search
          </Button>
        </Toolbar>
      </AppBar>

      {/* Documentation Sections */}
      <section id="post">
        <h2 className ="m-0">Garnishment Engine API Documentation</h2>
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <section key={section.id} id={section.id} className="SubSection">
              <h3 >{section.title}</h3>
              <p>{section.description}</p>
              {section.inputs}
                    {!section.hideButton && ( // Conditionally render the button
                <button
                    onClick={() => toggleCode(section.id)}
                    style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1em',
                    }}
                    className="show_btn"
                >
                    <FaCode /> {activeCode === section.id ? 'Hide Code' : 'Show Code'}
                </button>
                )}
              {activeCode === section.id && (
                <SyntaxHighlighter language="json5" style={xonokai}>
                  {section.code} 
                </SyntaxHighlighter>
              )}
            </section>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'left', color: '#888' }}>
            <Typography variant="h6">No matching documentation found.</Typography>
          </Box>
        )}
      </section>
    </>
  );
}

export default Documentation;