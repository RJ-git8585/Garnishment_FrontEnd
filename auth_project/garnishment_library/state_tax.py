from User_app.models import *
from rest_framework.response import Response
from rest_framework import status
from auth_project.garnishment_library import child_support as cs
from User_app.constants import *


class StateTaxView():
    #threshould Values
    VALUE1 = 30
    VALUE2 = 40

    def cal_x_disposible_income(self,gross_income,x=0.25):
        disposable_earnings = round(gross_income, 2)
        monthly_garnishment_amount= disposable_earnings*x
        return(monthly_garnishment_amount)

    def fmv_threshold(self):
        self.threshold_30= 7.25*self.VALUE1
        self.threshold_40= 7.25*self.VALUE2

    def cal_arizona(self,net_income,exemption_amount):
        return max(0, net_income - exemption_amount)
    
    def cal_massachusetts(self,disposable_income):
        if self.cal_x_disposible_income(disposable_income) >= 200:
            return 0
        else :
            return self.cal_x_disposible_income(disposable_income)
    
    def cal_georgia(self,disposable_income):
        if disposable_income < self.threshold_30:
            return 0
        elif disposable_income > self.threshold_30 and  disposable_income < self.threshold_40 :
            return disposable_income - self.threshold_30
        else:
            return self.cal_x_disposible_income(disposable_income)

    def cal_maine(self,disposable_income):
        if disposable_income < 217.5:
            return 0
        else:
            return min(disposable_income - 217.5, disposable_income * 0.25)
        
    def cal_indiana(self,disposable_income):
        
        if disposable_income< self.threshold_30:
            return 0
        elif self.threshold_40 >disposable_income and disposable_income > self.threshold_30:
            return disposable_income - self.threshold_30
        else :
            return self.cal_x_disposible_income(disposable_income)

    def cal_minnesota(self,disposable_income):
        if disposable_income > self.threshold_40 :
            return min(self.cal_x_disposible_income(disposable_income),disposable_income-self.threshold_40) 
        else :
            return 0 
        
    def cal_vermont(self,disposable_income):
        if disposable_income < self.threshold_30:
            return 0
        elif self.threshold_40 >disposable_income and disposable_income > self.threshold_30 :
            return disposable_income-self.threshold_30
        else :
            return self.cal_x_disposible_income(disposable_income)
        
    def cal_newyork(self,disposable_income,gross_pay):
        return(self.cal_x_disposible_income(gross_pay,.10),self.cal_x_disposible_income(disposable_income))
    
    def cal_westvirginia(self,):
        pass

    def calculate(self,record):
        try:
            self.fmv_threshold()
            gross_pay = record.get(EmployeeFields.GROSS_PAY)
            disposable_income = cs.ChildSupport().calculate_de(record)
            debt = record.get(EmployeeFields.DEBT)
            state = record.get(EmployeeFields.WORK_STATE).lower()
            net_income = record.get(CalculationFields.NET_PAY)
            payroll_taxes=record.get(PayrollTaxesFields.PAYROLL_TAXES)
            medical_insurance = payroll_taxes.get(CalculationFields.MEDICAL_INSURANCE)
            exemption_amount = record.get(EmployeeFields.EXEMPTION_AMOUNT) 

            #dict of formula based to state 
            state_formulas = {
            "arizona": self.cal_arizona(net_income,exemption_amount),
            "idaho": net_income  ,
            "illinois" :self.cal_x_disposible_income(gross_pay,.15),
            "maryland" : self.cal_x_disposible_income(disposable_income)-medical_insurance,
            "massachusetts":self.cal_massachusetts(disposable_income),
            "kentucky" : self.cal_x_disposible_income(disposable_income),
            "georgia": self.cal_georgia(disposable_income),
            "missouri":disposable_income,
            "new jersey" or "newjersey" :self.cal_x_disposible_income(gross_pay),
            "maine" :self.cal_maine(disposable_income),
            "indiana":self.cal_indiana(disposable_income),
            "minnesota":self.cal_maine(disposable_income) ,
            "new york" or "newyork": self.cal_newyork(disposable_income,gross_pay),
            "north carolina" or "northcarolina":self.cal_x_disposible_income(gross_pay,.10),
            "pennsylvania":self.cal_x_disposible_income(disposable_income,.10),
            "vermont": self.cal_vermont(disposable_income),
            "virginia": disposable_income,
            "west virginia" or "westvirginia": disposable_income

            }
            result= state_formulas.get(state, "state not found")

            if result == "state not found":
                twenty_five_percentage_grp_state = ['arkansas','oregon','california','montana','hawaii','colorado','connecticut','louisiana','mississippi']
                if state in twenty_five_percentage_grp_state:
                    result = self.cal_x_disposible_income(disposable_income)
                elif state in ['alabama']:
                    result = self.cal_x_disposible_income(gross_pay)
            # duration_of_levies = round((debt / monthly_garnishment_amount),2)
            return result

        except Exception as e:
            return Response(
                {
                    "error": str(e),
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
                }
            )

   
# record={
#             "ee_id": "EE005138",
#             "work_state": "indiana",
#             "no_of_exemption_including_self": 1.0,
#             "pay_period": "Weekly",
#             "filing_status": "single",
#             "wages": 500,
#             "commission_and_bonus": 50,
#             "non_accountable_allowances": 100,
#             "gross_pay": 600,
#             "debt":450,
#             "exemption_amount": 156,
#             "payroll_taxes": {
#                 "federal_income_tax": 67,
#                 "social_security_tax": 51,
#                 "medicare_tax": 35,
#                 "state_tax": 221,
#                 "local_tax": 0,
#                 "union_dues": 0,
#                 "wilmington_tax": 0,
#                 "medical_insurance_pretax": 17,
#                 "industrial_insurance": 0,
#                 "life_insurance": 0,
#                 "CaliforniaSDI": 0
#             },
#             "payroll_deductions": {
#                 "medical_insurance": 0
#             },
#             "net_pay": 1025,
#             "age": 50.0,
#             "is_blind": False,
#             "is_spouse_blind": False,
#             "spouse_age": 43.0,
#             "support_second_family": "Yes",
#             "no_of_student_default_loan": 1.0,
#             "arrears_greater_than_12_weeks": "Yes",
#             "garnishment_data": [
#                 {
#                     "type": "state tax levy",
#                     "data": [
#                         {
#                             "case_id": "C24373",
#                             "ordered_amount": 80,
#                             "arrear_amount": 10,
#                             "current_medical_support": 0.0,
#                             "past_due_medical_support": 0.0,
#                             "current_spousal_support": 0.0,
#                             "past_due_spousal_support": 0.0
#                         },
#                         {
#                             "case_id": "C24374",
#                             "ordered_amount": 55,
#                             "arrear_amount": 0,
#                             "current_medical_support": 0.0,
#                             "past_due_medical_support": 0.0,
#                             "current_spousal_support": 0.0,
#                             "past_due_spousal_support": 0.0
#                         }
#                     ]
#                 }
#             ]
#         }
# print("Disposible Earning",cs.ChildSupport().calculate_de(record))
# print("WithHoulding Amount",StateTaxView().calculate(record))