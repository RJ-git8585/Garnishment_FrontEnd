
/**
 * Help Component
 *
 * This component renders the Garnishment Support Center page, which includes
 * frequently asked questions (FAQs) to assist users in understanding and
 * navigating the garnishment tool. It provides information on the tool's
 * purpose, navigation, form submission, support contact, data security, and
 * form editing.
 *
 * @component
 * @returns {JSX.Element} The rendered Help page with FAQs and support details.
 *
 * @example
 * // To use the Help component, simply import and include it in your JSX:
 * import Help from './Help';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <Help />
 *     </div>
 *   );
 * }
 */
import React from 'react'

function Help() {

  return (
    <>
      <h1 className='text-xl mb-4 mt-4 font-semibold animate-fade-in'>
        Garnishment Support Center
      </h1>
      <h2 className='text-xl mb-4 font-semibold animate-fade-in'>
        Frequently Asked Questions (FAQs)
      </h2>
      
      <h3 className='text-lg font-semibold animate-slide-in'>
        1. What is this tool used for?
      </h3>
      <p className='text-sm mb-4 animate-fade-in'>
        This tool is designed to help employers and employees manage garnishment processes efficiently. It provides features for tracking, calculating, and submitting garnishment-related information.
      </p>

      <h3 className='text-lg font-semibold animate-slide-in'>
        2. How do I navigate through the tool?
      </h3>
      <p className='text-sm mb-4 animate-fade-in'>
        Use the sidebar to access different sections of the application. Each section is designed to handle specific tasks such as managing employee data, submitting garnishment forms, and reviewing reports.
      </p>

      <h3 className='text-lg font-semibold animate-slide-in'>
        3. How do I submit a garnishment form?
      </h3>
      <p className='text-sm mb-4 animate-fade-in'>
        Navigate to the Forms section, fill out the required fields, and click the Submit button. Ensure all mandatory fields are completed to avoid errors.
      </p>

      <h3 className='text-lg font-semibold animate-slide-in'>
        4. Who can I contact for support?
      </h3>
      <p className='text-sm mb-4 animate-fade-in'>
        If you encounter any issues, please contact our support team at <a href="mailto:support@garnishedge.com" className="text-blue-500">support@garnishedge.com</a>. We are here to assist you.
      </p>

      <h3 className='text-lg font-semibold animate-slide-in'>
        5. Is my data secure?
      </h3>
      <p className='text-sm mb-4 animate-fade-in'>
        Yes, we prioritize data security. All information is encrypted and stored securely to ensure your privacy and compliance with regulations.
      </p>

      <h3 className='text-lg font-semibold animate-slide-in'>
        6. Can I edit submitted forms?
      </h3>
      <p className='text-sm mb-4 animate-fade-in'>
        Yes, you can edit submitted forms by navigating to the History section, selecting the form, and clicking the Edit button. Make sure to save changes after editing.
      </p>
    </>
  )
}

export default Help