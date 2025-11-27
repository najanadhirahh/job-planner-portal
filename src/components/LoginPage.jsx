import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      enqueueSnackbar('Please enter both username and password', { variant: 'error' });
      return;
    }

    const success = await login(username, password);
    
    if (!success) {
      enqueueSnackbar('Invalid username or password. Try admin/admin for demo.', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Job Planner Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access the capacity planning system
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              margin="normal"
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
          
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Demo credentials:
            </Typography>
            <Typography variant="body2" textAlign="center">
              <strong>Username:</strong> admin
            </Typography>
            <Typography variant="body2" textAlign="center">
              <strong>Password:</strong> admin
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;