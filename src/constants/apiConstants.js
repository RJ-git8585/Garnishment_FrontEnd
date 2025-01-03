// src/constants/apiConstants.js
// Defining multiple constants
export const Authentication = `Endpoint: /User/Login

Method: POST
Description: Retrieve Token Information in Response.


Response
  {
    "success": true,
    "message": "Login successfully",
    "user_data": {
        "employer_id": 1,
        "username": "Sergio09",
        "name": "Sergio Rode",
        "email": "rjj@gmail.com"
    },
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNjc1MjI4NCwiaWF0IjoxNzM1ODg4Mjg0LCJqdGkiOiI2NjFiYWZhZjcyZDg0YWZiYjYxODU4OWNhNDY2MjBlNiIsInVzZXJfaWQiOjF9.5YwUQM16msOB9FE_GmKQ6zOPB10mfQki_N1s1iPo2Q4",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1ODg4NTg0LCJpYXQiOjE3MzU4ODgyODQsImp0aSI6ImIxMTFmOGU1YjgwZjQzNWZiNWUzMjFjMDBkNThjOGM5IiwidXNlcl9pZCI6MX0.nCbEilRivWKUBnBk0EDSA3FD5HecukHbs3gb1t_aNzo",
    "expire_time": 1735888584,
    "status code": 200
}`;


export const LoginCrl = `Endpoint: /User/Login

Method: POST
Description: Retrieve Authentication Information.
Headers:
  - Authorization: Bearer <token>

Request Body
{
    "email": "testUsers@gmail.com",
    "password": "Test@12345"

}`;
export const ChildSupport = `Endpoint: /User/CalculationDataView

Method: POST


Request Body
{
  "company_id": 11,
  "employee_name": "John Doe",
  "employee_id": 85,
  "GrossPay": 620,
  "NetPay": 10,
  "Taxes": 61,
  "arrears_greater_than_12_weeks": false,
  "support_second_family": false,
  "amount_to_withhold_child1": 10,
  "amount_to_withhold_child2": 5,
  "amount_to_withhold_child3": 10,
  "number_of_arrears": 3,
  "arrears_amt_Child1": 25,
  "arrears_amt_Child2": 3,
  "arrears_amt_Child3": 4,
  "order_id": 304,
  "State": "Alabama"
}`;

export const Fedral = `Endpoint: /User/FederalCaseData

Method: POST


Request Body
{
  "company_id": 11,
  "employee_id": 85,
  "GrossPay": 620,
  "employee_name": "John Doe",
  "NetPay": 10,
  "Taxes": 61,
  "Filling_Status": false,
  "NumberofExemptions": 2,
  "Disability": "",
  "order_id": 304,
  "State": "Alabama",
  "PayPeriod":"Daily",
  "Age":34
}`;
export const StudentLoan = `Endpoint: /User/MiltipleStudentLoanCalculationData

Method: POST


Request Body
{
  "company_id": 11,
  "employee_id": 85,
  "earnings": 620,
  "employee_name": "John Doe",
  "GrassPay": 10,
  "Taxes": 61,
  "NumberOfStudentDefaultLoans": 10,
  "State": "Alabama",
  "order_id": 304
}`;
export const Dashboard  = `Endpoint: /User/dashboard

Method: GET
Description: Retrieve Dashboard Information.
Headers:
  - Authorization: Bearer <token>

Response
{
    "success": true,
    "message": "Data Get successfully",
    "status code": 200,
    "data": {
        "Total_IWO": 2,
        "Employees_with_Single_IWO": 0,
        "Employees_with_Multiple_IWO": 1,
        "Active_employees": 2
    }
}`;



export const CompanyOnboarding = `Endpoint: /User/CompanyOnboarding

Method: POST
Description:  Company registeration for the portal.

Request Body:
{
       "name": "Paul Jr",
        "username": "Paul Jr",
        "email": "PaulJr@gmail.com",
        "password1" : "PaulJr@12345" ,
        "password2" : "PaulJr@12345" 
 }`;

export const EmployeeOnboarding = `Endpoint: /User/EmployeeOnboarding

Method: POST
Description: Process payroll for the company.
Headers:
  - Authorization: Bearer <token>

Request Body:
{
        "employer_id" :1,
        "employee_name": "Paul Jr",
        "pay_cycle" :  "biweekly",
        "number_of_garnishment": 40,
        "location" : "USA" ,
        "department" :"HR"
        
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