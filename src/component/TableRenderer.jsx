/* eslint-disable no-dupe-keys */
import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from "@mui/material";
import { Link } from "react-router-dom";
import { formatGarnishmentData } from "../utils/dataFormatter";
import Navbar from './../Navbar';

export const renderTable = (data) => {
  const allCases = Array.isArray(data) ? data : formatGarnishmentData(data);

  if (!allCases || allCases.length === 0) {
    return <p style={{ color: "red" }}>No valid results found.</p>;
  }

  const allResults = [];

    data.results.forEach((result) => {
      result.garnishment_data?.forEach((garnishment) => {
        garnishment.data?.forEach((garnData, index) => {
          allResults.push({
            ee_id: result.ee_id,
            case_id: garnData.case_id,
            garnishment_type: garnishment.type,
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
            
            
            garnishment_amount: garnData.garnishment_amount,  
            garnishment_date: garnData.garnishment_date,
            medical_insurance: result.payroll_taxes?.medical_insurance ?? "N/A",
            industrial_insurance: result.payroll_taxes?.industrial_insurance ?? "N/A",
            life_insurance: result.payroll_taxes?.life_insurance ?? "N/A",
            
            net_pay: result.net_pay,
            age: result.age,
            is_blind: result.is_blind,
            is_spouse_blind: result.is_spouse_blind,
            // eslint-disable-next-line no-dupe-keys
            union_dues: result.payroll_taxes?.union_dues  || "0",
            // eslint-disable-next-line no-dupe-keys
            wilmington_tax: result.payroll_taxes?.wilmington_tax || "N/A",
            medical_insurance_pretax: result.payroll_taxes?.medical_insurance_pretax || "N/A",
            
            spouse_age: result.spouse_age,
            support_second_family: result.support_second_family,    
            no_of_student_default_loan: result.no_of_student_default_loan,
            arrears_greater_than_12_weeks: result.arrears_greater_than_12_weeks,
            arrears_greater_than_12_weeks_amount: garnData.arrears_greater_than_12_weeks_amount || "N/A",
            withholding_limit_rule: result.withholding_limit_rule || "N/A",
            child_support: result.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt[0]?.child_support || "N/A",
            // child_support: result.agency?.find((item) => item.withholding_amt)?.withholding_amt[0]?.child_support || "N/A";
            // eslint-disable-next-line no-dupe-keys
            medical_insurance: result.payroll_deductions?.medical_insurance || "N/A",
            arrear_amount: garnData.arrear_amount || "N/A",
            CaliforniaSDI: result.payroll_taxes?.CaliforniaSDI || "N/A",
            withholding_amount: garnData.ordered_amount || "N/A",
            garnishment_fees: result.er_deduction?.garnishment_fees || "N/A", // Updated to use er_deduction.garnishment_fees
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
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Rules</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {allResults.map((caseItem, index) => {
            const childSupport = caseItem.agency?.find((item) => item.withholding_amt)?.withholding_amt[0]?.child_support || "N/A";
            console.log(allResults, "childSupport");
            return (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>{caseItem.ee_id || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.case_id || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.garnishment_type || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {caseItem.arrear_amount !== null && caseItem.arrear_amount !== undefined
                    ? caseItem.arrear_amount
                    : "0"}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {caseItem.withholding_amount !== null && caseItem.withholding_amount !== undefined
                    ? caseItem.withholding_amount
                    : "N/A"}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {caseItem.garnishment_fees !== null && caseItem.garnishment_fees !== undefined
                    ? caseItem.garnishment_fees
                    : "N/A"}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.Work_State || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {caseItem.no_of_exemption_including_self !== null &&
                  caseItem.no_of_exemption_including_self !== undefined
                    ? caseItem.no_of_exemption_including_self
                    : "N/A"}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.pay_period || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.filing_status || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.wages || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.commission_and_bonus || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {caseItem.non_accountable_allowances || "N/A"}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.gross_pay || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.net_pay || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.federal_income_tax || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.social_security_tax || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.medicare_tax || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.state_income_tax || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.local_tax || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.union_dues || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.wilmington_tax || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {caseItem.medical_insurance_pretax !== undefined && caseItem.medical_insurance_pretax !== null
                    ? caseItem.medical_insurance_pretax < 0
                      ? "N/A"
                      : caseItem.medical_insurance_pretax
                    : "N/A"}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.industrial_insurance || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.life_insurance || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.CaliforniaSDI || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{caseItem.medical_insurance || "N/A"}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Link
                    to={`/rules?rule=${encodeURIComponent(caseItem.Work_State || "No Rule")}`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {caseItem.withholding_limit_rule || "No Rule"}
                  </Link>
                </TableCell>
               
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
