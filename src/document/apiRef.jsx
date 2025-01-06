
import { LoginResponce,Logincrl,RegisterResponce,Registrationcrl} from '../constants/apiConstants';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Apiref ,Documentations}     from '../constants/signature';
function ApiRef() {
  return (
    <div>
        <sectio id="Post">
        <section id="Authentication">
                        <h2>{Apiref.AuthenticationTitle}</h2>
                        {/* <p>{Apiref.AuthenticationsubtestAuthtext}</p> */}
                         <p>{Documentations.AuthenticationsubtestAuthtext1}</p>

             <section id="AuthLogin">
                          <h2>Login</h2>
                          <p>{Documentations.authLoginSubtext}</p>
                          {/* <p><strong>Endpoint</strong></p> */}
                          <p><strong>URL:</strong> <code>{'$path'}/User/login/</code></p>
                          <p><strong>Method:</strong> <code>POST</code></p>
                          <p><strong>Content-type:</strong> <code>application/json</code></p>
                            <p></p>
                             <h3 className="mt-4">QUERY PARAMETERS</h3>
                        
                                    <div className="table-container">
                                    <table className="parameter-table">
                                        <thead>
                                        <tr>
                                            <th>Parameter</th>
                                            <th>Type</th>
                                            <th>Required</th>
                                            <th>Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td><code>email</code></td>
                                            <td><code>string</code></td>
                                            <td>✅ Yes</td>
                                            <td>Users registered email.</td>
                                        </tr>
                                        <tr>
                                            <td><code>password</code></td>
                                            <td><code>string</code></td>
                                            <td>✅ Yes</td>
                                            <td>Users account password.</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </div>


                        <div className="flex-row">
                                    <div className="code-block">
                                        <h4>Example CURL Command</h4>
                                            
                                            <SyntaxHighlighter language="json5" style={xonokai}>
                                                {Logincrl}
                                                </SyntaxHighlighter>
                        
                                        
                                    </div>
                                    <div className="response">
                                        <h4>Response</h4>
                                    
                                        <SyntaxHighlighter language="json5" style={xonokai}>
                                        {LoginResponce}
                                        </SyntaxHighlighter>
                    
                                            
                                    
                                    </div>
                        </div>
                        </section>
                        <section id="AuthRegister"> 
                                            <h2>Register</h2>
                                            <p><strong>Endpoint</strong></p>
                                            <p><strong>URL:</strong> <code>{'$path'}/User/register/</code></p>
                                            <p><strong>Method:</strong> <code>POST</code></p>
                                            <p><strong>Content-type:</strong> <code>application/json</code></p>
                        
                                            <h3>QUERY PARAMETERS</h3>
                                    
                                                <div className="table-container">
                                                <table className="parameter-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Parameter</th>
                                                        <th>Type</th>
                                                        <th>Required</th>
                                                        <th>Description</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td><code>email</code></td>
                                                        <td><code>string</code></td>
                                                        <td>✅ Yes</td>
                                                        <td>Users registered email.</td>
                                                    </tr>
                                                    <tr>
                                                        <td><code>password</code></td>
                                                        <td><code>string</code></td>
                                                        <td>✅ Yes</td>
                                                        <td>Users account password.</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                </div>


                                        <div className="flex-row">
                                            <div className="code-block">
                                                <h4>Example CURL Command</h4>
                                                    <pre>
                                                    <SyntaxHighlighter language="json5" style={xonokai}>
                                                        {Registrationcrl}
                                                        </SyntaxHighlighter>
                                
                                                    </pre>
                                            </div>
                                            <div className="response">
                                                <h4>Response</h4>
                                                <pre>
                                                <SyntaxHighlighter language="json5" style={xonokai}>
                                                {RegisterResponce}
                                                </SyntaxHighlighter>
                            
                                                    
                                                </pre>
                                            </div>
                                        </div>
                        </section>
          </section>
          <section id="companyRegistration">
                        <h2>CompanyRegistration</h2>
                        <p>This is a <strong>POST API</strong> for Login an employer with the following fields:</p>
                        <p><strong>Endpoint:</strong> <code>https://garnishment-backend.onrender.com/User/password-reset-confirm/:token/</code></p>
                        <h3>QUERY PARAMETERS</h3>
                        <table className="query-params-table">
                                <thead>
                                    <tr>
                                        <th>Key</th>
                                        <th>Values</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Password</td>
                                        <td>Password for securing the details.</td>
                                    </tr>
                                    <tr>
                                        <td>confirm_password</td>
                                        <td>Confirmation password for security.</td>
                                    </tr>
                                </tbody>
                            </table>
                        <div className="flex-row">
                            <div className="code-block">
                                <h3>Example CURL Command</h3>
                                <pre>
                {/* --request POST 'https://garnishment-backend.onrender.com/User/password-reset-confirm/:token' \
                --form 'password="newpassword1234"'\
                --form 'confirm_password="newpassword1234"'\ */}
                                </pre>
                            </div>
                            <div className="response">
                                <h3>Response</h3>
                                <pre>
                {/* {
                password = "newpassword1234",
                confirm_password = "newpassword1234"
                } */}
                                    
                                </pre>
                            </div>
                        </div>
          </section>
       </sectio>

    </div>
  )
}

export default ApiRef