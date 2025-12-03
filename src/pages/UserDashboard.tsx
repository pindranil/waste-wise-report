import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  List as ListIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { alertsApi, formTypesApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Alert as AlertType, FormType } from '../types';
import { garbageTypes, quantityOptions } from '../mocks/dummyData';
import MapPicker from '../components/MapPicker';
import AlertCard from '../components/AlertCard';
import DynamicForm from '../components/DynamicForm';
import Layout from '../components/Layout';

interface AlertForm {
  garbage_type: string;
  quantity: string;
  description: string;
  image: FileList | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Form modal state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(null);
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<AlertForm>();
  
  // Fetch alerts and form types
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [alertsRes, formTypesRes] = await Promise.all([
          alertsApi.getAll({ user_id: user.id }),
          formTypesApi.getAll(),
        ]);
        setAlerts(alertsRes.data);
        setFormTypes(formTypesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setAlertsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  
  const onSubmit = async (data: AlertForm) => {
    if (!position) {
      setError('Please select a location on the map');
      return;
    }
    
    if (!user) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const alertData = {
        user_id: user.id,
        latitude: position.lat,
        longitude: position.lng,
        garbage_type: data.garbage_type,
        quantity: data.quantity,
        description: data.description,
        image: imagePreview,
      };
      
      const response = await alertsApi.create(alertData);
      setAlerts(prev => [response.data, ...prev]);
      setSuccess(true);
      reset();
      setPosition(null);
      setImagePreview(null);
      setTabValue(1); // Switch to alerts list
    } catch (err) {
      setError('Failed to submit alert. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleOpenFormDialog = (alert: AlertType) => {
    setSelectedAlert(alert);
    const formType = formTypes.find(f => f.id === alert.form_type_id);
    if (formType) {
      setSelectedFormType(formType);
      setFormDialogOpen(true);
    }
  };
  
  const handleFormSubmit = async (formData: Record<string, any>) => {
    if (!selectedAlert) return;
    
    try {
      await formTypesApi.submitResponse(selectedAlert.id, formData);
      
      // Update local state
      setAlerts(prev => prev.map(a => 
        a.id === selectedAlert.id 
          ? { ...a, form_response: formData }
          : a
      ));
      
      setFormDialogOpen(false);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };
  
  return (
    <Layout>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Report Waste
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Help keep your community clean by reporting waste issues
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab icon={<AddIcon />} label="New Report" iconPosition="start" />
          <Tab icon={<ListIcon />} label={`My Alerts (${alerts.length})`} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* New Report Tab */}
      <TabPanel value={tabValue} index={0}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Map */}
          <Grid item xs={12} lg={6}>
            <Typography variant="h6" gutterBottom>
              📍 Select Location
            </Typography>
            <MapPicker position={position} onPositionChange={setPosition} height={400} />
          </Grid>
          
          {/* Form */}
          <Grid item xs={12} lg={6}>
            <Typography variant="h6" gutterBottom>
              📝 Report Details
            </Typography>
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Controller
                      name="garbage_type"
                      control={control}
                      rules={{ required: 'Please select garbage type' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Type of Waste"
                          error={!!errors.garbage_type}
                          helperText={errors.garbage_type?.message}
                        >
                          {garbageTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    
                    <Controller
                      name="quantity"
                      control={control}
                      rules={{ required: 'Please select quantity' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Quantity/Size"
                          error={!!errors.quantity}
                          helperText={errors.quantity?.message}
                        >
                          {quantityOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    
                    <TextField
                      {...register('description')}
                      fullWidth
                      multiline
                      rows={3}
                      label="Description (optional)"
                      placeholder="Add any additional details about the waste..."
                    />
                    
                    {/* Image Upload */}
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                      <label htmlFor="image-upload">
                        <Button variant="outlined" component="span" fullWidth>
                          📷 Upload Photo (optional)
                        </Button>
                      </label>
                      
                      {imagePreview && (
                        <Box sx={{ mt: 2, position: 'relative' }}>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ 
                              width: '100%', 
                              maxHeight: 200, 
                              objectFit: 'cover',
                              borderRadius: 8,
                            }} 
                          />
                          <Button 
                            size="small" 
                            color="error"
                            onClick={() => setImagePreview(null)}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}
                    </Box>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting || !position}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    >
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Alerts List Tab */}
      <TabPanel value={tabValue} index={1}>
        {alertsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : alerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No alerts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Start by creating a new waste report
            </Typography>
            <Button variant="contained" onClick={() => setTabValue(0)}>
              Create Report
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {alerts.map((alert) => (
              <Grid item xs={12} sm={6} md={4} key={alert.id}>
                <AlertCard
                  alert={alert}
                  showUserActions
                  onChat={() => navigate(`/chat/${alert.id}`)}
                  onFillForm={() => handleOpenFormDialog(alert)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      {/* Dynamic Form Dialog */}
      <Dialog 
        open={formDialogOpen} 
        onClose={() => setFormDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Additional Information Required</DialogTitle>
        <DialogContent>
          {selectedFormType && (
            <DynamicForm
              formType={selectedFormType}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        message="Operation completed successfully!"
      />
    </Layout>
  );
};

export default UserDashboard;
