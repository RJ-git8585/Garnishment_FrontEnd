from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from User_app.models import *
from rest_framework.response import Response
from User_app.serializers import *
from rest_framework.views import APIView
from GarnishEdge_Project.garnishment_library.gar_resused_classes import *
from GarnishEdge_Project.garnishment_library.child_support import *
from GarnishEdge_Project.garnishment_library.student_loan import *
from GarnishEdge_Project.garnishment_library import *
from django.utils.decorators import method_decorator
from GarnishEdge_Project.garnishment_library.garnishment_fees import  *
from GarnishEdge_Project.garnishment_library.federal_case import federal_tax
from GarnishEdge_Project.garnishment_library.state_tax import *
from concurrent.futures import ThreadPoolExecutor, as_completed
from User_app.log_files.api_log import log_api


from django.db import transaction




@method_decorator(csrf_exempt, name='dispatch')
class CalculationDataView(APIView):
    """
    API View to handle Garnishment calculations and save data to the database.
    """

    def validate_fields(self, record, required_fields):
        """Validate required fields and return missing fields."""
        return [field for field in required_fields if field not in record]
    
    

    def calculate_garnishment(self, garnishment_type, record):
        """Handles garnishment calculations based on type."""
        garnishment_type = garnishment_type.lower()

        garnishment_rules = {
            "child support": {
                "fields": [
                    EmployeeFields.ARREARS_GREATER_THAN_12_WEEKS, EmployeeFields.SUPPORT_SECOND_FAMILY,
                    CalculationFields.GROSS_PAY, PayrollTaxesFields.PAYROLL_TAXES
                ],
                "calculate": self.calculate_child_support
            },
            "federal tax levy": {
                "fields": [EmployeeFields.FILING_STATUS,EmployeeFields.PAY_PERIOD, CalculationFields.NET_PAY, EmployeeFields.AGE, EmployeeFields.IS_BLIND],
                "calculate": self.calculate_federal_tax
            },
            "student default loan": {
                "fields": [CalculationFields.GROSS_PAY, EmployeeFields.PAY_PERIOD, EmployeeFields.NO_OF_STUDENT_DEFAULT_LOAN,PayrollTaxesFields.PAYROLL_TAXES],
                "calculate": self.calculate_student_loan
            },
            "state tax levy": {
                "fields": [
                    EmployeeFields.GROSS_PAY, EmployeeFields.WORK_STATE
                ],
                "calculate": self.calculate_state_tax_levy
            },
        }

        if garnishment_type in garnishment_rules:
            required_fields = garnishment_rules[garnishment_type]["fields"]
            missing_fields = self.validate_fields(record, required_fields)

            if missing_fields:
                return {"error": f"Missing fields in record: {', '.join(missing_fields)}"}

            return garnishment_rules[garnishment_type]["calculate"](record)

        elif garnishment_type in {GarnishmentTypeFields.STATE_TAX_LEVY, GarnishmentTypeFields.CREDITOR_DEBT}:
            return {"er_deduction": {"Garnishment_fees": gar_fees_rules_engine().apply_rule(record,2000)}}

        return {"error": f"Unsupported garnishment_type: {garnishment_type}"}

    def calculate_child_support(self, record):
        """Calculate child support garnishment."""
        tcsa = ChildSupport().get_list_supportAmt(record)
        result = MultipleChild().calculate(record) if len(tcsa) > 1 else SingleChild().calculate(record)

        child_support_data, arrear_amount_data = result[0], result[1]
        #Garnishment cannot be deducted due to insufficient pay

        total_withhold_amt = sum(child_support_data.values())+sum(arrear_amount_data.values())
        
        if total_withhold_amt <= 0:
            record["agency"] = [
                                    {
                                        "withholding_amt": [
                                            {
                                                "child_support": "Garnishment cannot be deducted due to insufficient pay"
                                                for i in range(1, len(child_support_data) + 1)
                                            }
                                        ]
                                    },
                                    {
                                        "Arrear": [
                                            {
                                                "arrear_amount": "Garnishment cannot be deducted due to insufficient pay"
                                                for i in range(1, len(arrear_amount_data) + 1)
                                            }
                                            
                                        ]
                                    }
                                ]
            record["er_deduction"] = {"garnishment_fees":"Garnishment fees cannot be deducted due to insufficient pay"}

        else:
            record["agency"] = [{"withholding_amt": [
                {"child_support": child_support_data[f'child support amount{i}']} for i in range(1, len(child_support_data) + 1)
            ]}
            ,{"Arrear" : [{"arrear_amount": arrear_amount_data[f'arrear amount{i}']}
                                for i in range(1, len(arrear_amount_data) + 1)]}]
            
            record["er_deduction"] = {"garnishment_fees": gar_fees_rules_engine().apply_rule(record, total_withhold_amt)}

            # Identify withholding limit using state rules
            record["withholding_limit_rule"] = WLIdentifier().get_state_rules(record[EmployeeFields.WORK_STATE].capitalize())
        return record

    def calculate_federal_tax(self, record):
        """Calculate federal tax garnishment."""
        result = federal_tax().calculate(record)
        record["agency"] = [{"withholding_amt": [{"federal tax":result}]}]
        record["ER_deduction"] = {"garnishment_fees": gar_fees_rules_engine().apply_rule(record, result)}
        return record

    def calculate_student_loan(self, record):
        """Calculate student loan garnishment."""
        result = student_loan_calculate().calculate(record)
        #EE005126
        if len(result) == 1:
            record["agency"] = [{"withholding_amt":[{"student_loan": result['student_loan_amt']}]}]
            total_loan_amt = result['student_loan_amt']
        else:
            record["agency"] = [
                {"withholding_amt": [{"student_loan":result[f'student_loan_amt{i}']} for i in range(1, len(result) + 1)]}
            ]

            total_loan_amt = sum(item["student_loan"] for item in record["agency"][0]["withholding_amt"])

        record["ER_deduction"] = {"Garnishment_fees": gar_fees_rules_engine().apply_rule(record, total_loan_amt)}
        return record
    
    def calculate_state_tax_levy(self, record):
        """Calculate state tax levy garnishment."""

        result= StateTaxView().calculate(record)

        if result<=0:
            record["agency"] = [{"withholding_amt": [{"garnishment amount":"Garnishment cannot be deducted due to insufficient pay"}]}]
            record["ER_deduction"] = {"garnishment_fees":"Garnishment fees cannot be deducted due to insufficient pay"}
        else:
            record["agency"] = [{"withholding_amt": [{"garnishment amount":result}]}]
            
            # Calculate garnishment fees using the rules engine
            record["ER_deduction"] = {"garnishment_fees":  gar_fees_rules_engine().apply_rule(record, result)}
        return record

    def calculate_garnishment_wrapper(self, record):
        """
        Wrapper function for parallel processing of garnishment calculations.
        """
        garnishment_data = record.get("garnishment_data", [])
        if not garnishment_data:
            return None  
    
        garnishment_type = garnishment_data[0].get(EmployeeFields.GARNISHMENT_TYPE, "").strip().lower()
        result = self.calculate_garnishment(garnishment_type, record)
    
        if "error" in result:          
            return {"ee_id":record.get("ee_id"),"error": result["error"]}
    
        return result  
    


    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            batch_id = data.get("batch_id")
            cases_data = data.get("cases", [])


            if not batch_id:

                return Response({"error": "batch_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            if not cases_data:

                return Response({"error": "No rows provided"}, status=status.HTTP_400_BAD_REQUEST)

            output = []
            with ThreadPoolExecutor(max_workers=80) as executor:
                future_to_case = {
                    executor.submit(self.process_and_store_case, case_info,batch_id): case_info
                    for case_info in cases_data
                }
                for future in as_completed(future_to_case):
                    try:
                        result = future.result()
                        if result:
                            output.append(result)
                            log_api(
                            api_name="garnishment_calculate",
                            endpoint="/garnishment_calculate/",
                            status_code=200,
                            message="API executed successfully",
                            status="Success"
                        )
                    except Exception as e:

                        log_api(
                        api_name="garnishment_calculate",
                        endpoint="/garnishment_calculate/",
                        status_code=500,
                        message=str(e),
                        status="Failed"
            )

                        output.append({
                            "error": str(e),
                            "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                            "case": future_to_case[future]
                        })

            return Response({
                "message": "Result Generated Successfully",
                "status_code": status.HTTP_200_OK,
                "batch_id": batch_id,
                "results": output
            }, status=status.HTTP_200_OK)

        except Exception as e:
            log_api(
                        api_name="garnishment_calculate",
                        endpoint="/garnishment_calculate/",
                        status_code=500,
                        message=str(e),
                        status="Failed"
            )
            return Response({"error": str(e), "status": status.HTTP_500_INTERNAL_SERVER_ERROR})


    def process_and_store_case(self, case_info,batch_id):
         """
         Processes a single case: stores it in the database and calculates garnishment.
         """
         try:
             with transaction.atomic():
                 ee_id = case_info.get(EmployeeFields.EMPLOYEE_ID) 
                 # Store or update Employee Data
                 employee_defaults = {
                     EmployeeFields.CASE_ID: case_info.get(EmployeeFields.GARNISHMENT_TYPE, [{}])[0].get(CalculationFields.GARNISHMENT_DATA, [{}])[0].get(EmployeeFields.CASE_ID, ""),
                     EmployeeFields.WORK_STATE: case_info.get(EmployeeFields.WORK_STATE),
                     EmployeeFields.NO_OF_EXEMPTION_INCLUDING_SELF: case_info.get(EmployeeFields.NO_OF_EXEMPTION_INCLUDING_SELF),
                     EmployeeFields.PAY_PERIOD: case_info.get(EmployeeFields.PAY_PERIOD),
                     EmployeeFields.FILING_STATUS: case_info.get(EmployeeFields.FILING_STATUS),
                     EmployeeFields.AGE: case_info.get(EmployeeFields.AGE),
                     EmployeeFields.IS_BLIND: case_info.get(EmployeeFields.IS_BLIND),
                     EmployeeFields.IS_SPOUSE_BLIND: case_info.get(EmployeeFields.IS_SPOUSE_BLIND),
                     EmployeeFields.SPOUSE_AGE: case_info.get(EmployeeFields.SPOUSE_AGE),
                     EmployeeFields.SUPPORT_SECOND_FAMILY: case_info.get(EmployeeFields.SUPPORT_SECOND_FAMILY),
                     EmployeeFields.NO_OF_STUDENT_DEFAULT_LOAN: case_info.get(EmployeeFields.NO_OF_STUDENT_DEFAULT_LOAN),
                     EmployeeFields.ARREARS_GREATER_THAN_12_WEEKS: case_info.get(EmployeeFields.ARREARS_GREATER_THAN_12_WEEKS),
                     EmployeeFields.NO_OF_DEPENDENT_EXEMPTION: case_info.get(EmployeeFields.NO_OF_DEPENDENT_EXEMPTION),
                 }
                 EmployeeData.objects.update_or_create(ee_id=ee_id, defaults=employee_defaults) 
                 # Store or update Payroll Taxes
                 payroll_data = case_info.get(PayrollTaxesFields.PAYROLL_TAXES, {})
                 payroll_defaults = {
                     CalculationFields.WAGES: case_info.get(CalculationFields.WAGES),
                     CalculationFields.COMMISSION_AND_BONUS: case_info.get(CalculationFields.COMMISSION_AND_BONUS),
                     CalculationFields.NON_ACCOUNTABLE_ALLOWANCES: case_info.get(CalculationFields.NON_ACCOUNTABLE_ALLOWANCES),
                     CalculationFields.GROSS_PAY: case_info.get(CalculationFields.GROSS_PAY),
                     EmployeeFields.DEBT: case_info.get(EmployeeFields.DEBT),
                     EmployeeFields.EXEMPTION_AMOUNT: case_info.get(EmployeeFields.EXEMPTION_AMOUNT),
                     CalculationFields.NET_PAY: case_info.get(CalculationFields.NET_PAY),
                     PayrollTaxesFields.FEDERAL_INCOME_TAX: payroll_data.get(PayrollTaxesFields.FEDERAL_INCOME_TAX),
                     PayrollTaxesFields.SOCIAL_SECURITY_TAX: payroll_data.get(PayrollTaxesFields.SOCIAL_SECURITY_TAX),
                     PayrollTaxesFields.MEDICARE_TAX: payroll_data.get(PayrollTaxesFields.MEDICARE_TAX),
                     PayrollTaxesFields.STATE_TAX: payroll_data.get(PayrollTaxesFields.STATE_TAX),
                     PayrollTaxesFields.LOCAL_TAX: payroll_data.get(PayrollTaxesFields.LOCAL_TAX),
                     PayrollTaxesFields.UNION_DUES: payroll_data.get(PayrollTaxesFields.UNION_DUES),
                     PayrollTaxesFields.MEDICAL_INSURANCE_PRETAX: payroll_data.get(PayrollTaxesFields.MEDICAL_INSURANCE_PRETAX),
                     PayrollTaxesFields.INDUSTRIAL_INSURANCE: payroll_data.get(PayrollTaxesFields.INDUSTRIAL_INSURANCE),
                     PayrollTaxesFields.LIFE_INSURANCE: payroll_data.get(PayrollTaxesFields.LIFE_INSURANCE),
                     PayrollTaxesFields.CALIFORNIA_SDI: payroll_data.get(PayrollTaxesFields.CALIFORNIA_SDI, 0),
                 }
                 PayrollTaxes.objects.update_or_create(ee_id=ee_id, defaults=payroll_defaults) 
                 # Deduplicate Garnishment Data before inserting
                 unique_garnishments = {}
                 for garnishment_group in case_info.get(CalculationFields.GARNISHMENT_DATA, []):
                     garnishment_type = garnishment_group.get(EmployeeFields.GARNISHMENT_TYPE, "")
                     for garnishment in garnishment_group.get("data", []):
                         case_id = garnishment.get(EmployeeFields.CASE_ID)
                         if case_id:
                             unique_garnishments[case_id] = GarnishmentData(
                                 case_id=case_id,
                                 garnishment_type=garnishment_type,
                                 ordered_amount=garnishment.get(CalculationFields.ORDERED_AMOUNT),
                                 arrear_amount=garnishment.get(CalculationFields.ARREAR_AMOUNT),
                                 current_medical_support=garnishment.get(CalculationFields.CURRENT_MEDICAL_SUPPORT),
                                 past_due_medical_support=garnishment.get(CalculationFields.PAST_DUE_MEDICAL_SUPPORT),
                                 current_spousal_support=garnishment.get(CalculationFields.CURRENT_SPOUSAL_SUPPORT),
                                 past_due_spousal_support=garnishment.get(CalculationFields.PAST_DUE_SPOUSAL_SUPPORT),
                             ) 
                 # Perform bulk_create after deduplication
                 GarnishmentData.objects.bulk_create(
                     unique_garnishments.values(),
                     update_conflicts=True,
                     update_fields=[
                         "garnishment_type", "ordered_amount", "arrear_amount",
                         "current_medical_support", "past_due_medical_support",
                         "current_spousal_support", "past_due_spousal_support",
                     ],
                     unique_fields=["case_id"]
                 ) 
                 # **After storing, run the calculation**
                 calculated_result = self.calculate_garnishment_wrapper(case_info)

                 calculated_result["ee_id"] = ee_id
                 log_api(
                     api_name="garnishment_calculate",
                     endpoint="/garnishment_calculate/",
                     status_code=200,
                     message="API executed successfully",
                     status="Success"
                 )
                 return calculated_result 


         except Exception as e:


             return {"error": str(e), "status": 500, "ee_id": case_info.get(EmployeeFields.EMPLOYEE_ID)} 
         
