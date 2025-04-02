export const formatGarnishmentData = (response) => {
  if (!response || !response.results) {
    return [];
  }

  return response.results.reduce((acc, result) => {
    if (result.garnishment_data) {
     
      result.garnishment_data.forEach((garnishment) => {
        garnishment.data.forEach((garnData) => {
          acc.push({
            ee_id: result.ee_id,
            no_of_exemption_including_self: result.no_of_exemption_including_self,
            pay_period: result.pay_period,
            filing_status: result.filing_status,
            wages: result.wages,
            commission_and_bonus: result.commission_and_bonus,
            non_accountable_allowances: result.non_accountable_allowances,
            gross_pay: result.gross_pay,
            federal_income_tax: result.payroll_taxes?.federal_income_tax ?? "N/A",
            social_security_tax: result.payroll_taxes?.social_security_tax ?? "N/A",
            medicare_tax: result.payroll_taxes?.medicare_tax ?? "N/A",
            state_income_tax: result.payroll_taxes?.state_tax ?? "N/A",
            local_tax: result.payroll_taxes?.local_tax ?? "N/A",
            union_dues: result.payroll_taxes?.union_dues ?? "N/A",
            wilmington_tax: result.payroll_taxes?.wilmington_tax ?? "N/A",
            medical_insurance_pretax: result.payroll_taxes?.medical_insurance_pretax ?? "N/A",
            industrial_insurance: result.payroll_taxes?.industrial_insurance ?? "N/A",
            life_insurance: result.payroll_taxes?.life_insurance ?? "N/A",
            CaliforniaSDI: result.payroll_taxes?.CaliforniaSDI ?? "N/A",
            medical_insurance: result.payroll_deductions?.medical_insurance ?? "N/A",
            net_pay: result.net_pay,
            age: result.age,
            is_blind: result.is_blind,
            is_spouse_blind: result.is_spouse_blind,
            spouse_age: result.spouse_age,
            support_second_family: result.support_second_family,
            no_of_student_default_loan: result.no_of_student_default_loan,
            arrears_greater_than_12_weeks: result.arrears_greater_than_12_weeks,
            Work_State: result.work_state,
            case_id: garnData.case_id,
            garnishment_type: garnishment.type,
            ordered_amount: garnData.ordered_amount,
            arrear_amount:
              result.Agency?.find((agency) => agency.Arrear)?.Arrear?.[0]?.arrear_amount || garnData.arrear_amount || "0",
            withholding_amount:
              result.Agency?.find((agency) => agency.withholding_amt)?.withholding_amt?.[0]?.child_support || garnData.withholding_amount || "0",
            garnishment_fees: result.ER_deduction?.garnishment_fees || "N/A",
            withholding_limit_rule: result.withholding_limit_rule || "N/A",
          });
        });
      });
    }
    return acc;
  }, []);
};
