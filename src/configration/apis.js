// src/constants/apiConstants.js

/**
 * The base URL for the Garnishment Backend API.
 * This URL is used as the root endpoint for all API requests.
 * 
 * @constant {string} API_BASE_URL
 */
const API_BASE_URL = "https://garnishment-backend-6lzi.onrender.com";

export const API_URLS = {
  DASHBOARD_USERS_DATA: `${API_BASE_URL}/User/DashboardData`,
  DASHBOARD_LOGDATA: `${API_BASE_URL}/User/logdata`,
  EXPORT_EMPLOYEES: `${API_BASE_URL}/User/ExportEmployees`,
  RULESDATA: `${API_BASE_URL}/User/WithholdingLimitRuleData`,
  RULESDATA2: `${API_BASE_URL}/User/MandatoryDeductions`,
  RULESDATA3: `${API_BASE_URL}/User/GarnishmentCalculationRules`,

  ADD_EMPLOYEE: `${API_BASE_URL}/employees/add`,
  UPDATE_EMPLOYEE: `${API_BASE_URL}/employees/update`,
  DELETE_EMPLOYEE: `${API_BASE_URL}/employees/delete`,
};
