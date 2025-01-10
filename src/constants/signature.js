export const Signature_crls = {


    AuthLogin: `Login`,
    AuthRegister: `Register`,
    OnboardStep1: `OnboardStep1`,
    OnboardStep2: `OnboardStep2`,


  };

  export const SignatureMenus = {
    AuthLogin: `Login`,
    EmployeeOnboarding: `Employee Onboarding`,
    Employer_Portal: `Dashboard Portal`,
    Garnishment: `Garnishment`,

  };
  
  
  export const Documentations = {

    AuthLogin: `Login`,
    authLoginSubtext: `The Login API allows users to authenticate and gain access to the application. Upon successful authentication, the API returns an access token, enabling secure communication with other protected endpoints.`,



    DocTitle: `Garnishment API Documentation`,
    Overview: `Overview`,
    DoctitleSubtext: `The Garnishment Engine API provides programmatic access to manage and process garnishment orders, including employee wage deductions and reporting. It is designed for payroll systems and financial institutions to handle garnishment workflows efficiently and accurately.`,



    GettingStartTitle: `Get Started`,
    GettingStartsubtest:`Garnishment API provides programmatic access to read data. Retrieve Users, filter them, etc.`,


    AuthenticationTitle:`Authentication`,
    lastsubtext:`Ensure to replace CLIENTID and SECRETKEY with your actual client ID and secret key provided by the API provider. Additionally, fill in the necessary information within the request body JSON structure.`,
    AuthenticationsubtestAuthtext:`To authenticate, you’ll require the following credentials:`,
    AuthenticationsubtestAuthtext1:`All the API’s utilize Basic authentication, where you need to include the Authorization header in your HTTPS requests. The header value should be in the format Basic Base64 encode using the relevant token.`,



    EmployersPortalTille:`Dashboard Portal`,
    EmployerPortalSubtext:`This section outlines the functionality available to employers through the API. It includes features such as managing employee information.`,


    GarnishementPortalTille:`Garnishment`,
    GarnishementPortalSubtext:`This core section dives deep into the APIs responsible for the actual payroll process. It covers everything from initiate payroll, through to running payroll, making adjustments, and resolving any issues that may arise.`,


    EmployeeOnboardingtitle:`Employee Registration`,
    EmployeeOnboardingSubtext:`Here you will find comprehensive information on the API’s used to register new employees, including their demographic and tax details.`,
    


    CompanyOnboardingtitle:`Company Registration`,
    CompanyOnboardingSubtext:`This section has been updated to include a step-by-step guide for integrating a new company and configuring initial settings.`,


  };


  export const Apiref = {

    AuthenticationTitle:`Authentication`,
    lastsubtext:`Ensure to replace CLIENTID and SECRETKEY with your actual client ID and secret key provided by the API provider. Additionally, fill in the necessary information within the request body JSON structure.`,
    AuthenticationsubtestAuthtext:`This is a POST API for Login an employer with the following fields:`,
    AuthenticationsubtestAuthtext1:`All the API’s utilize Basic authentication, where you need to include the <code>Authorization</code> header in your HTTPS requests. The header value should be in the format Basic Base64 encode using the relevant clientID and SecretKey.`,


  };
  