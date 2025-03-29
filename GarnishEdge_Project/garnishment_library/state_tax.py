from User_app.models import *
from rest_framework.response import Response
from rest_framework import status
from GarnishEdge_Project.garnishment_library import child_support as cs
from User_app.constants import *

class StateTaxView():
    #threshould Values
    VALUE1 = 30
    VALUE2 = 40
    VALUE3 = 53.33

    def cal_x_disposible_income(self,gross_pay,x=0.25):
        disposable_earnings = round(gross_pay, 2)
        monthly_garnishment_amount= disposable_earnings*x
        return(monthly_garnishment_amount)

    def fmv_threshold(self):
        self.threshold_30= 7.25*self.VALUE1
        self.threshold_40= 7.25*self.VALUE2
        self.threshold_53= 7.25*self.VALUE3

    def cal_arizona(self,net_pay,exemption_amount):
        return max(0, net_pay - exemption_amount)
    
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
    

    def cal_south_carolina(self,dist_code,disposable_income,gross_pay):
        if dist_code=="AGYC":
            return(self.cal_x_disposible_income(disposable_income))
        elif dist_code in ["IIT", "SAL" ,"EWG"]:
            return(self.cal_x_disposible_income(gross_pay))
        
    
    def cal_west_virginia(self,no_of_exemption_including_self,net_pay):
        if no_of_exemption_including_self==1:
            exempt_amt=self.threshold_30+0
        elif no_of_exemption_including_self>1:
            exempt_amt=self.threshold_30+25*(no_of_exemption_including_self-1)
        return net_pay-exempt_amt
    
    def cal_rhode_island(self,no_of_dependent_exemption,net_pay):
        exempt_amt=75+(no_of_dependent_exemption*25)
        return net_pay-exempt_amt
    
    
    def cal_washington(self,is_case_of_non_tax_levy,is_case_of_income_tax_levy,disposable_income):
        if is_case_of_income_tax_levy==True:
            WA=self.cal_x_disposible_income(disposable_income)
        elif is_case_of_non_tax_levy==True:
            WA=self.cal_x_disposible_income(disposable_income,1)
        else:
            WA=0
        return WA
    def cal_new_mexico(self,disposable_income):
        if disposable_income <self.threshold_40:
            return 0
        elif disposable_income > self.threshold_40 and disposable_income < self.threshold_53 :
            return disposable_income - self.threshold_40
        elif disposable_income > self.threshold_40 and disposable_income > self.threshold_53:
            return self.cal_x_disposible_income(disposable_income)
        
    def calculate(self,record):
        try:
            self.fmv_threshold()
            gross_pay = record.get(EmployeeFields.GROSS_PAY)
            disposable_income = cs.ChildSupport().calculate_de(record)
            debt = record.get(EmployeeFields.DEBT)
            state = record.get(EmployeeFields.WORK_STATE).lower()
            net_pay = record.get(CalculationFields.NET_PAY)
            payroll_taxes=record.get(PayrollTaxesFields.PAYROLL_TAXES)
            medical_insurance = payroll_taxes.get(CalculationFields.MEDICAL_INSURANCE)
            exemption_amount = record.get(EmployeeFields.EXEMPTION_AMOUNT) 
            dist_code =record.get(EmployeeFields.DIST_CODE)
            no_of_exemption_including_self=record.get(EmployeeFields.NO_OF_EXEMPTION_INCLUDING_SELF)
            no_of_dependent_exemption=record.get(EmployeeFields.NO_OF_DEPENDENT_EXEMPTION)
            is_case_of_non_tax_levy=record.get(EmployeeFields.IS_CASE_OF_NON_TAX_LEVY)
            is_case_of_income_tax_levy=record.get(EmployeeFields.IS_CASE_OF_INCOME_TAX_LEVY)
            
            #dict of formula based to state 
            state_formulas = {
            "arizona": self.cal_arizona(net_pay,exemption_amount),
            "idaho": net_pay  ,
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
            "west virginia" or "westvirginia": self.cal_west_virginia(no_of_exemption_including_self,net_pay),
            "nebraska":net_pay-exemption_amount,
            "wisconsin":self.cal_x_disposible_income(gross_pay),
            "Washington": self.cal_washington(is_case_of_non_tax_levy,is_case_of_income_tax_levy,disposable_income),
            "south carolina":self.cal_south_carolina(dist_code,disposable_income,gross_pay),
            "rhode island" or "rhodeisland":self.cal_rhode_island(no_of_dependent_exemption,net_pay),
            "missouri":self.cal_x_disposible_income(disposable_income),
            "new mexico" or "newmexico":self.cal_new_mexico(disposable_income)

            }
            result= state_formulas.get(state, "state not found")
            if result == "state not found":
                twenty_five_percentage_grp_state = ['arkansas','delaware','oregon','utah','california','montana','hawaii','colorado','connecticut','louisiana','mississippi']
                if state in twenty_five_percentage_grp_state:
                    result = self.cal_x_disposible_income(disposable_income)
                elif state in ['alabama','iowa']:
                    result = self.cal_x_disposible_income(gross_pay)
                    
            return result
        
        except Exception as e:
            return Response(
                {
                    "error": str(e),
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
                }
            )


   
# record={
#     "batch_id": "B001A",
#     "cases": [
#         {
#             "ee_id": "EE005138",
#             "work_state": "Washington",
#             "no_of_exemption_including_self": 1.0,
#             "pay_period": "Weekly",
#             "filing_status": "single",
#             "wages": 600,
#             "commission_and_bonus": 0,
#             "non_accountable_allowances": 0,
#             "gross_pay": 600,
#             "debt":230,
#             "exemption_amount": 0,
#             "is_case_of_non_tax_levy":True,
#             "is_case_of_income_tax_levy":False,
#             "payroll_taxes": {
#                 "federal_income_tax": 50,
#                 "social_security_tax": 14,
#                 "medicare_tax": 0,
#                 "state_tax": 20,
#                 "local_tax": 0,
#                 "union_dues": 0,
#                 "wilmington_tax": 0,
#                 "medical_insurance_pretax": 0,
#                 "industrial_insurance": 0,
#                 "life_insurance": 0,
#                 "CaliforniaSDI": 0
#             },
#             "payroll_deductions": {
#                 "medical_insurance": 0
#             },
#             "net_pay": 516,
#             "age": 50.0,
#             "is_blind": False,
#             "is_spouse_blind": False,
#             "spouse_age": 43.0,
#             "support_second_family": "Yes",
#             "no_of_student_default_loan": 1.0,
#             "arrears_greater_than_12_weeks": "Yes",
#             "no_of_dependent_exemption":1,
#             "garnishment_data": [
#                 {
#                     "type": "state tax levy",
#                     "data": [
#                         {
#                             "case_id": "C24373",
#                             "ordered_amount": 0,
#                             "arrear_amount": 0,
#                             "current_medical_support": 0.0,
#                             "past_due_medical_support": 0.0,
#                             "current_spousal_support": 0.0,
#                             "past_due_spousal_support": 0.0
#                         },
#                         {
#                             "case_id": "C24374",
#                             "ordered_amount": 0,
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
#     ]
# }
# print("Disposible Earning",cs.ChildSupport().calculate_de(record))
# print("WithHoulding Amount",StateTaxView().calculate(record))
