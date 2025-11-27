import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { SnackbarProvider } from 'notistack';
import { GlobalStyles } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {user ? <Dashboard /> : <LoginPage />}
    </div>
  );};

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles
        styles={{
          html: { overflow: "hidden", height: "100vh", margin: 0, padding: 0 },
          body: { overflow: "hidden", height: "100vh", margin: 0, padding: 0 },
          "#root": { height: "100vh" }, // if you're using React root div
        }}
      />
    <CssBaseline />
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SnackbarProvider>
  </ThemeProvider>
);

export default App;