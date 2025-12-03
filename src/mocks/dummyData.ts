// Dummy data for the waste-reporting application
import dayjs from 'dayjs';
import { FormField } from '../types';

// Demo users
export const users = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'user@demo.com',
    password: 'demo123',
    role: 'user' as const,
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin' as const,
  },
];

// Form types for dynamic forms
export const formTypes: { id: string; name: string; description: string; fields_json: FormField[] }[] = [
  {
    id: 'form-1',
    name: 'Overflow Details',
    description: 'Detailed information about garbage overflow',
    fields_json: [
      { name: 'overflow_level', type: 'select' as const, label: 'Overflow Level', options: ['25%', '50%', '75%', '100%'], required: true },
      { name: 'smell_intensity', type: 'select' as const, label: 'Smell Intensity', options: ['None', 'Mild', 'Moderate', 'Strong'], required: true },
      { name: 'blocking_path', type: 'checkbox' as const, label: 'Is it blocking any pathway?', required: false },
      { name: 'additional_notes', type: 'textarea' as const, label: 'Additional Notes', required: false },
    ],
  },
  {
    id: 'form-2',
    name: 'Hazardous Waste Form',
    description: 'Report hazardous waste materials',
    fields_json: [
      { name: 'waste_type', type: 'select' as const, label: 'Type of Hazardous Waste', options: ['Chemical', 'Medical', 'Electronic', 'Industrial', 'Other'], required: true },
      { name: 'quantity_estimate', type: 'text' as const, label: 'Estimated Quantity (kg/liters)', required: true },
      { name: 'container_condition', type: 'select' as const, label: 'Container Condition', options: ['Intact', 'Leaking', 'Damaged', 'No Container'], required: true },
      { name: 'immediate_danger', type: 'checkbox' as const, label: 'Immediate danger to public?', required: false },
      { name: 'description', type: 'textarea' as const, label: 'Detailed Description', required: true },
    ],
  },
  {
    id: 'form-3',
    name: 'Large Item Disposal',
    description: 'Report large items needing special disposal',
    fields_json: [
      { name: 'item_type', type: 'select' as const, label: 'Item Type', options: ['Furniture', 'Appliance', 'Mattress', 'Construction Debris', 'Other'], required: true },
      { name: 'item_count', type: 'text' as const, label: 'Number of Items', required: true },
      { name: 'needs_equipment', type: 'checkbox' as const, label: 'Needs special equipment for removal?', required: false },
      { name: 'access_notes', type: 'textarea' as const, label: 'Access/Location Notes', required: false },
    ],
  },
];

// Initial alerts (sample data near San Francisco area)
export const initialAlerts = [
  {
    id: 'alert-1',
    user_id: 'user-1',
    latitude: 37.7749,
    longitude: -122.4194,
    garbage_type: 'household',
    quantity: 'large',
    image: null,
    status: 'pending' as const,
    created_at: dayjs().subtract(2, 'hour').toISOString(),
    updated_at: dayjs().subtract(2, 'hour').toISOString(),
    is_form_sent: false,
    form_type_id: null,
    form_response: null,
    description: 'Overflowing garbage bin near the park entrance',
  },
  {
    id: 'alert-2',
    user_id: 'user-1',
    latitude: 37.7849,
    longitude: -122.4094,
    garbage_type: 'hazardous',
    quantity: 'medium',
    image: null,
    status: 'processing' as const,
    created_at: dayjs().subtract(1, 'day').toISOString(),
    updated_at: dayjs().subtract(6, 'hour').toISOString(),
    is_form_sent: true,
    form_type_id: 'form-2',
    form_response: null,
    description: 'Leaking chemical containers found behind warehouse',
  },
  {
    id: 'alert-3',
    user_id: 'user-1',
    latitude: 37.7649,
    longitude: -122.4294,
    garbage_type: 'construction',
    quantity: 'small',
    image: null,
    status: 'completed' as const,
    created_at: dayjs().subtract(3, 'day').toISOString(),
    updated_at: dayjs().subtract(1, 'day').toISOString(),
    is_form_sent: false,
    form_type_id: null,
    form_response: null,
    description: 'Construction debris left on sidewalk',
  },
];

// Initial messages
export const initialMessages = [
  {
    id: 'msg-1',
    alert_id: 'alert-2',
    sender_id: 'admin-1',
    sender_role: 'admin' as const,
    content: 'We have received your report about hazardous waste. Our team is investigating.',
    created_at: dayjs().subtract(5, 'hour').toISOString(),
    is_read: true,
  },
  {
    id: 'msg-2',
    alert_id: 'alert-2',
    sender_id: 'user-1',
    sender_role: 'user' as const,
    content: 'Thank you for the quick response. Please let me know if you need more details.',
    created_at: dayjs().subtract(4, 'hour').toISOString(),
    is_read: true,
  },
];

// Initial notifications
export const initialNotifications = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    title: 'Alert Status Updated',
    body: 'Your alert has been updated to "processing".',
    is_read: false,
    created_at: dayjs().subtract(6, 'hour').toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'admin-1',
    title: 'New Alert Received',
    body: 'A new waste report has been submitted.',
    is_read: false,
    created_at: dayjs().subtract(30, 'minute').toISOString(),
  },
];

// Garbage types for selection
export const garbageTypes = [
  { value: 'household', label: 'Household Waste' },
  { value: 'hazardous', label: 'Hazardous Waste' },
  { value: 'construction', label: 'Construction Debris' },
  { value: 'electronic', label: 'Electronic Waste' },
  { value: 'organic', label: 'Organic/Garden Waste' },
  { value: 'recyclable', label: 'Recyclables' },
  { value: 'other', label: 'Other' },
];

// Quantity options
export const quantityOptions = [
  { value: 'small', label: 'Small (fits in a bag)' },
  { value: 'medium', label: 'Medium (1-3 bins)' },
  { value: 'large', label: 'Large (needs truck)' },
];

// Status options
export const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'completed', label: 'Completed', color: 'success' },
];
