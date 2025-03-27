import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";

const TableRenderer = ({ response }) => {
  if (!response || !response.results) {
    return <p style={{ color: "red" }}>No valid results found.</p>;
  }

  const allCases = response.results.flatMap((result) =>
    result.garnishment_data.flatMap((garnishment) =>
      garnishment.data.map((garnData) => ({
        ee_id: result.ee_id,
        case_id: garnData.case_id,
        garnishment_type: garnishment.type,
        arrear_amount: result.Agency?.find((agency) => agency.Arrear)?.Arrear[0]?.arrear_amount || "0",
        withholding_amount: result.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt[0]?.child_support || "0",
        garnishment_fees: result.ER_deduction?.garnishment_fees || "N/A",
        Work_State: result.work_state,
        no_of_exemption_including_self: result.no_of_exemption_including_self,
        pay_period: result.pay_period,
        filing_status: result.filing_status,
        wages: result.wages,
        commission_and_bonus: result.commission_and_bonus,
        non_accountable_allowances: result.non_accountable_allowances,
        gross_pay: result.gross_pay,
        federal_income_tax: result.payroll_taxes.federal_income_tax,
        social_security_tax: result.payroll_taxes.social_security_tax,
        medicare_tax: result.payroll_taxes.medicare_tax,
        state_income_tax: result.payroll_taxes.state_tax,
        local_tax: result.payroll_taxes.local_tax,
        union_dues: result.payroll_taxes.union_dues,
        wilmington_tax: result.payroll_taxes.wilmington_tax,
        medical_insurance_pretax: result.payroll_taxes.medical_insurance_pretax,
        industrial_insurance: result.payroll_taxes.industrial_insurance,
        life_insurance: result.payroll_taxes.life_insurance,
        CaliforniaSDI: result.payroll_taxes.CaliforniaSDI,
        medical_insurance: result.payroll_deductions.medical_insurance,
      }))
    )
  );

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

export default TableRenderer;
