import { useState } from 'react';
import { LoginResponce, Logincrl, RegisterResponce, Registrationcrl } from '../constants/apiConstants';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Documentations } from '../constants/signature';
import { FaCode } from 'react-icons/fa';
function ApiRef() {
  // Default state set to false (hidden by default)
  const [showLoginSection, setShowLoginSection] = useState(false);
  const [showRegisterSection, setShowRegisterSection] = useState(false);

  return (
    <div>
      <section id="Post">
        <section id="Authentication">
          {/* Login Section */}
          <section id="AuthLogin">
            <h2>Login</h2>
            <p>{Documentations.authLoginSubtext}</p>
            <p><strong>URL:</strong> <code>{'$path'}/User/login/</code></p>
            <p><strong>Method:</strong> <code>POST</code></p>
            <p><strong>Content-type:</strong> <code>application/json</code></p>

            <h3 className="mt-4">
              QUERY PARAMETERS, CURL Command & Response 
              <button className="show_btn" onClick={() => setShowLoginSection(!showLoginSection)}>
                 <FaCode /> {showLoginSection ? 'Hide' : 'Show'}
              </button>
            </h3>

            {showLoginSection && (
              <>
                {/* Query Parameters */}
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

                {/* CURL and Response */}
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
              </>
            )}
          </section>
          
          <section id="AuthLogin">
            <h2>Login</h2>
            <p>{Documentations.authLoginSubtext}</p>
            <p><strong>URL:</strong> <code>{'$path'}/User/login/</code></p>
            <p><strong>Method:</strong> <code>POST</code></p>
            <p><strong>Content-type:</strong> <code>application/json</code></p>

            <h3 className="mt-4">
              QUERY PARAMETERS, CURL Command & Response 
              <button className="show_btn" onClick={() => setShowLoginSection(!showLoginSection)}>
                 <FaCode /> {showLoginSection ? 'Hide' : 'Show'}
              </button>
            </h3>

            {showLoginSection && (
              <>
                {/* Query Parameters */}
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

                {/* CURL and Response */}
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
              </>
            )}
          </section>

          {/* Register Section */}
          <section id="AuthRegister">
            <h2>Register</h2>
            <p><strong>URL:</strong> <code>{'$path'}/User/register/</code></p>
            <p><strong>Method:</strong> <code>POST</code></p>
            <p><strong>Content-type:</strong> <code>application/json</code></p>

            <h3>
              QUERY PARAMETERS, CURL Command & Response 
              <button className="show_btn" onClick={() => setShowRegisterSection(!showRegisterSection)}>
              <FaCode /> {showRegisterSection ? 'Hide' : 'Show'}
              </button>
            </h3>

            {showRegisterSection && (
              <>
                {/* Query Parameters */}
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

                {/* CURL and Response */}
                <div className="flex-row">
                  <div className="code-block">
                    <h4>Example CURL Command</h4>
                    <SyntaxHighlighter language="json5" style={xonokai}>
                      {Registrationcrl}
                    </SyntaxHighlighter>
                  </div>
                  <div className="response">
                    <h4>Response</h4>
                    <SyntaxHighlighter language="json5" style={xonokai}>
                      {RegisterResponce}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </>
            )}
          </section>

          <section id="CompnayRegister">
            <h2>Register</h2>
            <p><strong>URL:</strong> <code>{'$path'}/User/register/</code></p>
            <p><strong>Method:</strong> <code>POST</code></p>
            <p><strong>Content-type:</strong> <code>application/json</code></p>

            <h3>
              QUERY PARAMETERS, CURL Command & Response 
              <button className="show_btn" onClick={() => setShowRegisterSection(!showRegisterSection)}>
              <FaCode /> {showRegisterSection ? 'Hide' : 'Show'}
              </button>
            </h3>

            {showRegisterSection && (
              <>
                {/* Query Parameters */}
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

                {/* CURL and Response */}
                <div className="flex-row">
                  <div className="code-block">
                    <h4>Example CURL Command</h4>
                    <SyntaxHighlighter language="json5" style={xonokai}>
                      {Registrationcrl}
                    </SyntaxHighlighter>
                  </div>
                  <div className="response">
                    <h4>Response</h4>
                    <SyntaxHighlighter language="json5" style={xonokai}>
                      {RegisterResponce}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </>
            )}
          </section>

        </section>
      </section>
    </div>
  );
}

export default ApiRef;
