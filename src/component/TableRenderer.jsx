import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import { Link, BrowserRouter } from "react-router-dom";
import { formatGarnishmentData } from "../utils/dataFormatter";
// import Navbar from './../Navbar';
import Swal from "sweetalert2";

import { BsFiletypeCsv, BsFiletypeXml } from "react-icons/bs";
import withReactContent from "sweetalert2-react-content";
import Rules from "../pages/Rules"; // Import the Rule component
import StatetaxLevyRules from "../pages/StatetaxLevyRules"; // Import the State Tax Levy Rules component
import CreditorTaxRule from "../pages/CreditorTaxRule"; // Add this import
import { createRoot } from 'react-dom/client'; // import createRoot from React 18
import MySwal from 'sweetalert2';
import { saveAs } from "file-saver"; // Ensure this import is correct
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import "../utils/css/TableRenderer.css"; // Updated path for the CSS file
let swalRoot = null; // Store the root instance globally

const handleRuleClick = (workState, employeeId, supportsSecondFamily, arrearsMoreThan12Weeks, disposableEarnings, dataCount) => {
  console.log("Work State:", workState);
  console.log("Employee ID:", employeeId);
  console.log("Supports Second Family:", supportsSecondFamily);
  console.log("Arrears More Than 12 Weeks:", arrearsMoreThan12Weeks);
  console.log("Disposable Earnings:", disposableEarnings);
  console.log("Data Count:", dataCount); // Ensure dataCount is logged

  MySwal.fire({
    html: "<div id='swal-rule-container'></div>",
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "swal-wide",
    },
    didOpen: () => {
      const container = document.getElementById('swal-rule-container');
      if (!swalRoot) {
        swalRoot = createRoot(container);
      }
      swalRoot.render(
        <BrowserRouter>
          <Rules
            workState={workState}
            employeeId={employeeId}
            supportsSecondFamily={supportsSecondFamily}
            arrearsMoreThan12Weeks={arrearsMoreThan12Weeks}
            disposableEarnings={disposableEarnings}
            dataCount={dataCount} // Pass dataCount here
          />
        </BrowserRouter>
      );
    },
    willClose: () => {
      if (swalRoot) {
        swalRoot.unmount();
        swalRoot = null;
      }
    }
  });
};

const handleStateTaxLevyRuleClick = (caseId,state,weekly) => {
  
  Swal.fire({
    html: "<div id='swal-rule-container'></div>",
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "swal-wide",
    },
    didOpen: () => {
      const container = document.getElementById("swal-rule-container");
      if (!swalRoot) {
        swalRoot = createRoot(container);
      }
      swalRoot.render(
        <BrowserRouter>
          <StatetaxLevyRules caseId={caseId} state={state} weekly={weekly}/>
        </BrowserRouter>
      );
    },
    willClose: () => {
      if (swalRoot) {
        swalRoot.unmount();
        swalRoot = null;
      }
    },
  });
};

const handleCreditorTaxRuleClick = (caseId,state,weekly) => {
  Swal.fire({
    html: "<div id='swal-rule-container'></div>",
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "swal-wide",
    },
    didOpen: () => {
      const container = document.getElementById("swal-rule-container");
      // console.log(state,weekly,caseId);
      if (!swalRoot) {
        swalRoot = createRoot(container);
      }
      swalRoot.render(
        <BrowserRouter>
          <CreditorTaxRule caseId={caseId} state={state} weekly={weekly} />
        </BrowserRouter>
      );
    },
    willClose: () => {
      if (swalRoot) {
        swalRoot.unmount();
        swalRoot = null;
      }
    },
  });
};

const exportTableData = (data) => {
  if (!data || data.length === 0) {
    return;
  }

  const filteredData = data.map(({ data_count, ...rest }) => rest); // Exclude data_count
  const headers = Object.keys(filteredData[0]).join(","); // Extract headers from the first row
  const rows = filteredData.map((row) =>
    Object.values(row)
      .map((value) => `"${value}"`) // Wrap values in quotes to handle commas
      .join(",")
  );
  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "Garnisment_data.csv");
};

const exportTableDataAsExcel = (data) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const filteredData = data.map(({ data_count, ...rest }) => rest); // Exclude data_count
  const worksheet = XLSX.utils.json_to_sheet(filteredData); // Convert JSON data to worksheet
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data"); // Append the worksheet to the workbook
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }); // Write workbook to buffer
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "Garnishment_data.xlsx");
};

export const renderTable = (data) => {
  const allCases = Array.isArray(data) ? data : formatGarnishmentData(data);

  if (!allCases || allCases.length === 0) {
    return <p style={{ color: "red" }}>No valid results found.</p>;
  }

  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    // If the value is a string that can be converted to a number, format it
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toLocaleString();
  };

  const allResults = [];
  const uniqueEntries = new Set(); // Track unique entries

  data.results.forEach((result) => {
    const garnishmentData = result.garnishment_data || [];
    const agencyData = result.agency || [];

    const maxLength = Math.max(
      garnishmentData.reduce((sum, garnishment) => sum + (garnishment.data?.length || 0), 0),
      agencyData.reduce((sum, agency) => sum + (agency.withholding_amt?.length || 0), 0),
      agencyData.reduce((sum, agency) => sum + (agency.arrear?.length || 0), 0)
    );

    for (let i = 0; i < maxLength; i++) {
      const garnishment = garnishmentData[Math.floor(i / (garnishmentData[0]?.data?.length || 1))] || {};
      const garnData = garnishment.data?.[i % (garnishment.data?.length || 1)] || {};

      const agency = agencyData.length > 0 
        ? agencyData[Math.floor(i / (agencyData[0]?.withholding_amt?.length || 1))] || {} 
        : {}; 
      // Dynamically handle cases where agencyData might be empty or undefined

      const withholdingData = agency.withholding_amt?.[i % (agency.withholding_amt?.length || 1)] || {};

      // Use a loop to find the withholding_arrear value in the agency array
      let withholdingArrear = "N/A";
      for (const agencyItem of agencyData) {
        if (agencyItem.arrear && agencyItem.arrear.length > 0) {
          const arrearItem = agencyItem.arrear[i % agencyItem.arrear.length];
          if (arrearItem && arrearItem.withholding_arrear !== undefined) {
            withholdingArrear = arrearItem.withholding_arrear;
            break;
          }
        }
      }
      // Ensure withholding_arrear fetches the correct value, including 0, and only shows "N/A" when missing
      const garnishmentAmount = withholdingData.child_support || withholdingData.garnishment_amount ||  withholdingData.creditor_debt
      
       || "0"; // Fetch child_support

      // Retrieve arrear_amount and ordered_amount from the response
      const arrearAmount =
        agency.Arrear?.[i % (agency.Arrear?.length || 1)]?.arrear_amount ||
        garnData.arrear_amount ||
        "0";

      const orderedAmount =
        garnishment.ordered_amount !== undefined
          ? garnishment.ordered_amount
          : garnData.ordered_amount || "0";

      // Fetch allowable_disposable_earning from er_deduction
      const allowableDisposableEarning = result.er_deduction?.allowable_disposable_earning || result.allowable_disposable_earning || "N/A";

      const uniqueKey = `${result.ee_id}-${garnData.case_id}-${arrearAmount}-${garnishmentAmount}-${i}`;
      if (!uniqueEntries.has(uniqueKey)) {
        uniqueEntries.add(uniqueKey);
        allResults.push({
          ee_id: result.ee_id,
          case_id: garnData.case_id,
          garnishment_type: garnishment.type,
          Work_State: result.work_state,
          pay_period: result.pay_period,
          ordered_amount: orderedAmount,
          arrear_amount: arrearAmount,
          // filing_status: result.filing_status,
          // no_of_exemption_including_self: result.no_of_exemption_including_self,
          wages: formatNumber(result.wages),
          commission_and_bonus: result.commission_and_bonus !== undefined && result.commission_and_bonus !== 0 
            ? formatNumber(result.commission_and_bonus)
            : "0",
          non_accountable_allowances: result.non_accountable_allowances !== undefined && result.non_accountable_allowances !== 0 
            ? formatNumber(result.non_accountable_allowances)
            : "0",
          gross_pay: formatNumber(result.gross_pay),
          net_pay: formatNumber(result.net_pay),
          // federal_income_tax: result.payroll_taxes?.federal_income_tax ?? "N/A",
          // state_income_tax: result.payroll_taxes?.state_tax ?? "N/A",
          // social_security_tax: result.payroll_taxes?.social_security_tax ?? "N/A",
          // medicare_tax: result.payroll_taxes?.medicare_tax ?? "N/A",
          // local_tax: result.payroll_taxes?.local_tax ?? "N/A",
          // union_dues: result.payroll_taxes?.union_dues || "0",
          // wilmington_tax: result.payroll_taxes?.wilmington_tax || "N/A",
          // medical_insurance_pretax: result.payroll_taxes?.medical_insurance_pretax || "N/A",
          // industrial_insurance: result.payroll_taxes?.industrial_insurance ?? "N/A",
          // life_insurance: result.payroll_taxes?.life_insurance ?? "N/A",
          // CaliforniaSDI: result.payroll_taxes?.CaliforniaSDI || "N/A",
          // famli_tax: result.famli_tax || "N/A",
          // medical_insurance: result.payroll_taxes?.medical_insurance ?? "N/A",
          // age: result.age,
          // is_blind: result.is_blind ? "True" : "False",
          // is_spouse_blind: result.is_spouse_blind ? "True" : "False",
          // spouse_age: result.spouse_age,
          support_second_family: result.support_second_family,
          arrears_greater_than_12_weeks: result.arrears_greater_than_12_weeks,
          // no_of_student_default_loan: result.no_of_student_default_loan,
          disposable_earning: result.disposable_earning ? formatNumber(result.disposable_earning) : "N/A",
          total_mandatory_deduction: result.total_mandatory_deduction ? formatNumber(result.total_mandatory_deduction) : "N/A",
          allowable_disposable_earning: allowableDisposableEarning ? formatNumber(allowableDisposableEarning) : "N/A",
          withholding_amount: garnishmentAmount ? formatNumber(garnishmentAmount) : "0",
          withholding_arrear: withholdingArrear, // Correctly fetch withholding_arrear, including 0
          ...result.er_deduction,
          withholding_limit_rule: result.withholding_limit_rule || "No Rule",
          data_count: garnishment.data ? garnishment.data.length : 0,
        });
      }
    }
  });

  const columns = [
    { label: "Employee ID", key: "ee_id" },
    { label: "Case ID", key: "case_id", headerClassName: 'text-right', cellClassName: 'text-right' },
    { label: "Work State", key: "Work_State" },
    { label: "Pay Period", key: "pay_period" },
    { label: "Garnishment Type", key: "garnishment_type" },
    { label: "Wages", key: "wages", headerClassName: 'text-right', cellClassName: 'text-right numbermove' },
    { label: "Commission and Bonus", key: "commission_and_bonus", headerClassName: 'text-right', cellClassName: 'text-right numbermove' },
    { label: "Non Accountable Allowances", key: "non_accountable_allowances", headerClassName: 'text-right', cellClassName: 'text-right numbermove' },
    { label: "Gross Pay", key: "gross_pay", headerClassName: 'text-right', cellClassName: 'text-right numbermove' },
    { label: "Net Pay", key: "net_pay", headerClassName: 'text-right', cellClassName: 'text-right numbermove' },
    { label: "Total Mandatory Deduction", key: "total_mandatory_deduction", headerClassName: 'text-right', cellClassName: 'text-right numbermove' },
    { label: "Disposable Earnings", key: "disposable_earning", headerClassName: 'text-left', cellClassName: 'text-left numbermove' },
    { label: "Support Second Family", key: "support_second_family" },
    { label: "Arrears Greater Than 12 Weeks", key: "arrears_greater_than_12_weeks" },
    { label: "Allowable Disposable Earnings", key: "allowable_disposable_earning" , cellClassName: 'text-left numbermove'},
    { label: "Ordered Amount", key: "ordered_amount", cellClassName: 'text-left numbermove' },
    { label: "Arrear Amount", key: "arrear_amount" , cellClassName: 'text-left numbermove'},
    { label: "Withholding Amount", key: "withholding_amount", cellClassName: 'text-left numbermove' },
    { label: "Withholding Arrear", key: "withholding_arrear", cellClassName: 'text-left numbermove'},
     { label: "Garnishment Fees", key: "garnishment_fees" },
    { label: "Rule Key", key: "withholding_limit_rule" },
    // { label: "Filing Status", key: "filing_status" },
    // { label: "No of Exemption", key: "no_of_exemption_including_self" },
    // { label: "Federal Income Tax", key: "federal_income_tax" },
    // { label: "State Income Tax", key: "state_income_tax" },
    // { label: "Social Security Tax", key: "social_security_tax" },
    // { label: "Medicare Tax", key: "medicare_tax" },
    // { label: "Local Tax", key: "local_tax" },
    // { label: "Union Dues", key: "union_dues" },
    // { label: "Wilmington Tax", key: "wilmington_tax" },
    // { label: "Medical Insurance Pretax", key: "medical_insurance_pretax" },
    // { label: "Industrial Insurance", key: "industrial_insurance" },
    // { label: "Life Insurance", key: "life_insurance" },
    // { label: "CaliforniaSDI", key: "CaliforniaSDI" },
    // { label: "Famli Tax", key: "famli_tax" },
    // { label: "Medical Insurance", key: "medical_insurance" },
    // { label: "Age", key: "age" },
    // { label: "Is Blind", key: "is_blind" },
    // { label: "Is Spouse Blind", key: "is_spouse_blind" },
    // { label: "Spouse Age", key: "spouse_age" },
    // { label: "No. of Student Default Loan", key: "no_of_student_default_loan" },
    //  { label: "Garnishment Fees", key: "garnishment_fees" },
    
  ];

  return (
    <div>
      <button
        onClick={() => exportTableDataAsExcel(allResults)}
        style={{
          marginBottom: "10px",
          marginLeft: "10px",
          padding: "5px 10px",
          backgroundColor: "#3e484c",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          position: "relative",
          bottom: "-2px",
          float: "inline-end",

        }}
        title="EXPORT EXCEL"
      >
        <BsFiletypeXml />
      </button>
      <TableContainer component={Paper} style={{ marginTop: "20px", maxHeight: "500px", overflowX: "auto" }} stickyHeader>
        <Table stickyHeader>
          <TableHead className="headcss">
            <TableRow style={{ backgroundColor: "#4a4a4a" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  style={{ fontWeight: "bold", color: "#fff" }}
                  className={column.headerClassName || "text-center"}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allResults.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell 
                    key={column.key} 
                    className={column.cellClassName || "text-center"}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {column.key === "withholding_limit_rule" ? (
                      item.garnishment_type === "State tax levy" ? (
                        <button
                          type="button"
                          onClick={() => handleStateTaxLevyRuleClick(item.case_id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          {item[column.key]}
                        </button>
                      ) : item.garnishment_type === "Creditor debt" ? (
                        <button
                          type="button"
                          onClick={() => handleCreditorTaxRuleClick(item.case_id,item.Work_State,item.pay_period)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          {item[column.key]}
                        </button>
                      ) : item[column.key] !== "No Rule" ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleRuleClick(
                              item.Work_State || "No Work State",
                              item.ee_id,
                              item.support_second_family || "No",
                              item.arrears_greater_than_12_weeks || "No",
                              item.disposable_earning || "0",
                              item.data_count
                            )
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          {item[column.key]}
                        </button>
                      ) : (
                        <span style={{ color: "gray" }}>{item[column.key]}</span>
                      )
                    ) : (
                      item[column.key] || "N/A"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

