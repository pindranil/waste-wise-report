import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { MarkEmailRead } from '@mui/icons-material';
import { notificationsApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import Layout from '../components/Layout';
import NotificationList from '../components/NotificationList';

const NotificationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    notifications, 
    unreadCount,
    setNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await notificationsApi.getAll(user.id);
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };
    
    fetchNotifications();
  }, [user, setNotifications]);
  
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      markAsRead(id);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationsApi.markAllAsRead(user.id);
      markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  
  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'
            }
          </Typography>
        </Box>
        
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </Box>
      
      <Box sx={{ maxWidth: 600 }}>
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </Box>
    </Layout>
  );
};

export default NotificationsPage;
