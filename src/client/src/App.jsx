import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Datasets from './pages/Datasets';
import Publications from './pages/Publications';
import { FlaskConical } from 'lucide-react';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '12px', color: 'var(--text-secondary)' }}>
        <FlaskConical size={28} style={{ animation: 'pulse-soft 1.5s ease-in-out infinite', color: 'var(--primary-500)' }} />
        <span style={{ fontSize: '14px' }}>Loading…</span>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?._id) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 
        (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.startsWith('/')
          ? import.meta.env.VITE_API_URL.replace('/api', '')
          : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin));
      const newSocket = io(socketUrl, { reconnectionAttempts: 3, timeout: 5000 });
      newSocket.on('connect_error', () => {
        // Gracefully ignore WebSocket connection errors in environments without active WS
      });
      newSocket.emit('join', user._id);

      newSocket.on('notification', (data) => {
        toast(data.message, {
          icon: '🔔',
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: 'var(--surface-color)',
            color: 'var(--text-primary)',
            border: '1px solid var(--primary-500)',
          }
        });
      });

      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user]);

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AppLayout><Dashboard /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <AppLayout><Projects /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <PrivateRoute>
                <AppLayout><CreateProject /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <AppLayout><ProjectDetail /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout><Profile /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <AppLayout><Requests /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/datasets"
            element={
              <PrivateRoute>
                <AppLayout><Datasets /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/publications"
            element={
              <PrivateRoute>
                <AppLayout><Publications /></AppLayout>
              </PrivateRoute>
            }
          />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
