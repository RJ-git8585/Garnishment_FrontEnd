// src/constants/apiConstants.js

/**
 * The base URL for the Garnishment Backend API.
 * This URL is used as the root endpoint for all API requests.
 * 
 * @constant {string} API_BASE_URL
 */
const API_BASE_URL = "https://garnishment-backend-6lzi.onrender.com";

export const API_URLS = {
  // Auth APIs
  LOGIN: `${API_BASE_URL}/User/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PASSWORD_RESET_CONFIRM: (token) => `${API_BASE_URL}/auth/password-reset-confirm/${token}/`,
  PASSWORD_RESET_REQUEST: `${API_BASE_URL}/auth/password-reset/`,

  // Employee APIs
  GET_EMPLOYEES: `${API_BASE_URL}/employee/rules/`,
  EXPORT_EMPLOYEE: `${API_BASE_URL}/employee/export/`,
  EDIT_EMPLOYEE: (caseId, employeeId) => `${API_BASE_URL}/employee/edit/${caseId}/${employeeId}`,
  DELETE_EMPLOYEE: (employeeId) => `${API_BASE_URL}/employee/delete/${employeeId}`,
  UPSERT_EMPLOYEE: `${API_BASE_URL}/employee/upsert/`,

  // Order APIs
  GET_ORDER_DETAILS: `${API_BASE_URL}/garnishment/order-details/`,
  EXPORT_ORDER: `${API_BASE_URL}/garnishment/export-orders/`,
  UPSERT_ORDER: `${API_BASE_URL}/garnishment/upsert-orders/`,

  // Dashboard APIs
  DASHBOARD_USERS_DATA: `${API_BASE_URL}/utility/dashboard/`,
  DASHBOARD_LOGDATA: `${API_BASE_URL}/garnishment/logs/`,
  EXPORT_EMPLOYEES: `${API_BASE_URL}/User/ExportEmployees`,
  
  // Department APIs
  GET_DEPARTMENTS: `${API_BASE_URL}/User/Department`,
  
  // Employee APIs
  GET_EMPLOYEE_DETAILS: `${API_BASE_URL}/User/employee_details/`,
  ADD_EMPLOYEE: `${API_BASE_URL}/employees/add`,
  UPDATE_EMPLOYEE: `${API_BASE_URL}/employees/update`,

  // Rules APIs
  RULESDATA: `${API_BASE_URL}/User/WithholdingLimitRuleData`,
  RULESDATA2: `${API_BASE_URL}/User/MandatoryDeductions`,
  RULESDATA3: `${API_BASE_URL}/User/GarnishmentCalculationRules`,

  // Creditor Rule APIs
  GET_CREDITOR_RULES: `${API_BASE_URL}/garnishment_creditor/creditor-debt-rule/`,
  UPDATE_CREDITOR_RULE: `${API_BASE_URL}/garnishment_creditor/creditor-debt-rule/:state/`,
  CREDITOR_RULE_EDIT_REQUEST: `${API_BASE_URL}/garnishment_creditor/creditor-debt-rule-edit-request/`,
  GET_GARNISHMENT_EXEMPT_CONFIG: `${API_BASE_URL}/garnishment_creditor/creditor-debt-exempt-amt-config/`,
  // Child Support Rule APIs
  GET_CHILD_SUPPORT_RULES: `${API_BASE_URL}/garnishment/child-support-rules/`,
  UPDATE_CHILD_SUPPORT_RULE: `${API_BASE_URL}/garnishment/child-support-rules/:state/`,

  // State Tax Levy Rule APIs
  GET_STATE_TAX_RULES: `${API_BASE_URL}/garnishment_state/state-tax-levy-config-data/`,
  GET_STATE_TAX_RULE_BY_STATE: `${API_BASE_URL}/garnishment_state/state-tax-levy-config-data/:state/`,
  UPDATE_STATE_TAX_RULE: `${API_BASE_URL}/garnishment_state/state-tax-levy-config-data/`,
  STATE_TAX_RULE_EDIT_REQUEST: `${API_BASE_URL}/garnishment_state/state-tax-levy-rule-edit-request/`,
    // State Tax Levy Exempt Amount Configuration APIs
  GET_CREDITOR_RULE_BY_STATE: `${API_BASE_URL}/garnishment_state/state-tax-levy-config-data/:state`,
  STATE_TAX_LEVY_EXEMPT: `${API_BASE_URL}/garnishment_state/state-tax-levy-exempt-amt-config/`,
  // Garnishment Exempt Amount Configuration APIs
  
  // Creditor Debt Applied Rule APIs
  GET_CREDITOR_DEBT_APPLIED_RULE: (caseId) => `${API_BASE_URL}/garnishment_creditor/creditor-debt-applied-rule/${caseId}/`,

  // State Tax Levy Applied Rule APIs
  GET_STATE_TAX_LEVY_APPLIED_RULE: (caseId) => `${API_BASE_URL}/garnishment_state/state-tax-levy-applied-rule/${caseId}`,

  // Creditor Debt Exempt Amount Configuration APIs
  GET_CREDITOR_DEBT_EXEMPT_CONFIG: (state, weekly) => 
    `${API_BASE_URL}/garnishment_creditor/creditor-debt-exempt-amt-config/${state.toLowerCase()}/${weekly.toLowerCase()}/`,

  // State Tax Levy Exempt Amount Configuration
  GET_STATE_TAX_LEVY_EXEMPT_CONFIG: (state, weekly) => 
    `${API_BASE_URL}/garnishment_state/state-tax-levy-exempt-amt-config/${state.toLowerCase()}/${weekly.toLowerCase()}/`,
};
