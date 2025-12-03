import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PlaceIcon from '@mui/icons-material/Place';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Position {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  position: Position | null;
  onPositionChange: (position: Position) => void;
  readOnly?: boolean;
  height?: string | number;
}

// Component to handle map clicks
function MapClickHandler({ onPositionChange }: { onPositionChange: (pos: Position) => void }) {
  useMapEvents({
    click: (e) => {
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Component to recenter map
function RecenterMap({ position }: { position: Position | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, { duration: 1 });
    }
  }, [position, map]);
  
  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({ 
  position, 
  onPositionChange, 
  readOnly = false,
  height = 400 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default center (San Francisco)
  const defaultCenter: Position = { lat: 37.7749, lng: -122.4194 };
  const center = position || defaultCenter;
  
  const handleUseMyLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onPositionChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError('Unable to get your location. Please enable location services.');
        setLoading(false);
        console.error('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onPositionChange]);
  
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', height }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={position ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!readOnly && <MapClickHandler onPositionChange={onPositionChange} />}
          <RecenterMap position={position} />
          {position && (
            <Marker 
              position={[position.lat, position.lng]} 
              icon={customIcon}
            />
          )}
        </MapContainer>
        
        {!readOnly && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
              onClick={handleUseMyLocation}
              disabled={loading}
              sx={{ 
                boxShadow: 3,
                '&:hover': { boxShadow: 4 },
              }}
            >
              {loading ? 'Getting location...' : 'Use My Location'}
            </Button>
          </Box>
        )}
        
        {!readOnly && !position && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              bgcolor: 'rgba(255,255,255,0.95)',
              px: 2,
              py: 1,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              boxShadow: 2,
            }}
          >
            <PlaceIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Click on the map to pin a location
            </Typography>
          </Box>
        )}
      </Box>
      
      {error && (
        <Box sx={{ p: 1, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}
      
      {position && (
        <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            📍 Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MapPicker;
