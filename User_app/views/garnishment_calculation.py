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
from auth_project.garnishment_library import garnishment_fees as garnishment_fees 
from auth_project.garnishment_library.federal_case import federal_tax
from concurrent.futures import ProcessPoolExecutor
from concurrent.futures import ThreadPoolExecutor, as_completed

@method_decorator(csrf_exempt, name='dispatch')
class CalculationDataView(APIView):
    """
    API View to handle Garnishment calculations and save data to the database.
    """

    def validate_fields(self, record, required_fields):
        """Validate required fields and return missing fields."""
        return [field for field in required_fields if field not in record]
    
    def calculate_garfees(self, record):
        """Calculate garnishment fees."""
       

    def calculate_garnishment(self, garnishment_type, record):
        """Handles garnishment calculations based on type."""
        garnishment_type = garnishment_type.lower()

        garnishment_rules = {
            "child support": {
                "fields": [
                    "arrears_greater_than_12_weeks", "support_second_family",
                    "gross_pay", "payroll_taxes"
                ],
                "calculate": self.calculate_child_support
            },
            "federal tax levy": {
                "fields": ["filing_status", "pay_period", "net_pay", "age", "is_blind"],
                "calculate": self.calculate_federal_tax
            },
            "student default loan": {
                "fields": ["gross_pay", "pay_period", "no_of_student_default_loan", "payroll_taxes"],
                "calculate": self.calculate_student_loan
            }
        }

        if garnishment_type in garnishment_rules:
            required_fields = garnishment_rules[garnishment_type]["fields"]
            missing_fields = self.validate_fields(record, required_fields)

            if missing_fields:
                return {"error": f"Missing fields in record: {', '.join(missing_fields)}"}

            return garnishment_rules[garnishment_type]["calculate"](record)

        elif garnishment_type in {"State Tax Levy", "creditor debt", "creditor"}:
            return {"ER_deduction": {"Garnishment_fees": garnishment_fees.gar_fees_rules_engine().apply_rule(record,2000)}}

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

        record["ER_deduction"] = {"garnishment_fees": garnishment_fees.gar_fees_rules_engine().apply_rule(record, total_withhold_amt)}
        return record

    def calculate_federal_tax(self, record):
        """Calculate federal tax garnishment."""
        result = federal_tax().calculate(record)
        record["Agency"] = [{"withholding_amt": [{"federal tax":result}]}]
        record["ER_deduction"] = {"garnishment_fees": garnishment_fees.gar_fees_rules_engine().apply_rule(record, result)}
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

        record["ER_deduction"] = {"Garnishment_fees": garnishment_fees.gar_fees_rules_engine().apply_rule(record, total_loan_amt)}
        return record
    
    def calculate_garnishment_wrapper(self, record):
        """
        Wrapper function for parallel processing of garnishment calculations.
        """
        garnishment_data = record.get("garnishment_data", [])
        if not garnishment_data:
            return None  # Skip if no garnishment data is present

        garnishment_type = garnishment_data[0].get('type', '').strip().lower()
        result = self.calculate_garnishment(garnishment_type, record)

        if "error" in result:
            return {"error": result["error"]}

        return record
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            batch_id = data.get("batch_id")
            Cases_data = data.get("cases", [])

            if not batch_id:
                return Response({"error": "batch_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            if not Cases_data:
                return Response({"error": "No rows provided"}, status=status.HTTP_400_BAD_REQUEST)

            output = []
            futures = []

            # Use ThreadPoolExecutor instead of ProcessPoolExecutor
            with ThreadPoolExecutor(max_workers=80) as executor:
                future_to_case = {executor.submit(self.calculate_garnishment_wrapper, case_info): case_info for case_info in Cases_data}

                for future in as_completed(future_to_case):
                    try:
                        result = future.result()
                        if result:
                            output.append({"cases": [result]})  # Append processed case data
                    except Exception as e:
                        output.append({"error": str(e), "case": future_to_case[future]})  # Capture errors per case

            return Response({
                "message": "Result Generated Successfully",
                "status_code": status.HTTP_200_OK,
                "batch_id": batch_id,
                "results": output
            }, status=status.HTTP_200_OK)

        except Employee_Detail.DoesNotExist:
            return Response({"error": "Employee details not found", "status": status.HTTP_404_NOT_FOUND})
        except Exception as e:
            return Response({"error": str(e), "status": status.HTTP_500_INTERNAL_SERVER_ERROR})