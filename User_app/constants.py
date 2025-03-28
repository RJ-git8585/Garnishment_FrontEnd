class CalculationFields:
    GROSS_PAY = 'gross_pay'
    NET_PAY = 'net_pay'
    WAGES = 'wages'
    COMMISSION_AND_BONUS = 'commission_and_bonus'
    NON_ACCOUNTABLE_ALLOWANCES = 'non_accountable_allowances'
    GARNISHMENT_DATA = 'garnishment_data'
    MEDICAL_INSURANCE = 'medical_insurance_pretax'
    ORDERED_AMOUNT = 'ordered_amount'
    ARREAR_AMOUNT = 'arrear_amount'
    CURRENT_MEDICAL_SUPPORT='current_medical_support'
    PAST_DUE_MEDICAL_SUPPORT='past_due_medical_support'
    CURRENT_SPOUSAL_SUPPORT='current_spousal_support'
    PAST_DUE_SPOUSAL_SUPPORT='past_due_spousal_support'



class GarnishmentTypeFields:
    CHILD_SUPPORT = 'child support'
    FEDERAL_TAX_LEVY = 'federal tax levy'
    STUDENT_DEFAULT_LOAN = 'student default loan'
    STATE_TAX_LEVY = 'State Tax Levy'
    CREDITOR_DEBT = 'creditor debt'

class PayPeriodFields:
    WEEKLY = 'weekly'
    BI_WEEKLY = 'bi-weekly'
    SEMI_MONTHLY = 'semi-monthly'
    MONTHLY = 'monthly'

class FilingStatusFields:
    SINGLE = 'single'
    MARRIED_FILING_JOINT_RETURN='married_filing_joint_return'
    MARRIED_FILING_SEPARATE_RETURN='married_filing_separate_return'
    HEAD_OF_HOUSEHOLD='head_of_household'
    QUALIFYING_WIDOWERS='qualifying_widowers'
    ADDITIONAL_EXEMPT_AMOUNT='additional_exempt_amount'

class PayrollTaxesFields:
    FEDERAL_INCOME_TAX = 'federal_income_tax'
    SOCIAL_SECURITY_TAX = 'social_security_tax'
    MEDICARE_TAX = 'medicare_tax'
    STATE_TAX = 'state_tax'
    LOCAL_TAX = 'local_tax'
    UNION_DUES = 'union_dues'
    MEDICAL_INSURANCE_PRETAX = 'medical_insurance_pretax'
    LIFE_INSURANCE = 'life_insurance'
    INDUSTRIAL_INSURANCE = 'industrial_insurance'
    CALIFORNIA_SDI='california_sdi'
    PAYROLL_TAXES = 'payroll_taxes'

class EmployeeFields:
    EMPLOYEE_ID = 'ee_id'
    CASE_ID = 'case_id'
    WORK_STATE = 'work_state'
    BLIND = 'blind'
    SPOUSE_AGE = 'spouse_age'
    PAY_PERIOD = 'pay_period'
    FILING_STATUS = 'filing_status'
    GROSS_PAY = 'gross_pay'
    NET_PAY = 'net_pay'
    AGE = 'age'
    IS_BLIND = 'is_blind'
    IS_SPOUSE_BLIND = 'is_spouse_blind'
    SUPPORT_SECOND_FAMILY = 'support_second_family'
    NO_OF_STUDENT_DEFAULT_LOAN = 'no_of_student_default_loan'
    NO_OF_EXEMPTION_INCLUDING_SELF = 'no_of_exemption_including_self'
    ARREARS_GREATER_THAN_12_WEEKS = 'arrears_greater_than_12_weeks'
    GARNISHMENT_TYPE="type"
    DEBT="debt"
    EXEMPTION_AMOUNT="exemption_amount"
    DIST_CODE ="dist_code"
    NO_OF_DEPENDENT_EXEMPTION="no_of_dependent_exemption"
    IS_CASE_OF_NON_TAX_LEVY="is_case_of_non_tax_levy"
    IS_CASE_OF_INCOME_TAX_LEVY="is_case_of_income_tax_levy"



class ChildSupportFields:
    PRORATE = "prorate"
    DEVIDEEQUALLY = "divide equally"


class PriorityOrderFields:
    CURRENT_SUPPORT = "current_support"
    ARREARS = "arrears"
    SPOUSAL_SUPPORT = "spousal_support"
    MEDICAL_PREMIUMS = "medical_premiums"
    INSURANCE_PREMIUMS = "insurance_premiums"
    COURT_FEE = "court_fee"
    HEALTH_INSURANCE_PREMIUMS = "health_insurance_premiums"
    HEALTH_CARE_PREMIUMS = "health_care_premiums"
    MEDICAL_SUPPORT_COVERAGE = "medical_support_coverage"
    COURT_ORDERED_HEALTH_INSURANCE_PREMIUMS = "court_ordered_health_insurance_premiums"
    CURRENT_SPOUSAL_SUPPORT = "current_spousal_support"
    ARREARS_FOR_CHILD_SUPPORT = "arrears_for_child_support"
    ARREARS_FOR_SPOUSAL_SUPPORT = "arrears_for_spousal_support"
    CURRENT_CHILD_SUPPORT = "current_child_support"
    MEDICAL_SUPPORT_PREMIUM = "medical_support_premium"
    ARREARAGE = "arrearage"
    DELINQUENCY = "deliquency"
    CHILD_SUPPORT_ARREARS = "child_support_arrears"
    MEDICAL_SUPPORT = "medical_support"
    OTHER_SUPPORT = "other_support"
    CASH_MEDICAL_SUPPORT = "cash_medical_support"
    FULL_COST_OF_THE_PREMIUM = "full_cost_of_the_premium"
    CURRENT_CHILD_AND_SPOUSAL_SUPPORT = "current_child_&_spousal_support"
    MEDICAL_SUPPORT_PREMIUMS = "medical_support_premiums"
    OTHER_CHILD_SUPPORT_OBLIGATIONS = "other_child_support_obligations"
    MEDICAL_INSURANCE_PREMIUMS = "medical_insurance_premiums"
    FEES = "fees"
    REIMBURSEMENTS = "reimbursements"
    MEDICAL_SUPPORT_ARREARS = "medical_support_arrears"
    CASH_CHILD_SUPPORT = "cash_child_support"
    HEALTH_PREMIUMS = "health_premiums"
    CHILD_ARREARS = "child_arrears"
    SPOUSAL_ARREARS = "spousal_arrears"
    SURCHARGE = "surcharge"
    INTEREST = "interest"

    # List of all fields
    ALL_FIELDS = [
        CURRENT_SUPPORT, ARREARS, SPOUSAL_SUPPORT, MEDICAL_PREMIUMS, INSURANCE_PREMIUMS,
        COURT_FEE, HEALTH_INSURANCE_PREMIUMS, HEALTH_CARE_PREMIUMS, MEDICAL_SUPPORT_COVERAGE,
        COURT_ORDERED_HEALTH_INSURANCE_PREMIUMS, CURRENT_SPOUSAL_SUPPORT, ARREARS_FOR_CHILD_SUPPORT,
        ARREARS_FOR_SPOUSAL_SUPPORT, CURRENT_CHILD_SUPPORT, MEDICAL_SUPPORT_PREMIUM, ARREARAGE,
        DELINQUENCY, CHILD_SUPPORT_ARREARS, MEDICAL_SUPPORT, OTHER_SUPPORT, CASH_MEDICAL_SUPPORT,
        FULL_COST_OF_THE_PREMIUM, CURRENT_CHILD_AND_SPOUSAL_SUPPORT, MEDICAL_SUPPORT_PREMIUMS,
        OTHER_CHILD_SUPPORT_OBLIGATIONS, MEDICAL_INSURANCE_PREMIUMS, FEES, REIMBURSEMENTS,
        MEDICAL_SUPPORT_ARREARS, CASH_CHILD_SUPPORT, HEALTH_PREMIUMS, CHILD_ARREARS,
        SPOUSAL_ARREARS, SURCHARGE, INTEREST
    ]


class OtherFields:
    PAYROLL_DEDUCTIONS="payroll_deductions"