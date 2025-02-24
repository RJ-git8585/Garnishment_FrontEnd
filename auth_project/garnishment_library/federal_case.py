from User_app.models import *
from User_app.serializers import *
import json
import os
from auth_project import settings
import re
from User_app.constants import *


class federal_tax_calculation():
    """ Calculate Federal Tax based on the given filing status and number of exceptions """

    def get_file_data(self, file_path):
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data

    def get_total_exemption_self(self, request):
      age = request.get(EmployeeFields.AGE)
        
      is_blind = request.get(EmployeeFields.IS_BLIND)
      number_of_exemption = 0

      if (age>=65 and is_blind==True) :
          number_of_exemption=2
      elif (age<65 and is_blind==True) :
          number_of_exemption=1
      elif(age>=65 and is_blind==False) :
          number_of_exemption=1
      return number_of_exemption

    def get_total_exemption_dependent(self, request):  

      is_spouse_blind= request.get(EmployeeFields.IS_SPOUSE_BLIND)
      spouse_age = request.get(EmployeeFields.SPOUSE_AGE)
      number_of_exemption = 0
      if (spouse_age>=65 and is_spouse_blind==True) :
          number_of_exemption=2
      elif (spouse_age<65 and is_spouse_blind==True):
          number_of_exemption=1
      elif(spouse_age>=65 and is_spouse_blind==False):
          number_of_exemption=1
      return number_of_exemption  




    def get_additional_exempt_for_self(self, record):
        pay_period=record.get(EmployeeFields.PAY_PERIOD).lower()
        filing_status=record.get(EmployeeFields.FILING_STATUS)

        no_of_exemption=self.get_total_exemption_self(record)
        
        file_path=os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/federal tables/additional_exempt_amount.json')
        result = 0

        data=self.get_file_data(file_path)

        data = data["additional_exempt_amt"]
        no_of_exemption_list=[]
        for item in data:
          if item.get(EmployeeFields.NO_OF_EXEMPTION_INCLUDING_SELF) == no_of_exemption:
            no_of_exemption_list.append(item)
        single_filing_status_list=[]
        head_of_household_list=[]
        any_other_filing_status=[]
        for item in no_of_exemption_list:
          if FilingStatusFields.SINGLE == item.get(EmployeeFields.FILING_STATUS):
            single_filing_status_list.append(item)
          elif FilingStatusFields.HEAD_OF_HOUSEHOLD == item.get(EmployeeFields.FILING_STATUS):
             head_of_household_list.append(item)
          else:
              any_other_filing_status.append(item)
        if filing_status == FilingStatusFields.SINGLE:
          result = single_filing_status_list[0].get(pay_period)

        elif filing_status == FilingStatusFields.HEAD_OF_HOUSEHOLD:
          result = head_of_household_list[0].get(pay_period)

        else:
          result = any_other_filing_status[0].get(pay_period)
        return result



    def get_additional_exempt_for_dependent(self, record):
        pay_period=record.get(EmployeeFields.PAY_PERIOD).lower()
        filing_status=record.get(EmployeeFields.FILING_STATUS)
        no_of_exemption=self.get_total_exemption_dependent(record)
        
        file_path=os.path.join(settings.BASE_DIR, 'User_app', 'configuration files/federal tables/additional_exempt_amount.json')

        result = 0
        data=self.get_file_data(file_path)

        data = data["additional_exempt_amt"]
        no_of_exemption_list=[]
        for item in data:
          if item.get(EmployeeFields.NO_OF_EXEMPTION_INCLUDING_SELF) ==no_of_exemption:
            no_of_exemption_list.append(item)

        single_filing_status_list=[]
        head_of_household_list=[]
        any_other_filing_status=[]

        for item in no_of_exemption_list:
          if FilingStatusFields.SINGLE == item.get("filing_status"):
            single_filing_status_list.append(item)
          elif FilingStatusFields.HEAD_OF_HOUSEHOLD == item.get("filing_status"):
             head_of_household_list.append(item)
          else:
              any_other_filing_status.append(item)

        if filing_status == FilingStatusFields.SINGLE:
          result = single_filing_status_list[0].get(pay_period)

        elif filing_status == FilingStatusFields.HEAD_OF_HOUSEHOLD:
          result = head_of_household_list[0].get(pay_period)

        else:
          result = any_other_filing_status[0].get(pay_period)
        return result


    def get_standard_exempt_amt(self, record):

        filing_status=record.get(EmployeeFields.FILING_STATUS)
        no_of_exemption_for_self=record.get(EmployeeFields.NO_OF_EXEMPTION_INCLUDING_SELF)
        pay_period=record.get(EmployeeFields.PAY_PERIOD)


        # Check if the number of exceptions is greater than 5
        exempt= 6 if no_of_exemption_for_self >5 else no_of_exemption_for_self

        if filing_status == FilingStatusFields.QUALIFYING_WIDOWERS or filing_status == FilingStatusFields.MARRIED_FILING_JOINT_RETURN:
            file_path=os.path.join(settings.BASE_DIR, 'User_app', f'configuration files/federal tables/married_filing_joint_return.json')
            data = self.get_file_data(file_path)
            status_data = data.get("married_filing_joint_return", [])
        else:
            file_path=os.path.join(settings.BASE_DIR, 'User_app', f'configuration files/federal tables/{filing_status}.json')
            data = self.get_file_data(file_path)
            status_data = data.get(filing_status, [])


        # Accessing federal tax data
        if no_of_exemption_for_self <=5:
            semimonthly_data = next((item for item in status_data if item["Pay Period"].lower() == pay_period.lower()), None)
            exempt_amount = semimonthly_data.get(str(exempt))
        elif no_of_exemption_for_self >5:
            semimonthly_data = next((item for item in status_data if item["Pay Period"].lower() == pay_period.lower()), None)
            # print("semimonthly_data",semimonthly_data)
            exemp_amt = semimonthly_data.get(str(exempt))
            # print("exemp_amt",exemp_amt)
            exempt_amount  = re.findall(r'\d+\.?\d*',exemp_amt)
            exempt1=float(exempt_amount[0])
            exempt2=float(exempt_amount[1])
            exempt_amount=round((exempt1+(exempt2*no_of_exemption_for_self)),2)
            # print("Single exempt_amount",exempt_amount)
        return exempt_amount


class federal_tax(federal_tax_calculation):

    def calculate(self, record):

        net_pay = record.get(CalculationFields.NET_PAY)
        is_blind=record.get(EmployeeFields.IS_BLIND)
        is_spouse_blind=record.get(EmployeeFields.IS_SPOUSE_BLIND)
        age=record.get(EmployeeFields.AGE)
        spouse_age=record.get(EmployeeFields.SPOUSE_AGE)

        #Calculate Standard exempt
        standard_exempt_amt=self.get_standard_exempt_amt(record)
        # print("standaerd_exmpt_amt",standard_exempt_amt)


        # Initialize exempt_amount_self and exempt_amount_dependent to 0 
        exempt_amount_self = 0  
        exempt_amount_dependent = 0

        if (age>=65 and is_blind==True) or (age<65 and is_blind==True) or(age>=65 and is_blind==False): 
            exempt_amount_self = self.get_additional_exempt_for_self(record)
            # print("exempt_amount_self", exempt_amount_self)
        if (spouse_age>=65 and is_spouse_blind==True) or (spouse_age<65 and is_spouse_blind==True) or (spouse_age>=65 and is_spouse_blind==False):
            exempt_amount_dependent = self.get_additional_exempt_for_dependent(record)

            # print("dependent_exempt_amt", exempt_amount_dependent)
        

        # Calculate the amount to deduct
        total_exempt_amt=standard_exempt_amt+exempt_amount_self+exempt_amount_dependent
        # print("total_exempt_amt",total_exempt_amt)

        amount_deduct = round((net_pay-total_exempt_amt), 2)
        # print("amount_deduct",amount_deduct)

        amount_deduct = amount_deduct if amount_deduct > 0 else 0
        return (round(amount_deduct,2))


# record =    {
#           "ee_id": "EE005114",
#           "gross_pay": 1000,
#           "state": "Alabama",
#           "no_of_exemption_for_self": 2,
#           "pay_period": "weekly",
#           "filing_status": "qualifying_widowers",
#           "net_pay": 858.8,
#           "payroll_taxes": [
#             {
#               "federal_income_tax": 80
#             },
#             {
#               "social_security_tax": 49.6
#             },
#             {
#               "medicare_tax": 11.6
#             },
#             {
#               "state_tax": 0
#             },
#             {
#               "local_tax": 0
#             }
#           ],
#           "payroll_deductions": {
#             "medical_insurance": 0
#           },
#           "age": 50,
#           "is_blind": True,
#           "is_spouse_blind": True,
#           "spouse_age": 39,
#           "support_second_family": "Yes",
#           "no_of_student_default_loan": 1,
#           "arrears_greater_than_12_weeks": "No",
#           "wages":2821.00,
#           "commission_and_bonus":519,
#           "non_accountable_allowances":454,
#           "garnishment_data": [
#             {
#               "type": "federal tax levy",
#               "data": [
#                 {
#                   "case_id": "C13278",
#                   "amount": 200,
#                   "arrear": 0
#                 }
#               ]
#             }
#           ]
#         }





# print("amt",federal_tax().calculate(record))
