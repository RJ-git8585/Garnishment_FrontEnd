// src/constants/apiConstants.js

// Defining multiple constants
export const Authentication = `Endpoint: /User/Authentication

Method: GET
Description: Retrieve Authentication Information.
Headers:
  - Authorization: Bearer <token>

Response:
{
  "status": "success",
  "data": {
    "userId": 12345,
    "portalAccess": false
  }
}`;

export const CompanyOnboarding = `Endpoint: /User/CompanyOnboarding

Method: POST
Description:  Company registeration for the portal.

Request Body:
{
  "username": "<username>",
  "password": "<password>",
  "email": "<email>"
}`;

export const EmployeeOnboarding = `Endpoint: /User/EmployeeOnboarding

Method: POST
Description: Process payroll for the company.
Headers:
  - Authorization: Bearer <token>

Request Body:
{
  "companyId": "<companyId>",
  "payrollDate": "<payrollDate>"
}`;

export const LoginResponce = 
`{
    "status": "success",
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }`;

  export const Logincrl = 
  `curl -X POST $path/User/login/ \
-H "Content-Type: application/json" \
-d '{
 "email": "user@example.com",
  "password": "securePassword123"
}'`;

export const RegisterResponce = 
`{
    "status": "success",
    "message": "Registration successful",
  }`;

  export const Registrationcrl = 
  `curl -X POST $path/User/login/ \
-H "Content-Type: application/json" \
-d '{
 "email": "user@example.com",
  "password": "securePassword123"
}'`;