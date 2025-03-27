import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import { formatGarnishmentData } from "../utils/dataFormatter";

export const renderTable = (data) => {
  const allCases = formatGarnishmentData(data);

  if (allCases.length === 0) {
    return <p style={{ color: "red" }}>No valid results found.</p>;
  }

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
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Work State</TableCell>
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
              <TableCell style={{ textAlign: "center" }}>{caseItem.medical_insurance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
