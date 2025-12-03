// MSW handlers for mock API
import { http, HttpResponse, delay } from 'msw';
import { 
  users, 
  initialAlerts, 
  initialMessages, 
  initialNotifications, 
  formTypes 
} from './dummyData';
import dayjs from 'dayjs';

// In-memory data store (simulates database)
let alerts = [...initialAlerts];
let messages = [...initialMessages];
let notifications = [...initialNotifications];

// Generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const handlers = [
  // ==================== AUTH ====================
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500);
    const body = await request.json() as { email: string; password: string };
    
    const user = users.find(u => u.email === body.email && u.password === body.password);
    
    if (!user) {
      return HttpResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate fake JWT
    const token = btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }));
    
    return HttpResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }),

  // ==================== ALERTS ====================
  http.get('/api/alerts', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    const status = url.searchParams.get('status');
    const garbageType = url.searchParams.get('garbage_type');
    
    let filteredAlerts = [...alerts];
    
    // Filter by user if specified
    if (userId) {
      filteredAlerts = filteredAlerts.filter(a => a.user_id === userId);
    }
    
    // Filter by status
    if (status && status !== 'all') {
      filteredAlerts = filteredAlerts.filter(a => a.status === status);
    }
    
    // Filter by garbage type
    if (garbageType && garbageType !== 'all') {
      filteredAlerts = filteredAlerts.filter(a => a.garbage_type === garbageType);
    }
    
    // Sort by created_at descending
    filteredAlerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return HttpResponse.json(filteredAlerts);
  }),

  http.get('/api/alerts/:id', async ({ params }) => {
    await delay(200);
    const alert = alerts.find(a => a.id === params.id);
    
    if (!alert) {
      return HttpResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    return HttpResponse.json(alert);
  }),

  http.post('/api/alerts', async ({ request }) => {
    await delay(400);
    const body = await request.json() as any;
    
    const newAlert = {
      id: generateId('alert'),
      user_id: body.user_id,
      latitude: body.latitude,
      longitude: body.longitude,
      garbage_type: body.garbage_type,
      quantity: body.quantity,
      image: body.image || null,
      description: body.description || '',
      status: 'pending' as const,
      created_at: dayjs().toISOString(),
      updated_at: dayjs().toISOString(),
      is_form_sent: false,
      form_type_id: null,
      form_response: null,
    };
    
    alerts.unshift(newAlert);
    
    // Create notification for admins
    const adminNotif = {
      id: generateId('notif'),
      user_id: 'admin-1',
      title: 'New Alert Received',
      body: `A new ${body.garbage_type} waste report has been submitted.`,
      is_read: false,
      created_at: dayjs().toISOString(),
    };
    notifications.unshift(adminNotif);
    
    return HttpResponse.json(newAlert, { status: 201 });
  }),

  http.put('/api/alerts/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as any;
    const alertIndex = alerts.findIndex(a => a.id === params.id);
    
    if (alertIndex === -1) {
      return HttpResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    const updatedAlert = {
      ...alerts[alertIndex],
      ...body,
      updated_at: dayjs().toISOString(),
    };
    
    alerts[alertIndex] = updatedAlert;
    
    // Create notification for status changes
    if (body.status && body.status !== alerts[alertIndex].status) {
      const userNotif = {
        id: generateId('notif'),
        user_id: alerts[alertIndex].user_id,
        title: 'Alert Status Updated',
        body: `Your alert has been updated to "${body.status}".`,
        is_read: false,
        created_at: dayjs().toISOString(),
      };
      notifications.unshift(userNotif);
    }
    
    return HttpResponse.json(updatedAlert);
  }),

  // ==================== FORM TYPES ====================
  http.get('/api/form-types', async () => {
    await delay(200);
    return HttpResponse.json(formTypes);
  }),

  http.post('/api/forms/:formTypeId/send', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as { alert_id: string };
    const alertIndex = alerts.findIndex(a => a.id === body.alert_id);
    
    if (alertIndex === -1) {
      return HttpResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      is_form_sent: true,
      form_type_id: params.formTypeId as string,
      updated_at: dayjs().toISOString(),
    };
    
    // Create notification for user
    const userNotif = {
      id: generateId('notif'),
      user_id: alerts[alertIndex].user_id,
      title: 'Form Request',
      body: 'Admin has requested additional information for your alert.',
      is_read: false,
      created_at: dayjs().toISOString(),
    };
    notifications.unshift(userNotif);
    
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/form-responses', async ({ request }) => {
    await delay(300);
    const body = await request.json() as { alert_id: string; response: any };
    const alertIndex = alerts.findIndex(a => a.id === body.alert_id);
    
    if (alertIndex === -1) {
      return HttpResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      form_response: body.response,
      updated_at: dayjs().toISOString(),
    };
    
    // Notify admin
    const adminNotif = {
      id: generateId('notif'),
      user_id: 'admin-1',
      title: 'Form Response Received',
      body: `User has submitted form response for alert #${body.alert_id}.`,
      is_read: false,
      created_at: dayjs().toISOString(),
    };
    notifications.unshift(adminNotif);
    
    return HttpResponse.json({ success: true });
  }),

  // ==================== MESSAGES ====================
  http.get('/api/messages', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const alertId = url.searchParams.get('alertId');
    
    if (!alertId) {
      return HttpResponse.json({ error: 'alertId is required' }, { status: 400 });
    }
    
    const alertMessages = messages
      .filter(m => m.alert_id === alertId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    return HttpResponse.json(alertMessages);
  }),

  http.post('/api/messages', async ({ request }) => {
    await delay(200);
    const body = await request.json() as any;
    
    const newMessage = {
      id: generateId('msg'),
      alert_id: body.alert_id,
      sender_id: body.sender_id,
      sender_role: body.sender_role,
      content: body.content,
      created_at: dayjs().toISOString(),
      is_read: false,
    };
    
    messages.push(newMessage);
    
    // Create notification for recipient
    const alert = alerts.find(a => a.id === body.alert_id);
    if (alert) {
      const recipientId = body.sender_role === 'admin' ? alert.user_id : 'admin-1';
      const notif = {
        id: generateId('notif'),
        user_id: recipientId,
        title: 'New Message',
        body: `You have a new message regarding alert #${body.alert_id}.`,
        is_read: false,
        created_at: dayjs().toISOString(),
      };
      notifications.unshift(notif);
    }
    
    return HttpResponse.json(newMessage, { status: 201 });
  }),

  // ==================== NOTIFICATIONS ====================
  http.get('/api/notifications', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    
    let userNotifications = notifications;
    if (userId) {
      userNotifications = notifications.filter(n => n.user_id === userId);
    }
    
    // Sort by created_at descending
    userNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return HttpResponse.json(userNotifications);
  }),

  http.post('/api/notifications', async ({ request }) => {
    await delay(200);
    const body = await request.json() as any;
    
    const newNotification = {
      id: generateId('notif'),
      user_id: body.user_id,
      title: body.title,
      body: body.body,
      is_read: false,
      created_at: dayjs().toISOString(),
    };
    
    notifications.unshift(newNotification);
    return HttpResponse.json(newNotification, { status: 201 });
  }),

  http.put('/api/notifications/:id/read', async ({ params }) => {
    await delay(100);
    const notifIndex = notifications.findIndex(n => n.id === params.id);
    
    if (notifIndex !== -1) {
      notifications[notifIndex] = {
        ...notifications[notifIndex],
        is_read: true,
      };
    }
    
    return HttpResponse.json({ success: true });
  }),

  http.put('/api/notifications/read-all', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    
    notifications = notifications.map(n => 
      n.user_id === userId ? { ...n, is_read: true } : n
    );
    
    return HttpResponse.json({ success: true });
  }),
];
