from django.views.decorators.csrf import csrf_exempt
from User_app.models import *
from django.contrib.auth import authenticate, login as auth_login ,get_user_model
from rest_framework.decorators import api_view
from auth_project.garnishment_library import state_tax as st
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings

import os
@method_decorator(csrf_exempt, name='dispatch')
class StateTaxView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            required_fields = [
                'gross_income', 'state', 'debt', 'garnishment_fees',
                'employee_name', 'employer_id', 'employee_id', 'disposable_income'
            ]
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return Response(
                    {'error': f'Required fields are missing: {", ".join(missing_fields)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user = State_tax_data.objects.create(**data)
            gross_income = data.get('gross_income', 0)
            garnishment_fees = data.get('garnishment_fees', 0)
            employee_name = data.get('employee_name')
            disposable_income = data.get('disposable_income')
            debt = data.get('debt', 0)
            state = data.get('state')

            global_instance = settings.MY_GLOBAL_FUNCTION.calculate(disposable_income)
            print(global_instance)

            global_instance1 = settings.MY_GLOBAL_STATE_FUNCTION.get_allocation_method()
            print(global_instance1)


            twenty_five_percentage_grp_state = [
                'arkansas', 'california', 'georgia', 'indiana', 'montana', 'new mexico', 'utah'
            ]
            if state.lower() in twenty_five_percentage_grp_state:
                monthly_garnishment_amount = settings.MY_GLOBAL_FUNCTION.calculate(disposable_income)
                print(monthly_garnishment_amount)
                
            elif state.lower() == 'albama':
                monthly_garnishment_amount = settings.MY_GLOBAL_FUNCTION.calculate(gross_income)
                print(monthly_garnishment_amount)
            
            duration_of_levies = round((debt / monthly_garnishment_amount),2)
                

            # if net_pay < 0:
            #     net_pay = 0
            print(duration_of_levies)
            LogEntry.objects.create(
                action='State Tax Calculation data Added',
                details=(
                    f'State Tax Calculation data Added successfully with employer ID '
                    f'{user.employer_id} and employee ID {user.employee_id}'
                )
            )
            return Response(
                {
                    'message': 'State Tax Calculations Details Successfully Registered',
                    'status_code': status.HTTP_200_OK
                }
            )
        # except Employee_Details.DoesNotExist:
        #     return Response(
        #         {"error": "Employee details not found"},
        #         status=status.HTTP_404_NOT_FOUND
        #     )
        except Employer_Profile.DoesNotExist:
            return Response(
                {
                    "error": "Employer profile not found",
                    "status_code": status.HTTP_404_NOT_FOUND
                }
            )
        # except Exception as e:
        #     return Response(
        #         {
        #             "error": str(e),
        #             "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
        #         }
        #     )

   