import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Visibility as ViewIcon,
  Assignment as FormIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Alert } from '../types';
import { garbageTypes, quantityOptions, statusOptions } from '../mocks/dummyData';

dayjs.extend(relativeTime);

interface AlertCardProps {
  alert: Alert;
  onView?: () => void;
  onChat?: () => void;
  onFillForm?: () => void;
  showAdminActions?: boolean;
  showUserActions?: boolean;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onView,
  onChat,
  onFillForm,
  showAdminActions = false,
  showUserActions = false,
}) => {
  const statusConfig = statusOptions.find(s => s.value === alert.status);
  const garbageLabel = garbageTypes.find(g => g.value === alert.garbage_type)?.label || alert.garbage_type;
  const quantityLabel = quantityOptions.find(q => q.value === alert.quantity)?.label || alert.quantity;
  
  const getStatusColor = () => {
    switch (alert.status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };
  
  const getGarbageTypeColor = () => {
    switch (alert.garbage_type) {
      case 'hazardous': return '#D32F2F';
      case 'electronic': return '#7B1FA2';
      case 'construction': return '#F57C00';
      case 'household': return '#388E3C';
      case 'organic': return '#689F38';
      case 'recyclable': return '#0288D1';
      default: return '#757575';
    }
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip 
            label={statusConfig?.label || alert.status} 
            color={getStatusColor()} 
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="inherit" />
            {dayjs(alert.created_at).fromNow()}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={garbageLabel}
            size="small"
            sx={{ 
              bgcolor: getGarbageTypeColor(),
              color: 'white',
              fontWeight: 500,
              mr: 1,
            }}
          />
          <Chip 
            label={quantityLabel}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        {alert.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {alert.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
          <LocationOn fontSize="small" />
          <Typography variant="caption">
            {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
          </Typography>
        </Box>
        
        {alert.is_form_sent && !alert.form_response && showUserActions && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="caption" color="warning.dark" fontWeight={600}>
              ⚠️ Form response required
            </Typography>
          </Box>
        )}
        
        {alert.form_response && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="caption" color="success.dark" fontWeight={600}>
              ✓ Form submitted
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        {onView && (
          <Tooltip title="View Details">
            <Button 
              size="small" 
              startIcon={<ViewIcon />}
              onClick={onView}
            >
              View
            </Button>
          </Tooltip>
        )}
        
        {onChat && (
          <Tooltip title="Open Chat">
            <Button 
              size="small" 
              startIcon={<ChatIcon />}
              onClick={onChat}
              color="secondary"
            >
              Chat
            </Button>
          </Tooltip>
        )}
        
        {onFillForm && alert.is_form_sent && !alert.form_response && (
          <Tooltip title="Fill Required Form">
            <Button 
              size="small" 
              startIcon={<FormIcon />}
              onClick={onFillForm}
              color="warning"
              variant="contained"
            >
              Fill Form
            </Button>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default AlertCard;
