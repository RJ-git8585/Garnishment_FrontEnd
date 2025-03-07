from rest_framework import serializers
from .models import *

# class EmployerProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Employer_Profile
#         fields = ['profile_id','employer_name', 'street_name','federal_employer_identification_number', 'city', 'state', 'country', 'zipcode', 'email', 'number_of_employer', 'department','location']

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer_Profile
        fields = '__all__'

class EmployeeDetailsSerializer(serializers.ModelSerializer):

    is_blind = serializers.BooleanField(required=False, allow_null=True)
    support_second_family = serializers.BooleanField(required=False, allow_null=True)
    spouse_age = serializers.IntegerField(required=False, allow_null=True)
    is_spouse_blind = serializers.BooleanField(required=False, allow_null=True)
    class Meta:
        model = Employee_Detail
        fields = '__all__'


class garnishment_order_serializer(serializers.ModelSerializer):
    class Meta:
        model = garnishment_order
        fields = '__all__'
 

class GetEmployerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer_Profile
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
# class MultipleStudentLoanSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = multiple_student_loan_result
#         fields = '__all__'

# class SingleStudentLoanSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = single_student_loan_result
#         fields = '__all__'


# class ResultSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CalculationResult
#         fields = '__all__'


class setting_Serializer(serializers.ModelSerializer):
    class Meta:
        model = setting
        fields = '__all__'


class APICallCountSerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()



class company_details_serializer(serializers.ModelSerializer):
    class Meta:
        model = company_details
        fields = '__all__' 

class garnishment_fees_serializer(serializers.ModelSerializer):
    class Meta:
        model = garnishment_fees
        fields = '__all__' 


class garnishment_fees_states_rule_serializer(serializers.ModelSerializer):
    class Meta:
        model = garnishment_fees_states_rule
        fields = ['id','state','pay_period','rule'] 


class garnishment_fees_rules_serializer(serializers.ModelSerializer):
    class Meta:
        model = garnishment_fees_rules
        fields = ['id','rule','maximum_fee_deduction','per_pay_period','per_month','per_remittance'] 



