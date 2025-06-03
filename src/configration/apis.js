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

  // Dashboard APIs
  DASHBOARD_USERS_DATA: `${API_BASE_URL}/User/DashboardData`,
  DASHBOARD_LOGDATA: `${API_BASE_URL}/User/logdata`,
  EXPORT_EMPLOYEES: `${API_BASE_URL}/User/ExportEmployees`,
  
  // Department APIs
  GET_DEPARTMENTS: `${API_BASE_URL}/User/Department`,
  
  // Employee APIs
  GET_EMPLOYEE_DETAILS: `${API_BASE_URL}/User/employee_details/`,
  ADD_EMPLOYEE: `${API_BASE_URL}/employees/add`,
  UPDATE_EMPLOYEE: `${API_BASE_URL}/employees/update`,
  DELETE_EMPLOYEE: `${API_BASE_URL}/employees/delete`,

  // Rules APIs
  RULESDATA: `${API_BASE_URL}/User/WithholdingLimitRuleData`,
  RULESDATA2: `${API_BASE_URL}/User/MandatoryDeductions`,
  RULESDATA3: `${API_BASE_URL}/User/GarnishmentCalculationRules`,

  // Creditor Rule APIs
  GET_CREDITOR_RULES: `${API_BASE_URL}/garnishment/creditor-debt-rule/`,
  UPDATE_CREDITOR_RULE: `${API_BASE_URL}/garnishment/creditor-debt-rule/:state/`,
  CREDITOR_RULE_EDIT_REQUEST: `${API_BASE_URL}/garnishment/creditor-debt-rule-edit-request/`,

  // Child Support Rule APIs
  GET_CHILD_SUPPORT_RULES: `${API_BASE_URL}/garnishment/child-support-rules/`,
  UPDATE_CHILD_SUPPORT_RULE: `${API_BASE_URL}/garnishment/child-support-rules/:state/`,

  // State Tax Levy Rule APIs
  GET_STATE_TAX_RULES: `${API_BASE_URL}/garnishment/state-tax-levy-config-data/`,
  GET_STATE_TAX_RULE_BY_STATE: `${API_BASE_URL}/garnishment/state-tax-levy-config-data/:state`,
  UPDATE_STATE_TAX_RULE: `${API_BASE_URL}/User/state-tax-levy-config-data/:state`,

  // Garnishment Exempt Amount Configuration APIs
  GET_GARNISHMENT_EXEMPT_CONFIG: `${API_BASE_URL}/garnishment/creditor-debt-exempt-amt-config/`,
};
