import json
import os
from django.contrib.staticfiles import finders
from django.conf import settings 
from User_app.constants import *

class DisposableIncomeCalculator:
    def __init__(self, x=0.25):
        self.x = x

    def calculate(self, gross_income):
        disposable_earnings = round(gross_income, 2)
        monthly_garnishment_amount = disposable_earnings * self.x
        return monthly_garnishment_amount

class AllocationMethodIdentifiers:


    def __init__(self, work_state):
        self.work_state = work_state.lower()  

    def get_allocation_method(self):

        file_path = os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/child support tables/withholding_rules.json')


        # Reading the JSON file
        with open(file_path, 'r') as file:
            data = json.load(file)
        # Accessing child support data
        child_support_data = data.get("WithholdingRules", [])
        
        # Searching for the matching state
        for record in child_support_data:
            if record['State'].lower() == self.work_state:
                return record['AllocationMethod'].lower()
        
        # If no matching record is found
        return f"No allocation method found for the state: {self.work_state.capitalize()}."
    


class CalculateAmountToWithhold:


    def __init__(self, allowed_amount_for_garnishment, amount_to_withhold,allocation_method_for_garnishment,number_of_child_support_order):
        self.allowed_amount_for_garnishment = allowed_amount_for_garnishment
        self.amount_to_withhold = amount_to_withhold
        self.allocation_method_for_garnishment = allocation_method_for_garnishment
        self.number_of_child_support_order = number_of_child_support_order

    def calculate(self, amount_to_withhold_child):
        if (self.allowed_amount_for_garnishment - self.amount_to_withhold) >= 0:
            return amount_to_withhold_child
        elif self.allocation_method_for_garnishment == ChildSupportFields.PRORATE:
            ratio = amount_to_withhold_child / self.amount_to_withhold
            return self.allowed_amount_for_garnishment * ratio
        elif amount_to_withhold_child > 0:
            return self.allowed_amount_for_garnishment / self.number_of_child_support_order
        else:
            return 0


class CalculateArrearAmountForChild:
    def __init__(self, amount_left_for_arrears, allowed_child_support_arrear,allocation_method_for_arrears,number_of_arrear):
        self.amount_left_for_arrears = amount_left_for_arrears
        self.allowed_child_support_arrear = allowed_child_support_arrear
        self.allocation_method_for_arrears = allocation_method_for_arrears
        self.number_of_arrear = number_of_arrear

    def calculate(self, arrears_amt_Child):
        if (self.amount_left_for_arrears - self.allowed_child_support_arrear) >= 0:
            return arrears_amt_Child
        elif self.allocation_method_for_arrears == ChildSupportFields.PRORATE:
            ratio = arrears_amt_Child / self.allowed_child_support_arrear
            return self.amount_left_for_arrears * ratio
        elif self.amount_left_for_arrears > 0:
            return self.amount_left_for_arrears / self.number_of_arrear
        else:
            return 0        

class WLIdentifier:
    def get_state_rules(self, work_state):
        file_path = os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/child support tables/withholding_rules.json')

        # Reading the JSON file
        with open(file_path, 'r') as file:
            data = json.load(file)
        
        # Accessing child support data
        ccpa_rules_data = data.get("WithholdingRules", [])
        
        # Searching for the matching state
        for record in ccpa_rules_data:
            if record['State'].lower() == work_state.lower():
                return record['Rule']  

        # If no matching record is found
        return f"No allocation method found for the state: {work_state.capitalize()}." 

    def find_wl_value(self,work_state, employee_id, supports_2nd_family, arrears_of_more_than_12_weeks, de_gt_145, order_gt_one):
        file_path = os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/child support tables/withholding_limits.json')
        state_rule = self.get_state_rules(work_state)

        # Reading the JSON file
        with open(file_path, 'r') as file:
            data = json.load(file)
        
        # Accessing child support data
        ccpa_limits_data = data.get("Rules", [])
        for rule in ccpa_limits_data:
            if rule["Rule"] == state_rule:
                for detail in rule["Details"]:
                    if ((detail["Supports_2nd_family"] == "" and detail["Arrears_of_more_than_12_weeks"] == "") or
                        (detail["Supports_2nd_family"] == supports_2nd_family and
                         detail["Arrears_of_more_than_12_weeks"] == arrears_of_more_than_12_weeks and
                         detail["de_gt_145"] == de_gt_145 and
                         detail["order_gt_one"] == order_gt_one)):
                        result = int(detail["WL"].replace("%", "")) / 100
                        return result
        
        return f"No matching WL found for this employee: {employee_id}"

class GarnishmentFeesIdentifier:
    @staticmethod
    def calculate(record):
        work_state = record.get(EmployeeFields.WORK_STATE).lower()
        pay_period = record.get(EmployeeFields.PAY_PERIOD).lower()

        gar_type = record.get("garnishment_data")[0]
        garnishment_type = gar_type.get(EmployeeFields.GARNISHMENT_TYPE).replace('_', ' ').title() 

        file_path = os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/child support tables/garnishment_fees.json')

        with open(file_path, 'r') as file:
            data = json.load(file) 

        # Search for matching rule
        for rule in data.get("fees", []):
            if (
                rule.get("State", "").lower() == work_state
                and rule.get("Type") == garnishment_type
                and rule.get("Pay Period") == pay_period
            ):
                return rule.get("Amount")
        
        return None
                

    
def change_record_case(record):
    new_record = {}
    for key, value in record.items():
        new_key = key.replace(' ', '_').lower()
        new_record[new_key] = value
    return new_record
