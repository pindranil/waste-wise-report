// Local mock API - simulates backend without MSW
import dayjs from 'dayjs';
import { 
  users, 
  initialAlerts, 
  initialMessages, 
  initialNotifications, 
  formTypes 
} from '../mocks/dummyData';
import { Message } from '../types';

// Initialize data from localStorage or defaults
const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// In-memory + localStorage data store
let alerts = getStoredData('mock_alerts', initialAlerts);
let messages: Message[] = getStoredData('mock_messages', initialMessages);
let notifications = getStoredData('mock_notifications', initialNotifications);

const saveAlerts = () => setStoredData('mock_alerts', alerts);
const saveMessages = () => setStoredData('mock_messages', messages);
const saveNotifications = () => setStoredData('mock_notifications', notifications);

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== AUTH ====================
export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw { response: { data: { error: 'Invalid email or password' }, status: 401 } };
    }
    const token = btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }));
    return { data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } };
  },
};

// ==================== ALERTS ====================
export const mockAlertsApi = {
  getAll: async (params?: { user_id?: string; status?: string; garbage_type?: string }) => {
    await delay(300);
    let filteredAlerts = [...alerts];
    if (params?.user_id) filteredAlerts = filteredAlerts.filter(a => a.user_id === params.user_id);
    if (params?.status && params.status !== 'all') filteredAlerts = filteredAlerts.filter(a => a.status === params.status);
    if (params?.garbage_type && params.garbage_type !== 'all') filteredAlerts = filteredAlerts.filter(a => a.garbage_type === params.garbage_type);
    filteredAlerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { data: filteredAlerts };
  },
  getById: async (id: string) => {
    await delay(200);
    const alert = alerts.find(a => a.id === id);
    if (!alert) throw { response: { data: { error: 'Alert not found' }, status: 404 } };
    return { data: alert };
  },
  create: async (data: any) => {
    await delay(400);
    const newAlert = {
      id: generateId('alert'), user_id: data.user_id, latitude: data.latitude, longitude: data.longitude,
      garbage_type: data.garbage_type, quantity: data.quantity, image: data.image || null,
      description: data.description || '', status: 'pending' as const, created_at: dayjs().toISOString(),
      updated_at: dayjs().toISOString(), is_form_sent: false, form_type_id: null, form_response: null,
    };
    alerts = [newAlert, ...alerts];
    saveAlerts();
    notifications = [{ id: generateId('notif'), user_id: 'admin-1', title: 'New Alert', body: `New ${data.garbage_type} waste report.`, is_read: false, created_at: dayjs().toISOString() }, ...notifications];
    saveNotifications();
    return { data: newAlert };
  },
  update: async (id: string, data: any) => {
    await delay(300);
    const alertIndex = alerts.findIndex(a => a.id === id);
    if (alertIndex === -1) throw { response: { data: { error: 'Alert not found' }, status: 404 } };
    alerts[alertIndex] = { ...alerts[alertIndex], ...data, updated_at: dayjs().toISOString() };
    saveAlerts();
    return { data: alerts[alertIndex] };
  },
};

// ==================== FORM TYPES ====================
export const mockFormTypesApi = {
  getAll: async () => { await delay(200); return { data: formTypes }; },
  sendForm: async (formTypeId: string, alertId: string) => {
    await delay(300);
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) throw { response: { data: { error: 'Alert not found' }, status: 404 } };
    alerts[alertIndex] = { ...alerts[alertIndex], is_form_sent: true, form_type_id: formTypeId, updated_at: dayjs().toISOString() };
    saveAlerts();
    return { data: { success: true } };
  },
  submitResponse: async (alertId: string, response: any) => {
    await delay(300);
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) throw { response: { data: { error: 'Alert not found' }, status: 404 } };
    alerts[alertIndex] = { ...alerts[alertIndex], form_response: response, updated_at: dayjs().toISOString() };
    saveAlerts();
    return { data: { success: true } };
  },
};

// ==================== MESSAGES ====================
export const mockMessagesApi = {
  getByAlertId: async (alertId: string) => {
    await delay(200);
    const alertMessages = messages.filter(m => m.alert_id === alertId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return { data: alertMessages };
  },
  send: async (data: { alert_id: string; sender_id: string; sender_role: string; content: string }) => {
    await delay(200);
    const newMessage: Message = {
      id: generateId('msg'), alert_id: data.alert_id, sender_id: data.sender_id,
      sender_role: data.sender_role as 'user' | 'admin', content: data.content,
      created_at: dayjs().toISOString(), is_read: false,
    };
    messages = [...messages, newMessage];
    saveMessages();
    return { data: newMessage };
  },
};

// ==================== NOTIFICATIONS ====================
export const mockNotificationsApi = {
  getAll: async (userId?: string) => {
    await delay(200);
    let userNotifications = userId ? notifications.filter(n => n.user_id === userId) : notifications;
    userNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { data: userNotifications };
  },
  create: async (data: { user_id: string; title: string; body: string }) => {
    await delay(200);
    const newNotification = { id: generateId('notif'), user_id: data.user_id, title: data.title, body: data.body, is_read: false, created_at: dayjs().toISOString() };
    notifications = [newNotification, ...notifications];
    saveNotifications();
    return { data: newNotification };
  },
  markAsRead: async (id: string) => { await delay(100); notifications = notifications.map(n => n.id === id ? { ...n, is_read: true } : n); saveNotifications(); return { data: { success: true } }; },
  markAllAsRead: async (userId: string) => { await delay(100); notifications = notifications.map(n => n.user_id === userId ? { ...n, is_read: true } : n); saveNotifications(); return { data: { success: true } }; },
};
