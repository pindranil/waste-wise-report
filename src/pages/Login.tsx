import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  Login as LoginIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';
import { authApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>();
  
  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(data.email, data.password);
      const { token, user } = response.data;
      
      login(token, user);
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fillDemoCredentials = (type: 'user' | 'admin') => {
    if (type === 'user') {
      setValue('email', 'user@demo.com');
      setValue('password', 'demo123');
    } else {
      setValue('email', 'admin@demo.com');
      setValue('password', 'demo123');
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%', boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: 3,
              }}
            >
              <TrashIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              Kachra
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Waste Reporting System
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters',
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 3 }}
            />
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <Divider sx={{ my: 3 }}>
            <Chip label="Demo Accounts" size="small" />
          </Divider>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => fillDemoCredentials('user')}
              sx={{ py: 1.5 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={600}>User</Typography>
                <Typography variant="caption" color="text.secondary">
                  user@demo.com
                </Typography>
              </Box>
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => fillDemoCredentials('admin')}
              sx={{ py: 1.5 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={600}>Admin</Typography>
                <Typography variant="caption" color="text.secondary">
                  admin@demo.com
                </Typography>
              </Box>
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
            Password for both: <strong>demo123</strong>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
