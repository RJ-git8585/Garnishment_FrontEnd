from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from User_app.models import *
from rest_framework.response import Response
from User_app.serializers import *
from rest_framework.views import APIView
from auth_project.garnishment_library.child_support import ChildSupport,MultipleChild,SingleChild 
from auth_project.garnishment_library.student_loan import student_loan_calculate
from django.utils.decorators import method_decorator
from auth_project.garnishment_library.garnishment_fees import  *
from auth_project.garnishment_library.federal_case import federal_tax
from auth_project.garnishment_library.state_tax import *
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
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
                    EmployeeFields.GROSS_PAY, EmployeeFields.WORK_STATE,EmployeeFields.DEBT,
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
            return {"ER_deduction": {"Garnishment_fees": gar_fees_rules_engine().apply_rule(record,2000)}}

        return {"error": f"Unsupported garnishment_type: {garnishment_type}"}

    def calculate_child_support(self, record):
        """Calculate child support garnishment."""
        tcsa = ChildSupport().get_list_supportAmt(record)
        result = MultipleChild().calculate(record) if len(tcsa) > 1 else SingleChild().calculate(record)

        child_support_data, arrear_amount_data = result[0], result[1]

        record["Agency"] = [{"withholding_amt": [
            {"child_support": child_support_data[f'child support amount{i}']}
            for i in range(1, len(child_support_data) + 1)
        ]},{"Arrear" : [{"arrear_amount": arrear_amount_data[f'arrear amount{i}']}
                            for i in range(1, len(arrear_amount_data) + 1)]}]

        

        total_withhold_amt = sum(cs["child_support"] for cs in record["Agency"][0]["withholding_amt"]) + \
                             sum(arr["arrear_amount"] for arr in record["Agency"][1]["Arrear"])

        record["ER_deduction"] = {"garnishment_fees": gar_fees_rules_engine().apply_rule(record, total_withhold_amt)}
        return record

    def calculate_federal_tax(self, record):
        """Calculate federal tax garnishment."""
        result = federal_tax().calculate(record)
        record["Agency"] = [{"withholding_amt": [{"federal tax":result}]}]
        record["ER_deduction"] = {"garnishment_fees": gar_fees_rules_engine().apply_rule(record, result)}
        return record

    def calculate_student_loan(self, record):
        """Calculate student loan garnishment."""
        result = student_loan_calculate().calculate(record)

        if len(result) == 1:
            record["Agency"] = [{"withholding_amt":[{"student_loan": result['student_loan_amt']}]}]
            total_loan_amt = result['student_loan_amt']
        else:
            record["Agency"] = [
                {"withholding_amt": [{"student_loan":result[f'student_loan_amt{i}']} for i in range(1, len(result) + 1)]}
            ]

            total_loan_amt = sum(item["student_loan"] for item in record["Agency"][0]["withholding_amt"])

        record["ER_deduction"] = {"Garnishment_fees": gar_fees_rules_engine().apply_rule(record, total_loan_amt)}
        return record
    
    def calculate_state_tax_levy(self, record):
        """Calculate state tax levy garnishment."""

        result= StateTaxView().calculate(record)
        record["Agency"] = [{"withholding_amt": [{"garnishment amount":result}]}]
        record["ER_deduction"] = {"garnishment_fees": gar_fees_rules_engine().apply_rule(record, result)}
        return record

    def calculate_garnishment_wrapper(self, record):
        """
        Wrapper function for parallel processing of garnishment calculations.
        """
        garnishment_data = record.get("garnishment_data", [])
        if not garnishment_data:
            return None  # Skip if no garnishment data is present
    
        garnishment_type = garnishment_data[0].get(EmployeeFields.GARNISHMENT_TYPE, "").strip().lower()
        result = self.calculate_garnishment(garnishment_type, record)
    
        if "error" in result:
            return {"ee_id":record.get("ee_id"),"error": result["error"]}
    
        return result  # Return calculated result instead of the input record
    

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
                    executor.submit(self.process_and_store_case, case_info): case_info
                    for case_info in cases_data
                }
                for future in as_completed(future_to_case):
                    try:
                        result = future.result()
                        if result:
                            output.append(result)
                    except Exception as e:
                        output.append({"error": str(e),"status": status.HTTP_500_INTERNAL_SERVER_ERROR, "case": future_to_case[future]})
            return Response({
                "message": "Result Generated Successfully",
                "status_code": status.HTTP_200_OK,
                "batch_id": batch_id,
                "results": output
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e), "status": status.HTTP_500_INTERNAL_SERVER_ERROR})


    def process_and_store_case(self, case_info):
        """
        Processes a single case: stores it in the database and calculates garnishment.
        """
        try:
            with transaction.atomic():
                ee_id = case_info.get("ee_id")
                employee_data, created = EmployeeData.objects.update_or_create(
                    ee_id=ee_id,
                    defaults={
                        "case_id": case_info.get("garnishment_data", [{}])[0].get("data", [{}])[0].get("case_id", ""),
                        "work_state": case_info.get("work_state"),
                        "no_of_exemption_including_self": case_info.get("no_of_exemption_including_self"),
                        "pay_period": case_info.get("pay_period"),
                        "filing_status": case_info.get("filing_status"),
                        "age": case_info.get("age"),
                        "is_blind": case_info.get("is_blind"),
                        "is_spouse_blind": case_info.get("is_spouse_blind"),
                        "spouse_age": case_info.get("spouse_age"),
                        "support_second_family": case_info.get("support_second_family"),
                        "no_of_student_default_loan": case_info.get("no_of_student_default_loan"),
                        "arrears_greater_than_12_weeks": case_info.get("arrears_greater_than_12_weeks"),
                        "no_of_dependent_exemption": case_info.get("no_of_dependent_exemption"),
                    }
                )
                # Extract and save payroll taxes
                payroll_data = case_info.get("payroll_taxes", {})
                PayrollTaxes.objects.update_or_create(
                    ee_id=ee_id,
                    defaults={
                        "wages": case_info.get("wages"),
                        "commission_and_bonus": case_info.get("commission_and_bonus"),
                        "non_accountable_allowances": case_info.get("non_accountable_allowances"),
                        "gross_pay": case_info.get("gross_pay"),
                        "debt": case_info.get("debt"),
                        "exemption_amount": case_info.get("exemption_amount"),
                        "net_pay": case_info.get("net_pay"),
                        "federal_income_tax": payroll_data.get("federal_income_tax"),
                        "social_security_tax": payroll_data.get("social_security_tax"),
                        "medicare_tax": payroll_data.get("medicare_tax"),
                        "state_tax": payroll_data.get("state_tax"),
                        "local_tax": payroll_data.get("local_tax"),
                        "union_dues": payroll_data.get("union_dues"),
                        "wilmington_tax": payroll_data.get("wilmington_tax"),
                        "medical_insurance_pretax": payroll_data.get("medical_insurance_pretax"),
                        "industrial_insurance": payroll_data.get("industrial_insurance"),
                        "life_insurance": payroll_data.get("life_insurance"),
                        "california_sdi": payroll_data.get("CaliforniaSDI", 0),
                    }
                )
                # Extract and save garnishment data
                for garnishment_group in case_info.get("garnishment_data", []):
                    garnishment_type = garnishment_group.get("type", "")
                    for garnishment in garnishment_group.get("data", []):
                        GarnishmentData.objects.update_or_create(
                            case_id=garnishment.get("case_id"),
                            defaults={
                                "garnishment_type": garnishment_type,
                                "ordered_amount": garnishment.get("ordered_amount"),
                                "arrear_amount": garnishment.get("arrear_amount"),
                                "current_medical_support": garnishment.get("current_medical_support"),
                                "past_due_medical_support": garnishment.get("past_due_medical_support"),
                                "current_spousal_support": garnishment.get("current_spousal_support"),
                                "past_due_spousal_support": garnishment.get("past_due_spousal_support"),
                            }
                        )
                # **After storing, run the calculation**
                calculated_result = self.calculate_garnishment_wrapper(case_info)
                return calculated_result
        except Exception as e:
            return {"error": str(e), "status": status.HTTP_500_INTERNAL_SERVER_ERROR, "case_id": case_info.get("ee_id")}
