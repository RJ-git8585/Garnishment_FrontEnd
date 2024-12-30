

function ApiRef() {
  return (
    <div>
        <sectio id="Post">
        <section id="createBusiness">
                        <h2>CreateBusiness</h2>
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