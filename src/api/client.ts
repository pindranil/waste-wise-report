// API client - uses local mock API for demo
import {
  mockAuthApi,
  mockAlertsApi,
  mockFormTypesApi,
  mockMessagesApi,
  mockNotificationsApi,
} from './mockApi';

// Export API functions that use the mock implementation
export const authApi = {
  login: (email: string, password: string) => mockAuthApi.login(email, password),
};

export const alertsApi = {
  getAll: (params?: { user_id?: string; status?: string; garbage_type?: string }) => 
    mockAlertsApi.getAll(params),
  getById: (id: string) => mockAlertsApi.getById(id),
  create: (data: any) => mockAlertsApi.create(data),
  update: (id: string, data: any) => mockAlertsApi.update(id, data),
};

export const formTypesApi = {
  getAll: () => mockFormTypesApi.getAll(),
  sendForm: (formTypeId: string, alertId: string) => 
    mockFormTypesApi.sendForm(formTypeId, alertId),
  submitResponse: (alertId: string, response: any) => 
    mockFormTypesApi.submitResponse(alertId, response),
};

export const messagesApi = {
  getByAlertId: (alertId: string) => mockMessagesApi.getByAlertId(alertId),
  send: (data: { alert_id: string; sender_id: string; sender_role: string; content: string }) => 
    mockMessagesApi.send(data),
};

export const notificationsApi = {
  getAll: (userId?: string) => mockNotificationsApi.getAll(userId),
  create: (data: { user_id: string; title: string; body: string }) => 
    mockNotificationsApi.create(data),
  markAsRead: (id: string) => mockNotificationsApi.markAsRead(id),
  markAllAsRead: (userId: string) => mockNotificationsApi.markAllAsRead(userId),
};

export default {
  authApi,
  alertsApi,
  formTypesApi,
  messagesApi,
  notificationsApi,
};
