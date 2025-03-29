from User_app.models import *
from User_app.serializers import *
from GarnishEdge_Project.garnishment_library import gar_resused_classes as gc
from User_app.constants import *
import os
import json 
from django.conf import settings

class ChildSupport:
    """
    This class contains utility functions to calculate various child support-related amounts.
    """
    PRORATE = "prorate"
    DEVIDEEQUALLY = "divide equally"
    CHILDSUPPORT = "child_support"
    
    def __init__(self):
        self.de_rules_file  = os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/child support tables/disposable earning rules.json')

    def _load_json_file(self, file_path):
        """
        Helper method to load a JSON file.
        """
        try:
            with open(file_path, 'r') as file:
                # Load and return the JSON data in one step
                data = json.load(file) 

                return data  
            
            
        except FileNotFoundError:
            raise Exception(f"File not found: {file_path}")
        except json.JSONDecodeError:
            raise Exception(f"Invalid JSON format in file: {file_path}")

    def calculate_deduction_rules(self, work_state):
        """
        Calculate the Disposable Earnings (DE) rule based on the state.
        """
        if not work_state:
            raise ValueError("State information is missing in the record.")

        data = self._load_json_file(self.de_rules_file)
        de_rules = data.get("de", [])

        # Find matching state in DE rules
        for rule in de_rules:
            if rule['State'].lower() == work_state.lower():
                return rule['taxes_deduction']
            
                

        raise ValueError(f"No DE rule found for state: {work_state}")
    
    def get_mapping_keys(self,work_state):
        """
        Get the Mapping keys of tax.
        """
        keys = self.calculate_deduction_rules(work_state)

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
        work_state = record.get(EmployeeFields.WORK_STATE).lower()
        payroll_taxes = record.get(PayrollTaxesFields.PAYROLL_TAXES)


        if gross_pay is None or work_state is None or payroll_taxes is None:
            raise ValueError("Record must include 'gross_pay', 'work_state', and 'taxs' fields.")

        de_rule = self.get_mapping_keys(work_state)

        # Calculate mandatory deductions
        tax_amt = [payroll_taxes[key] for key in de_rule]
        mandatory_deductions = sum(tax_amt)
        return mandatory_deductions
    
    def calculate_gross_pay(self, record):
        """
        Calculate the gross pay based on the record.
        """
        Wages=record.get("wages")
        commission_and_bonus=record.get("commission_and_bonus")
        non_accountable_allowances=record.get("non_accountable_allowances")
        return Wages+commission_and_bonus+non_accountable_allowances


    def calculate_de(self,record):
        gross_pay = self.calculate_gross_pay(record) 
        mandatory_deductions=self.calculate_md(record)
        # Calculate disposable earnings
        return gross_pay - mandatory_deductions
    

    
    def get_list_supportAmt(self, record):
        child_support_data = record["garnishment_data"][0]["data"]
        return [
            value 
            for Amt_dict in child_support_data
            for key, value in Amt_dict.items() 
            if key.lower().startswith(CalculationFields.ORDERED_AMOUNT)
        ]

    def get_list_support_arrearAmt(self, record):
        child_support_data = record["garnishment_data"][0]["data"]

        return [
            value
            for Amt_dict in child_support_data
            for key, value in Amt_dict.items() 
            if key.lower().startswith(CalculationFields.ARREAR_AMOUNT)
        ]


    def calculate_wl(self, record):

        # Extract necessary values from the record
        work_state = record.get(EmployeeFields.WORK_STATE)
        employee_id = record.get(EmployeeFields.EMPLOYEE_ID)
        supports_2nd_family = record.get(EmployeeFields.SUPPORT_SECOND_FAMILY)
        arrears_of_more_than_12_weeks = record.get(EmployeeFields.ARREARS_GREATER_THAN_12_WEEKS)

        # Determine the state rules
        state_rules = gc.WLIdentifier().get_state_rules(work_state)
        calculate_tcsa = len(self.get_list_supportAmt(record))
       
        # Calculate Disposable Earnings (DE)
        de = self.calculate_de(record)

        # Determine if DE > 145 and if there is more than one order
        de_gt_145 = "No" if de <= 145 or state_rules != "Rule_6" else "Yes"

        #Determine arrears_of_more_than_12_weeks
        arrears_of_more_than_12_weeks = "" if state_rules == "Rule_4" else "Yes"

        #Determine order_gt_one
        order_gt_one = "No" if calculate_tcsa > 1 or state_rules != "Rule_4" else "Yes"
        
        # Identify withholding limit using state rules
        wl_limit = gc.WLIdentifier().find_wl_value(work_state, employee_id, supports_2nd_family, arrears_of_more_than_12_weeks, de_gt_145, order_gt_one)
        return wl_limit

    def calculate_twa(self, record):
        
        tcsa = self.get_list_supportAmt(record)
        taa = self.get_list_support_arrearAmt(record)
        return sum(tcsa) + sum(taa)

    def calculate_ade(self, record):
        wl = self.calculate_wl(record)
        de = self.calculate_de(record)
        return wl * de
    
    def get_priority_order_according_to_state(self, record):
        state = record.get(EmployeeFields.WORK_STATE)
        de_rules_file  = os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/child support tables/priority_order_for_withholding_amt.json')
        data = self._load_json_file(de_rules_file)
        for record in data["data"]:
            if record['State'].lower() == state.lower():
                print("Priority Order",record['Priority of Withholding'])
                return record['Priority of Withholding']  


    def calculate_wa(self, record):
        tcsa = self.get_list_supportAmt(record)
        ade = self.calculate_ade(record)
        return min(ade, sum(tcsa))

    def calculate_each_child_support_amt(self, record):

        tcsa = self.get_list_supportAmt(record)
        return {f"child support amount{i+1}": amount for i, amount in enumerate(tcsa)}

    def calculate_each_arrears_amt(self, record):

        taa = self.get_list_support_arrearAmt(record)
        return {f"arrear amount{i+1}": amount for i, amount in enumerate(taa)}

class SingleChild(ChildSupport):
    def calculate(self, record):
        # Extract values from the record
        child_support_amount = self.get_list_supportAmt(record)[0]
        arrear_amount = self.get_list_support_arrearAmt(record)[0]

        # Calculate Adjusted Disposable Earnings (ADE) using a helper function
        ade = self.calculate_ade(record)
        # Determine the withholding amount and remaining arrear amount
        if ade > child_support_amount:
            # ADE is sufficient to cover the child support amount
            withholding_amount = child_support_amount
            amount_left_for_arrears = ade - child_support_amount

            if amount_left_for_arrears >= arrear_amount:
                # Remaining ADE can cover the arrear amount
                arrear_amount = arrear_amount
            else:
                # Remaining ADE is not sufficient to cover the arrear amount
                arrear_amount = amount_left_for_arrears
        else:
            # ADE is not sufficient to cover the child support amount
            withholding_amount = ade
            arrear_amount = 0
        calculate_gross_pay=self.calculate_gross_pay(record)
        result_amt={"child support amount1": 0 if calculate_gross_pay==0 else round(withholding_amount,2)}
        arrear_amt={"arrear amount1":0 if calculate_gross_pay==0 else round(arrear_amount,2)}
        return result_amt,arrear_amt
    


class MultipleChild(ChildSupport):
    """
    This class calculates the child support amounts and arrear amounts for multiple child support orders.
    """

    def calculate(self, record):

        # Extract necessary values and calculate required metrics
        ade = self.calculate_ade(record)
        tcsa = self.get_list_supportAmt(record)
        taa = self.get_list_support_arrearAmt(record)
        twa = self.calculate_twa(record)
        wa = self.calculate_wa(record)
        work_state = record.get(EmployeeFields.WORK_STATE)

        # Determine the allocation method for garnishment based on the state
        allocation_method_for_garnishment = gc.AllocationMethodIdentifiers(work_state).get_allocation_method()


        if ade > twa:
            # ADE is sufficient to cover the total withholding amount (TWA)
            child_support_amount = self.calculate_each_child_support_amt(record)
            arrear_amount = self.calculate_each_arrears_amt(record)
            
        else:
            # Apply the allocation method for garnishment
            if allocation_method_for_garnishment == self.PRORATE:
                child_support_amount = {
                    f"child support amount{i+1}": round((amount / twa) * ade,2) for i, amount in enumerate(tcsa)
                }
                
                amount_left_for_arrears = wa - sum(tcsa)
                if amount_left_for_arrears <= 0:
                    arrear_amount = {f"arrear amount{i+1}": 0 for i, _ in enumerate(taa)}
                else:
                    if amount_left_for_arrears >=taa:
                        arrear_amount={f"arrear amount{i+1}": round((amount/taa)*amount_left_for_arrears,2) for i, amount in enumerate(taa)}
                    else:
                        arrear_amount=self.calculate_each_arrears_amt(record)
            
            elif allocation_method_for_garnishment == self.DEVIDEEQUALLY:
                calculate_gross_pay=self.calculate_gross_pay(record)
                child_support_amount = {
                    f"child support amount{i+1}": 0 if calculate_gross_pay==0 else round(ade / len(tcsa),2) for i, _ in enumerate(tcsa)
                }
                print("child_support_amount1111",child_support_amount)
                
                amount_left_for_arrears = ade - sum(tcsa)
                if amount_left_for_arrears <= 0:
                    arrear_amount = {f"arrear amount {i+1}": 0 for i, _ in enumerate(taa)}
                else:
                    if amount_left_for_arrears >=taa:
                        arrear_amount=self.calculate_each_arrears_amt(record)                       
                    else:
                        arrear_amount={f"arrear amount{i+1}": 0 if calculate_gross_pay==0 else round(amount/len(taa),2) for i, amount in enumerate(taa)}
            else:
                raise ValueError("Invalid allocation method for garnishment.")


        return child_support_amount, arrear_amount
    
# record=       {
#       "ee_id": "EE005143",
#       "work_state": "Alabama",
#       "no_of_exemption_including_self": 1,
#       "pay_period": "Weekly",
#       "filing_status": "married_filling_joint",
#       "wages": 2549,
#       "commission_and_bonus": 0,
#       "non_accountable_allowances": 0,
#       "gross_pay": 2549,
#       "payroll_taxes": {
#         "federal_income_tax": 140,
#         "social_security_tax": 73,
#         "medicare_tax": 15.32,
#         "state_tax": 33,
#         "local_tax": 5,
#         "union_dues": 0,
#         "wilmington_tax": 0,
#         "medical_insurance_pretax": 0,
#         "industrial_insurance": 0,
#         "life_insurance": 0,
#         "CaliforniaSDI": 0
#       },
#       "payroll_deductions": {
#         "medical_insurance": 0
#       },
#       "net_pay": 2282.68,
#       "age": 48,
#       "is_blind": False,
#       "is_spouse_blind": False,
#       "spouse_age": 45,
#       "support_second_family": "Yes",
#       "no_of_student_default_loan": 0,
#       "arrears_greater_than_12_weeks": "No",
#       "garnishment_data": [
#         {
#           "type": "Child Support",
#           "data": [
#             {
#               "case_id": "C24383",
#               "ordered_amount": 85,
#               "arrear_amount": 0,
#               "current_medical_support": 0,
#               "past_due_medical_support": 0,
#               "current_spousal_support": 0,
#               "past_due_spousal_support": 0
#             },
#             {
#               "case_id": "C24384",
#               "ordered_amount": 70,
#               "arrear_amount": 0,
#               "current_medical_support": 0,
#               "past_due_medical_support": 0,
#               "current_spousal_support": 0,
#               "past_due_spousal_support": 0
#             }
#           ]
#         }
#       ]
#     }
# # print("DE",ChildSupport().calculate_deduction_rules("alabama"))


# tcsa = ChildSupport().get_list_supportAmt(record)
# print("tcsa",tcsa)
# print("result",list(MultipleChild().calculate(record) if len(tcsa) > 1 else SingleChild().calculate(record)))


# print("tcsqqa",ChildSupport().get_list_supportAmt(record))

# print("ade", ChildSupport().calculate_ade(record))
# print("calculate_amount_ordered_to_be_withheld",ChildSupport().calculate_amount_ordered_to_be_withheld(record))

# print("Priority Order",ChildSupport().get_priority_order_according_to_state(record))

# print("Calculate Amount Left",ChildSupport().calculate_amount_left(record))




