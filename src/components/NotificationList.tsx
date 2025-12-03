import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Paper,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead,
  Circle,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Notification } from '../types';

dayjs.extend(relativeTime);

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon />
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Chip 
              label={unreadCount} 
              size="small" 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                fontWeight: 600,
              }} 
            />
          )}
        </Box>
        {unreadCount > 0 && onMarkAllAsRead && (
          <IconButton 
            size="small" 
            onClick={onMarkAllAsRead}
            sx={{ color: 'white' }}
          >
            <MarkEmailRead />
          </IconButton>
        )}
      </Box>
      
      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
          <Typography color="text.secondary">
            No notifications yet
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                  cursor: 'pointer',
                }}
                onClick={() => !notification.is_read && onMarkAsRead?.(notification.id)}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {!notification.is_read && (
                    <Circle sx={{ fontSize: 10, color: 'primary.main' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={notification.is_read ? 400 : 600}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.body}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {dayjs(notification.created_at).fromNow()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default NotificationList;
