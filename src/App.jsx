import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Reviews from './pages/Reviews';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import PCRepair from './pages/PCRepair';
import MobileRepair from './pages/MobileRepair';
import Profile from './pages/Profile';
import History from './pages/History';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Bidding from './pages/Bidding';
import TechnicianDashboard from './pages/TechnicianDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/pc-repair" element={<PCRepair />} />
              <Route path="/mobile-repair" element={<MobileRepair />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/account" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/bidding" element={<Bidding />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dashboards */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technician-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin']}> {/* Admin might want to see this too for testing */}
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}


export default App;
