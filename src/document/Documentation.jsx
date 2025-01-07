// import React from 'react'
import { FaCode } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import  { useState } from 'react';
import { CompanyOnboarding,EmployeeOnboarding,LoginCrl,PEO} from '../constants/apiConstants'; // Import multiple constants
 // Import multiple constants
 import { Documentations }     from '../constants/signature';

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
                                    <p className="overviews_cls">{Documentations.Overview}</p>    
                                    <h1 className="mt-2 mb-20 font-bold text-gray-500">{Documentations.DocTitle}</h1>
                                    <p>{Documentations.DoctitleSubtext}</p>
                            </section>

                              <section id="PEOLogin">
            
                                        <h2 >PEO / ADMIN LOGIN</h2>
                                        <p>The PEO/ADMIN Login API allows users to authenticate and gain access to the application. Upon successful authentication, the API returns an access token, enabling secure communication with other protected endpoints.</p>
                                        
                                        <button 
                                        onClick={() => toggleCode('PEOLogin')}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                        className="show_btn"
                                        >
                                        <FaCode /> {activeCode === 'PEOLogin' ? 'Hide Code' : 'Show Code'}
                                        </button>
                                        {activeCode === 'PEOLogin' && (
                                            <SyntaxHighlighter language="json5" style={xonokai}>
                                            {PEO}
                                            </SyntaxHighlighter>
                                        )}
                                        
                                        
                            </section>
                            
   
          
                     {/* <section id="Authentication"> */}
            
                                {/* <h2 >{Documentations.AuthenticationTitle}</h2>
                                <p>{Documentations.AuthenticationsubtestAuthtext1}</p>
                                
                                <button 
                                onClick={() => toggleCode('EMPLOYER_PORTAL')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                className="show_btn"
                                >
                                <FaCode /> {activeCode === 'EMPLOYER_PORTAL' ? 'Hide Code' : 'Show Code'}
                                </button>
                                {activeCode === 'EMPLOYER_PORTAL' && (
                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                    {Authentication}
                                    </SyntaxHighlighter>
                                )} */}
                                
                                
                     {/* </section> */}
                     <section id="AuthLogin" className="SubSection">
            
                                                <h2 >{Documentations.AuthLogin}</h2>
                                                <p>{Documentations.authLoginSubtext}</p>  
                                                <button 
                                                onClick={() => toggleCode('LOGIN')}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                                className="show_btn"
                                                >
                                                <FaCode /> {activeCode === 'LOGIN' ? 'Hide Code' : 'Show Code'}
                                                </button>
                                                {activeCode === 'LOGIN' && (
                                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                                    {LoginCrl}
                                                    </SyntaxHighlighter>
                                                )}
            
            
                                    </section>
            
                <section id="CompanyOnboarding">
            
                                <h2 >{Documentations.CompanyOnboardingtitle}</h2>
                                <p>{Documentations.CompanyOnboardingSubtext}</p>
                                            <button 
                                onClick={() => toggleCode('COMPANY_ONBOARDING')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                className="show_btn"
                                >
                                <FaCode /> {activeCode ? 'Hide Code' : 'Show Code'}
                                </button>
                                {activeCode === 'COMPANY_ONBOARDING' && (
                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                    {CompanyOnboarding},
                                    </SyntaxHighlighter>
                                )}
                 </section>

               

                <section id="EmployeeOnboarding">
                                <h2>{Documentations.EmployeeOnboardingtitle}</h2>
                                <p>{Documentations.EmployeeOnboardingSubtext}</p>
                                <p><strong>Endpoint:</strong> <code>/User/EmployeeOnboarding</code></p>

                                <button 
                                onClick={() => toggleCode('EMPLOYEE_ONBOARDING')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                className="show_btn"
                                >
                                <FaCode /> {activeCode === 'EMPLOYEE_ONBOARDING' ? 'Hide Code' : 'Show Code'}
                                </button>
                                {activeCode === 'EMPLOYEE_ONBOARDING' && (
                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                    {EmployeeOnboarding}
                                    </SyntaxHighlighter>
                                )}
        
                </section>
                {/* <section id="EmployerPortal">
                                <h2>{Documentations.EmployersPortalTille}</h2>
                                <p>{Documentations.EmployerPortalSubtext}</p>
                                <p><strong>Endpoint:</strong> <code>/User/Dashboard</code></p>
                                <button 
                                onClick={() => toggleCode('DASHBOARD')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                className="show_btn"
                                >
                                <FaCode /> {activeCode === 'DASHBOARD' ? 'Hide Code' : 'Show Code'}
                                </button>
                                {activeCode === 'DASHBOARD' && (
                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                    {Dashboard}
                                    </SyntaxHighlighter>
                                )}
                                
                </section> */}
                {/* <section id="Garnishment" className="">
                                <h2>{Documentations.GarnishementPortalTille}</h2>
                                <p>{Documentations.GarnishementPortalSubtext}</p>
                </section>
                <section id="ChildSupport" className="SubSection">
                                <h2>Child Support</h2>
                                <p>{Documentations.EmployerPortalSubtext}</p>
                                <p><strong>Endpoint:</strong> <code>/User/CalculationDataView</code></p>
                                <button 
                                onClick={() => toggleCode('ChildSupport')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                className="show_btn"
                                >
                                <FaCode /> {activeCode === 'ChildSupport' ? 'Hide Code' : 'Show Code'}
                                </button>
                                {activeCode === 'ChildSupport' && (
                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                    {ChildSupport}
                                    </SyntaxHighlighter>
                                )}
                                
                </section>
                <section id="Fedral" className="SubSection">
                                <h2>Fedral</h2>
                                <p>{Documentations.EmployerPortalSubtext}</p>
                                <p><strong>Endpoint:</strong> <code>/User/FederalCaseData</code></p>
                                <button 
                                onClick={() => toggleCode('Fedral')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                className="show_btn"
                                >
                                <FaCode /> {activeCode === 'Fedral' ? 'Hide Code' : 'Show Code'}
                                </button>
                                {activeCode === 'Fedral' && (
                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                    {Fedral}
                                    </SyntaxHighlighter>
                                )}
                                
                </section>
                <section id="StudentLoan" className="SubSection">
                                <h2>Multi Student Loan</h2>
                                <p>{Documentations.EmployerPortalSubtext}</p>
                                <p><strong>Endpoint:</strong> <code>/User/MiltipleStudentLoanCalculationData</code></p>
                                <button 
                                onClick={() => toggleCode('StudentLoan')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em' }}
                                className="show_btn"
                                >
                                <FaCode /> {activeCode === 'StudentLoan' ? 'Hide Code' : 'Show Code'}
                                </button>
                                {activeCode === 'StudentLoan' && (
                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                    {StudentLoan}
                                    </SyntaxHighlighter>
                                )}
                                
                </section> */}
    </section>




    
    </>
  )
}

export default Documentation