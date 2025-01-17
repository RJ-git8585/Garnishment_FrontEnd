import { useState,useRef, useEffect } from 'react';
import { LoginResponce, Logincrl, RegisterResponce, Registrationcrl } from '../constants/apiConstants';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCode } from 'react-icons/fa';
import { AppBar, Toolbar, Typography, TextField, Box, Button } from '@mui/material';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { TbArrowBigDownLinesFilled } from "react-icons/tb";
function ApiRef() {
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
   const textFieldRef = useRef(null);

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
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
  // API Documentation Sections
  const sections = [
    {
      id: 'AuthLogin',
      title: 'Login',
      description: 'Authenticate users and gain access to the application.',
      details: (
        <>
          <p><strong>URL:</strong> <code>{'$path'}/User/login/</code></p>
          <p><strong>Method:</strong> <code>POST</code></p>
          <p><strong>Content-type:</strong> <code>application/json</code></p>
        </>
      ),
      parameters: [
        { name: 'email', type: 'string', required: '✅ Yes', description: 'Users registered email.' },
        { name: 'password', type: 'string', required: '✅ Yes', description: 'Users account password.' },
      ],
      curl: Logincrl,
      response: LoginResponce,
    },
    {
      id: 'AuthRegister',
      title: 'Register',
      description: 'Create a new user account.',
      details: (
        <>
          <p><strong>URL:</strong> <code>{'$path'}/User/register/</code></p>
          <p><strong>Method:</strong> <code>POST</code></p>
          <p><strong>Content-type:</strong> <code>application/json</code></p>
        </>
      ),
     parameters: [
  { name: 'Company Id', type: 'Integer', required: '✅ Yes', description: 'Unique identifier for the company' },
  { name: 'EEID', type: 'Integer', required: '✅ Yes', description: 'Unique employee identification no. for each employee' },
  { name: 'First Name', type: 'String', required: '✅ Yes', description: 'First Name of the Employee' },
  { name: 'Middle Name (Optional)', type: 'String', required: '❌ No', description: 'Middle Name of the employee' },
  { name: 'Last Name', type: 'String', required: '✅ Yes', description: 'Last Name of the employee' },
  { name: 'Disability', type: 'String', required: '✅ Yes', description: 'Indicates if an employee has any disability' },
  { name: 'Age', type: 'Integer', required: '✅ Yes', description: "Employee's age in years" },
  { name: 'Work location - Address', type: 'String', required: '✅ Yes', description: 'Location where the employee works' },
  { name: 'Work location - Zip Code', type: 'Integer', required: '✅ Yes', description: "Postal or Zip Code of the employee's work location" },
  { name: 'Home location - Address', type: 'String', required: '✅ Yes', description: "Employee's residential address" },
  { name: 'Home location - Zip Code', type: 'Integer', required: '✅ Yes', description: "Postal or Zip Code of the employee's residential address" },
  { name: 'Number of garnishment', type: 'Integer', required: '✅ Yes', description: 'Number of garnishments on employee wages' },
  { name: 'Types of garnishment', type: 'String', required: '✅ Yes', description: "Types of garnishments applied to the employee's wages" },
  { name: 'SDU', type: 'String', required: '✅ Yes', description: 'State Disbursement Unit responsible for garnishment' }
],
      curl: Registrationcrl,
      response: RegisterResponce,
    },
  ];

  // Filter Sections Based on Search Query
  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
   
  );

  return (
    <>
     
     
     <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            API Refrence
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

      {/* Sections */}
      <section id="post">
      <Box sx={{ p: 4 }}>
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <Box key={section.id} sx={{ mb: 4 }}>
              <Typography className="text-sm" variant="h6">{section.title}</Typography>
              <Typography>{section.description}</Typography>
              {section.details}

              <Typography sx={{ mt: 2 }}>Query Parameters:</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1em' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ffffff40', padding: '8px' }}>Parameter</th>
                      <th style={{ border: '1px solid #ffffff40', padding: '8px' }}>Type</th>
                      <th style={{ border: '1px solid #ffffff40', padding: '8px' }}>Required</th>
                      <th style={{ border: '1px solid #ffffff40', padding: '8px' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.parameters.map((param) => (
                      <tr key={param.name}>
                        <td style={{ border: '1px solid #ffffff40', padding: '8px' }}>{param.name}</td>
                        <td style={{ border: '1px solid #ffffff40', padding: '8px' }}>{param.type}</td>
                        <td style={{ border: '1px solid #ffffff40', padding: '8px' }}>{param.required}</td>
                        <td style={{ border: '1px solid #ffffff40', padding: '8px' }}>{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              <Button
                variant="contained"
                size="small"
                className="show_btn"
                sx={{ mt: 2 }}
                onClick={() => toggleSection(section.id)}
              >
                <FaCode /> {activeSection === section.id ? 'Hide Code' : 'Show Code'}
              </Button>

              {activeSection === section.id && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">CURL Command:</Typography>
                  <SyntaxHighlighter language="json5" style={xonokai}>
                    {section.curl}
                  </SyntaxHighlighter>

                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Response:</Typography>
                  <SyntaxHighlighter language="json5" style={xonokai}>
                    {section.response}
                  </SyntaxHighlighter>
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary">
            No matching API references found.
          </Typography>
        )}
      </Box>
      </section>
    </>
  );
}

export default ApiRef;