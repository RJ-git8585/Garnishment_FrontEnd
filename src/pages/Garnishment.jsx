    /* eslint-disable react/no-unknown-property */
    // eslint-disable-next-line no-unused-vars
    import React, { useState,useEffect } from 'react';
    import Headertop from '../component/Headertop';
    import Sidebar from '../component/sidebar';
    // import {  toast } from 'react-toastify';
    // import 'react-toastify/dist/ReactToastify.css';
    import { FaBalanceScaleRight } from "react-icons/fa";
    // eslint-disable-next-line no-unused-vars
    

    import MultipleChild from '../forms/MultipleChild';
    import StudentLoan from '../forms/StudentLoan';
    import { BASE_URL } from '../Config';
    import MultipleStudentLoan from '../forms/MultipleStudentLoan';
    import FederalTax from '../forms/FederalTax';
    import MultipleGarnishments from '../forms/MultipleGarnishments';
    // import StateTax from '../forms/StateTax';  

    function Garnishment( ) {
      // /Users/sourabhkosti/Desktop/code/Ritik/Garnishment_React-main/src/pages/forms 
      const [employee_name, setEmpName] = useState('');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [earnings, setEarnings] = useState('');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [garnishment_fees, setGarnishmentFees] = useState('');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [order_id, setOrderID] = useState('');
      // eslint-disable-next-line react-hooks/rules-of-hooks  
      const [state, setState] = useState('');
      // const [selectedType, setSelectedType] = useState('MultipleChild');
      // const [medicare, setMedicare] = useState('');
      const [arrears_amt, setArrears] = useState('');
      const [arrears_greater_than_12_weeks, setIsChecked] = useState(false);
      const [support_second_family, setIsCheckedFamily] = useState(false); // Initialize checkbox state as unchecked
      // eslint-disable-next-line no-unused-vars
      const [options, setOptions] = useState([]);
      const [employee_id, setSelectedOption] = useState(null);
      // const [data, setData] = useState(null);
      
      const employer_id = (parseInt(sessionStorage.getItem("id")));
      // const handleChangeType = (event) => {
      //   const selectedOption = event.target.value;
      //   setSelectedType(selectedOption);
      //   console.log('Selected value:', selectedOption);
      // };

      // eslint-disable-next-line no-unused-vars
      const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked); 
        
      };
    
      const handleReset = () => {
        setSelectedOption('');
        setEmpName('');
        setEarnings('');
        setGarnishmentFees('');
        setOrderID('');
        setState('');
        setArrears('');
              setIsChecked('');
              setIsCheckedFamily('');
            
    };

    // tab

    const [activeTab, setActiveTab] = useState('Child Support');

      // Function to handle tab switching
      const handleTabClick = (tab) => {
        setActiveTab(tab);
      };
    // tabs cloased
      const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
          employer_id,
          employee_id,
          employee_name,
          earnings,
          garnishment_fees,
          order_id,
          state,
          arrears_greater_than_12_weeks,
          support_second_family,
          arrears_amt,
        };
        console.log(data)
        fetch(`${BASE_URL}/User/CalculationDataView`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              console.log('Data submitted successfully!');
              // toast.success('Calculation Added Successfully !!');
              handleReset();
              setSelectedOption('');
              setEmpName('');
              setEarnings('');
              setGarnishmentFees('');
              setSelectedOption('');
              setOrderID('');
              setState('');
              setIsChecked('');
              setIsCheckedFamily('');
              setArrears('');
            } else {
              console.error('Error submitting data:', response.statusText);
            }
          });
      };
    


      return (
        <>
          <div className="min-h-full">
            <div className="container main ml-auto">
            <div className='sidebar hidden lg:block'><Sidebar/></div>
              <div className="contant content ml-auto">
                <Headertop />
                <div className="p-0">
                  {/* <h1 className="uppercase font-bold mb-4 inline-block"><FaBalanceScaleRight/>Garnishment Calcultor</h1> */}
                  <h1 className='edit-profile mt-6 mb-4 inline-block'><FaBalanceScaleRight/>Garnishment Calculator</h1>
                  <form onSubmit={handleSubmit}>
                  {/* <MultiStep activeStep={2} > */}    
                <div className='hidden'> 
                            
                            <div className="mt-2 hidden">
                              <input
                                id="employer_id"
                                name="employer_id"
                                value={employer_id}
                                type="hidden"
                                // autoComplete="employee_name"
                                // onChange={(e) => setEid(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            </div>
                          {/* </div>
    tabs Section  */}

          {/* Tab headers */}
          <div className="tabs mb-6">
          <label htmlFor="empID" className="block italic text-red-700 text-sm font-semibold mb-3">
                          Please Select Garnishment Type:
                        </label>
          
            <button 
              className={activeTab === 'Child Support' ? ' custom active  mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4' : ' mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-gray-900 text-white hover:bg-slate-700 -my-2.5 ml-4'} 
              onClick={() => handleTabClick('Child Support')}>
            Child Support
            </button>
            <button 
              className={activeTab === 'Student loan' ? 'active  mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4' : ' mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4'} 
              onClick={() => handleTabClick('Student loan')}>
              Student loan
            </button>
            <button 
              className={activeTab === 'MultiStudent Loan' ? 'active  mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4' : ' mb-4 inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4'} 
              onClick={() => handleTabClick('MultiStudent Loan')}>
              MultiStudent Loan
            </button>
            <button 
              className={activeTab === 'Federal Tax' ? 'active inline-flex  mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4' : 'inline-flex mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4'} 
              onClick={() => handleTabClick('Federal Tax')}>
              Federal Tax
            </button>
            {/* <button 
              className={activeTab === 'State Tax' ? 'active inline-flex mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4' : 'inline-flex  mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4'} 
              onClick={() => handleTabClick('State Tax')}>
              State Tax
            </button>
            <button 
              className={activeTab === 'Creditor' ? 'active inline-flex mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4' : 'inline-flex  mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4'} 
              onClick={() => handleTabClick('Creditor')}>
              Creditor
            </button> */}
            <button 
              className={activeTab === 'Multiple Garnishments' ? 'active inline-flex mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4' : 'inline-flex  mb-4 justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5 ml-4'} 
              onClick={() => handleTabClick('Multiple Garnishments')}>
              Multiple Garnishments 
            </button>
          </div>

          {/* Tab content */}
          <div className="tab-content">
            {activeTab === 'Child Support' && <div> <MultipleChild></MultipleChild></div>}
            {activeTab === 'Student loan' && <div> <StudentLoan></StudentLoan></div>}
            {activeTab === 'MultiStudent Loan' && <div> <MultipleStudentLoan></MultipleStudentLoan></div>}
            {activeTab === 'Federal Tax' && <div> <FederalTax></FederalTax></div>}
            {/* {activeTab === 'State Tax' && <div><StateTax></StateTax></div>}
            {activeTab === 'Creditor' && <div>Creditor Calculation Coming Soon......</div>} */}
            {activeTab === 'Multiple Garnishments' && <div><MultipleGarnishments></MultipleGarnishments></div>}
          </div>

    {/* Tab Section closed */}





                          {/* <div>
                  <label htmlFor="empID" className="block italic text-red-700 text-sm font-semibold mb-3">
                          Please Select Garnishment Type:
                        </label>
                  <select className="custom-select mb-10 shadow appearance-none  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white-50 border border-white-300 text-white-900 text-sm bg-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 focus:shadow-outline dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500" value={selectedType} onChange={handleChangeType} required>
                    
                    <option value="MultipleChild">Child Support</option>
                    <option value="StudentLoan">Student loan</option>
                    <option value="MultiStudentLoan">Multiple Student loan</option>
                    <option value="FederalTax">Federal Tax</option>
                    <option value="StateTax">State Tax</option>
                    <option value="Creditor">Creditor</option>
            
                  </select>  
              </div>
              */}
                      {/* {selectedType === 'MultipleChild' && (
                          <div>
                        
                            <MultipleChild></MultipleChild>
                          
                          </div>
                        )} */}

                        {/* {selectedType === 'StudentLoan' && (
                          <div>
                            <StudentLoan></StudentLoan>
                          </div>
                        )} */}
                        {/* {selectedType === 'MultiStudentLoan' && (
                          <div>
                        <MultipleStudentLoan></MultipleStudentLoan>
                          </div>
                        )} */}
                        {/* {selectedType === 'FederalTax' && (
                          <div>
                            <FederalTax></FederalTax>
                          
                          </div>
                        )} */}
                        {/* {selectedType === 'StateTax' && (
                          <div>
                          <h1>StateTax Calculation Coming Soon......</h1>
                        
                          </div>
                        )} */}
                        {/* {selectedType === 'Creditor' && (
                          <div>
                          <h1>Creditor Calculation Coming Soon......</h1>
                          
                          </div>
                        )}   */}
                        

                        {/* {selectedType === 'Bankruptcy' && (
                          <div>
                            <h1>Bankruptcy Calculation Coming Soon.....</h1>
                            
                          </div>
                        )} */}
                  </form>
                  
                </div>
              </div>
            </div> 
          </div>
        </>
      );
    }

    export default Garnishment;
