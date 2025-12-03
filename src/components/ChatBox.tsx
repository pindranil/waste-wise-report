import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import dayjs from 'dayjs';
import { Message } from '../types';
import { useAuthStore } from '../stores/authStore';
import { messagesApi } from '../api/client';

interface ChatBoxProps {
  alertId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ alertId }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await messagesApi.getByAlertId(alertId);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [alertId]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    try {
      const response = await messagesApi.send({
        alert_id: alertId,
        sender_id: user.id,
        sender_role: user.role,
        content: newMessage.trim(),
      });
      
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        minHeight: 400,
        maxHeight: 600,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">Chat - Alert #{alertId.slice(-6)}</Typography>
      </Box>
      
      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          overflowY: 'auto',
          bgcolor: 'grey.50',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === user?.id;
            const isAdmin = msg.sender_role === 'admin';
            
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {!isOwnMessage && (
                  <Avatar 
                    sx={{ 
                      bgcolor: isAdmin ? 'secondary.main' : 'primary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {isAdmin ? <AdminPanelSettingsIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                  </Avatar>
                )}
                
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: isOwnMessage ? 'primary.main' : 'white',
                    color: isOwnMessage ? 'white' : 'text.primary',
                    p: 1.5,
                    px: 2,
                    borderRadius: 2,
                    borderTopLeftRadius: isOwnMessage ? 16 : 4,
                    borderTopRightRadius: isOwnMessage ? 4 : 16,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 0.5, 
                      opacity: 0.7,
                      textAlign: 'right',
                    }}
                  >
                    {dayjs(msg.created_at).format('HH:mm')}
                    {msg.is_read && isOwnMessage && ' ✓'}
                  </Typography>
                </Box>
                
                {isOwnMessage && (
                  <Avatar 
                    sx={{ 
                      bgcolor: isAdmin ? 'secondary.main' : 'primary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {isAdmin ? <AdminPanelSettingsIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                  </Avatar>
                )}
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'grey.300' },
            }}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatBox;
