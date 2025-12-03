import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Home, Delete as TrashIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        p: 3,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            bgcolor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <TrashIcon sx={{ color: 'grey.500', fontSize: 40 }} />
        </Box>
        
        <Typography variant="h1" fontWeight={700} color="primary.main" sx={{ fontSize: { xs: 80, md: 120 } }}>
          404
        </Typography>
        
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          Oops! The page you're looking for seems to have been disposed of.
          Let's get you back on track.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
