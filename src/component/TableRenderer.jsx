/* eslint-disable react/no-deprecated */
/* eslint-disable no-dupe-keys */
import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import { Link, BrowserRouter } from "react-router-dom";
import { formatGarnishmentData } from "../utils/dataFormatter";
import Navbar from './../Navbar';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Rules from "../pages/Rules"; // Import the Rule component
import { createRoot } from 'react-dom/client'; // import createRoot from React 18
import MySwal from 'sweetalert2';

let swalRoot = null; // Store the root instance globally

const handleRuleClick = (workState) => {
  console.log("Work State passed to Rules component:", workState); // Debugging log
  MySwal.fire({
    title: "Rule Details",
    html: "<div id='swal-rule-container'></div>", // Container to hold the React component
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "swal-wide",
    },
    didOpen: () => {
      const container = document.getElementById('swal-rule-container');
      if (!swalRoot) {
        swalRoot = createRoot(container); // Create the React root only once
      }
      swalRoot.render(
        <BrowserRouter>
          {workState ? (
            <Rules workState={workState} />
          ) : (
            <div style={{ color: "red" }}>No work state data available</div> // Fallback UI
          )}
        </BrowserRouter>
      );
    },
    willClose: () => {
      if (swalRoot) {
        swalRoot.unmount(); // Clean up the component
        swalRoot = null; // Reset the root instance
      }
    }
  });
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
      agencyData.reduce((sum, agency) => sum + (agency.withholding_amt?.length || 0), 0)
    );

    for (let i = 0; i < maxLength; i++) {
      const garnishment = garnishmentData[Math.floor(i / (garnishmentData[0]?.data?.length || 1))] || {};
      const garnData = garnishment.data?.[i % (garnishment.data?.length || 1)] || {};

      const agency = agencyData[Math.floor(i / (agencyData[0]?.withholding_amt?.length || 1))] || {};
      const withholdingData = agency.withholding_amt?.[i % (agency.withholding_amt?.length || 1)] || {};

      const garnishmentAmount = withholdingData.garnishment_amount || withholdingData.child_support || "0";

      // Retrieve arrear_amount from agency > Arrear > arrear_amount, fallback to garnData.arrear_amount or "0"
      const arrearAmount =
        agency.Arrear?.[i % (agency.Arrear?.length || 1)]?.arrear_amount ||
        garnData.arrear_amount ||
        "0";

      const uniqueKey = `${result.ee_id}-${garnData.case_id}-${arrearAmount}-${garnishmentAmount}-${i}`;
      if (!uniqueEntries.has(uniqueKey)) {
        uniqueEntries.add(uniqueKey);
        allResults.push({
          ee_id: result.ee_id,
          case_id: garnData.case_id,
          garnishment_type: garnishment.type,
          arrear_amount: arrearAmount, // Updated logic for arrear_amount
          withholding_amount: garnishmentAmount,
          garnishment_fees: result.er_deduction?.garnishment_fees || "0",
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
          famli_tax : result.famli_tax || "N/A",
          age: result.age,
          is_blind: result.is_blind,
          is_spouse_blind: result.is_spouse_blind,
          union_dues: result.payroll_taxes?.union_dues || "0",
          wilmington_tax: result.payroll_taxes?.wilmington_tax || "N/A",
          medical_insurance_pretax: result.payroll_taxes?.medical_insurance_pretax || "N/A",
          spouse_age: result.spouse_age,
          support_second_family: result.support_second_family,
          no_of_student_default_loan: result.no_of_student_default_loan,
          arrears_greater_than_12_weeks: result.arrears_greater_than_12_weeks,
          arrears_greater_than_12_weeks_amount: garnData.arrears_greater_than_12_weeks_amount || "N/A",
          withholding_limit_rule: result.withholding_limit_rule || "N/A",
          disposible_earning: result.disposible_earning || "N/A",
          CaliforniaSDI: result.payroll_taxes?.CaliforniaSDI || "N/A",
        });
      }
    }
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
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Disposible Earning</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Garnishment Fees</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Work State</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>No of Exemption</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Pay Period</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Filing Status</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Wages</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Commission and Bonus</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Non-Accountable Allowances</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Gross Pay</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Net Pay</TableCell>
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
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Famli Tax</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Rules</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allResults.map((item, index) => (
            <TableRow key={index}>
              <TableCell style={{ textAlign: "center" }}>{item.ee_id}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.case_id}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.garnishment_type}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.arrear_amount}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.withholding_amount}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.disposible_earning}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.garnishment_fees}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.Work_State}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.no_of_exemption_including_self}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.pay_period}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.filing_status}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.wages}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.commission_and_bonus}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.non_accountable_allowances}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.gross_pay}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.net_pay}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.federal_income_tax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.social_security_tax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.medicare_tax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.state_income_tax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.local_tax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.union_dues}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.wilmington_tax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.medical_insurance_pretax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.industrial_insurance}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.life_insurance}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.CaliforniaSDI}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.medical_insurance}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{item.famli_tax}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <button
                  onClick={() => handleRuleClick(item.Work_State || "No Work State")}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

