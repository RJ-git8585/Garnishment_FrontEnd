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
    DoctitleSubtext: `Welcome to the comprehensive documentation for our suite of Garnishment APIs. This set of tools is designed to empower developers, Garnishment administrators, and business owners alike, by providing a seamless and efficient interface to manage all aspects of a company’s Garnishment system. From the onboarding of companies and their employees to the streamlined handling of Garnishment calculations and reporting, this suite of APIs is purpose-built to be robust, secure, and easy to integrate.`,


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


    EmployeeOnboardingtitle:`Employee Onboarding`,
    EmployeeOnboardingSubtext:`Here you will find comprehensive information on the APIs used to onboard new employees, including personal details and tax information.`,


    CompanyOnboardingtitle:`Company Onboarding`,
    CompanyOnboardingSubtext:`This section provides a step-by-step guide for integrating a new company into the system. It details the endpoints necessary for registering a company, setting up bank accounts, and configuring initial settings.`,


  };


  export const Apiref = {

    AuthenticationTitle:`Authentication`,
    lastsubtext:`Ensure to replace CLIENTID and SECRETKEY with your actual client ID and secret key provided by the API provider. Additionally, fill in the necessary information within the request body JSON structure.`,
    AuthenticationsubtestAuthtext:`This is a POST API for Login an employer with the following fields:`,
    AuthenticationsubtestAuthtext1:`All the API’s utilize Basic authentication, where you need to include the <code>Authorization</code> header in your HTTPS requests. The header value should be in the format Basic Base64 encode using the relevant clientID and SecretKey.`,


  };
  