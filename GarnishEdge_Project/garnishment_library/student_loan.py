from requests import Response
from User_app.models import *
from User_app.serializers import *
from GarnishEdge_Project.garnishment_library.child_support import ChildSupport
import os
import json 
from django.conf import settings
import json
from rest_framework import status
from User_app.constants import *
class StudentLoan():
    """ Calculate Student Loan garnishment amount based on the provided data."""

    def __init__(self):
        self.de_rules_file  = os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/child support tables/disposable earning rules.json')

    def _load_json_file(self, file_path):
        """
        Helper method to load a JSON file.
        """
        try:
            with open(file_path, 'r') as file:
                # Load and return the JSON data in one step
                data = json.load(file)  # Load the JSON data once

                return data  # Return the loaded data
        except FileNotFoundError:
            raise Exception(f"File not found: {file_path}")
        except json.JSONDecodeError:
            raise Exception(f"Invalid JSON format in file: {file_path}")

    def calculate_deduction_rules(self, record):
        """
        Calculate the Disposable Earnings (DE) rule based on the state.
        """
        work_state = record.get(EmployeeFields.WORK_STATE)
        if not work_state:
            raise ValueError("State information is missing in the record.")

        data = self._load_json_file(self.de_rules_file)
        de_rules = data.get("de", [])

        # Find matching state in DE rules
        for rule in de_rules:
            if rule['State'].lower() == work_state.lower():
                return rule['taxes_deduction']

        raise ValueError(f"No DE rule found for state: {work_state}")
    
    def get_mapping_keys(self,record):
        """
        Get the Mapping keys of tax.
        """
        keys = self.calculate_deduction_rules(record)

        data = self._load_json_file(self.de_rules_file)
        actual_keys = data.get("mapping", [])
        actual_keys_list =  [next((actual_key_dict[key] for actual_key_dict in actual_keys if key in actual_key_dict), key)
                                        for key in keys]
        return actual_keys_list
    

    def calculate_md(self, record):
        """
        Calculate mandatory deductions based on state and tax rules.
        """
        gross_pay = record.get(CalculationFields.GROSS_PAY)
        work_state = record.get(EmployeeFields.WORK_STATE)
        payroll_taxes = record.get(PayrollTaxesFields.PAYROLL_TAXES)


        if gross_pay is None or work_state is None or payroll_taxes is None:
            raise ValueError("Record must include 'gross_pay', 'work_state', and 'taxs' fields.")

        de_rule = self.get_mapping_keys(record)

        # Calculate mandatory deductions
        tax_amt = [payroll_taxes[key] for key in de_rule]
        mandatory_deductions = sum(tax_amt)
        return mandatory_deductions
    
    def calculate_gross_pay(self, record):
        """
        Calculate the gross pay based on the record.
        """
        Wages=record.get(CalculationFields.WAGES)
        commission_and_bonus=record.get(CalculationFields.COMMISSION_AND_BONUS)
        non_accountable_allowances=record.get(CalculationFields.NON_ACCOUNTABLE_ALLOWANCES)
        return Wages+commission_and_bonus+non_accountable_allowances


    def calculate_de(self,record):
        gross_pay = self.calculate_gross_pay(record) 
        mandatory_deductions=self.calculate_md(record)
        # Calculate disposable earnings
        return gross_pay - mandatory_deductions

    def get_fmw(self,record):
      pay_period=record.get(EmployeeFields.PAY_PERIOD)
      if pay_period.lower()==PayPeriodFields.WEEKLY:
        return 7.25*30
      elif pay_period.lower()==PayPeriodFields.BI_WEEKLY:
        return 7.25*60
      elif pay_period.lower()==PayPeriodFields.SEMI_MONTHLY:
        return 7.25*65
      elif pay_period.lower()==PayPeriodFields.MONTHLY:
        return 7.25*130

    def get_single_student_amount(self, record):
        # Calculate disposable earnings
        disposable_earning = self.calculate_de(record)

        # Calculate percentages earnings
        fifteen_percent_of_earning = disposable_earning *.15
        twentyfive_percent_of_earning =disposable_earning*.25

        fmw =self.get_fmw(record)
        difference_of_de_and_fmw=disposable_earning-fmw
        
        if  fmw>=disposable_earning:
            loan_amt = "Student loan withholding cannot be applied because Disposable Earnings are less than or equal to $217.5, the exempt amount."
        elif fmw<disposable_earning:
            loan_amt=min(fifteen_percent_of_earning,twentyfive_percent_of_earning,difference_of_de_and_fmw)
        elif difference_of_de_and_fmw<0:
            loan_amt = 0
        
        if isinstance(loan_amt, (float,int)):
            loan_amt=round(loan_amt,2)
        else:
            loan_amt=loan_amt
        

        return ({"student_loan_amt":loan_amt})
    

    def get_multiple_student_amount(self, record):

        fmw = self.get_fmw(record)
        disposable_earning = self.calculate_de(record)

        difference_of_de_and_fmw = disposable_earning - fmw


        if fmw >= disposable_earning:
            student_loan_amt1 = "Student loan withholding cannot be applied because Disposable Earnings are less than or equal to $217.5, the exempt amount."
            student_loan_amt2 = "Student loan withholding cannot be applied because Disposable Earnings are less than or equal to $217.5, the exempt amount."
        elif difference_of_de_and_fmw < 0:
            student_loan_amt1 = 0
            student_loan_amt2 = 0
        elif disposable_earning > fmw:
            student_loan_amt1 = .15* disposable_earning
            student_loan_amt2 = .10* disposable_earning

        return ({"student_loan_amt1": round(student_loan_amt1,2), "student_loan_amt2": round(student_loan_amt2,2)})
    
class student_loan_calculate():
        
    def calculate(self, record):
        try:
            no_of_student_default_loan=record.get(EmployeeFields.NO_OF_STUDENT_DEFAULT_LOAN)
            if no_of_student_default_loan==1:
                student_loan_amt=StudentLoan().get_single_student_amount(record)
            elif no_of_student_default_loan>1:
                student_loan_amt=StudentLoan().get_multiple_student_amount(record)
            return student_loan_amt
        except Exception as e:
            return Response(
                {"error": str(e), "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR}
            )



# record=        {   "case_id": "C5635",
#                 "ee_id": "EE005120",
#                 "work_state": "Alabama",
#                 "no_of_exemption_for_self": 0,
#                 "pay_period": "Weekly",
#                 "filing_status": "single",
#                 "wages": 1205.0,
#                 "commission_and_bonus": 22,
#                 "non_accountable_allowances":44,
#                 "gross_pay": 1205.0,
#                 "payroll_taxes": {
#                     "federal_income_tax": 90.0,
#                     "social_security_tax": 55.8,
#                     "medicare_tax": 13.05,
#                     "state_tax": 25.0,
#                     "local_tax": 5.0
#                 },
#                 "payroll_deductions": {
#                     "medical_insurance": 50.0
#                 },
#                 "net_pay": 966.15,
#                 "age": 32,
#                 "is_blind": False,
#                 "is_spouse_blind": False,
#                 "spouse_age": 14,
#                 "support_second_family": "Yes",
#                 "no_of_student_default_loan": 2,
#                 "arrears_greater_than_12_weeks": "No",
#                 "garnishment_data": [
#                             {
#                               "type": "Federal Tax Levy",
#                               "data": [
#                                 {
#                                   "case_id": "C59615",
#                                   "amount": 0,
#                                   "arrear": 0
#                                 }
#                               ]
#                             }
#                 ]
#                 }

# # print("get_percentages:",StudentLoan().get_percentage)
# print("get_single_student_amount",StudentLoan().get_single_student_amount(record))
# print("get_multiple_student_amount",StudentLoan().get_multiple_student_amount(record))
# print("student_loan",student_loan_calculate().calculate( record ))
