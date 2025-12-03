import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { alertsApi } from '../api/client';
import { Alert } from '../types';
import { useAuthStore } from '../stores/authStore';
import { garbageTypes, statusOptions } from '../mocks/dummyData';
import Layout from '../components/Layout';
import ChatBox from '../components/ChatBox';
import MapPicker from '../components/MapPicker';

const ChatPage: React.FC = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAlert = async () => {
      if (!alertId) return;
      
      try {
        const response = await alertsApi.getById(alertId);
        setAlert(response.data);
      } catch (error) {
        console.error('Error fetching alert:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlert();
  }, [alertId]);
  
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }
  
  if (!alert) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>Alert not found</Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Layout>
    );
  }
  
  const statusConfig = statusOptions.find(s => s.value === alert.status);
  const garbageLabel = garbageTypes.find(g => g.value === alert.garbage_type)?.label;
  
  return (
    <Layout>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component="button"
          underline="hover" 
          color="inherit"
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/user')}
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Chat</Typography>
      </Breadcrumbs>
      
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Chat - Alert #{alertId?.slice(-6)}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Alert Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Alert Details</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip 
                    label={statusConfig?.label}
                    color={statusConfig?.color as any}
                    size="small"
                  />
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Typography>{garbageLabel}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Quantity</Typography>
                  <Typography sx={{ textTransform: 'capitalize' }}>{alert.quantity}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Description</Typography>
                  <Typography>{alert.description || 'No description'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Reported</Typography>
                  <Typography>{dayjs(alert.created_at).format('MMM D, YYYY HH:mm')}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          {/* Map */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn fontSize="small" /> Location
            </Typography>
            <MapPicker 
              position={{ lat: alert.latitude, lng: alert.longitude }}
              onPositionChange={() => {}}
              readOnly
              height={200}
            />
          </Box>
        </Grid>
        
        {/* Chat */}
        <Grid item xs={12} md={8}>
          <ChatBox alertId={alertId!} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ChatPage;
