import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import DestinasiList from './pages/DestinasiList';
import DestinasiDetail from './pages/DestinasiDetail';
import KategoriList from './pages/KategoriList';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserUlasan from './pages/UserUlasan';
import UserFavorit from './pages/UserFavorit';
import AdminRoutes from './routes/AdminRoutes';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const userData = JSON.parse(user);
  if (userData.peran !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Conditional Navbar Component
// Conditional Navbar Component
const ConditionalNavbar = () => {
  const location = useLocation();
  const hiddenPaths = ['/login', '/register'];

  if (
    location.pathname.startsWith('/admin') ||
    hiddenPaths.includes(location.pathname)
  ) {
    return null;
  }

  return <Navbar />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminRoutes />
            </AdminRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="/destinasi" element={<DestinasiList />} />
          <Route path="/destinasi/:id" element={<DestinasiDetail />} />
          <Route path="/kategori" element={<KategoriList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/ulasan" element={
            <ProtectedRoute>
              <UserUlasan />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/favorit" element={
            <ProtectedRoute>
              <UserFavorit />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
