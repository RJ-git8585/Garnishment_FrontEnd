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



class ChildSupportFields:
    PRORATE = "prorate"
    DEVIDEEQUALLY = "divide equally"