import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  Visibility,
  Chat,
  Send,
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { alertsApi, formTypesApi } from '../api/client';
import { Alert, FormType } from '../types';
import { garbageTypes, statusOptions } from '../mocks/dummyData';
import Layout from '../components/Layout';
import MapPicker from '../components/MapPicker';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [formTypes, setFormTypes] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', garbage_type: 'all' });
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsRes, formTypesRes] = await Promise.all([
        alertsApi.getAll(filters),
        formTypesApi.getAll(),
      ]);
      setAlerts(alertsRes.data);
      setFormTypes(formTypesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [filters]);
  
  const handleStatusUpdate = async (alertId: string, newStatus: string) => {
    try {
      await alertsApi.update(alertId, { status: newStatus });
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, status: newStatus as any } : a
      ));
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
      
      if (selectedAlert?.id === alertId) {
        setSelectedAlert(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };
  
  const handleSendForm = async () => {
    if (!selectedAlert || !selectedFormType) return;
    
    try {
      await formTypesApi.sendForm(selectedFormType, selectedAlert.id);
      setAlerts(prev => prev.map(a => 
        a.id === selectedAlert.id 
          ? { ...a, is_form_sent: true, form_type_id: selectedFormType }
          : a
      ));
      setSelectedAlert(prev => prev ? { ...prev, is_form_sent: true, form_type_id: selectedFormType } : null);
      setFormDialogOpen(false);
      setSnackbar({ open: true, message: 'Form request sent to user', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to send form', severity: 'error' });
    }
  };
  
  const getStatusChip = (status: string) => {
    const config = statusOptions.find(s => s.value === status);
    return (
      <Chip 
        label={config?.label || status}
        color={config?.color as any || 'default'}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };
  
  const getGarbageLabel = (type: string) => {
    return garbageTypes.find(g => g.value === type)?.label || type;
  };
  
  // Stats
  const stats = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    processing: alerts.filter(a => a.status === 'processing').length,
    completed: alerts.filter(a => a.status === 'completed').length,
  };
  
  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and respond to waste reports
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={fetchData}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Alerts', value: stats.total, color: 'primary.main' },
          { label: 'Pending', value: stats.pending, color: 'warning.main' },
          { label: 'Processing', value: stats.processing, color: 'info.main' },
          { label: 'Completed', value: stats.completed, color: 'success.main' },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Filter by Status"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Filter by Type"
                value={filters.garbage_type}
                onChange={(e) => setFilters(prev => ({ ...prev, garbage_type: e.target.value }))}
              >
                <MenuItem value="all">All Types</MenuItem>
                {garbageTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Alerts Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : alerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No alerts found
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Form</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow 
                  key={alert.id}
                  hover
                  sx={{ '&:last-child td': { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      #{alert.id.slice(-6)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getGarbageLabel(alert.garbage_type)}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{alert.quantity}</TableCell>
                  <TableCell>{getStatusChip(alert.status)}</TableCell>
                  <TableCell>
                    {alert.form_response ? (
                      <Chip label="Submitted" color="success" size="small" />
                    ) : alert.is_form_sent ? (
                      <Chip label="Pending" color="warning" size="small" />
                    ) : (
                      <Chip label="Not Sent" variant="outlined" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {dayjs(alert.created_at).format('MMM D, HH:mm')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chat">
                      <IconButton 
                        size="small"
                        color="secondary"
                        onClick={() => navigate(`/chat/${alert.id}`)}
                      >
                        <Chat />
                      </IconButton>
                    </Tooltip>
                    {alert.status !== 'completed' && (
                      <Tooltip title="Mark Complete">
                        <IconButton 
                          size="small"
                          color="success"
                          onClick={() => handleStatusUpdate(alert.id, 'completed')}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      
      {/* Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedAlert && (
          <>
            <DialogTitle>
              Alert Details - #{selectedAlert.id.slice(-6)}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <MapPicker 
                    position={{ lat: selectedAlert.latitude, lng: selectedAlert.longitude }}
                    onPositionChange={() => {}}
                    readOnly
                    height={250}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {statusOptions.map((opt) => (
                          <Button
                            key={opt.value}
                            variant={selectedAlert.status === opt.value ? 'contained' : 'outlined'}
                            size="small"
                            color={opt.color as any}
                            onClick={() => handleStatusUpdate(selectedAlert.id, opt.value)}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                      <Typography>{getGarbageLabel(selectedAlert.garbage_type)}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                      <Typography sx={{ textTransform: 'capitalize' }}>{selectedAlert.quantity}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography>{selectedAlert.description || 'No description provided'}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                      <Typography>{dayjs(selectedAlert.created_at).format('MMMM D, YYYY [at] HH:mm')}</Typography>
                    </Box>
                    
                    {selectedAlert.form_response && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Form Response
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          {Object.entries(selectedAlert.form_response).map(([key, value]) => (
                            <Box key={key} sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {key.replace(/_/g, ' ').toUpperCase()}
                              </Typography>
                              <Typography>{String(value)}</Typography>
                            </Box>
                          ))}
                        </Paper>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {!selectedAlert.is_form_sent && (
                <Button 
                  startIcon={<Send />}
                  onClick={() => setFormDialogOpen(true)}
                >
                  Send Form Request
                </Button>
              )}
              <Button onClick={() => navigate(`/chat/${selectedAlert.id}`)}>
                Open Chat
              </Button>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Send Form Dialog */}
      <Dialog 
        open={formDialogOpen} 
        onClose={() => setFormDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Form Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a form to request additional information from the user.
          </Typography>
          <TextField
            select
            fullWidth
            label="Select Form Type"
            value={selectedFormType}
            onChange={(e) => setSelectedFormType(e.target.value)}
          >
            {formTypes.map((form) => (
              <MenuItem key={form.id} value={form.id}>
                <Box>
                  <Typography>{form.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {form.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSendForm}
            disabled={!selectedFormType}
          >
            Send Form
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <MuiAlert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Layout>
  );
};

export default AdminDashboard;
