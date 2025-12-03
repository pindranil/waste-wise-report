import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme/muiTheme';
import { useAuthStore } from './stores/authStore';

// Pages
import Login from './pages/Login';
import Index from './pages/Index';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'admin' ? '/admin' : '/user'} replace />
            ) : (
              <Login />
            )
          } />
          
          {/* Index - redirects based on auth */}
          <Route path="/" element={<Index />} />
          
          {/* User routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Shared routes */}
          <Route path="/chat/:alertId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
