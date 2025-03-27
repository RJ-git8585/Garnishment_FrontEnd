// src/constants/apiConstants.js

const API_BASE_URL = "https://garnishment-backend.onrender.com";

export const API_URLS = {
  DASHBOARD_USERS_DATA: `${API_BASE_URL}/User/DashboardData`,
  DASHBOARD_LOGDATA: `${API_BASE_URL}/User/logdata`,
  EXPORT_EMPLOYEES: `${API_BASE_URL}/User/ExportEmployees`,



  ADD_EMPLOYEE: `${API_BASE_URL}/employees/add`,
  UPDATE_EMPLOYEE: `${API_BASE_URL}/employees/update`,
  DELETE_EMPLOYEE: `${API_BASE_URL}/employees/delete`,
};
