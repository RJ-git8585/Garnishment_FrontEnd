

/**
 * @constant {Object} Signature_crls
 * @description Contains constants for various signature-related identifiers used in the application.
 * @property {string} AuthLogin - Identifier for the login signature.
 * @property {string} AuthRegister - Identifier for the register signature.
 * @property {string} OnboardStep1 - Identifier for the first onboarding step.
 * @property {string} OnboardStep2 - Identifier for the second onboarding step.
 */

/**
 * @constant {Object} SignatureMenus
 * @description Contains constants for menu labels used in the application.
 * @property {string} AuthLogin - Label for the login menu.
 * @property {string} EmployeeOnboarding - Label for the employee onboarding menu.
 * @property {string} Employer_Portal - Label for the employer portal menu.
 * @property {string} Garnishment - Label for the garnishment menu.
 */

/**
 * @constant {Object} Documentations
 * @description Contains documentation-related constants and descriptions for various sections of the application.
 * @property {string} AuthLogin - Title for the login documentation.
 * @property {string} authLoginSubtext - Description of the login API functionality.
 * @property {string} DocTitle - Title for the Garnishment API documentation.
 * @property {string} Overview - Overview section title.
 * @property {string} DoctitleSubtext - Description of the Garnishment Engine API.
 * @property {string} GettingStartTitle - Title for the "Get Started" section.
 * @property {string} GettingStartsubtest - Description of the "Get Started" section.
 * @property {string} AuthenticationTitle - Title for the authentication section.
 * @property {string} lastsubtext - Instructions for replacing client credentials in API requests.
 * @property {string} AuthenticationsubtestAuthtext - Description of required authentication credentials.
 * @property {string} AuthenticationsubtestAuthtext1 - Explanation of Basic authentication usage.
 * @property {string} EmployersPortalTille - Title for the employer portal section.
 * @property {string} EmployerPortalSubtext - Description of employer portal functionality.
 * @property {string} GarnishementPortalTille - Title for the garnishment portal section.
 * @property {string} GarnishementPortalSubtext - Description of garnishment portal functionality.
 * @property {string} EmployeeOnboardingtitle - Title for the employee onboarding section.
 * @property {string} EmployeeOnboardingSubtext - Description of employee onboarding APIs.
 * @property {string} CompanyOnboardingtitle - Title for the company onboarding section.
 * @property {string} CompanyOnboardingSubtext - Description of company onboarding process.
 */

/**
 * @constant {Object} Apiref
 * @description Contains API reference-related constants and descriptions.
 * @property {string} AuthenticationTitle - Title for the authentication API reference.
 * @property {string} lastsubtext - Instructions for replacing client credentials in API requests.
 * @property {string} AuthenticationsubtestAuthtext - Description of the login API fields.
 * @property {string} AuthenticationsubtestAuthtext1 - Explanation of Basic authentication usage with clientID and SecretKey.
 */
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
  