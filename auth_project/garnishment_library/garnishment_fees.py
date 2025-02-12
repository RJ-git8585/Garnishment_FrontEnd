from User_app.models import *
from User_app.serializers import *

class gar_fees_rules_engine():
    def __init__(self):
        
        # Mapping rule names to their corresponding methods
        self.rule_map = {f'Rule_{i}': getattr(self, f'Rule_{i}') for i in range(1, 27)}
    
    def get_serialized_data(self):
        data = garnishment_fees.objects.all()
        serializer = garnishment_fees_serializer(data, many=True)
        return serializer.data
    
    def calculate_rule(self,withhold_amt, percentage, min_value=0):
        return max(min_value, 0 if withhold_amt == 0 else withhold_amt * percentage)

    def find_rule(self,record):
        state=record.get("state").lower()
        gar_type = record.get("garnishment_data")[0]
        type=gar_type.get('type').lower()
        pay_period=record.get('pay_period').lower()
        data = garnishment_fees.objects.all()
        serializer = garnishment_fees_serializer(data, many=True)

        for item in serializer.data:
            if (item["state"].strip().lower() == state.strip().lower() and
                item["pay_period"].strip().lower() == pay_period.strip().lower() and
                item["type"].strip().lower() == type.strip().lower()):
                return (item["rules"])
            
    def get_payable_name(self,rule_name):
        rules_data=self.get_serialized_data()
        for item in rules_data:
            if (item["rules"].title() == rule_name):
                return (item["payable_by"])

    def Rule_1(self,record,withhold_amt):
        state=record.get("state").lower()
        gar_type = record.get("garnishment_data")[0]
        type=gar_type.get('type').lower()
        pay_period=record.get('pay_period').lower()
        rules_data=self.get_serialized_data()

        for item in rules_data:
            if (item["state"].strip().lower() == state.strip().lower() and
                item["pay_period"].strip().lower() == pay_period.strip().lower() and
                item["type"].strip().lower() == type.strip().lower()):
                return (item["amount"])
            
    def Rule_2(self,record,withhold_amt):
        return ("No Provision")
    
    def Rule_3(self,record,withhold_amt):
        state=record.get("state").strip().lower()
        gar_type = record.get("garnishment_data")[0]
        type=gar_type.get('type').strip().lower()
        pay_period=record.get('pay_period').strip().lower()
        rules_data=self.get_serialized_data()
        for item in rules_data:
            if (item["state"].strip().lower() == state and
                item["pay_period"].strip().lower() == pay_period and
                item["type"].strip().lower() == type):

                gar_fees = 0  # Default value

                if type == "State Tax Levy":
                    withhold_amt *= 0.10
                    gar_fees = withhold_amt if withhold_amt < 50 else 0

                elif type == "Creditor Debt":
                    withhold_amt *= 0.10
                    max_gar_fees = max(50, withhold_amt)
                    gar_fees = max_gar_fees if max_gar_fees < 100 else 0

                return gar_fees
            



    def Rule_4(self, record, withhold_amt):
        return f"${self.calculate_rule(withhold_amt, 0.020)} and {self.get_payable_name('Rule_4')}"
    
    def Rule_5(self, record, withhold_amt):
        return f"${self.calculate_rule(withhold_amt, 0.030, 12)} and {self.get_payable_name('Rule_5')}"

    def Rule_6(self, record, withhold_amt):
        return f"${self.calculate_rule(withhold_amt, 0.020, 8)} and {self.get_payable_name('Rule_6')}"
    
    def Rule_7(self, record, withhold_amt):
        return f"${self.calculate_rule(withhold_amt, 0.010, 2)} and {self.get_payable_name('Rule_7')}"
    
    def Rule_8(self, record, withhold_amt):
        return "Income submitted by electronic means: $1 each payment,but not to exceed $2 per month. Income submitted by other means: $2 each payment, but not to exceed $4 per month"
    
    def Rule_9(self, record, withhold_amt):
        return f"5% of amount deducted from creditor funds"
    
    def Rule_10(self, record, withhold_amt):
        return "Court will award you cost"
    
    def Rule_11(self, record, withhold_amt):
        return "Rule 11 is not defined"
    
    def Rule_12(self, record, withhold_amt):
        return "$2 for each deduction taken after the levy has expired or is released"
    
    def Rule_13(self, record, withhold_amt):
        return f'{withhold_amt*0.02} and {self.get_payable_name("Rule_13")}'
    
    def Rule_14(self, record, withhold_amt):
        return f'{withhold_amt*0.02} and {self.get_payable_name("Rule_14")}'
    
    def Rule_15(self, record, withhold_amt):
        return f'$5 from landlord amount'
    
    def Rule_16(self, record, withhold_amt):
        return f'$5 for each garnishment served'
    
    def Rule_17(self, record, withhold_amt):
        return f'$15 paid by creditor'
    
    def Rule_18(self, record, withhold_amt):
        return f"${self.calculate_rule(withhold_amt, 0.050, 5)} and {self.get_payable_name('Rule_18')}"

    def Rule_19(self, record, withhold_amt):
        return "may deduct $5.00 for state employees"
    
    def Rule_20(self, record, withhold_amt):
        return "$10.00 per month under state or federal wage attachments (i.e. student loans)"
    
    def Rule_21(self, record, withhold_amt):
        return "$10 for single garnishment and $25 for continuing garnishment, paid by the creditor"
    
    def Rule_22(self, record, withhold_amt):
        return "$10 or $50 paid by creditor"
    
    
    def Rule_23(self, record, withhold_amt):
        return "One-time fee of $10 for creditor debts & $20 for the court debt collection of fines & costs"

    def Rule_24(self, record, withhold_amt):
        return "One time fee of $25 deducted from employee earnings" 

    def Rule_25(self, record, withhold_amt):
        return "$15 is paid by creditor at the time of Writ is served" 
    
    def Rule_26(self, record, withhold_amt):
        return f"{self.calculate_rule(withhold_amt, 0.030, 12)} and {self.get_payable_name('Rule_26')}"

    def apply_rule(self, record,withhold_amt):
        rule_name=self.find_rule(record)
        """Dynamically applies the rule based on the rule name"""
        if rule_name in self.rule_map:
            return self.rule_map[rule_name](record,withhold_amt)
        else:
            raise ValueError(f"Rule '{rule_name}' is not defined.")


# record={
#                 "ee_id": "EE005114",
#                 "gross_pay": 1000.0,
#                 "state": "Alabama",
#                 "no_of_exemption_for_self": 2,
#                 "pay_period": "Weekly",
#                 "filing_status": "single_filing_status",
#                 "net_pay": 858.8,
#                 "payroll_taxes": [
#                     {
#                         "federal_income_tax": 80.0
#                     },
#                     {
#                         "social_security_tax": 49.6
#                     },
#                     {
#                         "medicare_tax": 11.6
#                     },
#                     {
#                         "state_tax": 0.0
#                     },
#                     {
#                         "local_tax": 0.0
#                     }
#                 ],
#                 "payroll_deductions": {
#                     "medical_insurance": 0.0
#                 },
#                 "age": 50,
#                 "is_blind": True,
#                 "is_spouse_blind": True,
#                 "spouse_age": 39,
#                 "support_second_family": "Yes",
#                 "no_of_student_default_loan": 2,
#                 "arrears_greater_than_12_weeks": "No",
#                 "garnishment_data": [
#                     {
#                         "type": "Child Support" ,
#                         "data": [
#                             {
#                                 "case_id": "C13278",
#                                 "amount": 200.0,
#                                 "arrear": 0
#                             }
#                         ]
#                     }
#                 ]
#             }



# print(gar_fees_rules_engine().apply_rule(record,0))



