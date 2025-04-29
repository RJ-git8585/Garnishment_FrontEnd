/* eslint-disable react/no-deprecated */
/* eslint-disable no-dupe-keys */
import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import { Link, BrowserRouter } from "react-router-dom";
import { formatGarnishmentData } from "../utils/dataFormatter";
import Navbar from './../Navbar';
import Swal from "sweetalert2";

import { BsFiletypeCsv, BsFiletypeXml } from "react-icons/bs";
import withReactContent from "sweetalert2-react-content";
import Rules from "../pages/Rules"; // Import the Rule component
import { createRoot } from 'react-dom/client'; // import createRoot from React 18
import MySwal from 'sweetalert2';
import { saveAs } from "file-saver"; // Ensure this import is correct
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import "./TableRenderer.css";
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

const exportTableData = (data) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
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

  const allResults = [];
  const uniqueEntries = new Set(); // Track unique entries

  data.results.forEach((result) => {
    const garnishmentData = result.garnishment_data || [];
    const agencyData = result.agency || [];

    const maxLength = Math.max(
      garnishmentData.reduce((sum, garnishment) => sum + (garnishment.data?.length || 0), 0),
      agencyData.reduce((sum, agency) => sum + (agency.withholding_amt?.length || 0), 0),
      agencyData.reduce((sum, agency) => sum + (agency.arrear?.length || 0), 0) // Ensure arrear length is considered
    );

    for (let i = 0; i < maxLength; i++) {
      const garnishment = garnishmentData[Math.floor(i / (garnishmentData[0]?.data?.length || 1))] || {};
      const garnData = garnishment.data?.[i % (garnishment.data?.length || 1)] || {};

      const agency = agencyData[Math.floor(i / (agencyData[0]?.withholding_amt?.length || 1))] || {};
      const withholdingData = agency.withholding_amt?.[i % (agency.withholding_amt?.length || 1)] || {};
      const arrearData = agency.arrear?.[i % (agency.arrear?.length || 1)] || {};

      const garnishmentAmount = withholdingData.child_support || withholdingData.garnishment_amount || "0"; // Fetch child_support
      const withholdingArrear = arrearData.withholding_arrear || "0"; // Fetch withholding_arrear

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
          arrear_amount: arrearAmount,
          ordered_amount: orderedAmount, // Correctly fetch and display ordered_amount
          withholding_amount: garnishmentAmount, // Display withholding amount
          withholding_arrear: arrearAmount, // Display withholding arrear
          allowable_disposable_earning: allowableDisposableEarning, // Display allowable_disposable_earning from er_deduction or result
          ...result.er_deduction,
          Work_State: result.work_state,
          no_of_exemption_including_self: result.no_of_exemption_including_self,
          pay_period: result.pay_period,
          filing_status: result.filing_status,
          wages: result.wages,
          commission_and_bonus: result.commission_and_bonus,
          non_accountable_allowances: result.non_accountable_allowances,
          gross_pay: result.gross_pay,
          federal_income_tax: result.payroll_taxes?.federal_income_tax ?? "N/A",
          social_security_tax: result.payroll_taxes?.social_security_tax ?? "N/A",
          state_income_tax: result.payroll_taxes?.state_tax ?? "N/A",
          medicare_tax: result.payroll_taxes?.medicare_tax ?? "N/A",
          local_tax: result.payroll_taxes?.local_tax ?? "N/A",
          medical_insurance: result.payroll_taxes?.medical_insurance ?? "N/A",
          industrial_insurance: result.payroll_taxes?.industrial_insurance ?? "N/A",
          life_insurance: result.payroll_taxes?.life_insurance ?? "N/A",
          net_pay: result.net_pay,
          famli_tax: result.famli_tax || "N/A",
          age: result.age,
          is_blind: result.is_blind ? "True" : "False", // Display true/false for is_blind
          is_spouse_blind: result.is_spouse_blind ? "True" : "False", // Display true/false for is_spouse_blind
          union_dues: result.payroll_taxes?.union_dues || "0",
          wilmington_tax: result.payroll_taxes?.wilmington_tax || "N/A",
          medical_insurance_pretax: result.payroll_taxes?.medical_insurance_pretax || "N/A",
          spouse_age: result.spouse_age,
          support_second_family: result.support_second_family,
          no_of_student_default_loan: result.no_of_student_default_loan,
          arrears_greater_than_12_weeks: result.arrears_greater_than_12_weeks,
          arrears_greater_than_12_weeks_amount: garnData.arrears_greater_than_12_weeks_amount || "N/A",
          withholding_limit_rule: result.withholding_limit_rule || "No Rule",
          disposable_earning: result.disposable_earning || "N/A",
          CaliforniaSDI: result.payroll_taxes?.CaliforniaSDI || "N/A",
          data_count: garnishment.data ? garnishment.data.length : 0,
        });
      }
    }
  });

  return (
    <div>
      <button
        onClick={() => exportTableData(allResults)}
        style={{
          marginBottom: "10px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
       
        <BsFiletypeCsv />
      </button>
      <button
        onClick={() => exportTableDataAsExcel(allResults)}
        style={{
          marginBottom: "10px",
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <BsFiletypeXml />
      </button>
      <TableContainer component={Paper} style={{ marginTop: "20px", maxHeight: "500px", overflowX: "auto" }} stickyHeader>
        <Table stickyHeader>
          <TableHead className="headcss">
            <TableRow style={{ backgroundColor: "#4a4a4a" }}> {/* Set background color to gray */}
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Employee ID</TableCell> {/* White text */}
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Case ID</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Garnishment Type</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Work State</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Pay Period</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Ordered Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Arrear Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Filing Status</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>No of Exemption</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Wages</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Commission and Bonus</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Non Accountable Allowances</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Gross Pay</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Federal Income Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>State Income Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Social Security Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Medicare Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Local Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Union Dues</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Wilmington Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Medical Insurance Pretax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Industrial Insurance</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Life Insurance</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>CaliforniaSDI</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Famli Tax</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Medical Insurance</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Age</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Is Blind</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Is Spouse Blind</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Spouse Age</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Support Second Family</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Arrears Greater Than 12 Weeks</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>No. of Student Default Loan</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Disposable Earnings</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Allowable Disposable Earnings</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Withholding Amount</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Withholding Arrear</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Garnishment Fees</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Rule Key</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allResults.map((item, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>{item.ee_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.case_id}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.garnishment_type}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.Work_State}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.pay_period}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.ordered_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.arrear_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.filing_status}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.no_of_exemption_including_self}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.wages}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.commission_and_bonus}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.non_accountable_allowances}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.gross_pay}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.federal_income_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.state_income_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.social_security_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.medicare_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.local_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.union_dues}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.wilmington_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.medical_insurance_pretax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.industrial_insurance}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.life_insurance}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.CaliforniaSDI}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.famli_tax}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.medical_insurance}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.age}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.is_blind}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.is_spouse_blind}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.spouse_age}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.support_second_family}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.arrears_greater_than_12_weeks}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.no_of_student_default_loan}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.disposable_earning}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.allowable_disposable_earning}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.withholding_amount}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.withholding_arrear}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.garnishment_fees}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {item.garnishment_type !== "State tax levy" ? (
                    <button
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
                      {item.withholding_limit_rule || "No Rule"}
                    </button>
                  ) : (
                    <span>{item.withholding_limit_rule || "No Rule"}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

