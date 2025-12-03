// Type definitions for the waste-reporting app

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Alert {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  garbage_type: string;
  quantity: string;
  image: string | null;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
  is_form_sent: boolean;
  form_type_id: string | null;
  form_response: Record<string, any> | null;
}

export interface FormField {
  name: string;
  type: 'text' | 'select' | 'checkbox' | 'textarea';
  label: string;
  options?: string[];
  required: boolean;
}

export interface FormType {
  id: string;
  name: string;
  description: string;
  fields_json: FormField[];
}

export interface Message {
  id: string;
  alert_id: string;
  sender_id: string;
  sender_role: 'user' | 'admin';
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface Position {
  lat: number;
  lng: number;
}
