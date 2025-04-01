from django.urls import path
from ..views import *
from ..views.views import *
from django.urls import include, path
from ..views.view_state_tax import *


urlpatterns = [
    path('', include('User_app.urls.url_state_tax')),
    path("register", register, name="register"),
    path("login",login, name="login"),    
    path('employer-profile/', EmployerProfile, name='employer_profile'),
    path('employee_details/', EmployeeDetailsAPIView.as_view(), name='employee_details'),
    path('update_employee_details/<str:case_id>/<str:ee_id>/',EmployeeDetailsUpdateAPIView.as_view(), name='Employee_Details_UpdateAPIView'),
    path('update_company_details/<str:cid>/',CompanyDetailsUpdateAPIView.as_view(), name='Company_Details_UpdateAPIView'),
    path('employer-profile/<int:employer_id>/',EmployerProfileEditView.as_view(),name='Employer_Profile_UpdateAPIView'),
    path('upload/<int:employer_id>', PDFFileUploadView, name='upload_pdf'),
    path('getemployerdetails/<int:id>/', get_employer_details, name='employer-detail-by-employer-id'),
    path('DashboardData',get_dashboard_data, name='iwo_dashboard'),
    path('IWO_Data',insert_iwo_detail, name='iwo_pdf_data'),
    path('ConvertExcelToJson',convert_excel_to_json.as_view(), name='ConvertExcelToJson'),
    path('EmployeeDelete/<str:case_id>/<str:ee_id>/',EmployeeDeleteAPIView.as_view(), name='Employee-Delete-APIView'),
    path('GarOrderDelete/<str:case_id>/',GarOrderDeleteAPIView.as_view(), name='Gar-Order-Delete-APIView'),
    path('CompanyDelete/<str:cid>/',CompanyDeleteAPIView.as_view(), name='Company-Delete-APIView'),
    path('ExportEmployees/<str:cid>/', export_employee_data, name='export-employee-data'),
    path('EmployeeImportView/<int:employer_id>/', EmployeeImportView.as_view(), name='Employee-Import-View'),
    path('logdata', LastFiveLogsView.as_view(), name=' Garnishment Calculation'),
    path('GetAllemployerdetail', EmployerProfileList.as_view(), name='employer-profile-list'),
    path('GetAllEmplloyeeDetail', EmployeeDetailsList.as_view(), name='employer-profile-list'),
    path('GetSingleEmployee/<str:case_id>/<str:ee_id>/', get_single_employee_details, name='get-single-employee-details'),
    path('GetOrderDetails/', get_order_details, name='get_order_details'),
    path('password-reset', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('setting/<int:employer_id>/',GETSettingDetails.as_view(), name='Get Setting'),
    path('POSTsetting/',SettingPostAPI, name='POST Setting'),
    path('call-count/', APICallCountView.as_view(), name='api-call-count'),
    path('state_tax_case/',StateTaxView.as_view(), name='state_tax_case'),
    #path('ChildSupportBatchResult/<str:batch_id>', ChildSupportGarnishmentBatchResult.as_view(), name='Calculation Data'),
    path('upsert-employees-details/', upsert_employees_data, name='import_employees_api'),
    path('upsert-company-details/', upsert_company_details, name='upsert_company_details'),
    path('upsert_gar_order/', upsert_garnishment_order, name='upsert_garnishment_order'),
    path('Company_Details/', CompanyDetails.as_view(), name='CompanyDetails'),
    path('ExportCompany/', export_company_data, name='export_company_data'),
    path('GarnishmentFeesStatesRules/', GETGarnishmentFeesStatesRule.as_view(), name='GETGarnishmentFeesStatesRule'),
    path('GarnishmentFeesRules/<str:rule>/', GETGarnishmentFeesRules, name='GETGarnishmentFeesRules'),
    path('GarnishmentFeesRulesUpdate/<str:rule>/', GarFeesRulesUpdateAPIView.as_view(), name='GETGarnishmentFeesRules'),
    path('GarnishmentFeesRulesBasedOnState/<str:state>/', garnishment_fees_rules_based_on_state, name='GarnishmentFeesRulesBasedOnState'),
    path('EmployeeRules/', Employeegarnishment_orderMatch_details.as_view(), name='employee-garnishment-match'),
    path('garnishment_calculate/', PostCalculationView.as_view(), name='Calculation Data'),
    path('WithholdingLimitRuleData/<str:state>', GETWithholdingLimitRuleData.as_view(), name='Withholding Limit Rule Data'),
    path('MandatoryDeductions/<str:state>', GETMandatoryDeductions.as_view(), name='Mandatory Deductions')

]

