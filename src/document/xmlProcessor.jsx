/**
 * XmlProcessor Component
 * 
 * This component provides functionality for processing XML and Excel files, converting them to JSON,
 * and performing garnishment calculations. It also allows users to view and export the processed data.
 * 
 * @component
 * 
 * @returns {JSX.Element} The XmlProcessor component.
 * 
 * @description
 * - Allows users to upload an Excel file, which is converted to JSON via an API call.
 * - Performs garnishment calculations on the uploaded data using another API call.
 * - Displays the API response in either JSON format or a table format.
 * - Provides options to copy the response, toggle fullscreen mode, and export the data to an Excel file.
 * - Displays the time taken for file upload and garnishment calculation.
 * 
 * @state {number} reloadKey - Key to force component re-render.
 * @state {string} jsonInput - JSON input string.
 * @state {Object|null} response - API response data.
 * @state {string} error - Error message, if any.
 * @state {boolean} loading - Loading state for API calls.
 * @state {boolean} showTable - Flag to toggle between JSON and table view.
 * @state {boolean} isFullscreen - Flag to toggle fullscreen mode.
 * @state {File|null} file - Uploaded file (not directly used in the component).
 * @state {number|null} fileUploadTime - Time taken for file upload in milliseconds.
 * @state {number|null} garnishmentCalcTime - Time taken for garnishment calculation in milliseconds.
 * 
 * @function reloadComponent - Resets the component state to its initial values.
 * @function handleFileUpload - Handles file upload, converts it to JSON, and triggers garnishment calculation.
 * @function exportToExcel - Exports the processed data to an Excel file.
 * @function handleGarnishmentCalculation - Sends the JSON data to the API for garnishment calculation.
 * @function handleCopy - Copies the API response to the clipboard.
 * @function toggleFullscreen - Toggles the fullscreen mode for the component.
 * @function renderTable - Renders the API response data in a table format.
 * 
 * @dependencies
 * - React hooks: useState, useRef
 * - Material-UI components: Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer
 * - External libraries: XLSX for Excel file handling, react-icons for icons
 * 
 * @example
 * <XmlProcessor />
 */
import { BASE_URL } from '../Config';
import Headertop from '../component/Headertop';
import { FaTableCells } from "react-icons/fa6";
import { FaCopy, FaExpand, FaCompress } from "react-icons/fa";
import { BsFiletypeJson,BsFiletypeXml  } from "react-icons/bs";
import Sidebar from '../component/sidebar';
import { useState, useRef } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import './xml.css'
import * as XLSX from "xlsx";


const XmlProcessor = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setFile] = useState(null);
  const [fileUploadTime, setFileUploadTime] = useState(null);
  const [garnishmentCalcTime, setGarnishmentCalcTime] = useState(null);
  const containerRef = useRef(null);

  const reloadComponent = () => {
    setReloadKey(prevKey => prevKey + 1);
    setJsonInput('');
    setResponse(null);
    setError('');
    setLoading(false);
    setFile(null);
    setShowTable(false);
    setFileUploadTime(null);
    setGarnishmentCalcTime(null);
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      setLoading(true);
      const startTime = new Date().getTime();

      try {
        const apiResponse = await fetch(`${BASE_URL}/User/ConvertExcelToJson`, {
          method: 'POST',
          body: formData,
        });

        const endTime = new Date().getTime();
        setFileUploadTime(endTime - startTime);

        if (!apiResponse.ok) {
          throw new Error(`API Error: ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        setJsonInput(JSON.stringify(data, null, 2));

        await handleGarnishmentCalculation(data);
      } catch (err) {
        setError(err.message || 'An error occurred while uploading the file.');
      } finally {
        setLoading(false);
      }
    }  
  };


  const exportToExcel = () => {
    if (!response || !response.results) {
      alert("No data available to export.");
      return;
    }
  
    const formattedData = response.results.reduce((acc, result) => {
      result.garnishment_data.forEach((garnishment) => {
        garnishment.data.forEach((garnData) => {
          acc.push({
            "Employee ID": result.ee_id, // Fixed reference
            "Case ID": garnData.case_id, // Corrected case ID extraction
            "Garnishment Type": garnishment.type,
            "Ordered Amount": garnData.ordered_amount ?? "N/A",
            "Arrear Amount":
              result.Agency?.find((agency) => agency.Arrear)?.Arrear[0]?.arrear_amount ?? "N/A",
            "Withholding Amount":
              result.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt[0]?.child_support ?? "N/A",
            "ER Deduction": result.ER_deduction?.garnishment_fees || "N/A",
          });
        });
      });
      return acc;
    }, []);
  
    if (formattedData.length === 0) {
      alert("No valid data found for export.");
      return;
    }
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Garnishment Data");
  
    XLSX.writeFile(workbook, "Garnishment_Data.xlsx");
  };
  
  
  const handleGarnishmentCalculation = async (data) => {
    try {
      setLoading(true);
      const startTime = new Date().getTime();
      const apiResponse = await fetch(`${BASE_URL}/User/garnishment_calculate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const endTime = new Date().getTime();
      setGarnishmentCalcTime(endTime - startTime);

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
      }

      const result = await apiResponse.json();
      setResponse(result);
      setShowTable(false);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2)).then(
        () => alert('Response copied to clipboard!'),
        () => alert('Failed to copy response.')
      );
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const renderTable = (data) => {
    if (!data || !data.results) {
      return <p style={{ color: "red" }}>No valid results found.</p>;
    }
  
    const allCases = [];
  
    // Extract relevant data from results
    data.results.forEach((result) => {
      result.garnishment_data.forEach((garnishment) => {
        garnishment.data.forEach((garnData) => {
          // Extract Agency details
          const arrearAmount =
            result.Agency?.find((agency) => agency.Arrear)?.Arrear[0]?.arrear_amount || "0";
          const withholdingAmount =
            result.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt[0]
              ?.child_support || "0";
          const garnishmentFees = result.ER_deduction?.garnishment_fees || "N/A";
  
          allCases.push({
            ee_id: result.ee_id,
            no_of_exemption_including_self: result.no_of_exemption_including_self,
            pay_period:result.pay_period,
            filing_status: result.filing_status,
            wages : result.wages,
            commission_and_bonus: result.commission_and_bonus,  
            non_accountable_allowances: result.non_accountable_allowances,
            gross_pay: result.gross_pay,
            // payroll taxes Data for
            federal_income_tax: result.payroll_taxes.federal_income_tax,
            social_security_tax: result.payroll_taxes.social_security_tax,
            medicare_tax: result.payroll_taxes.medicare_tax,  
            state_income_tax: result.payroll_taxes.state_tax,
            local_tax: result.payroll_taxes.local_tax,
            union_dues: result.payroll_taxes.union_dues,
            wilmington_tax: result.payroll_taxes.wilmington_tax,
            medical_insurance_pretax: result.payroll_taxes.medical_insurance_pretax,
            industrial_insurance  : result.payroll_taxes.industrial_insurance,
            life_insurance  : result.payroll_taxes.life_insurance,
            CaliforniaSDI  : result.payroll_taxes.CaliforniaSDI,
            // payroll taxes Data for
            medical_insurance: result.payroll_deductions.medical_insurance,
            // payroll OPen new text for
            net_pay: result.net_pay,
            age: result.age,
            is_blind: result.is_blind,
            is_spouse_blind : result.is_spouse_blind,
            spouse_age  : result.spouse_age,
            support_second_family : result.support_second_family,
            no_of_student_default_loan : result.no_of_student_default_loan,
            arrears_greater_than_12_weeks : result.arrears_greater_than_12_weeks,
            // Garnoshishment data using type copy from


            Work_State: result.work_state, // Fixed to correctly reference the employee ID
            case_id: garnData.case_id, // Correctly extracting case ID from garnishment data
            garnishment_type: garnishment.type,
            ordered_amount: garnData.ordered_amount,
            arrear_amount: arrearAmount,
            withholding_amount: withholdingAmount,
            garnishment_fees: garnishmentFees,
          });
        });
      });
    });
  
    return (
      <TableContainer component={Paper} style={{ marginTop: "20px", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Employee ID</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Case ID</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Garnishment Type</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Arrear Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Withholding Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Garnishment Fees</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Work State </TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>No of Exemption</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Pay Period</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Filing Status</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Wages</TableCell> 
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Commission and Bonus</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Non-Accountable Allowances</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Gross Pay</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Federal Income Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Social Security Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Medicare Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>State Income Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Local Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Union Dues</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Wilmington Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Medical Insurance Pretax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Industrial Insurance</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Life Insurance</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>CaliforniaSDI</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Medical Insurance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCases.map((caseItem, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>{caseItem.ee_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.case_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.garnishment_type}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.arrear_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.withholding_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.garnishment_fees}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.Work_State}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.no_of_exemption_including_self}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.pay_period}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.filing_status}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.wages}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.commission_and_bonus}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.non_accountable_allowances}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.gross_pay}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.federal_income_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.social_security_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.medicare_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.state_income_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.local_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.union_dues}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.wilmington_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.medical_insurance_pretax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.industrial_insurance}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.life_insurance}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.CaliforniaSDI}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.medical_insurance}</TableCell>````
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="min-h-full" key={reloadKey}>
      <div className="container main ml-auto">
        <div className='sidebar hidden lg:block'><Sidebar /></div>
        <div className='contant content ml-auto customBatchProcessing'>
          <Headertop />
          <hr />
          <div className="bg_cls container" ref={containerRef}>
            <h2 className="header">Batch Processor</h2>

            {/* Display time response outside API response box */}
            <div className="timeContainer">
            <div className="timeContainer">
                {fileUploadTime !== null && (
                  <p className="text-black">
                    File Upload Time: <b>{fileUploadTime}</b> ms
                  </p>
                )}
                {garnishmentCalcTime !== null && (
                  <p className="text-black">
                    Garnishment Calculation Time: <b>{garnishmentCalcTime}</b> ms
                  </p>
                )}
              </div></div>

            <div className="columnContainer">
              <div className="inputSection">
                <div className="fileInputContainer">
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                    className="fileInput"
                  />
                  <button
                    className="resetButton"
                    onClick={reloadComponent}
                    disabled={loading}
                  >
                    {loading ? 'Loading Responses...' : 'Reset'}
                  </button>
                </div>

                <textarea
                  className="textArea"
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
              </div>
              {response && (
                <div className="responseSection">
                  <div className="responseHeader">
                    <h3>API Response</h3>
                    <div>
                    <button className="copyButton" onClick={handleCopy}>
                    <FaCopy />
                  </button>
                  <button className="toggleButton" onClick={() => setShowTable(!showTable)}>
                    {showTable ? <BsFiletypeJson /> : <FaTableCells />}
                  </button>
                  <button className="toggleButton" onClick={toggleFullscreen}>
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                <button className="toggleButton" onClick={exportToExcel}>
                  <BsFiletypeXml />
                </button>
          </div>
                  </div>
                  <div className="responseContainer">
                    {showTable ? renderTable(response) : (
                      <pre className="responsejson">{JSON.stringify(response, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default XmlProcessor;
