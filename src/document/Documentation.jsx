// import React from 'react'
import { FaCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import  { useState } from 'react';
import { Authentication,CompanyOnboarding,EmployeeOnboarding } from '../constants/apiConstants'; // Import multiple constants
 // Import multiple constants

function Documentation() {

    const [activeCode, setActiveCode] = useState(null);

    const toggleCode = (codeType) => {
        // If the clicked button's code is already shown, hide it, else show it
        setActiveCode(activeCode === codeType ? null : codeType);
      };



  return (
    <>
    <section id="post">
         <section>
                            <p className="overviews_cls">Overview</p>    
                            <h1 className="mt-2 mb-20 font-bold text-gray-500">Garnishment  API Documentation</h1>
                             <p>Welcome to the comprehensive documentation for our suite of Payroll APIs. This set of tools is designed to empower developers, payroll administrators, and business owners alike, by providing a seamless and efficient interface to manage all aspects of a company’s payroll system. From the onboarding of companies and their employees to the streamlined handling of payroll calculations and reporting, this suite of APIs is purpose-built to be robust, secure, and easy to integrate.</p>
                            </section>

            <section id="get-started">
                <h2 >Get Started</h2>
                <p>The Garnishment API provides programmatic access to read data. Retrieve Users, filter them, etc.</p>
                <p>To use this API, you need a <strong>User Access</strong>. Please contact us at <a href="https://orangedatatech.com">orangedatatech.com</a> to get your user details.</p>   
            </section>
            
   
            <hr></hr>
            <section id="Authentication">
            
                        <h2 >Authentication</h2>

                        <p>All the API’s utilize Basic authentication, where you need to include the <code>Authorization</code> header in your HTTPS requests. The header value should be in the format Basic Base64 encode using the relevant clientID and SecretKey.</p>
                    
                        {/* <p><strong>Endpoint:</strong> <code>/User/Authentication</code></p> */}
                        <button 
         onClick={() => toggleCode('EMPLOYER_PORTAL')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
          className="show_btn"
        >
          <FaCode /> {activeCode === 'EMPLOYER_PORTAL' ? 'Hide Code' : 'Show Code'}
        </button>
        {activeCode === 'EMPLOYER_PORTAL' && (
            <SyntaxHighlighter language="bash" style={oneDark}>
              {Authentication}
            </SyntaxHighlighter>
          )}
             </section>
            
                <section id="CompanyOnboarding">
            
                    <h2 >Company Onboarding</h2>

                    <p>This section provides a step-by-step guide for integrating a new company into the system. It details the endpoints necessary for registering a company, setting up bank accounts, and configuring initial settings.</p>
                   
                    {/* <p><strong>Endpoint:</strong> <code>/User/CompanyOnboarding</code></p> */}
                    <button 
           onClick={() => toggleCode('COMPANY_ONBOARDING')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
          className="show_btn"
        >
          <FaCode /> {activeCode ? 'Hide Code' : 'Show Code'}
        </button>
        {activeCode === 'COMPANY_ONBOARDING' && (
            <SyntaxHighlighter language="bash" style={oneDark}>
              {CompanyOnboarding}
            </SyntaxHighlighter>
          )}
                </section>
    <section id="EmployeeOnboarding">
        <h2>Employee Onboarding</h2>
        <p>Here you will find comprehensive information on the APIs used to onboard new employees, including personal details and tax information.</p>
        <p><strong>Endpoint:</strong> <code>/User/EmployeeOnboarding</code></p>

        <button 
         onClick={() => toggleCode('EMPLOYEE_ONBOARDING')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
          className="show_btn"
        >
          <FaCode /> {activeCode === 'EMPLOYEE_ONBOARDING' ? 'Hide Code' : 'Show Code'}
        </button>
        {activeCode === 'EMPLOYEE_ONBOARDING' && (
            <SyntaxHighlighter language="bash" style={oneDark}>
              {EmployeeOnboarding}
            </SyntaxHighlighter>
          )}
        
    </section>
    <section id="EmployerPortal">
        <h2>Employer Portal</h2>
        <p>This section outlines the functionality available to employers through the API. It includes features such as managing employee information, setting up company bank account, employee wage and pay schedules.</p>
        <p><strong>Endpoint:</strong> <code>/User/EmployerPortal</code></p>
        
    </section>
       <section id="Garnishment" className="">
                        <h2>Garnishment</h2>
                        <p>This core section dives deep into the APIs responsible for the actual payroll process. It covers everything from initiate payroll, through to running payroll, making adjustments, and resolving any issues that may arise.</p>
                        <p><strong>Endpoint:</strong> <code>/User/Payroll/</code></p>     
       </section>
    </section>




    
    </>
  )
}

export default Documentation