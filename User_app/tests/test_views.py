import os
import django
import unittest
import json
from rest_framework import status
from rest_framework.test import APIClient
from django.conf import settings
from django.test import TestCase

from GarnishEdge_Project.garnishment_library.child_support import *

# Ensure Django settings are loaded before importing Django modules
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "GarnishEdge_Project.settings") 
django.setup()


class GarnishmentCalculationTests(unittest.TestCase):
    def setUp(self):
        """Initialize API client before each test"""
        self.client = APIClient()
        self.url = "http://127.0.0.1:8000/User/garnishment_calculate/"

    def test_calculation_data_view_success(self):
        test_data = {
            "batch_id": "B001A",
            "cases": [
                {
                    "ee_id": "EE005114",
                    "work_state": "Alabama",
                    "no_of_exemption_including_self": 1.0,
                    "pay_period": "Weekly",
                    "filing_status": "single",
                    "wages": 2005,
                    "commission_and_bonus": 639,
                    "non_accountable_allowances": 488,
                    "gross_pay": 3132,
                    "payroll_taxes": {
                        "federal_income_tax": 80.0,
                        "social_security_tax": 49.6,
                        "medicare_tax": 11.6,
                        "state_tax": 0.0,
                        "local_tax": 0.0,
                        "union_dues": 0,
                        "wilmington_tax": 0,
                        "medical_insurance_pretax": 0,
                        "industrial_insurance": 0,
                        "life_insurance": 0,
                        "CaliforniaSDI": 0
                    },
                    "payroll_deductions": {"medical_insurance": 0},
                    "net_pay": 0,
                    "age": 50.0,
                    "is_blind": False,
                    "is_spouse_blind": False,
                    "spouse_age": 43.0,
                    "support_second_family": "Yes",
                    "no_of_student_default_loan": 1.0,
                    "arrears_greater_than_12_weeks": "No",
                    "garnishment_data": [
                        {
                            "type": "Child Support",
                            "data": [
                                {
                                    "case_id": "C10851",
                                    "ordered_amount": 100.0,
                                    "arrear_amount": 0.0,
                                    "current_medical_support": 0.0,
                                    "past_due_medical_support": 0.0,
                                    "current_spousal_support": 0.0,
                                    "past_due_spousal_support": 0.0
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        response = self.client.post(self.url, data=test_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Result Generated Successfully")

    def test_calculation_data_view_missing_batch_id(self):
        test_data = {"cid": {}}
        response = self.client.post(self.url, data=test_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "batch_id is required")

    def test_calculation_data_view_invalid_garnishment_type(self):
        test_data = {
            "batch_id": "B001A",
            "cid": {
                "C00001": {
                    "employees": [
                        {
                            "ee_id": "EE005114",
                            "garnishment_data": [{"type": "Student Default Loanss", "data": []}]
                        }
                    ]
                }
            }
        }


        response = self.client.post(self.url, data=test_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

class ChildSupportTests(unittest.TestCase):

    def test_child_support_result(self):
        """Test child support calculation"""
        test_data=os.path.join(settings.BASE_DIR, 'User_app', 'tests/test_data.json')
        with open(test_data, 'r') as file:
            data = json.load(file)
            
        tcsa = ChildSupport().get_list_supportAmt(data)
        result=list(MultipleChild().calculate(data) if len(tcsa) > 1 else SingleChild().calculate(data))

        for i in range(len(data["result"])):
            for k,v in data["result"][i].items():
                self.assertEqual(data["result"][i][k], result[i][k])

if __name__ == "__main__":
    unittest.main()