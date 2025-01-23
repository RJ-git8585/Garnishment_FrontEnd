from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from User_app.models import *
from rest_framework.response import Response
from User_app.serializers import *
from rest_framework.views import APIView
from auth_project.garnishment_library import gar_resused_classes as gc
from auth_project.garnishment_library.child_support import ChildSupport,MultipleChild,SingleChild 
from auth_project.garnishment_library.student_loan import student_loan_calculate
from django.utils.decorators import method_decorator
from auth_project.garnishment_library.federal_case import federal_tax
import json



@method_decorator(csrf_exempt, name='dispatch')
class CalculationDataView(APIView):
    """
    API View to handle Garnishment calculations and save data to the database.
    """
    def post(self, request, *args, **kwargs):
        try:
            # Use request.data directly
            data = request.data
            batch_id = data.get("batch_id")
            cid_data = data.get("CID", {})
            output = []
    
            # Validate batch_id
            if not batch_id:
                return Response({"error": "batch_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
            # Validate rows
            if not cid_data:
                return Response({"error": "No rows provided"}, status=status.HTTP_400_BAD_REQUEST)
    
            for cid, cid_info in cid_data.items():
                cid_summary = {"CID": cid, "employees": []}
    
                for record in cid_info.get("employees", []):
                    orders = []
                    garnishment_data = record.get("garnishment_data", [])
    
                    for garnishment in garnishment_data:
                        garnishment_type = list(garnishment.keys())[0]
    
                        if garnishment_type == "child_support_order":
                            # Validate child support fields
                            required_fields = [
                                "arrears_greater_than_12_weeks",
                                "support_second_family", "gross_pay", "payroll_taxes"
                            ]
                            missing_fields = [field for field in required_fields if field not in record]
    
                            if not missing_fields:
                                tcsa = ChildSupport().get_list_supportAmt(record)
                                result = (
                                    MultipleChild().calculate(record)
                                    if len(tcsa) > 1
                                    else ChildSupport().calculate(record)
                                )
                            else:
                                result = {"error": f"Missing fields in record: {', '.join(missing_fields)}"}
    
                        elif garnishment_type == "federal_tax":
                            # Validate federal tax fields
                            required_fields = ["filing_status", "pay_period", "net_pay", "age", "is_blind"]
                            missing_fields = [field for field in required_fields if field not in record]
    
                            if not missing_fields:
                                result = federal_tax().calculate(record)
                            else:
                                result = {"error": f"Missing fields in record: {', '.join(missing_fields)}"}
    
                        elif garnishment_type == "student_loan":
                            # Validate student loan fields
                            required_fields = ["gross_pay", "pay_period", "no_of_student_default_loan", "payroll_taxes"]
                            missing_fields = [field for field in required_fields if field not in record]
    
                            if not missing_fields:
                                result = student_loan_calculate().calculate(record)
                            else:
                                result = {"error": f"Missing fields in record: {', '.join(missing_fields)}"}
    
                        else:
                            return Response(
                                {"error": f"Unsupported garnishment_type: {garnishment_type}"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
    
                        # Append each order to the orders list
                        orders.append({
                            "order_id": record.get("order_id"),
                            "garnishment_type": garnishment_type,
                            "withhoulding_amt": result
                        })
    
                    # Append employee data with all their orders
                    
                    cid_summary["employees"].append({
                        "ee_id": record.get("ee_id"),
                        "garnishment": orders
                    })
    
                output.append(cid_summary)
    
                # Log the action
                LogEntry.objects.create(
                    action="Calculation data added",
                    details=(
                        f"Calculation data added successfully with employer ID "
                        f"{record.get('employer_id')} and employee ID {record.get('ee_id')}"
                    )
                )
    
            return Response(
                {
                    "message": "Calculations successfully registered",
                    "status_code": status.HTTP_200_OK,
                    "batch_id": batch_id,
                    "results": output
                },
                status=status.HTTP_200_OK
            )
    
        except Employee_Detail.DoesNotExist:
            return Response(
                {"error": "Employee details not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e), "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




# record=   {
#       "ee_id": "EMP009",
#       "employer_id" :"EMP001",
#       "gross_pay": 600,
#       "employee_name": "Michael Johnson",
#       "garnishment_fees": 5,
#       "arrears_greater_than_12_weeks": "Yes",
#       "support_second_family": "Yes",
#       "child_support" : [ {"amount": 200, "arrear": 6}, {"amount": 300, "arrear": 0}],
#       "taxs":[{"fit":200 },{"sst":10} ,{"mct":20}, {"st":10} , {"lt":5}],
#       "state": "Florida",
#       "arrears_amount1": 99,
#       "pay_period" : "weekly",
#       "mandatory_deductions":10.0,
#        "garnishment_type":"child_support"
# } 

# print("calculate_twa",ChildSupport().calculate_twa(record))
# print("calculate_de_rule",ChildSupport().calculate_de_rule(record))
# print("calculate_md",ChildSupport().calculate_md(record))
# print("calculate_wl",ChildSupport().calculate_wl(record))
# print("calculate_tcsa",ChildSupport().get_list_supportAmt(record))
# print("calculate_tcsa_sum",sum(ChildSupport().get_list_supportAmt(record)))
# print("calculate_taa",ChildSupport().get_list_support_arrearAmt(record))
# print("calculate_ade",ChildSupport().calculate_ade(record))
# print("calculate_wa",ChildSupport().calculate_wa(record))


    
                    # elif len(garnishment_data)>1:
                    #     # Validate student loan fields
                    #     required_student_loan_fields = ["gross_pay", "pay_period","no_of_student_default_loan","taxes"]
                    #     missing_student_loan_fields = [
                    #         field for field in required_student_loan_fields if field not in record
                    #     ]
                        
                    #     if not missing_student_loan_fields:
                    #          result = multiple_garnishment_case().calculate(record)
                    #     else:
                    #         result = {"error": f"Missing fields in record: {', '.join(missing_student_loan_fields)}"}    