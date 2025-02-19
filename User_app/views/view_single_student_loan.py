from rest_framework import status
from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from User_app.models import *

from django.contrib.auth import authenticate, login as auth_login ,get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from ..serializers import *
from rest_framework.decorators import api_view
from django.utils.decorators import method_decorator
from django.core.mail import send_mail
import csv
from rest_framework.views import APIView



@csrf_exempt
@api_view(['POST'])
def StudentLoanCalculationData(request):
    if request.method == 'POST':
        try:
            data = request.data
            batch_id = data.get("batch_id")
            rows = data.get("rows", [])
            
            # Validate batch number
            if not batch_id:
                return Response({"error": "batch_id is required"}, status=400)

            if not rows:
                return Response({"error": "No rows provided"}, status=400)

            # Process each result
            for record in rows:
                employee_id = record.get("employee_id")
                employer_id = record.get("employer_id")
                employee_name = record.get("employee_name")
                garnishment_fees = record.get("garnishment_fees", 0)
                disposable_income = record.get("disposable_income", 0)

                # Save the record to the `single_student_loan_data` table
                user = single_student_loan_data.objects.create(**record)

                # Perform calculations
                allowable_disposable_earning = round(disposable_income - garnishment_fees, 2)
                fifteen_percent_of_earning = round(allowable_disposable_earning * 0.15, 2)
                fmw = round(7.25 * 30, 2)
                difference = round(disposable_income - fmw, 2)

                # Calculate garnishment amount
                if allowable_disposable_earning < fmw:
                    garnishment_amount = 0
                else:
                    garnishment_amount = min(fifteen_percent_of_earning, difference)
                
                if garnishment_amount < 0:
                    garnishment_amount = 0
                
                # Calculate net pay
                net_pay = round(disposable_income - garnishment_amount, 2)
                if net_pay < 0:
                    net_pay = 0

                # Save the calculated results to the appropriate tables
                single_student_loan_data_and_result.objects.create(
                    employee_id=employee_id,
                    employer_id=employer_id,
                    employee_name=employee_name,
                    garnishment_fees=garnishment_fees,
                    disposable_income=disposable_income,
                    allowable_disposable_earning=allowable_disposable_earning,
                    fifteen_percent_of_eraning=fifteen_percent_of_earning,
                    fmw=fmw,
                    garnishment_amount=garnishment_amount,
                    difference=difference,
                    net_pay=net_pay
                )

                single_student_loan_result.objects.create(
                    employee_id=employee_id,
                    employer_id=employer_id,
                    net_pay=net_pay,
                    batch_id=batch_id,
                    garnishment_amount=garnishment_amount
                )

                # Add log details
                log_entry = LogEntry.objects.create(
                    action='Single Student Loan Calculation data Added',
                    details=f'Single Student Loan Calculation data added successfully with employer ID {user.employer_id} and employee ID {user.employee_id}'
                )

            return Response({'message': 'Single Student Loan Calculation Details Registered Successfully', "status code":status.HTTP_200_OK})
        except Employee_Details.DoesNotExist:
            return Response({"error": "Employee details not found", status:status.HTTP_404_NOT_FOUND})
        except Employer_Profile.DoesNotExist:
            return Response({"error": "Employer profile not found", status:status.HTTP_404_NOT_FOUND})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'message': 'Please use POST method', "status_code": status.HTTP_400_BAD_REQUEST})


class get_Single_Student_loan_result(APIView):
    def get(request,self, employee_id, employer_id): 
        employees = single_student_loan_result.objects.filter(employee_id=employee_id, employer_id=employer_id)
        if employees.exists():
            try:
                employee= employees.order_by('-timestamp')[:1]             
                serializer = SingleStudentLoanSerializer(employee,many=True)

                response_data = {
                    'success': True,
                    'message': 'Data retrieved successfully',
                    'status code': status.HTTP_200_OK,
                    'data': serializer.data
                }
                return JsonResponse(response_data)
            except Employer_Profile.DoesNotExist:
                return JsonResponse({'message': 'Data not found', 'status code': status.HTTP_404_NOT_FOUND})
        else:
            return JsonResponse({'message': 'Employer ID not found', 'status code': status.HTTP_404_NOT_FOUND})    

class get_single_student_loan_data_and_result(APIView):
    def get(self, request, employer_id,employee_id):
        employees = single_student_loan_data_and_result.objects.filter(employer_id=employer_id,employee_id=employee_id).order_by('-timestamp')[0:1]
        if employees.exists():
            try:
                serializer = single_student_loan_data_and_result_Serializer(employees,many=True)
                response_data = {
                    'success': True,
                    'message': 'Data retrieved successfully',
                    'status code': status.HTTP_200_OK,
                    'data': serializer.data
                }
                return JsonResponse(response_data)
            except single_student_loan_data_and_result.DoesNotExist:
                return JsonResponse({'message': 'Data not found', 'status code': status.HTTP_404_NOT_FOUND})
            except Exception as e:
                return Response({"error": str(e), "status code" :status.HTTP_500_INTERNAL_SERVER_ERROR})
        else:
            return JsonResponse({'message': 'Employee ID not found', 'status code': status.HTTP_404_NOT_FOUND})

class get_single_student_loan_case_data(APIView):
    def get(self, request, employer_id,employee_id):
        employees = single_student_loan_data.objects.filter(employer_id=employer_id,employee_id=employee_id).order_by('-timestamp')[0:1]
        if employees.exists():
            try:
                serializer = single_student_loan_data_Serializer(employees,many=True)
                response_data = {
                    'success': True,
                    'message': 'Data retrieved successfully',
                    'status code': status.HTTP_200_OK,
                    'data': serializer.data
                }
                return JsonResponse(response_data)
            except federal_loan_case_data.DoesNotExist:
                return JsonResponse({'message': 'Data not found', 'status code': status.HTTP_404_NOT_FOUND})
            except Exception as e:
                return Response({"error": str(e), "status code" :status.HTTP_500_INTERNAL_SERVER_ERROR})
        else:
            return JsonResponse({'message': 'Employee ID not found', 'status code': status.HTTP_404_NOT_FOUND})

class get_all_Single_Student_loan_result(APIView):
    def get(self, request, employer_id):
        employees = single_student_loan_result.objects.filter(employer_id=employer_id,)
        if employees.exists():
            try:
                serializer = SingleStudentLoanSerializer(employees,many=True)
                response_data = {
                    'success': True,
                    'message': 'Single Student Loan Data retrieved successfully',
                    'status code': status.HTTP_200_OK,
                    'data': serializer.data
                }
                return JsonResponse(response_data)
            except single_student_loan_result.DoesNotExist:
                return JsonResponse({'message': 'Data not found', 'status code': status.HTTP_404_NOT_FOUND})
            except Exception as e:
                return Response({"error": str(e), "status code" :status.HTTP_500_INTERNAL_SERVER_ERROR})
        else:
            return JsonResponse({'message': 'Employee ID not found', 'status code': status.HTTP_404_NOT_FOUND})


class SingleStudentLoanBatchResult(APIView):
    def get(request,self, batch_id): 
        employees = single_student_loan_result.objects.filter(batch_id=batch_id)
        if employees.exists():
            try:
                employee= employees.order_by('-timestamp')       
                # serializer = SingleStudentLoanSerializer(employee,many=True)

                response_data = {
                    'success': True,
                    'message': 'Data retrieved successfully',
                    'status code': status.HTTP_200_OK,
                    # 'data': serializer.data
                }
                return JsonResponse(response_data)
            except Employer_Profile.DoesNotExist:
                return JsonResponse({'message': 'Data not found', 'status code': status.HTTP_404_NOT_FOUND})
        else:
            return JsonResponse({'message': 'Employer ID not found', 'status code': status.HTTP_404_NOT_FOUND})    

