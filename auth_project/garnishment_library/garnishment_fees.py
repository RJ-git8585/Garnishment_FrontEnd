from User_app.models import *
from User_app.serializers import *

class gar_fees_rules_engine():
    def __init__(self):
        
        # Mapping rule names to their corresponding methods
        self.rule_map = {f'Rule_{i}': getattr(self, f'Rule_{i}') for i in range(1, 7)}
    
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

                if type == "state tax":
                    withhold_amt *= 0.10
                    gar_fees = withhold_amt if withhold_amt < 50 else 0

                elif type == "creditor":
                    withhold_amt *= 0.10
                    max_gar_fees = max(50, withhold_amt)
                    gar_fees = max_gar_fees if max_gar_fees < 100 else 0

                return gar_fees
            

    def Rule_4(self, record, withhold_amt):
        return self.calculate_rule(withhold_amt, 0.020)
    
    def Rule_5(self, record, withhold_amt):
        return self.calculate_rule(withhold_amt, 0.030, 12)
    
    def Rule_6(self, record, withhold_amt):
        return self.calculate_rule(withhold_amt, 0.020, 8)
    
    def Rule_7(self, record, withhold_amt):
        return self.calculate_rule(withhold_amt, 0.025, 10)
        

    def apply_rule(self, record,withhold_amt):
        rule_name=self.find_rule(record)
        """Dynamically applies the rule based on the rule name"""
        if rule_name in self.rule_map:
            return self.rule_map[rule_name](record,withhold_amt)
        else:
            raise ValueError(f"Rule '{rule_name}' is not defined.")


record={
                "ee_id": "EE005114",
                "gross_pay": 1000.0,
                "state": "Alabama",
                "no_of_exemption_for_self": 2,
                "pay_period": "Weekly",
                "filing_status": "single_filing_status",
                "net_pay": 858.8,
                "payroll_taxes": [
                    {
                        "federal_income_tax": 80.0
                    },
                    {
                        "social_security_tax": 49.6
                    },
                    {
                        "medicare_tax": 11.6
                    },
                    {
                        "state_tax": 0.0
                    },
                    {
                        "local_tax": 0.0
                    }
                ],
                "payroll_deductions": {
                    "medical_insurance": 0.0
                },
                "age": 50,
                "is_blind": True,
                "is_spouse_blind": True,
                "spouse_age": 39,
                "support_second_family": "Yes",
                "no_of_student_default_loan": 2,
                "arrears_greater_than_12_weeks": "No",
                "garnishment_data": [
                    {
                        "type": "Child Support" ,
                        "data": [
                            {
                                "case_id": "C13278",
                                "amount": 200.0,
                                "arrear": 0
                            }
                        ]
                    }
                ]
            }



print(gar_fees_rules_engine().apply_rule(record,0))



